"use client";

import { useActionState } from "react";
import { logoutUser, type UitloggenState } from "../actions";

const initialState: UitloggenState = {};

// Knoppen onderaan het instellingenscherm (Figma 07a / D7a)
export function InstellingenKnoppen() {
  const [state, formAction, pending] = useActionState(logoutUser, initialState);

  return (
    <div className="mt-[73px] lg:mt-[53px]">
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className="h-11 w-full rounded-[10px] border-[1.5px] border-hubi-ink bg-white text-[13px] font-semibold text-hubi-ink transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link disabled:cursor-wait disabled:opacity-60 lg:h-[50px] lg:rounded-xl lg:text-[15px]"
        >
          {pending ? "Uitloggen..." : "Uitloggen"}
        </button>
      </form>

      {state.message && (
        <p role="alert" className="mt-3 text-center text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button
        type="button"
        className="mt-3 w-full py-2 text-center text-xs text-hubi-muted transition-colors hover:text-hubi-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:mt-2"
      >
        Account verwijderen
      </button>
    </div>
  );
}
