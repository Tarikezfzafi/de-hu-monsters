import type { Metadata } from "next";
import { ProfielForm } from "@/features/profiel/components/ProfielForm";

export const metadata: Metadata = {
  title: "Profielvoorbeeld | HUBi",
};

export default function ProfielVoorbeeldPage() {
  return (
    <main className="flex flex-1 justify-center px-5 pt-12 pb-10 lg:px-16 lg:py-24">
      <div className="w-full max-w-[350px] lg:max-w-[790px]">
        <p className="text-[10px] font-medium uppercase tracking-[0.6px] text-hubi-muted">
          Scherm 02 · Voorbeeld
        </p>

        <ProfielForm
          naam="Jouw profiel"
          voorbeeld
          profiel={{
            tribe: "Tribe Gert & Roel",
            skills_heb: ["Python", "Figma"],
            skills_leer: ["Networking"],
            hobbys: ["Gaming", "Fotografie"],
            avatar_url: null,
          }}
        />
      </div>
    </main>
  );
}
