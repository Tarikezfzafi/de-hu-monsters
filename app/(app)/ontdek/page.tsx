import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { getOntdekProfielen } from "@/features/profiel/actions";
import { OntdekContent, type OntdekLid } from "@/features/ontdek/components/OntdekContent";
import { berekenMatch, kleurVoor, skillsVan } from "@/features/ontdek/match";

export const metadata: Metadata = {
  title: "Ontdek | HUBi",
};

async function OntdekData() {
  await connection();

  const resultaat = await getOntdekProfielen();
  if ("fout" in resultaat) {
    return (
      <OntdekContent
        leden={[]}
        fout={resultaat.fout}
      />
    );
  }

  const { profielen, eigenId } = resultaat;
  const eigenProfiel = profielen.find((profiel) => profiel.id === eigenId);

  // Eigen kaart bovenaan Ontdek (null = nog geen profiel opgeslagen)
  const eigenLid: OntdekLid | null = eigenProfiel
    ? {
        id: eigenProfiel.id,
        naam: eigenProfiel.naam,
        tribe: eigenProfiel.tribe,
        skills: skillsVan(eigenProfiel),
        hobbys: eigenProfiel.hobbys,
        avatarUrl: eigenProfiel.avatar_url,
        match: null, // geen % voor jezelf
        kleur: "from-slate-600 to-slate-400",
      }
    : null;

  const leden = profielen
    .filter((profiel) => profiel.id !== eigenId)
    .map((profiel, index): OntdekLid => ({
      id: profiel.id,
      naam: profiel.naam,
      tribe: profiel.tribe,
      skills: skillsVan(profiel),
      hobbys: profiel.hobbys,
      avatarUrl: profiel.avatar_url,
      match: berekenMatch(eigenProfiel, profiel),
      kleur: kleurVoor(index),
    }));

  return <OntdekContent leden={leden} eigenLid={eigenLid} />;
}

export default function OntdekPage() {
  return (
    <Suspense
      fallback={
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <p className="text-sm text-hubi-muted">Profielen laden...</p>
        </main>
      }
    >
      <OntdekData />
    </Suspense>
  );
}
