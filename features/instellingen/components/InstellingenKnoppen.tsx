// Knop onderaan het instellingenscherm (Figma 07a / D7a). Nog zonder werking.
// Uitloggen zit in de navigatiebalk.
export function InstellingenKnoppen() {
  return (
    <div className="mt-[73px] lg:mt-[53px]">
      <button
        type="button"
        className="w-full py-2 text-center text-xs text-hubi-muted transition-colors hover:text-hubi-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link"
      >
        Account verwijderen
      </button>
    </div>
  );
}
