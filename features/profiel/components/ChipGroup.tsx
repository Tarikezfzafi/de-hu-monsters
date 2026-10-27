"use client";

import { useRef, useState } from "react";

type ChipGroupProps = {
  titel: string;
  name: "skillsHeb" | "skillsLeer" | "hobbys";
  opties: string[];
  gekozen: string[];
};

// Basis voor elke chip: vaste hoogte + tekst exact in het midden
const chipBase =
  "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full border-[1.5px] px-5 text-sm leading-none transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:h-[46px] lg:text-[15px]";

const selectedChipColors: Record<ChipGroupProps["name"], string> = {
  skillsHeb: "border-[#2456a6] bg-[#2456a6] text-white",
  skillsLeer: "border-[#65419a] bg-[#65419a] text-white",
  hobbys: "border-[#176b62] bg-[#176b62] text-white",
};

export function ChipGroup({ titel, name, opties, gekozen }: ChipGroupProps) {
  // Standaardopties + eerder opgeslagen eigen opties, zonder dubbele
  const [alle, setAlle] = useState(() => [...new Set([...opties, ...gekozen])]);
  const [selectie, setSelectie] = useState(() => [...new Set(gekozen)]);
  const [nieuw, setNieuw] = useState<string | null>(null);
  const submitOnBlur = useRef(true);

  function toggle(item: string) {
    setSelectie((huidig) =>
      huidig.includes(item) ? huidig.filter((x) => x !== item) : [...huidig, item]
    );
  }

  function toevoegen(waarde = nieuw) {
    submitOnBlur.current = false;
    const trimmed = waarde?.trim();
    if (trimmed && !alle.includes(trimmed)) {
      setAlle((huidig) => [...huidig, trimmed]);
      setSelectie((huidig) => [...huidig, trimmed]);
    }
    setNieuw(null);
  }

  function verwijderen(item: string) {
    setAlle((huidig) => huidig.filter((waarde) => waarde !== item));
    setSelectie((huidig) => huidig.filter((waarde) => waarde !== item));
  }

  return (
    <fieldset>
      <legend className="mb-3 text-[10px] font-medium uppercase tracking-[0.6px] text-hubi-muted">
        {titel}
      </legend>

      <div className="flex flex-wrap gap-3">
        {alle.map((item) => {
          const actief = selectie.includes(item);

          return (
            <span key={item} className="inline-flex items-center gap-1.5">
              <button
                type="button"
                aria-pressed={actief}
                onClick={() => toggle(item)}
                className={`${chipBase} gap-2 ${
                  actief
                    ? `${selectedChipColors[name]} font-semibold shadow-sm`
                    : "border-hubi-ink bg-transparent text-hubi-ink hover:bg-hubi-line/50"
                }`}
              >
                {item}
                {actief && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="size-4 shrink-0"
                  >
                    <path
                      d="m3.5 8 3 3 6-6"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
              <button
                type="button"
                aria-label={`${item} verwijderen`}
                onClick={() => verwijderen(item)}
                className="flex size-6 shrink-0 items-center justify-center rounded-full border border-hubi-soft text-base leading-none text-hubi-muted transition-colors hover:border-red-500 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link"
              >
                ×
              </button>
            </span>
          );
        })}

        {nieuw === null ? (
          <button
            type="button"
            onClick={() => {
              submitOnBlur.current = true;
              setNieuw("");
            }}
            className={`${chipBase} border-dashed border-hubi-soft text-hubi-muted hover:border-hubi-ink hover:text-hubi-ink`}
          >
            + Toevoegen
          </button>
        ) : (
          <input
            autoFocus
            value={nieuw}
            onChange={(event) => setNieuw(event.target.value)}
            onBlur={() => {
              if (submitOnBlur.current) toevoegen();
            }}
            onKeyDown={(event) => {
              // Enter mag het formulier niet versturen
              if (event.key === "Enter") {
                event.preventDefault();
                toevoegen(nieuw);
              }
              if (event.key === "Escape") {
                submitOnBlur.current = false;
                setNieuw(null);
              }
            }}
            placeholder="Typ en druk Enter"
            maxLength={40}
            className={`${chipBase} w-44 border-dashed border-hubi-ink bg-transparent text-hubi-ink outline-none placeholder:text-hubi-muted`}
          />
        )}
      </div>

      {/* Elke gekozen chip als hidden input, zodat formData.getAll(name) ze ophaalt */}
      {selectie.map((item) => (
        <input key={item} type="hidden" name={name} value={item} />
      ))}
    </fieldset>
  );
}