// Gegevens van challenges. Komen straks uit de database; de componenten tonen alleen wat ze krijgen.

type ChallengePartner = {
  // Naam en foto van de match waarmee je de challenge doet
  partner: string;
  partnerAvatarUrl?: string | null;
};

export type ChallengeVoorstel = ChallengePartner & {
  id: string;
  titel: string;
  beschrijving: string;
  xp: number;
  // Soort challenge, bijvoorbeeld "Team challenge"
  soort?: string;
};

export type ChallengeBezig = ChallengePartner & {
  id: string;
  titel: string;
  // Waar je het bewijs voor deze challenge indient
  bewijsHref: string;
};
