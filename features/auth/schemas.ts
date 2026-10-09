import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 12;

const HU_EMAIL_DOMAINS = ["@student.hu.nl", "@hu.nl"];

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Vul je e-mailadres in")
      .email("Vul een geldig e-mailadres in")
      .refine(
        (email) => HU_EMAIL_DOMAINS.some((domain) => email.endsWith(domain)),
        "Gebruik een e-mailadres van de Hogeschool Utrecht (student.hu.nl of hu.nl)",
      ),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Minimaal ${MIN_PASSWORD_LENGTH} tekens`),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Wachtwoorden komen niet overeen",
  });

export type RegisterValues = z.infer<typeof registerSchema>;
