import type { OntdekProfiel } from "@/features/profiel/actions";

const KLEUREN = [
  "from-blue-500 to-cyan-400",
  "from-fuchsia-500 to-rose-400",
  "from-violet-500 to-indigo-400",
  "from-emerald-500 to-teal-400",
];

export function kleurVoor(index: number) {
  return KLEUREN[index % KLEUREN.length];
}

export function skillsVan(profiel: OntdekProfiel) {
  return [...new Set([...profiel.skills_heb, ...profiel.skills_leer])];
}

function interessesVan(profiel: OntdekProfiel) {
  return new Set(
    [...profiel.skills_heb, ...profiel.skills_leer, ...profiel.hobbys].map((interesse) =>
      interesse.toLocaleLowerCase("nl")
    )
  );
}

// Match % = gedeelde interesses / alle interesses samen (null als je zelf nog niets hebt ingevuld)
export function berekenMatch(eigen: OntdekProfiel | undefined, ander: OntdekProfiel) {
  const mijn = eigen ? interessesVan(eigen) : new Set<string>();
  if (mijn.size === 0) return null;

  const van = interessesVan(ander);
  const gedeeld = [...van].filter((interesse) => mijn.has(interesse)).length;
  const samen = new Set([...mijn, ...van]).size;

  return Math.round((gedeeld / samen) * 100);
}
