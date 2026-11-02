"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TRIBES } from "./tribes";

const MAX_FOTO = 5 * 1024 * 1024;

const chips = z.array(z.string().trim().min(1).max(40)).max(20);

const profielSchema = z.object({
  tribe: z.enum(TRIBES, "Kies je tribe"),
  skillsHeb: chips,
  skillsLeer: chips,
  hobbys: chips,
});

export type ProfielState = {
  errors?: Partial<
    Record<keyof z.infer<typeof profielSchema> | "foto", string[]>
  >;
  message?: string;
};

export type OntdekProfiel = {
  id: string;
  naam: string;
  tribe: string;
  skills_heb: string[];
  skills_leer: string[];
  hobbys: string[];
  avatar_url: string | null;
};

export type OntdekProfielenResult =
  | { profielen: OntdekProfiel[]; eigenId: string }
  | { fout: string };

function leesTekst(waarden: Record<string, unknown>, sleutels: string[]) {
  for (const sleutel of sleutels) {
    const waarde = waarden[sleutel];
    if (typeof waarde === "string" && waarde.trim()) return waarde.trim();
  }

  return null;
}

function leesTeksten(waarde: unknown) {
  return Array.isArray(waarde)
    ? waarde.filter((item): item is string => typeof item === "string")
    : [];
}

export async function getOntdekProfielen(): Promise<OntdekProfielenResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Ingelogde gebruiker voor ontdekpagina ophalen mislukt:", userError);
    return { fout: "Je gegevens konden niet worden geladen. Probeer het opnieuw." };
  }

  if (!user) redirect("/login");

  const { data, error } = await supabase.from("profiles").select("*");

  if (error) {
    console.error("Ontdekprofielen ophalen mislukt:", error);
    return { fout: "Profielen konden niet worden geladen. Probeer het later opnieuw." };
  }

  const profielen = (data as Record<string, unknown>[])
    .flatMap((record): OntdekProfiel[] => {
      const id = leesTekst(record, ["id"]);
      const tribe = leesTekst(record, ["tribe"]);
      if (!id || !tribe) return [];

      const naam = leesTekst(record, ["display_name", "full_name", "name"])
        ?? `HUBi-lid ${id.slice(0, 6)}`;

      return [{
        id,
        naam,
        tribe,
        skills_heb: leesTeksten(record.skills_heb),
        skills_leer: leesTeksten(record.skills_leer),
        hobbys: leesTeksten(record.hobbys),
        avatar_url: typeof record.avatar_url === "string" ? record.avatar_url : null,
      }];
    });

  return { profielen, eigenId: user.id };
}

export async function saveProfile(
  _prevState: ProfielState,
  formData: FormData,
): Promise<ProfielState> {
  // 1. Valideren (getAll, want elke gekozen chip is een eigen hidden input)
  const result = profielSchema.safeParse({
    tribe: formData.get("tribe")?.toString() ?? "",
    skillsHeb: formData.getAll("skillsHeb"),
    skillsLeer: formData.getAll("skillsLeer"),
    hobbys: formData.getAll("hobbys"),
  });

  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors };
  }

  const foto = formData.get("foto");
  const heeftFoto = foto instanceof File && foto.size > 0;

  if (heeftFoto && !foto.type.startsWith("image/")) {
    return { errors: { foto: ["Kies een afbeelding"] } };
  }
  if (heeftFoto && foto.size > MAX_FOTO) {
    return { errors: { foto: ["Foto mag maximaal 5 MB zijn"] } };
  }

  // Alleen verwijderen als er niet tegelijk een nieuwe foto gekozen is
  const verwijderFoto = formData.get("verwijderFoto") === "1" && !heeftFoto;

  // 2. Ingelogde gebruiker ophalen
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 3. Nieuwe foto eerst uploaden; de huidige foto blijft beschikbaar tot het profiel is opgeslagen
  let avatarUrl: string | undefined;
  let avatarPad: string | undefined;

  if (heeftFoto) {
    avatarPad = `${user.id}/avatar-${Date.now()}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(avatarPad, foto, { contentType: foto.type, upsert: true });

    if (error) {
      console.error(error);
      return { message: "Foto uploaden is mislukt. Probeer het opnieuw." };
    }

    avatarUrl = supabase.storage.from("avatars").getPublicUrl(avatarPad)
      .data.publicUrl;
  }

  // 4. Profiel opslaan (aanmaken of bijwerken)
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    tribe: result.data.tribe,
    skills_heb: result.data.skillsHeb,
    skills_leer: result.data.skillsLeer,
    hobbys: result.data.hobbys,
    ...(avatarUrl && { avatar_url: avatarUrl }),
    ...(verwijderFoto && { avatar_url: null }),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error(error);

    if (avatarPad) {
      const { error: verwijderFout } = await supabase.storage
        .from("avatars")
        .remove([avatarPad]);
      if (verwijderFout) console.error(verwijderFout);
    }

    return { message: "Profiel opslaan is mislukt. Probeer het opnieuw." };
  }

  // 5. Oude bestanden pas opruimen nadat de database de nieuwe avatar kent
  if (avatarPad || verwijderFoto) {
    const { data: bestanden, error: lijstFout } = await supabase.storage
      .from("avatars")
      .list(user.id);

    if (lijstFout) {
      console.error(lijstFout);
    } else {
      const oudePaden = bestanden
        .map((bestand) => `${user.id}/${bestand.name}`)
        .filter((pad) => pad !== avatarPad);

      if (oudePaden.length) {
        const { error: verwijderFout } = await supabase.storage
          .from("avatars")
          .remove(oudePaden);
        if (verwijderFout) console.error(verwijderFout);
      }
    }
  }

  // 6. Doorsturen
  redirect("/ontdek");
}
