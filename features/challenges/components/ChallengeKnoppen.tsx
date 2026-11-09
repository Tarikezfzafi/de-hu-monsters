"use client";

import { STRAFPUNTEN_BIJ_WEIGEREN } from "../regels";

type ChallengeKnoppenProps = {
  // Punten die het kost om een challenge te weigeren
  strafpunten?: number;
  // Wordt aangeroepen na een klik op "Niet accepteren"
  onWeigeren?: () => void;
};

// Knoppen in de Voorstel-kaart (Figma 08 / D8 Challenges). Nog zonder backend.
export function ChallengeKnoppen({
  strafpunten = STRAFPUNTEN_BIJ_WEIGEREN,
  onWeigeren,
}: ChallengeKnoppenProps) {
  const weigerTekst = `Niet accepteren (−${strafpunten} ${
    strafpunten === 1 ? "punt" : "punten"
  }, nieuwe challenge)`;

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:gap-3">
      <button
        type="button"
        className="min-h-[46px] w-full rounded-[10px] bg-hubi-ink px-4 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:min-h-[54px] lg:w-[150px] lg:shrink-0 lg:rounded-xl lg:text-base"
      >
        Accepteren <span aria-hidden="true">→</span>
      </button>

      <button
        type="button"
        onClick={onWeigeren}
        className="min-h-11 w-full rounded-[10px] border-[1.5px] border-hubi-ink bg-white px-3 py-2 text-xs font-semibold text-hubi-ink transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:min-h-[54px] lg:w-auto lg:flex-1 lg:rounded-xl lg:text-sm"
      >
        {weigerTekst}
      </button>
    </div>
  );
}
