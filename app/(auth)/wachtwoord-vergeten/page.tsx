import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Wachtwoord vergeten | HUBi",
};

type SearchParams = Promise<{ fout?: string }>;

// Leest ?fout=... pas binnen Suspense, zodat de rest van de pagina niet hoeft te wachten
async function InvalidLinkNotice({ searchParams }: { searchParams: SearchParams }) {
  const { fout } = await searchParams;

  if (fout !== "link-ongeldig") return null;

  return (
    <p role="alert" className="mt-4 text-sm text-red-600">
      Deze link is verlopen of al gebruikt. Vraag hieronder een nieuwe aan.
    </p>
  );
}

export default function WachtwoordVergetenPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <AuthShell
      brandTitle={
        <>
          Geen zorgen,
          <br />
          je komt er weer in.
        </>
      }
      brandText="Je ontvangt een link per e-mail om een nieuw wachtwoord in te stellen."
    >
      <Link
        href="/login"
        className="mb-5 inline-block text-[13px] font-medium text-hubi-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:mb-6"
      >
        ← Terug naar inloggen
      </Link>

      <header>
        <h1 className="text-[26px] font-bold lg:text-[28px]">Wachtwoord vergeten</h1>
        <p className="mt-1 text-[13px] text-hubi-muted lg:mt-2 lg:text-sm">
          Vul je e-mailadres in. We sturen je een link om een nieuw wachtwoord in te stellen.
        </p>
      </header>

      <Suspense fallback={null}>
        <InvalidLinkNotice searchParams={searchParams} />
      </Suspense>

      <ForgotPasswordForm />
    </AuthShell>
  );
}