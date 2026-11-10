import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const fieldClass =
  "w-full rounded-2xl border border-input bg-card px-4 text-[0.95rem] text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/40 aria-[invalid=true]:border-destructive";

export function Field({
  label,
  error,
  optional,
  children,
  htmlFor,
}: {
  label: string;
  error?: string | undefined;
  optional?: boolean | undefined;
  children: ReactNode;
  htmlFor?: string | undefined;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
        {label} {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean | undefined }) {
  const { invalid, className, ...rest } = props;
  return <input {...rest} aria-invalid={invalid} className={cn(fieldClass, "h-13", className)} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean | undefined }) {
  const { invalid, className, ...rest } = props;
  return <textarea {...rest} aria-invalid={invalid} className={cn(fieldClass, "min-h-28 py-3", className)} />;
}

export function ChoiceChip({
  selected,
  onClick,
  children,
  role = "checkbox",
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  role?: "checkbox" | "radio";
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex min-h-13 items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-300 ease-ios active:scale-[0.98]",
        selected ? "border-primary bg-secondary shadow-soft" : "border-input bg-card hover:border-primary/60",
      )}
    >
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center border transition-colors",
          role === "radio" ? "rounded-full" : "rounded-md",
          selected ? "border-primary bg-primary text-primary-foreground" : "border-input",
        )}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
      {children}
    </button>
  );
}

export function YesNo({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{label}</p>
      <div className="inline-flex rounded-full bg-muted p-1" role="radiogroup" aria-label={label}>
        {[true, false].map((v) => (
          <button
            key={String(v)}
            type="button"
            role="radio"
            aria-checked={value === v}
            onClick={() => onChange(v)}
            className={cn(
              "h-10 rounded-full px-6 text-sm font-semibold transition-all duration-300 ease-ios",
              value === v ? "bg-card text-foreground shadow-soft" : "text-muted-foreground",
            )}
          >
            {v ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}
