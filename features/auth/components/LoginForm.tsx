"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, type LoginState } from "../actions";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginUser, initialState);

  return (
    <form action={formAction} className="mt-[26px] flex flex-col gap-[18px]">
      <FormField
        label="E-mailadres"
        name="email"
        type="email"
        placeholder="jij@domain.nl"
        autoComplete="email"
        error={state.errors?.email?.[0]}
        // ↓ Toegevoegd: bewaart de invoer na een fout
        defaultValue={state.values?.email}
      />

      <PasswordField
        label="Wachtwoord"
        name="password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={state.errors?.password?.[0]}
      />

      <Link
        href="/wachtwoord-vergeten"
        className="self-end text-xs text-hubi-link hover:underline"
      >
        Wachtwoord vergeten?
      </Link>

      {state.message && (
        <p role="alert" className="text-sm text-red-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-[18px] h-[46px] w-full rounded-[10px] bg-hubi-ink text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link disabled:cursor-not-allowed disabled:opacity-60 lg:h-[50px] lg:text-base"
      >
        {pending ? "Bezig..." : "Inloggen →"}
      </button>
    </form>
  );
}