type AccountGegevensProps = {
  naam: string;
  email: string;
};

// Sectie ACCOUNT van het instellingenscherm (Figma 07a / D7a): alleen weergeven
export function AccountGegevens({ naam, email }: AccountGegevensProps) {
  return (
    <section aria-labelledby="account-kop">
      <h2
        id="account-kop"
        className="text-[11px] leading-[13px] font-medium uppercase tracking-[0.66px] text-hubi-muted"
      >
        Account
      </h2>

      <ul className="mt-[11px] lg:mt-[13px]">
        <Rij label="Naam" waarde={naam} />
        <Rij label="E-mailadres" waarde={email} />
        <Rij label="Wachtwoord wijzigen" />
      </ul>
    </section>
  );
}

function Rij({ label, waarde }: { label: string; waarde?: string }) {
  return (
    <li className="flex h-12 items-center justify-between gap-4 border-b border-hubi-line text-sm lg:h-[52px] lg:text-[15px]">
      <span className="shrink-0 text-hubi-ink">{label}</span>

      <span className="flex min-w-0 items-center gap-2 text-hubi-muted">
        {waarde && <span className="truncate">{waarde}</span>}
        <span aria-hidden="true">›</span>
      </span>
    </li>
  );
}
