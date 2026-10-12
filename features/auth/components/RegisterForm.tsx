"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../actions";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";
import {
  MIN_PASSWORD_LENGTH,
  registerSchema,
  type RegisterValues,
} from "../schemas";

export function RegisterForm() {
  const [serverMessage, setServerMessage] = useState<string>();

  const {
    register,
    handleSubmit,
    setError,
    trigger,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  async function onSubmit(values: RegisterValues) {
    setServerMessage(undefined);

    // Bij gelukt stuurt de server door naar /registreren/bevestig.
    const result = await registerUser(values);

    if (result.errors) {
      for (const [field, messages] of Object.entries(result.errors)) {
        if (messages?.[0]) {
          setError(field as keyof RegisterValues, { message: messages[0] });
        }
      }
    }
    if (result.message) setServerMessage(result.message);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-[26px] flex flex-col gap-[18px]">
      <FormField
        label="Volledige naam"
        placeholder="Voor- en achternaam"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <FormField
        label="E-mailadres"
        type="email"
        placeholder="jij@student.hu.nl"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordField
        label="Wachtwoord"
        placeholder="••••••••"
        autoComplete="new-password"
        hint={`Minimaal ${MIN_PASSWORD_LENGTH} tekens`}
        error={errors.password?.message}
        {...register("password", {
          onChange: () => {
            if (touchedFields.confirmPassword) void trigger("confirmPassword");
          },
        })}
      />

      <PasswordField
        label="Wachtwoord herhalen"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <label className="flex items-start gap-2 pt-5 text-xs text-hubi-ink">
        <input
          type="checkbox"
          aria-invalid={errors.acceptTerms ? true : undefined}
          className="grid size-[18px] shrink-0 appearance-none place-content-center rounded-[4px] border-[1.5px] border-hubi-ink before:hidden before:text-xs before:leading-none before:text-white before:content-['✓'] checked:bg-hubi-ink checked:before:block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link"
          {...register("acceptTerms")}
        />
        <span>Ik ga akkoord met de gebruiksvoorwaarden en het privacybeleid</span>
      </label>
      {errors.acceptTerms && (
        <p role="alert" className="text-[11px] text-red-600">
          {errors.acceptTerms.message}
        </p>
      )}

      {serverMessage && (
        <p role="alert" className="text-sm text-red-600">
          {serverMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-[18px] h-[46px] w-full rounded-[10px] bg-hubi-ink text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link disabled:cursor-not-allowed disabled:opacity-60 lg:h-[50px] lg:text-base"
      >
        {isSubmitting ? "Bezig..." : "Account aanmaken →"}
      </button>
    </form>
  );
}
