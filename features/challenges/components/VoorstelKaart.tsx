import type { ChallengeVoorstel } from "../types";
import { ChallengeKnoppen } from "./ChallengeKnoppen";
import { PartnerRegel } from "./PartnerRegel";
import { SectieKop } from "./SectieKop";

type VoorstelKaartProps = {
  voorstel: ChallengeVoorstel;
};

// Sectie VOORSTEL met de kaart van het voorgestelde challenge (Figma 08 / D8 Challenges)
export function VoorstelKaart({ voorstel }: VoorstelKaartProps) {
  const kopId = `voorstel-${voorstel.id}`;

  return (
    <section aria-labelledby="voorstel-sectie" className="flex min-w-0 flex-col gap-2">
      <SectieKop id="voorstel-sectie" titel="Voorstel" stap="1 · Accepteren" />

      <article
        aria-labelledby={kopId}
        className="flex flex-col gap-2 rounded-[14px] border-[1.5px] border-hubi-ink bg-white p-4 leading-[1.2] lg:gap-3 lg:p-6"
      >
        <p className="text-[10px] font-medium tracking-[1px] text-hubi-muted uppercase">
          Jullie challenge
        </p>

        <h3 id={kopId} className="text-xl font-semibold text-hubi-ink lg:text-[22px] lg:leading-[1.2]">
          {voorstel.titel}
        </h3>

        <p className="text-[13px] text-hubi-ink lg:text-sm">{voorstel.beschrijving}</p>

        <p className="text-[13px] font-medium text-hubi-link">
          +{voorstel.xp} XP · {voorstel.soort ?? "Team challenge"}
        </p>

        <PartnerRegel partner={voorstel.partner} avatarUrl={voorstel.partnerAvatarUrl} />

        <ChallengeKnoppen />
      </article>
    </section>
  );
}
