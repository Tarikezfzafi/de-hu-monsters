"use client";

import { useState } from "react";
import type { ChallengeAfgerond, ChallengeBezig, ChallengeVoorstel } from "../types";
import { AfgerondRijen } from "./AfgerondRijen";
import { BezigKaarten } from "./BezigKaarten";
import { LeegKaart } from "./LeegKaart";
import { VoorstelKaart } from "./VoorstelKaart";

const tabs = ["Open", "Bezig", "Afgerond"] as const;
type Tab = (typeof tabs)[number];

type ChallengesOverzichtProps = {
  voorstel?: ChallengeVoorstel;
  bezig?: ChallengeBezig[];
  afgerond?: ChallengeAfgerond[];
};

// Tabs en inhoud van het challengescherm. Zonder challenges in de gekozen tab staat de lege staat.
export function ChallengesOverzicht({
  voorstel,
  bezig = [],
  afgerond = [],
}: ChallengesOverzichtProps) {
  const [actief, setActief] = useState<Tab>("Open");

  // Open toont alle secties; Bezig en Afgerond alleen hun eigen sectie
  const toonVoorstel = actief === "Open" ? voorstel : undefined;
  const toonBezig = actief === "Open" || actief === "Bezig" ? bezig : [];
  const toonAfgerond = actief === "Open" || actief === "Afgerond" ? afgerond : [];

  return (
    <div className="flex flex-col gap-3 lg:gap-7">
      <div role="group" aria-label="Soort challenges" className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            aria-pressed={tab === actief}
            onClick={() => setActief(tab)}
            className={`h-[30px] rounded-full border-[1.5px] border-hubi-ink px-[14px] text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:h-9 lg:px-[18px] lg:text-sm ${
              tab === actief
                ? "bg-hubi-ink text-white"
                : "bg-white text-hubi-ink hover:bg-background"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {toonVoorstel || toonBezig.length > 0 || toonAfgerond.length > 0 ? (
        <div className="grid items-start gap-x-6 gap-y-3 lg:grid-cols-2 lg:gap-y-7">
          {toonVoorstel && <VoorstelKaart voorstel={toonVoorstel} />}
          {toonBezig.length > 0 && <BezigKaarten challenges={toonBezig} />}
          {toonAfgerond.length > 0 && (
            <div className="lg:col-span-2">
              <AfgerondRijen challenges={toonAfgerond} />
            </div>
          )}
        </div>
      ) : (
        <div className="mt-0.5 lg:mt-0">
          <LeegKaart />
        </div>
      )}
    </div>
  );
}
