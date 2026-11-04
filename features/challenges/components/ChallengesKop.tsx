type ChallengesKopProps = {
  // Aantal punten van de gebruiker. Zonder waarde (nog geen bron) wordt de pill niet getoond.
  punten?: number;
};

// Kop van het challengescherm (Figma 08 / D8 Challenges)
export function ChallengesKop({ punten }: ChallengesKopProps) {
  return (
    <header>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-[26px] leading-[1.2] font-bold text-hubi-ink lg:text-[28px]">
          Challenges
        </h1>

        {punten !== undefined && (
          <p className="flex h-7 w-[90px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-hubi-ink text-xs text-hubi-ink lg:h-9 lg:w-[140px] lg:text-[13px]">
            Punten: {punten}
          </p>
        )}
      </div>

      <p className="mt-1 text-[13px] leading-4 text-hubi-muted lg:mt-1.5 lg:text-sm lg:leading-[17px]">
        Jouw challenges met je matches
      </p>
    </header>
  );
}
