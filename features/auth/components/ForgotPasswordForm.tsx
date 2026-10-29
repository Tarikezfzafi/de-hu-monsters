"use client";

import { useActionState } from "react";
import { requestPasswordReset, type ForgotPasswordState } from "../actions";
import { FormField } from "./FormField";

const initialState: ForgotPasswordState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState
  );

  return (
    <form
      action={formAction}
      noValidate
      className="mt-[26px] flex flex-col gap-[18px]"
    >
      <FormField
        label="E-mailadres"
        name="email"
        type="email"
        placeholder="jij@domain.hu.nl"
        autoComplete="email"
        error={state.errors?.email?.[0]}
        defaultValue={state.values?.email}
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-[14px] h-[46px] w-full rounded-[10px] bg-hubi-ink text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link disabled:cursor-not-allowed disabled:opacity-60 lg:mt-[18px] lg:h-[50px] lg:text-base"
      >
        {pending ? "Bezig..." : "Link versturen →"}
      </button>

      {state.sent && (
        <div
          role="status"
          className="mt-2 rounded-[10px] border border-hubi-line bg-white px-4 py-[9px] lg:py-[13.5px]"
        >
          <p className="text-[13px] leading-4 font-semibold text-hubi-ink lg:text-sm lg:leading-[17px]">
            ✓ Check je inbox
          </p>
          <p className="mt-1 text-xs leading-[15px] text-hubi-muted">
            Staat de mail er niet tussen? Kijk in je spam of vraag een nieuwe
            link aan.
          </p>
        </div>
      )}
    </form>
  );
}
