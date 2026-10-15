"use client";

import { useActionState } from "react";
import { updatePassword, type ResetPasswordState } from "../actions";
import { PasswordField } from "./PasswordField";

const initialState: ResetPasswordState = {};

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  return (
    <form action={formAction} className="mt-[26px] flex flex-col gap-[18px]">
      <PasswordField
        label="Nieuw wachtwoord"
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

      {state.message && (
        <p role="alert" className="text-sm text-red-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-[18px] h-[46px] w-full rounded-[10px] bg-hubi-ink text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link disabled:cursor-not-allowed disabled:opacity-60 lg:h-[50px] lg:text-base"
      >
        {pending ? "Bezig..." : "Wachtwoord opslaan →"}
      </button>
    </form>
  );
}
