import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfielForm } from "@/features/profiel/components/ProfielForm";
import { AccountBevestigdMelding } from "@/features/profiel/components/AccountBevestigdMelding";
import { LidKaart } from "@/features/ontdek/components/LidKaart";
import type { OntdekLid } from "@/features/ontdek/components/OntdekContent";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Profiel | HUBi",
};

// Leest cookies (ingelogde gebruiker) pas binnen Suspense, vereist door cacheComponents
async function Profiel() {
  // Pas renderen bij een echt verzoek: Supabase gebruikt Date.now() voor de sessie
  await connection();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profiel, error: profielFout } = await supabase
    .from("profiles")
    .select("tribe, skills_heb, skills_leer, hobbys, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (profielFout) {
    console.error("Profiel ophalen mislukt:", profielFout);
    throw new Error("Profielgegevens konden niet worden geladen.");
  }

  const naam = user.user_metadata.full_name ?? "Jouw profiel";

  // Voorbeeld van je kaart op Ontdek (pas zichtbaar als je een tribe hebt opgeslagen)
  const kaart: OntdekLid | null = profiel?.tribe
    ? {
        id: user.id,
        naam,
        tribe: profiel.tribe,
        skills: [...new Set([...(profiel.skills_heb ?? []), ...(profiel.skills_leer ?? [])])],
        hobbys: profiel.hobbys ?? [],
        avatarUrl: profiel.avatar_url,
        match: null,
        kleur: "from-slate-600 to-slate-400",
      }
    : null;

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-12">
      <div>
        <ProfielForm naam={naam} profiel={profiel} />
      </div>

      {kaart && (
        <aside aria-labelledby="voorbeeld-kaart" className="mt-10 lg:sticky lg:top-24 lg:mt-0">
          <h2
            id="voorbeeld-kaart"
            className="text-[10px] font-medium uppercase tracking-[0.6px] text-hubi-muted"
          >
            Zo zien anderen jou
          </h2>
          <div className="mt-2">
            <LidKaart lid={kaart} />
          </div>
        </aside>
      )}
    </div>
  );
}

// Toont eenmalig een melding als je net je e-mailadres hebt bevestigd (/confirm stuurt hierheen)
async function Melding({ searchParams }: Pick<PageProps<"/profiel">, "searchParams">) {
  const { melding } = await searchParams;

  return melding === "account-bevestigd" ? <AccountBevestigdMelding /> : null;
}

export default function ProfielPage({ searchParams }: PageProps<"/profiel">) {
  return (
    <main className="flex flex-1 justify-center px-5 pt-12 pb-10 lg:px-16 lg:py-24">
      <div className="w-full max-w-[350px] lg:max-w-[1120px]">
        <Suspense fallback={null}>
          <Melding searchParams={searchParams} />
        </Suspense>

        <Suspense fallback={<p className="mt-4 text-sm text-hubi-muted">Laden...</p>}>
          <Profiel />
        </Suspense>
      </div>
    </main>
  );
}
