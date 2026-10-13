"use client";

import type { FormEvent } from "react";
import { FormField } from "./FormField";

export function ForgotPasswordForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Het versturen van de link volgt in een latere taak. Dit voorkomt dat
    // de pagina herlaadt als je op Enter drukt.
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-[26px]">
      <FormField
        label="E-mailadres"
        name="email"
        type="email"
        placeholder="jij@domain.hu.nl"
        autoComplete="email"
      />
    </form>
  );
}
