import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Wachtwoord vergeten | HUBi",
};

// Taak 3: header en instructie. De opmaak volgt in taak 4.
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
      <header>
        <h1 className="text-[26px] font-bold lg:text-[28px]">Wachtwoord vergeten</h1>
        <p className="mt-1 text-[13px] text-hubi-muted lg:mt-2 lg:text-sm">
          Vul je e-mailadres in. We sturen je een link om een nieuw wachtwoord in te stellen.</p>
      </header>

      <ForgotPasswordForm />
    </AuthShell>
  );
}