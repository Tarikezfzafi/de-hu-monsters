"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";
import { logoutUser } from "@/features/auth/actions";

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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hubi-line bg-background lg:sticky lg:inset-auto lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:self-start lg:border-t-0 lg:border-r lg:bg-white lg:px-4 lg:pt-8 lg:pb-8"
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

      <ul className="grid h-[72px] grid-cols-6 lg:mt-4 lg:flex lg:h-auto lg:flex-1 lg:flex-col lg:gap-3">
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

        {/* Mobiel: zesde tab. Desktop: onderaan de zijbalk (mt-auto) */}
        <li className="flex lg:mt-auto">
          <form action={logoutUser} className="flex w-full">
            <UitlogKnop />
          </form>
        </li>
      </ul>
    </nav>
  );
}

// Eigen component, want useFormStatus werkt alleen binnen een <form>
function UitlogKnop() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full flex-col items-center justify-center gap-1 text-[10px] font-medium uppercase text-red-600 transition-colors hover:text-red-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-hubi-link disabled:cursor-not-allowed disabled:opacity-60 lg:h-10 lg:flex-row lg:justify-start lg:gap-2 lg:rounded-[10px] lg:px-5 lg:text-sm lg:font-normal lg:normal-case lg:hover:bg-red-50 lg:focus-visible:outline-offset-0"
    >
      <UitlogIcoon />
      {pending ? "Bezig..." : "Uitloggen"}
    </button>
  );
}

function UitlogIcoon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
