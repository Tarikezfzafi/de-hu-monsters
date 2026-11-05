import Link from "next/link";
import type { ChallengeBezig } from "../types";
import { PartnerRegel } from "./PartnerRegel";
import { SectieKop } from "./SectieKop";
import { StatusChip } from "./StatusChip";

type BezigKaartenProps = {
  challenges: ChallengeBezig[];
};

// Sectie BEZIG met een kaart per challenge waaraan je werkt (Figma 08 / D8 Challenges)
export function BezigKaarten({ challenges }: BezigKaartenProps) {
  return (
    <section aria-labelledby="bezig-sectie" className="flex min-w-0 flex-col gap-2">
      <SectieKop id="bezig-sectie" titel="Bezig" stap="2 · Uitvoeren en bewijs indienen" />

      <div className="flex flex-col gap-2">
        {challenges.map((challenge) => (
          <article
            key={challenge.id}
            aria-labelledby={`bezig-${challenge.id}`}
            className="flex flex-col gap-2 rounded-xl border border-hubi-line bg-white p-4 leading-[1.2] lg:gap-3 lg:p-6"
          >
            <div className="flex items-center gap-2">
              <h3
                id={`bezig-${challenge.id}`}
                className="min-w-0 flex-1 text-base font-semibold text-hubi-ink lg:text-lg lg:leading-[22px]"
              >
                {challenge.titel}
              </h3>
              <StatusChip status="Bewijs indienen" />
            </div>

            <PartnerRegel partner={challenge.partner} avatarUrl={challenge.partnerAvatarUrl} />

            <Link
              href={challenge.bewijsHref}
              className="self-start text-[13px] font-medium text-hubi-link hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:text-sm lg:leading-[17px]"
            >
              Ga naar bewijs indienen <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
