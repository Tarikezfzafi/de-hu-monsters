import type { Metadata } from "next";
import { ChallengesKop } from "@/features/challenges/components/ChallengesKop";
import { ChallengesOverzicht } from "@/features/challenges/components/ChallengesOverzicht";
import type { ChallengeVoorstel } from "@/features/challenges/types";

export const metadata: Metadata = {
  title: "Challenges voorbeeld | HUBi",
};

// Voorbeeld met nepgegevens, voor het bekijken en testen van het scherm zonder backend
const voorstel: ChallengeVoorstel = {
  id: "voorbeeld",
  titel: "Linux Challenge",
  beschrijving: "Los samen een Linux-probleem op en laat zien wat je kunt.",
  xp: 50,
  partner: "Sophie",
};

export default function ChallengesVoorbeeldPage() {
  return (
    <main className="min-w-0 flex-1 px-5 pt-[41px] pb-10 lg:px-12 lg:pt-[83px]">
      <div className="mx-auto flex max-w-[1104px] flex-col gap-3 lg:gap-[34px]">
        <ChallengesKop punten={3} />
        <ChallengesOverzicht voorstel={voorstel} />
      </div>
    </main>
  );
}
