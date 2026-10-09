import type { ReactNode } from "react";


type FormFieldProps = {
  label: string;
  name: string; 
  type?: "text" | "email" | "password";
  placeholder: string; 
  autoComplete?: string; 
  hint?: string; 
  trailing?: ReactNode;
  error?: string;   // error melding toegvoegd.
};

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  hint,
  trailing,
  error,
}: FormFieldProps) {
  const hintId = `${name}-hint`;

  return (
    <div>
      {}
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
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-describedby={hint ? hintId : undefined}
          aria-invalid={!!error}
          className={`mt-0.5 block w-full border-0 border-b-2 border-hubi-ink bg-transparent pb-1.5 text-sm text-hubi-ink outline-none placeholder:text-hubi-muted focus-visible:border-hubi-link lg:text-[15px] ${trailing ? "pr-8" : ""}`}
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

      {error && (                   // ← nieuw: onder de hint,
        <p className="mt-1.5 text-[11px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
