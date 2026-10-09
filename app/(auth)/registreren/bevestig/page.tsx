import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/auth/components/AuthShell";

export const metadata: Metadata = {
  title: "Bevestig je e-mail | HUBi",
};

export default function BevestigPage() {
  return (
    <AuthShell
      brandTitle={
        <>
          Bijna klaar.
          <br />
          Check je inbox.
        </>
      }
      brandText="Bevestig je e-mailadres en vul daarna je profiel in."
    >
      <header>
        <h1 className="text-[26px] font-bold lg:text-[28px]">
          Check je mail
        </h1>
        <p className="mt-1 text-[13px] text-hubi-muted lg:mt-2 lg:text-sm">
          We hebben een bevestigingslink naar je e-mailadres gestuurd. Klik op
          de link om je account te activeren.
        </p>
      </header>

      <p className="mt-6 text-center text-[13px] text-hubi-muted">
        Al bevestigd?{" "}
        <Link href="/login" className="text-hubi-link">
          Inloggen
        </Link>
      </p>
    </AuthShell>
  );
}
