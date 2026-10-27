// Knoppen onderaan het instellingenscherm (Figma 07a / D7a). Nog zonder werking.
export function InstellingenKnoppen() {
  return (
    <div className="mt-[73px] lg:mt-[53px]">
      <button
        type="button"
        className="h-11 w-full rounded-[10px] border-[1.5px] border-hubi-ink bg-white text-[13px] font-semibold text-hubi-ink transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:h-[50px] lg:rounded-xl lg:text-[15px]"
      >
        Uitloggen
      </button>

      <button
        type="button"
        className="mt-3 w-full py-2 text-center text-xs text-hubi-muted transition-colors hover:text-hubi-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:mt-2"
      >
        Account verwijderen
      </button>
    </div>
  );
}
