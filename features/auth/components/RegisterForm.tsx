"use client";

import { useActionState } from "react";
import { registerUser, type RegisterState } from "../actions";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerUser, initialState);

  return (
    <form action={formAction} className="mt-[26px] flex flex-col gap-[18px]">
      <FormField
        label="Volledige naam"
        name="fullName"
        placeholder="Voor- en achternaam"
        autoComplete="name"
        error={state.errors?.fullName?.[0]}
      />

      <FormField
        label="E-mailadres"
        name="email"
        type="email"
        placeholder="jij@student.hu.nl"
        autoComplete="email"
        error={state.errors?.email?.[0]}
      />

      <PasswordField
        label="Wachtwoord"
        name="password"
        placeholder="••••••••"
        autoComplete="new-password"
        hint="Minimaal 12 tekens"
        error={state.errors?.password?.[0]}
      />

      <PasswordField
        label="Wachtwoord herhalen"
        name="confirmPassword"
        placeholder="••••••••"
        autoComplete="new-password"
        error={state.errors?.confirmPassword?.[0]}
      />

      
      <label className="flex items-start gap-2 pt-5 text-xs text-hubi-ink">
        <input
          type="checkbox"
          name="acceptTerms"
          className="grid size-[18px] shrink-0 appearance-none place-content-center rounded-[4px] border-[1.5px] border-hubi-ink before:hidden before:text-xs before:leading-none before:text-white before:content-['✓'] checked:bg-hubi-ink checked:before:block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link"
        />

        <span>Ik ga akkoord met de gebruiksvoorwaarden en het privacybeleid</span>
      </label>
      {state.errors?.acceptTerms && (
        <p className="text-[11px] text-red-600">{state.errors.acceptTerms[0]}</p>
      )}

      {state.message && (
        <p role="alert" className="text-sm text-red-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-[18px] h-[46px] w-full rounded-[10px] bg-hubi-ink text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link disabled:cursor-not-allowed disabled:opacity-60 lg:h-[50px] lg:text-base"
      >
        {pending ? "Bezig..." : "Account aanmaken →"}
      </button>
    </form>
  );
}
