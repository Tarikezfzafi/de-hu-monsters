"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { FormField } from "./FormField";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Voorkomt dat de pagina herlaadt.
    event.preventDefault();

    // Alleen de weergave: er wordt nog niets verstuurd. Het echt versturen
    // van de link (Supabase) en de controle van het e-mailadres volgen in een
    // latere taak.
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    if (email.trim() === "") return;
    setSent(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-[26px] flex flex-col gap-[18px]"
    >
      <FormField
        label="E-mailadres"
        name="email"
        type="email"
        placeholder="jij@domain.hu.nl"
        autoComplete="email"
      />

      <button
        type="submit"
        className="mt-[14px] h-[46px] w-full rounded-[10px] bg-hubi-ink text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:mt-[18px] lg:h-[50px] lg:text-base"
      >
        Link versturen →
      </button>

      {sent && (
        <div
          role="status"
          className="mt-2 rounded-[10px] border border-hubi-line bg-white px-4 py-3"
        >
          <p className="text-[13px] font-semibold text-hubi-ink lg:text-sm">
            ✓ Check je inbox
          </p>
          <p className="mt-1 text-xs text-hubi-muted">
            Staat de mail er niet tussen? Kijk in je spam of vraag een nieuwe
            link aan.
          </p>
        </div>
      )}
    </form>
  );
}
