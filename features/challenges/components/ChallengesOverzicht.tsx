"use client";

import { useState } from "react";
import { LeegKaart } from "./LeegKaart";

const tabs = ["Open", "Bezig", "Afgerond"] as const;
type Tab = (typeof tabs)[number];

// Tabs en inhoud van het challengescherm. Zolang er geen challenges zijn, toont elke tab de lege staat.
export function ChallengesOverzicht() {
  const [actief, setActief] = useState<Tab>("Open");

  return (
    <div className="flex flex-col gap-[14px] lg:gap-7">
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

      <LeegKaart />
    </div>
  );
}
