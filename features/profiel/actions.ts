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

  // 3. Foto uploaden naar de map van deze gebruiker
  let avatarUrl: string | undefined;

  if (heeftFoto) {
    // Oude foto('s) eerst weghalen, zodat er maar één per gebruiker bewaard blijft
    const { data: oud } = await supabase.storage.from("avatars").list(user.id);
    if (oud?.length) {
      await supabase.storage
        .from("avatars")
        .remove(oud.map((bestand) => `${user.id}/${bestand.name}`));
    }

    const pad = `${user.id}/avatar-${Date.now()}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(pad, foto, { contentType: foto.type, upsert: true });

    if (error) {
      console.error(error);
      return { message: "Foto uploaden is mislukt. Probeer het opnieuw." };
    }

    avatarUrl = supabase.storage.from("avatars").getPublicUrl(pad)
      .data.publicUrl;
  }

  // 3b. Foto verwijderen: alle bestanden in de map van deze gebruiker weghalen
  if (verwijderFoto) {
    const { data: bestanden } = await supabase.storage
      .from("avatars")
      .list(user.id);

    if (bestanden?.length) {
      await supabase.storage
        .from("avatars")
        .remove(bestanden.map((bestand) => `${user.id}/${bestand.name}`));
    }
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
    return { message: "Profiel opslaan is mislukt. Probeer het opnieuw." };
  }

  // 5. Doorsturen
  redirect("/");
}
