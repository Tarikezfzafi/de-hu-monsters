"use client";

import { useState } from "react";

type RanglijstType = "individueel" | "tribe";

export type IndividueleRanglijstItem = {
  id: string;
  naam: string;
  xp: number;
  huidig: boolean;
};

export type TribeRanglijstItem = {
  id: string;
  naam: string;
  xp: number;
  huidig: boolean;
};

type RankingContentProps = {
  individueel: IndividueleRanglijstItem[];
  tribes: TribeRanglijstItem[];
  fout?: string;
};

export function RankingContent({
  individueel,
  tribes,
  fout,
}: RankingContentProps) {
  const [ranglijstType, setRanglijstType] = useState<RanglijstType>("individueel");
  const ranglijst =
    ranglijstType === "individueel" ? individueel : tribes;
  const legeRanglijst = ranglijstType === "individueel" ? "individuele ranking" : "tribe ranking";

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#f3f4f6]">
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1050px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-hubi-muted">
            Scherm 07 / 07
          </p>
          <h1 className="mt-1 text-[28px] font-bold tracking-tight text-hubi-ink">
            Leaderboard
          </h1>

          <div
            role="group"
            aria-label="Kies een leaderboard"
            className="mt-3 grid h-9 w-full max-w-[234px] grid-cols-2 overflow-hidden rounded-[9px] border border-hubi-ink"
          >
            <button
              type="button"
              aria-pressed={ranglijstType === "individueel"}
              onClick={() => setRanglijstType("individueel")}
              className={`rounded-[8px] text-xs font-semibold transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-hubi-link ${
                ranglijstType === "individueel"
                  ? "bg-[#079bd2] text-white"
                  : "bg-transparent text-hubi-ink hover:bg-white/70"
              }`}
            >
              Individueel
            </button>
            <button
              type="button"
              aria-pressed={ranglijstType === "tribe"}
              onClick={() => setRanglijstType("tribe")}
              className={`rounded-[8px] text-xs font-semibold transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-hubi-link ${
                ranglijstType === "tribe"
                  ? "bg-[#079bd2] text-white"
                  : "bg-transparent text-hubi-ink hover:bg-white/70"
              }`}
            >
              Tribe
            </button>
          </div>

          {fout ? (
            <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700">
              {fout}
            </p>
          ) : ranglijst.length > 0 ? (
            <ol
              aria-label={legeRanglijst}
              className="mt-5 grid list-none gap-[9px] p-0"
            >
              {ranglijst.map((item, index) => (
                <li key={item.id}>
                  <article
                    className={`flex min-h-[50px] items-center gap-3 rounded-[12px] border bg-white px-4 py-[7px] sm:gap-4 sm:px-[18px] ${
                      item.huidig
                        ? "border-[4px] border-[#079bd2] bg-[#e1f3fa]"
                        : "border-hubi-line"
                    }`}
                  >
                    <span
                      aria-label={`Plek ${index + 1}`}
                      className="w-[20px] shrink-0 text-xs tabular-nums text-hubi-muted"
                    >
                      {index + 1}
                    </span>
                    <span
                      aria-hidden="true"
                      className="size-[34px] shrink-0 rounded-full bg-[#e5e7eb]"
                    />
                    <h2 className="min-w-0 flex-1 truncate text-sm font-semibold text-hubi-ink">
                      {item.naam}
                    </h2>
                    <span className="shrink-0 text-xs font-semibold tabular-nums text-hubi-ink sm:text-sm">
                      {new Intl.NumberFormat("nl-NL").format(item.xp)} XP
                    </span>
                  </article>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-5 rounded-xl border border-hubi-line bg-white p-5 text-sm text-hubi-muted">
              Er staan nog geen profielen op deze ranglijst.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
