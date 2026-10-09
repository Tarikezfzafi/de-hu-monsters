"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Vul je volledige naam in"),
    email: z.email("Vul een geldig e-mailadres in"),
    password: z.string().min(12, "Wachtwoord moet minimaal 12 tekens zijn"),
    confirmPassword: z.string(),
    acceptTerms: z.literal("on", "Je moet akkoord gaan met de voorwaarden"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Wachtwoorden komen niet overeen",
    path: ["confirmPassword"],
  });

export type RegisterState = {
  errors?: Partial<Record<keyof z.infer<typeof registerSchema>, string[]>>;
  message?: string;
};

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  // 1. Valideren
  const result = registerSchema.safeParse(Object.fromEntries(formData));

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
