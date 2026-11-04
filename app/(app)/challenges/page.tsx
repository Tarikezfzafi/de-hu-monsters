import type { Metadata } from "next";
import { ChallengesKop } from "@/features/challenges/components/ChallengesKop";
import { ChallengesOverzicht } from "@/features/challenges/components/ChallengesOverzicht";

export const metadata: Metadata = {
  title: "Challenges | HUBi",
};

export default function ChallengesPage() {
  return (
    <main className="min-w-0 flex-1 px-5 pt-[41px] pb-10 lg:px-12 lg:pt-[83px]">
      <div className="mx-auto flex max-w-[1104px] flex-col gap-3 lg:gap-[34px]">
        <ChallengesKop />
        <ChallengesOverzicht />
      </div>
    </main>
  );
}
