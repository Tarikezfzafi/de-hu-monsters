"use client";

import { useMemo, useState, type FormEvent } from "react";

const zoekcategorieen = ["Naam", "Skill/hobby", "Tribe"] as const;
type Zoekcategorie = (typeof zoekcategorieen)[number];

type Zoekcriterium = {
  categorie: Zoekcategorie;
  waarde: string;
};

const leden = [
  {
    naam: "Alex",
    tribe: "Tribe B",
    match: 92,
    initialen: "A",
    kleur: "from-blue-500 to-cyan-400",
    skills: ["Linux", "Networking", "Python"],
    hobbys: ["Gaming"],
  },
  {
    naam: "Sophie",
    tribe: "Tribe A",
    match: 87,
    initialen: "S",
    kleur: "from-fuchsia-500 to-rose-400",
    skills: [],
    hobbys: ["Muziek", "Reizen", "Fotografie"],
  },
  {
    naam: "Mees",
    tribe: "Tribe B",
    match: 76,
    initialen: "M",
    kleur: "from-violet-500 to-indigo-400",
    skills: [],
    hobbys: ["Fitness", "Gaming"],
  },
  {
    naam: "Lina",
    tribe: "Tribe C",
    match: 68,
    initialen: "L",
    kleur: "from-emerald-500 to-teal-400",
    skills: [],
    hobbys: ["Koken", "Reizen"],
  },
];

