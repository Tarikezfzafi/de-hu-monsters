"use client";

import { useEffect, useState, useTransition } from "react";
import { accepteerChallenge, weigerChallenge } from "../actions";
import type { ChallengeAfgerond, ChallengeBezig, ChallengeVoorstel } from "../types";
import { AfgerondRijen } from "./AfgerondRijen";
import { BezigKaarten } from "./BezigKaarten";
import { LeegKaart } from "./LeegKaart";
import { Melding } from "./Melding";
import { VoorstelKaarten } from "./VoorstelKaarten";

const MELDING_DUUR_MS = 3000;

const tabs = ["Open", "Bezig", "Afgerond"] as const;
type Tab = (typeof tabs)[number];

type ChallengesOverzichtProps = {
  voorstellen?: ChallengeVoorstel[];
  bezig?: ChallengeBezig[];
  afgerond?: ChallengeAfgerond[];
  // Voorbeeldpagina: de knoppen doen alsof, zonder de database
  demo?: boolean;
};

// Tabs en inhoud van het challengescherm. Zonder challenges in de gekozen tab staat de lege staat.
export function ChallengesOverzicht({
  voorstellen = [],
  bezig = [],
  afgerond = [],
  demo = false,
}: ChallengesOverzichtProps) {
  const [actief, setActief] = useState<Tab>("Open");
  const [melding, setMelding] = useState<{ tekst: string; id: number } | null>(null);
  const [bezigMetActie, startActie] = useTransition();

  // De melding verdwijnt na een paar seconden vanzelf
  useEffect(() => {
    if (!melding) return;

    const timer = setTimeout(() => setMelding(null), MELDING_DUUR_MS);
    return () => clearTimeout(timer);
  }, [melding]);

  function toonMelding(tekst: string) {
    setMelding({ tekst, id: Date.now() });
  }

  // De server past de database aan en laadt de pagina daarna opnieuw met de nieuwe stand
  function accepteer(id: string) {
    if (demo) return toonMelding("Challenge geaccepteerd (voorbeeld)");

    startActie(async () => {
      const resultaat = await accepteerChallenge(id);
      if (!resultaat.ok) toonMelding(resultaat.fout);
    });
  }

  function weiger(id: string) {
    if (demo) return toonMelding("Nieuwe challenge geladen");

    startActie(async () => {
      const resultaat = await weigerChallenge(id);
      toonMelding(resultaat.ok ? (resultaat.melding ?? "Nieuwe challenge geladen") : resultaat.fout);
    });
  }

  // Open toont alle secties; Bezig en Afgerond alleen hun eigen sectie
  const toonVoorstellen = actief === "Open" ? voorstellen : [];
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

      {toonVoorstellen.length > 0 || toonBezig.length > 0 || toonAfgerond.length > 0 ? (
        <div className="grid items-start gap-x-6 gap-y-3 lg:grid-cols-2 lg:gap-y-7">
          {toonVoorstellen.length > 0 && (
            <VoorstelKaarten
              voorstellen={toonVoorstellen}
              bezig={bezigMetActie}
              onAccepteren={accepteer}
              onWeigeren={weiger}
            />
          )}
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

      <Melding tekst={melding?.tekst ?? null} />
    </div>
  );
}
