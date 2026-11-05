const stijlen = {
  "Bewijs indienen": "border-solid bg-white text-hubi-ink",
  Goedgekeurd: "border-solid bg-hubi-ink text-white",
  Afgekeurd: "border-dashed bg-white text-hubi-ink",
} as const;

export type ChallengeStatus = keyof typeof stijlen;

// Chip met de status van een challenge (Figma "Chip / Status")
export function StatusChip({ status }: { status: ChallengeStatus }) {
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center rounded-full border-[1.5px] border-hubi-ink px-3 text-xs font-medium whitespace-nowrap ${stijlen[status]}`}
    >
      {status}
    </span>
  );
}
