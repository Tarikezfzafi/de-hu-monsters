import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { ChallengesKop } from "@/features/challenges/components/ChallengesKop";
import { ChallengesOverzicht } from "@/features/challenges/components/ChallengesOverzicht";
import { getChallengeData } from "@/features/challenges/data";

export const metadata: Metadata = {
  title: "Challenges | HUBi",
};

// Leest de ingelogde gebruiker pas binnen Suspense, vereist door cacheComponents
async function ChallengesData() {
  await connection();

  const { punten, overzicht, fout } = await getChallengeData();

  return (
    <>
      <ChallengesKop punten={punten} />

      {fout && (
        <p role="alert" className="text-sm text-red-600">
          {fout}
        </p>
      )}

      <ChallengesOverzicht
        voorstellen={overzicht.voorstellen}
        bezig={overzicht.bezig}
        afgerond={overzicht.afgerond}
      />
    </>
  );
}

export default function ChallengesPage() {
  return (
    <main className="min-w-0 flex-1 px-5 pt-[41px] pb-10 lg:px-12 lg:pt-[83px]">
      <div className="mx-auto flex max-w-[1104px] flex-col gap-3 lg:gap-[34px]">
        <Suspense fallback={<ChallengesKop />}>
          <ChallengesData />
        </Suspense>
      </div>
    </main>
  );
}
