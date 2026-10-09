import type { ComponentProps, ReactNode } from "react";

type FormFieldProps = ComponentProps<"input"> & {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  trailing?: ReactNode;
};

export function FormField({
  label,
  name,
  hint,
  error,
  trailing,
  ...inputProps
}: FormFieldProps) {
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;
  const describedBy =
    [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[10px] font-medium uppercase tracking-[0.6px] text-hubi-muted"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`mt-0.5 block w-full border-0 border-b-2 border-hubi-ink bg-transparent pb-1.5 text-sm text-hubi-ink outline-none placeholder:text-hubi-muted focus-visible:border-hubi-link aria-[invalid=true]:border-red-600 lg:text-[15px] ${trailing ? "pr-8" : ""}`}
          {...inputProps}
        />
        {trailing && (
          <div className="absolute right-0 bottom-1.5 flex items-center">
            {trailing}
          </div>
        )}
      </div>

      {hint && (
        <p id={hintId} className="mt-1.5 text-[11px] text-hubi-muted">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-[11px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
