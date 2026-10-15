"use client";

import { useState } from "react";

type ChipGroupProps = {
  titel: string;
  name: string;
  opties: string[];
  gekozen: string[];
};

// Basis voor elke chip: vaste hoogte + tekst exact in het midden
const chipBase =
  "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full border-[1.5px] px-5 text-sm leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:h-[46px] lg:text-[15px]";

export function ChipGroup({ titel, name, opties, gekozen }: ChipGroupProps) {
  // Standaardopties + eerder opgeslagen eigen opties, zonder dubbele
  const [alle, setAlle] = useState(() => [...new Set([...opties, ...gekozen])]);
  const [selectie, setSelectie] = useState(gekozen);
  const [nieuw, setNieuw] = useState<string | null>(null);

  function toggle(item: string) {
    setSelectie((huidig) =>
      huidig.includes(item) ? huidig.filter((x) => x !== item) : [...huidig, item]
    );
  }

  function toevoegen() {
    const waarde = nieuw?.trim();
    if (waarde && !alle.includes(waarde)) {
      setAlle((huidig) => [...huidig, waarde]);
      setSelectie((huidig) => [...huidig, waarde]);
    }
    setNieuw(null);
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
            <button
              key={item}
              type="button"
              aria-pressed={actief}
              onClick={() => toggle(item)}
              className={`${chipBase} border-hubi-ink text-hubi-ink ${
                actief ? "bg-hubi-accent font-semibold" : "bg-transparent hover:bg-hubi-line/50"
              }`}
            >
              {item}
            </button>
          );
        })}

        {nieuw === null ? (
          <button
            type="button"
            onClick={() => setNieuw("")}
            className={`${chipBase} border-dashed border-hubi-soft text-hubi-muted hover:border-hubi-ink hover:text-hubi-ink`}
          >
            + Toevoegen
          </button>
        ) : (
          <input
            autoFocus
            value={nieuw}
            onChange={(event) => setNieuw(event.target.value)}
            onBlur={toevoegen}
            onKeyDown={(event) => {
              // Enter mag het formulier niet versturen
              if (event.key === "Enter") {
                event.preventDefault();
                toevoegen();
              }
              if (event.key === "Escape") setNieuw(null);
            }}
            placeholder="Typ en druk Enter"
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