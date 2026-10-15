import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Nieuw wachtwoord | HUBi",
};

export const instant = false;

export default async function WachtwoordResettenPage() {
  // Zonder geldige resetlink (dus zonder sessie) mag je hier niet komen
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/wachtwoord-vergeten");

  return (
    <AuthShell
      brandTitle={
        <>
          Bijna klaar.
          <br />
          Kies een nieuw wachtwoord.
        </>
      }
      brandText="Daarna log je in met je nieuwe wachtwoord."
    >
      <header>
        <h1 className="text-[26px] font-bold lg:text-[28px]">Nieuw wachtwoord</h1>
        <p className="mt-1 text-[13px] text-hubi-muted lg:mt-2 lg:text-sm">
          Kies een wachtwoord van minimaal 12 tekens.
        </p>
      </header>

      <ResetPasswordForm />
    </AuthShell>
  );
}
