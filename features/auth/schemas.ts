import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 12;

export const registerSchema = z
  .object({
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
