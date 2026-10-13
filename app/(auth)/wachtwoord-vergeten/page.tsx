import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";

export const metadata: Metadata = {
  title: "Wachtwoord vergeten | HUBi",
};

// Taak 2: tekst (zie ontwerp D1b). De rest volgt.
export default function WachtwoordVergetenPage() {
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
      {null}
    </AuthShell>
  );
}