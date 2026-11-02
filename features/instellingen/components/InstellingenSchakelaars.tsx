import type { ReactNode } from "react";
import { Schakelaar } from "./Schakelaar";

// Secties MELDINGEN en PRIVACY van het instellingenscherm (Figma 07a / D7a)
export function InstellingenSchakelaars() {
  return (
    <div className="mt-6 flex flex-col gap-6 lg:mt-9 lg:gap-9">
      <Sectie titel="Meldingen">
        <Schakelaar label="Nieuwe matches" standaardAan />
        <Schakelaar label="Challenge-updates" standaardAan />
        <Schakelaar label="Beoordeling door docent" />
      </Sectie>

      <Sectie titel="Privacy">
        <Schakelaar label="Profiel zichtbaar voor mijn tribe" standaardAan />
      </Sectie>
    </div>
  );
}

function Sectie({ titel, children }: { titel: string; children: ReactNode }) {
  const id = `sectie-${titel.toLowerCase()}`;

  return (
    <section aria-labelledby={id}>
      <h2
        id={id}
        className="text-[11px] leading-[13px] font-medium uppercase tracking-[0.66px] text-hubi-muted"
      >
        {titel}
      </h2>

      <ul className="mt-[11px] lg:mt-[13px]">{children}</ul>
    </section>
  );
}
