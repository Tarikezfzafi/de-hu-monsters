"use client";

import { useState } from "react";
import type { ChallengeBezig, ChallengeVoorstel } from "../types";
import { BezigKaarten } from "./BezigKaarten";
import { LeegKaart } from "./LeegKaart";
import { VoorstelKaart } from "./VoorstelKaart";

const tabs = ["Open", "Bezig", "Afgerond"] as const;
type Tab = (typeof tabs)[number];

type ChallengesOverzichtProps = {
  voorstel?: ChallengeVoorstel;
  bezig?: ChallengeBezig[];
};

// Tabs en inhoud van het challengescherm. Zonder challenges in de gekozen tab staat de lege staat.
export function ChallengesOverzicht({ voorstel, bezig = [] }: ChallengesOverzichtProps) {
  const [actief, setActief] = useState<Tab>("Open");

  // Open toont alle secties, Bezig alleen de challenges waaraan je werkt
  const toonVoorstel = actief === "Open" ? voorstel : undefined;
  const toonBezig = actief === "Open" || actief === "Bezig" ? bezig : [];

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

      {toonVoorstel || toonBezig.length > 0 ? (
        <div className="grid items-start gap-3 lg:grid-cols-2 lg:gap-6">
          {toonVoorstel && <VoorstelKaart voorstel={toonVoorstel} />}
          {toonBezig.length > 0 && <BezigKaarten challenges={toonBezig} />}
        </div>
      ) : (
        <div className="mt-0.5 lg:mt-0">
          <LeegKaart />
        </div>
      )}
    </div>
  );
}
