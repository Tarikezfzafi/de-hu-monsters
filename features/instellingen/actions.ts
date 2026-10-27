"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UitloggenState = {
  message?: string;
};

export async function logoutUser(): Promise<UitloggenState> {
  // 1. Sessie beëindigen bij Supabase (verwijdert ook de cookies)
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    return { message: "Uitloggen is mislukt. Probeer het opnieuw." };
  }

  // 2. Terug naar het inlogscherm
  redirect("/login");
}
