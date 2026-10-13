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
  values?: {
    fullName?: string;
    email?: string;
  };
};

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  // Waarden vooraf uitlezen zodat we ze terug kunnen geven bij een fout
  const fullName = formData.get("fullName")?.toString() || "";
  const email = formData.get("email")?.toString() || "";

  // 1. Valideren
  const result = registerSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { 
      errors: z.flattenError(result.error).fieldErrors,
      values: { fullName, email }
    };
  }

  // 2. Account aanmaken bij Supabase
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: { full_name: result.data.fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
    },
  });

  if (error) {
    console.error(error);
    return { 
      message: "Registreren is mislukt. Probeer het opnieuw.",
      values: { fullName, email }
    };
  }

  // 3. Doorsturen
  redirect("/registreren/bevestig");
}


const loginSchema = z.object({
  email: z.email("Vul een geldig e-mailadres in"),
  password: z.string().min(1, "Vul je wachtwoord in"),
});

export type LoginState = {
  errors?: Partial<Record<keyof z.infer<typeof loginSchema>, string[]>>;
  message?: string;
  values?: {
    email?: string;
  };
};

export async function loginUser(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // Waarde vooraf uitlezen voor de fallback
  const email = formData.get("email")?.toString() || "";

  // 1. Valideren
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { 
      errors: z.flattenError(result.error).fieldErrors,
      values: { email }
    };
  }

  // 2. Inloggen bij Supabase
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    return { 
      message: "E-mailadres of wachtwoord klopt niet.",
      values: { email }
    };
  }

  // 3. Doorsturen
  redirect("/");
}