import Link from "next/link";
import type { ChallengeAfgerond } from "../types";
import { SectieKop } from "./SectieKop";
import { StatusChip } from "./StatusChip";

type AfgerondRijenProps = {
  challenges: ChallengeAfgerond[];
};

// Sectie AFGEROND met een rij per beoordeelde challenge (Figma 08 / D8 Challenges)
export function AfgerondRijen({ challenges }: AfgerondRijenProps) {
  return (
    <section aria-labelledby="afgerond-sectie" className="flex min-w-0 flex-col gap-2">
      <SectieKop id="afgerond-sectie" titel="Afgerond" stap="3 · Docent beoordeelt → XP" />

      <ul className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-6">
        {challenges.map((challenge) => (
          <li
            key={challenge.id}
            className="flex items-center gap-2 rounded-xl border border-hubi-line bg-white px-4 py-2.5 leading-[1.2] lg:px-6 lg:py-3.5"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="truncate text-sm leading-[1.2] font-semibold text-hubi-ink lg:text-[15px]">
                {challenge.titel}
              </p>

              {challenge.status === "Goedgekeurd" ? (
                <p className="text-xs leading-[1.2] font-medium text-hubi-link">+{challenge.xp} XP</p>
              ) : (
                <Link
                  href={challenge.opnieuwHref}
                  className="self-start text-xs leading-[1.2] font-medium text-hubi-link hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link"
                >
                  Opnieuw indienen <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>

            <StatusChip status={challenge.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}
