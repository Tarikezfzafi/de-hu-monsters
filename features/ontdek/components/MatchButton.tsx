"use client";

import { useState } from "react";

type MatchButtonProps = {
  naam: string;
};

export function MatchButton({ naam }: MatchButtonProps) {
  const [gematcht, setGematcht] = useState(false);

  return (
    <div className="mt-8 border-t border-hubi-line pt-6">
      <button
        type="button"
        aria-pressed={gematcht}
        onClick={() => setGematcht(true)}
        className="h-12 w-full rounded-xl bg-hubi-ink px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link"
      >
        {gematcht ? `Match aangevraagd met ${naam} ✓` : `Match met ${naam}`}
      </button>
      {gematcht && (
        <p role="status" className="mt-2 text-center text-sm text-hubi-muted">
          Je match is geselecteerd.
        </p>
      )}
    </div>
  );
}
