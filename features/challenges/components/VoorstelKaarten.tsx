import type { ChallengeVoorstel } from "../types";
import { ChallengeKnoppen } from "./ChallengeKnoppen";
import { PartnerRegel } from "./PartnerRegel";
import { SectieKop } from "./SectieKop";

type VoorstelKaartenProps = {
  voorstellen: ChallengeVoorstel[];
  onAccepteren?: (id: string) => void;
  onWeigeren?: (id: string) => void;
  // Tijdens het verwerken zijn de knoppen uitgeschakeld
  bezig?: boolean;
};

// Sectie VOORSTEL met een kaart per voorgestelde challenge (Figma 08 / D8 Challenges)
export function VoorstelKaarten({
  voorstellen,
  onAccepteren,
  onWeigeren,
  bezig,
}: VoorstelKaartenProps) {
  return (
    <section aria-labelledby="voorstel-sectie" className="flex min-w-0 flex-col gap-2">
      <SectieKop id="voorstel-sectie" titel="Voorstel" stap="1 · Accepteren" />

      <div className="flex flex-col gap-3">
        {voorstellen.map((voorstel) => (
          <article
            key={voorstel.id}
            aria-labelledby={`voorstel-${voorstel.id}`}
            className="flex flex-col gap-2 rounded-[14px] border-[1.5px] border-hubi-ink bg-white p-4 leading-[1.2] lg:gap-3 lg:p-6"
          >
            <p className="text-[10px] font-medium tracking-[1px] text-hubi-muted uppercase">
              Jullie challenge
            </p>

            <h3
              id={`voorstel-${voorstel.id}`}
              className="text-xl font-semibold text-hubi-ink lg:text-[22px] lg:leading-[1.2]"
            >
              {voorstel.titel}
            </h3>

            <p className="text-[13px] text-hubi-ink lg:text-sm">{voorstel.beschrijving}</p>

            <p className="text-[13px] font-medium text-hubi-link">
              +{voorstel.xp} XP · {voorstel.soort ?? "Team challenge"}
            </p>

            <PartnerRegel partner={voorstel.partner} avatarUrl={voorstel.partnerAvatarUrl} />

            <ChallengeKnoppen
              bezig={bezig}
              onAccepteren={() => onAccepteren?.(voorstel.id)}
              onWeigeren={() => onWeigeren?.(voorstel.id)}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
