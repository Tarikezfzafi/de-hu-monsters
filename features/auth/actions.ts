"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registerSchema, type RegisterValues } from "./schemas";

export type RegisterState = {
  errors?: Partial<Record<keyof RegisterValues, string[]>>;
  message?: string;
};

export async function registerUser(
  values: RegisterValues
): Promise<RegisterState> {
  // 1. Valideren met dezelfde regels als in het formulier. De browser-check
  // is te omzeilen, dus de server controleert alles opnieuw.
  const result = registerSchema.safeParse(values);

  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors };
  }

  const { fullName, email, password } = result.data;

  // 2. Account aanmaken bij Supabase
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) {
    return { message: "Registreren is mislukt. Probeer het opnieuw." };
  }

  // 3. Doorsturen
  redirect("/registreren/bevestig");
}
