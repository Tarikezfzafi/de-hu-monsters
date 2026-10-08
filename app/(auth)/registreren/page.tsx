import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Account aanmaken | HUBi",
};

export default function RegistrerenPage() {
  return (
    <AuthShell
      brandTitle={
        <>
          Maak je account
          <br />
          en vind je tribe.
        </>
      }
      brandText="Registreren duurt een minuut. Daarna vul je je profiel in en word je gematcht met medestudenten."
    >
      <header>
        <h1 className="text-[26px] font-bold lg:text-[28px]">
          Account aanmaken
        </h1>
        <p className="mt-1 text-[13px] text-hubi-muted lg:mt-2 lg:text-sm">
          Maak een HUBi-account met je HU-mailadres
        </p>
      </header>

      <RegisterForm />

      <p className="mt-6 text-center text-[13px] text-hubi-muted">
        Heb je al een account?{" "}
        <Link href="/login" className="text-hubi-link">
          Inloggen
        </Link>
      </p>
    </AuthShell>
  );
}
