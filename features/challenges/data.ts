import { createClient } from "@/lib/supabase/server";
import {
  bouwOverzicht,
  type ChallengeOverzicht,
  type ChallengeRij,
  type MatchRij,
  type PartnerRij,
  type TemplateRij,
} from "./overzicht";

export type ChallengeData = {
  // Punten van de gebruiker; zonder waarde (nog) niet te laden
  punten?: number;
  overzicht: ChallengeOverzicht;
  fout?: string;
};

const leeg: ChallengeOverzicht = { voorstellen: [], bezig: [], afgerond: [] };
const FOUT = "Je challenges konden niet worden geladen. Vernieuw de pagina en probeer het opnieuw.";

const uniek = (waarden: string[]) => [...new Set(waarden)];

// Haalt de challenges en punten van de ingelogde gebruiker op. De beveiliging in de database
// zorgt dat je alleen de challenges van je eigen matches ziet.
export async function getChallengeData(): Promise<ChallengeData> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { overzicht: leeg, fout: "Je bent niet ingelogd." };

  const [puntenResultaat, challengeResultaat] = await Promise.all([
    supabase.rpc("challenge_mijn_punten"),
    supabase
      .from("match_challenges")
      .select("id, status, xp, match_id, template_id")
      .order("created_at", { ascending: false }),
  ]);

  if (puntenResultaat.error) console.error("Punten ophalen mislukt:", puntenResultaat.error);
  const punten = typeof puntenResultaat.data === "number" ? puntenResultaat.data : undefined;

  if (challengeResultaat.error) {
    console.error("Challenges ophalen mislukt:", challengeResultaat.error);
    return { punten, overzicht: leeg, fout: FOUT };
  }

  const challenges = (challengeResultaat.data ?? []) as ChallengeRij[];
  if (challenges.length === 0) return { punten, overzicht: leeg };

  const [matchResultaat, templateResultaat] = await Promise.all([
    supabase
      .from("matches")
      .select("id, user_a, user_b")
      .in("id", uniek(challenges.map((challenge) => challenge.match_id))),
    supabase
      .from("challenge_templates")
      .select("id, titel, beschrijving, soort")
      .in("id", uniek(challenges.map((challenge) => challenge.template_id))),
  ]);

  if (matchResultaat.error || templateResultaat.error) {
    console.error("Matches of sjablonen ophalen mislukt:", matchResultaat.error, templateResultaat.error);
    return { punten, overzicht: leeg, fout: FOUT };
  }

  const matches = (matchResultaat.data ?? []) as MatchRij[];
  const partnerIds = uniek(matches.map((match) => (match.user_a === user.id ? match.user_b : match.user_a)));

  // Zonder profielen tonen we de challenges wel, met "Onbekend" als naam
  const partnerResultaat = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", partnerIds);
  if (partnerResultaat.error) console.error("Partners ophalen mislukt:", partnerResultaat.error);

  return {
    punten,
    overzicht: bouwOverzicht({
      ikId: user.id,
      challenges,
      matches,
      templates: (templateResultaat.data ?? []) as TemplateRij[],
      partners: (partnerResultaat.data ?? []) as PartnerRij[],
    }),
  };
}
