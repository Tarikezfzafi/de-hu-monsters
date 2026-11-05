import type { ChallengeVoorstel } from "../types";
import { ChallengeKnoppen } from "./ChallengeKnoppen";

type VoorstelKaartProps = {
  voorstel: ChallengeVoorstel;
};

// Sectie VOORSTEL met de kaart van het voorgestelde challenge (Figma 08 / D8 Challenges)
export function VoorstelKaart({ voorstel }: VoorstelKaartProps) {
  const kopId = `voorstel-${voorstel.id}`;

  return (
    <section aria-labelledby="voorstel-sectie" className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between gap-2 text-hubi-muted">
        <h2
          id="voorstel-sectie"
          className="text-[11px] leading-[13px] font-medium tracking-[1px] uppercase"
        >
          Voorstel
        </h2>
        <p className="text-[10px] leading-[13px] lg:text-[11px]">1 · Accepteren</p>
      </div>

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

        <div className="flex items-center gap-2">
          <div
            aria-hidden="true"
            className="size-7 shrink-0 rounded-full bg-hubi-ink/8 bg-cover bg-center"
            style={
              voorstel.partnerAvatarUrl
                ? { backgroundImage: `url("${voorstel.partnerAvatarUrl}")` }
                : undefined
            }
          />
          <p className="text-[13px] text-hubi-ink">met {voorstel.partner}</p>
        </div>

        <ChallengeKnoppen />
      </article>
    </section>
  );
}
