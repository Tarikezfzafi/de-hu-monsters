import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  RankingContent,
  type IndividueleRanglijstItem,
  type TribeRanglijstItem,
} from "@/features/ranking/components/RankingContent";

export const metadata: Metadata = {
  title: "Leaderboard | HUBi",
};

type IndividueleRanglijstRij = {
  id: string;
  display_name: string;
  xp: number;
};

type TribeRanglijstRij = {
  tribe: string;
  xp: number;
};

async function RankingData() {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  if (userError) {
    console.error("Ingelogde gebruiker voor leaderboard ophalen mislukt:", userError);
    return (
      <RankingContent
        individueel={[]}
        tribes={[]}
        fout="De ranglijst kon niet worden geladen. Vernieuw de pagina en probeer het opnieuw."
      />
    );
  }

  const [individueleResultaat, tribeResultaat, profielResultaat] =
    await Promise.all([
      supabase
        .from("leaderboard_individuals")
        .select("id, display_name, xp")
        .order("xp", { ascending: false })
        .order("display_name", { ascending: true }),
      supabase
        .from("leaderboard_tribes")
        .select("tribe, xp")
        .order("xp", { ascending: false })
        .order("tribe", { ascending: true }),
      supabase
        .from("profiles")
        .select("tribe")
        .eq("id", user.id)
        .maybeSingle(),
    ]);

  if (individueleResultaat.error || tribeResultaat.error || profielResultaat.error) {
    console.error("Leaderboardgegevens ophalen mislukt:", {
      individueleRanglijst: individueleResultaat.error,
      tribeRanglijst: tribeResultaat.error,
      profiel: profielResultaat.error,
    });

    return (
      <RankingContent
        individueel={[]}
        tribes={[]}
        fout="De ranglijst kon niet worden geladen. Vernieuw de pagina en probeer het opnieuw."
      />
    );
  }

  const individueel = (
    (individueleResultaat.data ?? []) as IndividueleRanglijstRij[]
  ).map(
    (rij): IndividueleRanglijstItem => ({
      id: rij.id,
      naam: rij.display_name,
      xp: rij.xp,
      huidig: rij.id === user.id,
    })
  );

  const eigenTribe = profielResultaat.data?.tribe;
  const tribes = ((tribeResultaat.data ?? []) as TribeRanglijstRij[]).map(
    (rij): TribeRanglijstItem => ({
      id: rij.tribe,
      naam: rij.tribe,
      xp: rij.xp,
      huidig: rij.tribe === eigenTribe,
    })
  );

  return <RankingContent individueel={individueel} tribes={tribes} />;
}

export default function RankingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <p className="text-sm text-hubi-muted">Ranglijst laden...</p>
        </main>
      }
    >
      <RankingData />
    </Suspense>
  );
}
