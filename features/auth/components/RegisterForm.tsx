"use client";


import type { FormEvent } from "react";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";

export function RegisterForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-[26px] flex flex-col gap-[18px]">
      <FormField
        label="Volledige naam"
        name="fullName"
        placeholder="Voor- en achternaam"
        autoComplete="name"
      />

      <FormField
        label="E-mailadres"
        name="email"
        type="email"
        placeholder="jij@student.hu.nl"
        autoComplete="email"
      />

      <PasswordField
        label="Wachtwoord"
        name="password"
        placeholder="••••••••"
        autoComplete="new-password"
        hint="Minimaal 12 tekens"
      />

      <PasswordField
        label="Wachtwoord herhalen"
        name="confirmPassword"
        placeholder="••••••••"
        autoComplete="new-password"
      />

      {}
      <label className="flex items-start gap-2 pt-5 text-xs text-hubi-ink">
        <input
          type="checkbox"
          name="acceptTerms"
          className="grid size-[18px] shrink-0 appearance-none place-content-center rounded-[4px] border-[1.5px] border-hubi-ink before:hidden before:text-xs before:leading-none before:text-white before:content-['✓'] checked:bg-hubi-ink checked:before:block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link"
        />
        <span>Ik ga akkoord met de gebruiksvoorwaarden en het privacybeleid</span>
      </label>

      <button
        type="submit"
        className="mt-[18px] h-[46px] w-full rounded-[10px] bg-hubi-ink text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:h-[50px] lg:text-base"
      >
        Account aanmaken →
      </button>
    </form>
  );
}
