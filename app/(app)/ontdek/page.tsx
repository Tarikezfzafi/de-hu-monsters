import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { getOntdekProfielen } from "@/features/profiel/actions";
import { OntdekContent, type OntdekLid } from "@/features/ontdek/components/OntdekContent";

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
        skills: [...new Set([...eigenProfiel.skills_heb, ...eigenProfiel.skills_leer])],
        hobbys: eigenProfiel.hobbys,
        avatarUrl: eigenProfiel.avatar_url,
        match: null, // geen % voor jezelf
        kleur: "from-slate-600 to-slate-400",
      }
    : null;

  const eigenInteresses = new Set(
    [
      ...(eigenProfiel?.skills_heb ?? []),
      ...(eigenProfiel?.skills_leer ?? []),
      ...(eigenProfiel?.hobbys ?? []),
    ].map((interesse) => interesse.toLocaleLowerCase("nl"))
  );

  const leden = profielen
    .filter((profiel) => profiel.id !== eigenId)
    .map((profiel, index): OntdekLid => {
      const skills = [
        ...new Set([
          ...profiel.skills_heb,
          ...profiel.skills_leer,
        ]),
      ];
      const hobbys = profiel.hobbys;
      const interesses = new Set(
        [...skills, ...hobbys].map((interesse) => interesse.toLocaleLowerCase("nl"))
      );
      const gedeeld = [...interesses].filter((interesse) =>
        eigenInteresses.has(interesse)
      ).length;
      const union = new Set([...eigenInteresses, ...interesses]);
      const match = eigenInteresses.size > 0 && union.size > 0
        ? Math.round((gedeeld / union.size) * 100)
        : null;

      return {
        id: profiel.id,
        naam: profiel.naam,
        tribe: profiel.tribe,
        skills,
        hobbys,
        avatarUrl: profiel.avatar_url,
        match,
        kleur: [
          "from-blue-500 to-cyan-400",
          "from-fuchsia-500 to-rose-400",
          "from-violet-500 to-indigo-400",
          "from-emerald-500 to-teal-400",
        ][index % 4],
      };
    });

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
