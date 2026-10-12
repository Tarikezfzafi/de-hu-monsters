import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 12;

const HU_EMAIL_DOMAINS = ["@student.hu.nl", "@hu.nl"];

// Voor nu mag elk geldig e-mailadres (ook privé), want HU-mail ontvangt de
// bevestigingsmail nog niet. Zet op true om alleen HU-adressen toe te laten.
const ONLY_HU_EMAILS = false;

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Vul je voor- en achternaam in"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Vul je e-mailadres in")
      .email("Vul een geldig e-mailadres in")
      .refine(
        (email) =>
          !ONLY_HU_EMAILS ||
          HU_EMAIL_DOMAINS.some((domain) => email.endsWith(domain)),
        "Gebruik een e-mailadres van de Hogeschool Utrecht (student.hu.nl of hu.nl)",
      ),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Minimaal ${MIN_PASSWORD_LENGTH} tekens`),
    confirmPassword: z.string(),
    acceptTerms: z
      .boolean()
      .refine(
        (accepted) => accepted,
        "Je moet akkoord gaan met de gebruiksvoorwaarden en het privacybeleid",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Wachtwoorden komen niet overeen",
  });

export type RegisterValues = z.infer<typeof registerSchema>;
