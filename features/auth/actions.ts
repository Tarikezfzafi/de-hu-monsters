"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  blokkadeMelding,
  blokkadeTot,
  registreerMislukteLogin,
  wisPogingen,
} from "./pogingen";

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
  // Tijdstip (ms) waarop de blokkade na te veel pogingen eindigt
  blokkadeTot?: number;
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

  // 2. Geblokkeerd na te veel mislukte pogingen?
  const geblokkeerdTot = await blokkadeTot();

  if (geblokkeerdTot) {
    return {
      message: blokkadeMelding(geblokkeerdTot),
      blokkadeTot: geblokkeerdTot,
      values: { email }
    };
  }

  // 3. Inloggen bij Supabase
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    // Deze poging telt mee; bij de laatste poging gaat de blokkade in
    const nieuweBlokkade = await registreerMislukteLogin();

    if (nieuweBlokkade) {
      return {
        message: blokkadeMelding(nieuweBlokkade),
        blokkadeTot: nieuweBlokkade,
        values: { email }
      };
    }

    return { 
      message: "E-mailadres of wachtwoord klopt niet.",
      values: { email }
    };
  }

  // 4. Gelukt: teller wissen en doorsturen
  await wisPogingen();
  redirect("/profiel");
}

const forgotPasswordSchema = z.object({
  email: z.email("Vul een geldig e-mailadres in"),
});

export type ForgotPasswordState = {
  errors?: Partial<Record<keyof z.infer<typeof forgotPasswordSchema>, string[]>>;
  message?: string;
  sent?: boolean;
  values?: { email?: string };
};

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = formData.get("email")?.toString() || "";

  // 1. Valideren
  const result = forgotPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
      values: { email },
    };
  }

  // 2. Resetmail laten versturen door Supabase
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(result.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/wachtwoord-resetten`,
  });

  if (error) {
    console.error(error);
  }

  // 3. Altijd "verstuurd" tonen, ook als het e-mailadres niet bestaat
  return { sent: true, values: { email } };
}

const resetPasswordSchema = z
  .object({
    password: z.string().min(12, "Wachtwoord moet minimaal 12 tekens zijn"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Wachtwoorden komen niet overeen",
    path: ["confirmPassword"],
  });

export type ResetPasswordState = {
  errors?: Partial<Record<keyof z.infer<typeof resetPasswordSchema>, string[]>>;
  message?: string;
};

export async function updatePassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  // 1. Valideren
  const result = resetPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors };
  }

  // 2. Nieuw wachtwoord opslaan bij Supabase
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: result.data.password,
  });

    if (error) {
    // Zelfde wachtwoord als het oude: link is nog geldig, dus ander bericht
    if (error.code === "same_password") {
      return { message: "Kies een ander wachtwoord dan je huidige." };
    }

    console.error(error);
    return { message: "Wachtwoord wijzigen is mislukt. Vraag een nieuwe link aan." };
  }

    // 3. Uitloggen, zodat de gebruiker opnieuw inlogt met het nieuwe wachtwoord
  await supabase.auth.signOut();

  // 4. Doorsturen naar inloggen
  redirect("/login?wachtwoord=gewijzigd");
}

export async function logoutUser() {
  // 1. Sessie beëindigen bij Supabase en de sessie-cookies wissen
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
  }

  // 2. Doorsturen naar inloggen
  redirect("/login");
}

