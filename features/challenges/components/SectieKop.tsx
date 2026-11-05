type SectieKopProps = {
  id: string;
  titel: string;
  // Stap in de flow, bijvoorbeeld "1 · Accepteren"
  stap: string;
};

// Kopje boven een sectie van het challengescherm (VOORSTEL, BEZIG, AFGEROND)
export function SectieKop({ id, titel, stap }: SectieKopProps) {
  return (
    <div className="flex items-center justify-between gap-2 text-hubi-muted">
      <h2
        id={id}
        className="text-[11px] leading-[13px] font-medium tracking-[1px] uppercase"
      >
        {titel}
      </h2>
      <p className="text-[10px] leading-[13px] lg:text-[11px]">{stap}</p>
    </div>
  );
}
