"use client";

import { useId, useState } from "react";

type SchakelaarProps = {
  label: string;
  standaardAan?: boolean;
};

// Rij met een aan/uit-schakelaar (Figma 07a / D7a). De stand wordt nog niet opgeslagen.
export function Schakelaar({ label, standaardAan = false }: SchakelaarProps) {
  const id = useId();
  const [aan, setAan] = useState(standaardAan);

  return (
    <li className="flex h-12 items-center justify-between gap-4 border-b border-hubi-line text-sm lg:h-[52px] lg:text-[15px]">
      <label htmlFor={id} className="min-w-0 cursor-pointer text-hubi-ink">
        {label}
      </label>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={aan}
        onClick={() => setAan(!aan)}
        className={`relative h-[22px] w-10 shrink-0 rounded-full border-[1.5px] border-hubi-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link motion-reduce:transition-none lg:h-6 lg:w-11 ${
          aan ? "bg-hubi-ink" : "bg-transparent"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-1/2 left-[2.5px] size-4 -translate-y-1/2 rounded-full transition-transform motion-reduce:transition-none lg:size-[18px] ${
            aan ? "translate-x-[17px] bg-white lg:translate-x-[19px]" : "bg-hubi-ink"
          }`}
        />
      </button>
    </li>
  );
}
