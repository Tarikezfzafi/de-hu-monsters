import { bewijsPad } from "./routes";
import type { ChallengeAfgerond, ChallengeBezig, ChallengeVoorstel } from "./types";

// Rijen zoals ze uit de database komen (zie supabase/migrations)
export type ChallengeRij = {
  id: string;
  status: string;
  xp: number;
  match_id: string;
  template_id: string;
};
export type MatchRij = { id: string; user_a: string; user_b: string };
export type TemplateRij = { id: string; titel: string; beschrijving: string; soort: string };
export type PartnerRij = { id: string; display_name: string | null; avatar_url: string | null };

export type ChallengeOverzicht = {
  voorstellen: ChallengeVoorstel[];
  bezig: ChallengeBezig[];
  afgerond: ChallengeAfgerond[];
};

type Invoer = {
  ikId: string;
  challenges: ChallengeRij[];
  matches: MatchRij[];
  templates: TemplateRij[];
  partners: PartnerRij[];
};

// Zet databaserijen om naar de gegevens voor de kaarten van het challengescherm
export function bouwOverzicht({ ikId, challenges, matches, templates, partners }: Invoer) {
  const matchPerId = new Map(matches.map((match) => [match.id, match]));
  const templatePerId = new Map(templates.map((template) => [template.id, template]));
  const partnerPerId = new Map(partners.map((partner) => [partner.id, partner]));

  const overzicht: ChallengeOverzicht = { voorstellen: [], bezig: [], afgerond: [] };

  for (const challenge of challenges) {
    const match = matchPerId.get(challenge.match_id);
    const template = templatePerId.get(challenge.template_id);
    if (!match || !template) continue;

    const partner = partnerPerId.get(match.user_a === ikId ? match.user_b : match.user_a);
    const gedeeld = {
      id: challenge.id,
      titel: template.titel,
      partner: partner?.display_name?.trim() || "Onbekend",
      partnerAvatarUrl: partner?.avatar_url ?? null,
    };

    // "afgewezen" (vervangen door een nieuw voorstel) en "ingediend" (wacht op de docent,
    // hoort bij het scherm Bewijs indienen) tonen we hier nog niet.
    switch (challenge.status) {
      case "voorgesteld":
        overzicht.voorstellen.push({
          ...gedeeld,
          beschrijving: template.beschrijving,
          xp: challenge.xp,
          soort: template.soort,
        });
        break;
      case "bezig":
        overzicht.bezig.push({ ...gedeeld, bewijsHref: bewijsPad(challenge.id) });
        break;
      case "goedgekeurd":
        overzicht.afgerond.push({
          id: challenge.id,
          titel: template.titel,
          status: "Goedgekeurd",
          xp: challenge.xp,
        });
        break;
      case "afgekeurd":
        overzicht.afgerond.push({
          id: challenge.id,
          titel: template.titel,
          status: "Afgekeurd",
          opnieuwHref: bewijsPad(challenge.id),
        });
        break;
    }
  }

  return overzicht;
}
