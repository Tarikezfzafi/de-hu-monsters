// Gegevens van een challenge-voorstel. Komen straks uit de database; de componenten tonen alleen wat ze krijgen.
export type ChallengeVoorstel = {
  id: string;
  titel: string;
  beschrijving: string;
  xp: number;
  // Soort challenge, bijvoorbeeld "Team challenge"
  soort?: string;
  // Naam en foto van de match waarmee je de challenge doet
  partner: string;
  partnerAvatarUrl?: string | null;
};
