"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { loginUser, type LoginState } from "../actions";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";

const initialState: LoginState = {};

// Seconden tot het einde van de blokkade: 0 = niet (meer) geblokkeerd, null = nog onbekend
function useResterendeSeconden(tot?: number): number | null {
  const [tik, setTik] = useState<{ tot: number; nu: number } | null>(null);

  useEffect(() => {
    if (!tot) return;

    const tikken = () => {
      setTik({ tot, nu: Date.now() });
      if (Date.now() >= tot) clearInterval(interval);
    };
    const interval = setInterval(tikken, 1000);
    const eerste = setTimeout(tikken, 0);

    return () => {
      clearInterval(interval);
      clearTimeout(eerste);
    };
  }, [tot]);

  if (!tot) return 0;
  if (tik?.tot !== tot) return null;
  return Math.max(0, Math.ceil((tot - tik.nu) / 1000));
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginUser, initialState);
  const resterend = useResterendeSeconden(state.blokkadeTot);
  const geblokkeerd = resterend === null || resterend > 0;

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

      {state.message && !(state.blokkadeTot && resterend === 0) && (
        <p role="alert" className="text-sm text-red-600">{state.message}</p>
      )}

      {geblokkeerd && resterend !== null && (
        // Alleen voor het oog: een alert die elke seconde verandert wordt te vaak voorgelezen
        <p aria-hidden="true" className="-mt-2 text-xs tabular-nums text-hubi-muted">
          Opnieuw proberen over {Math.floor(resterend / 60)}:
          {String(resterend % 60).padStart(2, "0")}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || geblokkeerd}
        className="mt-[18px] h-[46px] w-full rounded-[10px] bg-hubi-ink text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link disabled:cursor-not-allowed disabled:opacity-60 lg:h-[50px] lg:text-base"
      >
        {pending ? "Bezig..." : "Inloggen →"}
      </button>
    </form>
  );
}