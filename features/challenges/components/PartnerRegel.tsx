type PartnerRegelProps = {
  partner: string;
  avatarUrl?: string | null;
};

// "met [naam]" met een kleine profielfoto
export function PartnerRegel({ partner, avatarUrl }: PartnerRegelProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        aria-hidden="true"
        className="size-7 shrink-0 rounded-full bg-hubi-ink/8 bg-cover bg-center"
        style={avatarUrl ? { backgroundImage: `url("${avatarUrl}")` } : undefined}
      />
      <p className="text-[13px] text-hubi-ink">met {partner}</p>
    </div>
  );
}