export function OntdekContent() {
  const [zoekterm, setZoekterm] = useState("");
  const [zoekcategorie, setZoekcategorie] = useState<Zoekcategorie>("Naam");
  const [zoekcriteria, setZoekcriteria] = useState<Zoekcriterium[]>([]);

  const gevondenLeden = useMemo(() => {
    return leden.filter((lid) => {
      return zoekcriteria.every(({ categorie, waarde }) => {
        const zoek = waarde.toLocaleLowerCase("nl");
        const waarden = categorie === "Naam"
          ? [lid.naam]
          : categorie === "Skill/hobby"
            ? [...lid.skills, ...lid.hobbys]
              : [lid.tribe];

        return waarden.some((veld) => veld.toLocaleLowerCase("nl").includes(zoek));
      });
    });
  }, [zoekcriteria]);

  function voegCriteriumToe(waarde: string) {
    const zoekwaarde = waarde.trim();
    if (!zoekwaarde) return;

    const bestaatAl = zoekcriteria.some(
      (criterium) =>
        criterium.categorie === zoekcategorie
        && criterium.waarde.toLocaleLowerCase("nl") === zoekwaarde.toLocaleLowerCase("nl")
    );

    if (!bestaatAl) {
      setZoekcriteria((huidig) => [
        ...huidig,
        { categorie: zoekcategorie, waarde: zoekwaarde },
      ]);
    }

    setZoekterm("");
  }

  function voegZoekcriteriumToe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    voegCriteriumToe(zoekterm);
  }

  const zoekopties = useMemo(() => {
    const zoek = zoekterm.trim().toLocaleLowerCase("nl");
    if (!zoek) return [];

    const opties = leden.flatMap((lid) =>
      zoekcategorie === "Naam"
        ? [lid.naam]
        : zoekcategorie === "Skill/hobby"
          ? [...lid.skills, ...lid.hobbys]
          : [lid.tribe]
    );

    return [...new Set(opties)]
      .filter((optie) => optie.toLocaleLowerCase("nl").startsWith(zoek))
      .slice(0, 6);
  }, [zoekcategorie, zoekterm]);

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#f3f4f6]">
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1050px]">
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-[28px] font-bold tracking-tight text-hubi-ink">
                Ontdek
              </h1>
              <p className="mt-1 text-sm text-hubi-muted">
                Ontmoet mensen met dezelfde interesses.
              </p>
            </div>
            <span className="rounded-full bg-gradient-to-r from-blue-50 via-fuchsia-50 to-rose-50 px-3 py-1.5 text-xs font-medium text-[#514387]">
              Vind jouw match ✨
            </span>
          </div>

          <div className="mt-6 max-w-[620px]">
            <form
              onSubmit={voegZoekcriteriumToe}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <div>
                <label htmlFor="ontdek-categorie" className="sr-only">
                  Zoekcategorie
                </label>
                <select
                  id="ontdek-categorie"
                  value={zoekcategorie}
                  onChange={(event) => {
                    const categorie = zoekcategorieen.find(
                      (optie) => optie === event.target.value
                    );
                    if (categorie) setZoekcategorie(categorie);
                  }}
                  className="h-12 w-full rounded-2xl border border-hubi-line bg-white px-3 text-sm text-hubi-ink shadow-sm outline-none focus:border-[#7771d7] focus:ring-4 focus:ring-[#7771d7]/10 sm:w-auto"
                >
                  {zoekcategorieen.map((categorie) => (
                    <option key={categorie} value={categorie}>
                      {categorie}
                    </option>
                  ))}
                </select>
              </div>
              <input
                id="ontdek-zoeken"
                type="text"
                value={zoekterm}
                onChange={(event) => setZoekterm(event.target.value)}
                aria-label={`Zoek op ${zoekcategorie.toLocaleLowerCase("nl")}`}
                placeholder={`Zoek ${zoekcategorie === "Naam" ? "een naam" : `een ${zoekcategorie.toLocaleLowerCase("nl")}`}...`}
                className="h-12 min-w-0 flex-1 rounded-2xl border border-hubi-line bg-white px-4 text-sm text-hubi-ink shadow-sm outline-none transition placeholder:text-hubi-muted focus:border-[#7771d7] focus:ring-4 focus:ring-[#7771d7]/10"
              />
              <button
                type="submit"
                disabled={!zoekterm.trim()}
                className="h-12 shrink-0 rounded-2xl bg-hubi-ink px-5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link disabled:cursor-not-allowed disabled:opacity-50"
              >
                Voeg toe
              </button>
            </form>

            {zoekopties.length > 0 && (
              <ul
                aria-label="Zoeksuggesties"
                className="mt-2 flex flex-wrap gap-2"
              >
                {zoekopties.map((optie) => (
                  <li key={optie}>
                    <button
                      type="button"
                      onClick={() => voegCriteriumToe(optie)}
                      className="rounded-full border border-hubi-line bg-white px-3 py-1.5 text-sm text-hubi-ink shadow-sm transition hover:border-[#9b91d9] hover:bg-[#f7f5fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link"
                    >
                      {optie}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {zoekcriteria.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Actieve zoekfilters">
                {zoekcriteria.map((criterium, index) => (
                  <span
                    key={`${criterium.categorie}-${criterium.waarde}-${index}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#d9d3ef] bg-[#f2effb] py-1 pl-3 pr-1 text-xs text-[#514387]"
                  >
                    <span className="font-semibold">{criterium.categorie}:</span>
                    {criterium.waarde}
                    <button
                      type="button"
                      aria-label={`Verwijder ${criterium.categorie}: ${criterium.waarde}`}
                      onClick={() =>
                        setZoekcriteria((huidig) =>
                          huidig.filter((_, huidigIndex) => huidigIndex !== index)
                        )
                      }
                      className="flex size-6 items-center justify-center rounded-full text-sm text-[#514387] hover:bg-[#e2dcf4] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-hubi-link"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setZoekcriteria([])}
                  className="px-2 py-1 text-xs text-hubi-muted underline underline-offset-2 hover:text-hubi-ink"
                >
                  Wis alles
                </button>
              </div>
            )}
            <p className="mt-2 text-xs text-hubi-muted">
              Voeg filters één voor één toe. Typ een beginletter om bestaande namen, skills en hobby&apos;s te zien.
            </p>
          </div>

          {gevondenLeden.length > 0 ? (
            <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2">
              {gevondenLeden.map((lid) => (
                <li key={lid.naam}>
                  <article className="flex min-h-[142px] gap-4 rounded-2xl border border-white bg-white p-4 shadow-[0_4px_18px_rgba(20,23,28,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(20,23,28,0.09)] sm:p-5">
                    <div
                      aria-label={`${lid.naam}, profielfoto niet beschikbaar`}
                      className={`flex size-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${lid.kleur} text-lg font-bold text-white shadow-sm`}
                    >
                      {lid.initialen}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h2 className="text-sm font-semibold text-hubi-ink">
                            {lid.naam}
                          </h2>
                          <p className="mt-1 text-xs text-hubi-muted">
                            ICT · {lid.tribe}
                          </p>
                        </div>
                        <span
                          className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-hubi-link"
                          aria-label={`${lid.match}% match`}
                        >
                          {lid.match}%
                        </span>
                      </div>
                      <ul aria-label="Interesses" className="mt-3 flex flex-wrap gap-1.5">
                        {[...lid.skills, ...lid.hobbys].map((tag, index) => (
                          <li
                            key={tag}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                              index === 0
                                ? "bg-blue-50 text-[#315da7]"
                                : index === 1
                                  ? "bg-fuchsia-50 text-[#8b4386]"
                                  : "bg-emerald-50 text-[#287866]"
                            }`}
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-hubi-line bg-white/70 px-6 py-10 text-center">
              <p className="font-semibold text-hubi-ink">Geen matches gevonden</p>
              <p className="mt-1 text-sm text-hubi-muted">
                Probeer een andere naam, skill of hobby.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
