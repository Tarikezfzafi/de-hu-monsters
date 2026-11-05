"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type ChallengeActieResultaat =
  | { ok: true; melding?: string }
  | { ok: false; fout: string };

// Foutcodes uit de database (supabase/migrations) in gewone taal
const FOUTEN: Record<string, string> = {
  niet_ingelogd: "Log opnieuw in en probeer het nog eens.",
  niet_gevonden: "Deze challenge bestaat niet meer.",
  niet_meer_open: "Deze challenge is al behandeld. Vernieuw de pagina.",
  onvoldoende_punten: "Je hebt niet genoeg punten om te weigeren.",
  geen_challenges_meer: "Er zijn geen nieuwe challenges meer voor deze match.",
};
const ALGEMENE_FOUT = "Er ging iets mis. Probeer het opnieuw.";

function foutTekst(bericht: string) {
  const code = Object.keys(FOUTEN).find((sleutel) => bericht.includes(sleutel));
  return code ? FOUTEN[code] : ALGEMENE_FOUT;
}

async function voerUit(
  functie: "challenge_accepteer" | "challenge_weiger",
  id: string,
  melding?: string
): Promise<ChallengeActieResultaat> {
  if (!z.uuid().safeParse(id).success) return { ok: false, fout: ALGEMENE_FOUT };

  const supabase = await createClient();
  const { error } = await supabase.rpc(functie, { p_id: id });

  if (error) {
    console.error(`${functie} mislukt:`, error);
    return { ok: false, fout: foutTekst(error.message) };
  }

  // Laadt de pagina opnieuw met de nieuwe stand (voorstel, punten)
  revalidatePath("/challenges");
  return { ok: true, melding };
}

export async function accepteerChallenge(id: string) {
  return voerUit("challenge_accepteer", id);
}

export async function weigerChallenge(id: string) {
  return voerUit("challenge_weiger", id, "Nieuwe challenge geladen");
}
