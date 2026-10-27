import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfielForm } from "@/features/profiel/components/ProfielForm";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Profiel | HUBi",
};

// Leest cookies (ingelogde gebruiker) pas binnen Suspense, vereist door cacheComponents
async function Profiel() {
  // Pas renderen bij een echt verzoek: Supabase gebruikt Date.now() voor de sessie
  await connection();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profiel } = await supabase
    .from("profiles")
    .select("tribe, skills_heb, skills_leer, hobbys, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const naam = user.user_metadata.full_name ?? "Jouw profiel";

  return <ProfielForm naam={naam} profiel={profiel} />;
}

export default function ProfielPage() {
  return (
    <main className="flex flex-1 justify-center px-5 pt-12 pb-10 lg:px-16 lg:py-24">
      <div className="w-full max-w-[350px] lg:max-w-[790px]">
        

        <Suspense fallback={<p className="mt-4 text-sm text-hubi-muted">Laden...</p>}>
          <Profiel />
        </Suspense>
      </div>
    </main>
  );
}
