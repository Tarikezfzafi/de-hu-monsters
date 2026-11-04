export type OntdekLid = {
  id: string;
  naam: string;
  tribe: string;
  match: number;
  initialen: string;
  kleur: string;
  skills: string[];
  hobbys: string[];
};

export const leden: OntdekLid[] = [
  {
    id: "alex",
    naam: "Alex",
    tribe: "Tribe B",
    match: 92,
    initialen: "A",
    kleur: "from-blue-500 to-cyan-400",
    skills: ["Linux", "Networking", "Python"],
    hobbys: ["Gaming"],
  },
  {
    id: "sophie",
    naam: "Sophie",
    tribe: "Tribe A",
    match: 87,
    initialen: "S",
    kleur: "from-fuchsia-500 to-rose-400",
    skills: [],
    hobbys: ["Muziek", "Reizen", "Fotografie"],
  },
  {
    id: "mees",
    naam: "Mees",
    tribe: "Tribe B",
    match: 76,
    initialen: "M",
    kleur: "from-violet-500 to-indigo-400",
    skills: [],
    hobbys: ["Fitness", "Gaming"],
  },
  {
    id: "lina",
    naam: "Lina",
    tribe: "Tribe C",
    match: 68,
    initialen: "L",
    kleur: "from-emerald-500 to-teal-400",
    skills: [],
    hobbys: ["Koken", "Reizen"],
  },
];
