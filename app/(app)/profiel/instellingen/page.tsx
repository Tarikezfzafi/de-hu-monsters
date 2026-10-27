import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AccountGegevens } from "@/features/instellingen/components/AccountGegevens";
import { InstellingenKnoppen } from "@/features/instellingen/components/InstellingenKnoppen";

export const metadata: Metadata = {
  title: "Instellingen | HUBi",
};

// Leest cookies (ingelogde gebruiker) pas binnen Suspense, vereist door cacheComponents
async function Account() {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const naam = user.user_metadata.full_name ?? "Niet ingevuld";

  return <AccountGegevens naam={naam} email={user.email ?? ""} />;
}

export default function InstellingenPage() {
  return (
    <main className="flex flex-1 justify-center px-5 pt-12 pb-10 lg:px-16 lg:py-24">
      <div className="w-full max-w-[350px] lg:max-w-[600px]">
        <Suspense fallback={<p className="text-sm text-hubi-muted">Laden...</p>}>
          <Account />
        </Suspense>

        <InstellingenKnoppen />
      </div>
    </main>
  );
}
