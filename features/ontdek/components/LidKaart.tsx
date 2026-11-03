import type { OntdekLid } from "./OntdekContent";

export function LidKaart({ lid }: { lid: OntdekLid }) {
  return (
    <article className="flex min-h-[142px] gap-4 rounded-2xl border border-white bg-white p-4 shadow-[0_4px_18px_rgba(20,23,28,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(20,23,28,0.09)] sm:p-5">
      <div
        role="img"
        aria-label={`${lid.naam}, profielfoto`}
        className={`flex size-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br bg-cover bg-center ${lid.kleur} text-lg font-bold text-white shadow-sm`}
        style={lid.avatarUrl ? { backgroundImage: `url("${lid.avatarUrl}")` } : undefined}
      >
        {!lid.avatarUrl && lid.naam.slice(0, 1).toLocaleUpperCase("nl")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-hubi-ink">
              {lid.naam}
            </h2>
            <p className="mt-1 text-xs text-hubi-muted">
              ICT · {lid.tribe}
            </p>
          </div>
          {lid.match !== null && (
            <span
              className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-hubi-link"
              aria-label={`${lid.match}% match`}
            >
              {lid.match}%
            </span>
          )}
        </div>
        <ul aria-label="Interesses" className="mt-3 flex flex-wrap gap-1.5">
          {[...lid.skills, ...lid.hobbys].map((tag, index) => (
            <li
              key={`${tag}-${index}`}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                index === 0
                  ? "bg-blue-50 text-[#315da7]"
                  : index === 1
                    ? "bg-fuchsia-50 text-[#8b4386]"
                    : "bg-emerald-50 text-[#287866]"
              }`}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
