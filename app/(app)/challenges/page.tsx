import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Challenges | HUBi",
};

export default function ChallengesPage() {
  return (
    <main className="flex flex-1 justify-center px-5 pt-12 pb-10 lg:px-16 lg:py-24">
      <div className="w-full max-w-[350px] lg:max-w-[790px]">
        <h1 className="text-[26px] font-bold lg:text-[28px]">Challenges</h1>
        <p className="mt-1 text-[13px] text-hubi-muted lg:mt-2 lg:text-sm">
          Dit scherm komt binnenkort.
        </p>
      </div>
    </main>
  );
}
