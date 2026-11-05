type MeldingProps = {
  // Zonder tekst is er geen melding zichtbaar
  tekst: string | null;
};

// Korte melding onderaan het scherm (Figma "Toast / Nieuwe challenge")
export function Melding({ tekst }: MeldingProps) {
  return (
    // Het gebied staat altijd in de pagina, zodat schermlezers een nieuwe tekst voorlezen
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[58px] z-50 flex justify-center px-5 lg:bottom-11"
    >
      {tekst && (
        <p className="rounded-full bg-hubi-ink px-5 py-2.5 text-[13px] leading-4 font-medium text-white">
          {tekst}
        </p>
      )}
    </div>
  );
}
