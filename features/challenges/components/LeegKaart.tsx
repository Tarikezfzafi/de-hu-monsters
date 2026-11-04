import Link from "next/link";

// Lege staat van het challengescherm (Figma 08a / D8a Challenges, Leeg)
export function LeegKaart() {
  return (
    <div className="flex flex-col items-center gap-5 rounded-xl border border-hubi-line bg-white px-5 py-8 lg:px-8 lg:py-12">
      <p className="text-center text-sm leading-[17px] text-hubi-ink lg:text-base lg:leading-[19px]">
        Nog geen challenges. Zoek een match bij Ontdek.
      </p>

      <Link
        href="/ontdek"
        className="flex min-h-[46px] w-full items-center justify-center rounded-[10px] bg-hubi-ink px-4 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:min-h-[54px] lg:w-[260px] lg:rounded-xl lg:text-base"
      >
        <span>
          Naar Ontdek <span aria-hidden="true">→</span>
        </span>
      </Link>
    </div>
  );
}
