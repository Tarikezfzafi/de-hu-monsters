"use client";

import { useEffect, useState } from "react";

// Melding na het bevestigen van het e-mailadres. Komt na verversen niet terug.
export function AccountBevestigdMelding() {
  const [open, setOpen] = useState(true);

  // Haalt ?melding=... uit de adresbalk, zodat de melding na verversen weg is
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("melding")) return;

    url.searchParams.delete("melding");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, []);

  if (!open) return null;

  return (
    <div
      role="status"
      className="mb-6 flex items-start gap-3 rounded-[10px] border border-hubi-line bg-white px-4 py-3"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-hubi-ink lg:text-sm">
          <span aria-hidden="true">✓ </span>
          Je account is aangemaakt en bevestigd
        </p>
        <p className="mt-1 text-xs text-hubi-muted">
          Welkom bij HUBi! Vul hieronder je profiel in.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Melding sluiten"
        className="-mt-1 -mr-2 flex size-8 shrink-0 items-center justify-center rounded-full text-lg leading-none text-hubi-muted transition-colors hover:text-hubi-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
