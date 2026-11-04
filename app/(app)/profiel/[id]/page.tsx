import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MatchButton } from "@/features/ontdek/components/MatchButton";
import { leden } from "@/features/ontdek/leden";

export const metadata: Metadata = {
  title: "Profiel bekijken | HUBi",
};

type ProfielPaginaProps = {
  params: Promise<{ id: string }>;
};

async function ProfielInspectieContent({ params }: ProfielPaginaProps) {
  const { id } = await params;
  const lid = leden.find((persoon) => persoon.id === id);

  if (!lid) notFound();

  return (
    <main className="flex flex-1 justify-center px-5 py-8 sm:px-8 lg:px-16 lg:py-16">
      <div className="w-full max-w-[650px]">
        <Link
          href="/ontdek"
          className="text-sm font-medium text-hubi-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hubi-link"
        >
          ← Terug naar Ontdek
        </Link>

        <article className="mt-5 rounded-2xl border border-hubi-line bg-white p-5 shadow-[0_4px_18px_rgba(20,23,28,0.05)] sm:p-8">
          <header className="flex items-center gap-4">
            <div
              aria-label={`${lid.naam}, profielfoto niet beschikbaar`}
              className={`flex size-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${lid.kleur} text-2xl font-bold text-white shadow-sm`}
            >
              {lid.initialen}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-hubi-muted">{lid.tribe}</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-hubi-ink">
                {lid.naam}
              </h1>
            </div>
            <span
              className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-hubi-link"
              aria-label={`${lid.match}% match`}
            >
              {lid.match}% match
            </span>
          </header>

          <section className="mt-8 border-t border-hubi-line pt-6">
            <h2 className="text-base font-semibold text-hubi-ink">Skills</h2>
            {lid.skills.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {lid.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-[#315da7]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-hubi-muted">
                Deze persoon heeft nog geen skills toegevoegd.
              </p>
            )}
          </section>

          <section className="mt-6 border-t border-hubi-line pt-6">
            <h2 className="text-base font-semibold text-hubi-ink">Hobby&apos;s</h2>
            {lid.hobbys.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {lid.hobbys.map((hobby) => (
                  <li
                    key={hobby}
                    className="rounded-full bg-[#f2effb] px-3 py-1.5 text-sm font-medium text-[#514387]"
                  >
                    {hobby}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-hubi-muted">
                Deze persoon heeft nog geen hobby&apos;s toegevoegd.
              </p>
            )}
          </section>

          <MatchButton naam={lid.naam} />
        </article>
      </div>
    </main>
  );
}

export default function ProfielInspectiePagina(props: ProfielPaginaProps) {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-hubi-muted">Profiel laden...</p>}>
      <ProfielInspectieContent {...props} />
    </Suspense>
  );
}
