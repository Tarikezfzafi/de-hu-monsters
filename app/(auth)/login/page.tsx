import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Inloggen | HUBi",
};

type SearchParams = Promise<{ wachtwoord?: string }>;

// Leest ?wachtwoord=... pas binnen Suspense, zodat de rest van de pagina niet hoeft te wachten
async function PasswordChangedNotice({ searchParams }: { searchParams: SearchParams }) {
  const { wachtwoord } = await searchParams;

  if (wachtwoord !== "gewijzigd") return null;

  return (
    <p role="status" className="mt-4 text-sm text-green-700">
      Je wachtwoord is gewijzigd. Log in met je nieuwe wachtwoord.
    </p>
  );
}

export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <AuthShell
      brandTitle={
        <>
          Vind je tribe.
          <br />
          Deel je skills.
          <br />
          Groei samen.
        </>
      }
      brandText="HUBi matcht je met medestudenten op skills en hobby's, met wekelijkse challenges om samen te groeien."
    >
      <header>
        <h1 className="text-[26px] font-bold lg:text-[28px]">Inloggen</h1>
        <p className="mt-1 text-[13px] text-hubi-muted lg:mt-2 lg:text-sm">
          Log in of maak een account aan om te starten
        </p>
      </header>

      <Suspense fallback={null}>
        <PasswordChangedNotice searchParams={searchParams} />
      </Suspense>

      <LoginForm />

      <p className="mt-6 text-center text-[13px] text-hubi-muted">
        Nog geen account?{" "}
        <Link href="/registreren" className="text-hubi-link">
          Registreren hier
        </Link>
      </p>
    </AuthShell>
  );
}