"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Dezelfde vijf schermen als in de Figma-wireframes (mobiel en desktop)
const LINKS = [
  { href: "/ontdek", label: "Ontdek" },
  { href: "/matches", label: "Matches" },
  { href: "/challenges", label: "Challenges" },
  { href: "/ranking", label: "Ranking" },
  { href: "/profiel", label: "Profiel" },
] as const;

// Mobiel: tabbalk onderaan. Vanaf lg: zijbalk links met het HUBi-logo.
export function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Hoofdnavigatie"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hubi-line bg-background lg:sticky lg:inset-auto lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:self-start lg:border-t-0 lg:border-r lg:bg-white lg:px-4 lg:pt-8"
    >
      <Link
        href="/ontdek"
        className="hidden rounded-[10px] px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:block"
      >
        <Image
          src="/logo.webp"
          alt="HUBi"
          width={900}
          height={604}
          sizes="72px"
          className="h-auto w-[72px]"
        />
      </Link>

      <ul className="grid h-[72px] grid-cols-5 lg:mt-4 lg:flex lg:h-auto lg:flex-col lg:gap-3">
        {LINKS.map(({ href, label }) => {
          const actief = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href} className="contents">
              <Link
                href={href}
                aria-current={actief ? "page" : undefined}
                className={`flex items-center justify-center text-[10px] font-medium uppercase transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-hubi-link lg:h-10 lg:justify-start lg:rounded-[10px] lg:px-5 lg:text-sm lg:font-normal lg:normal-case lg:focus-visible:outline-offset-0 ${
                  actief
                    ? "text-hubi-ink lg:bg-[#e6e8eb] lg:font-semibold"
                    : "text-hubi-muted hover:text-hubi-ink lg:hover:bg-background"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
