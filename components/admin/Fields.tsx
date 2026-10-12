"use client";

import { cn } from "@/lib/utils";
import { inputClass } from "@/components/admin/ui";

/* Labelled inputs for the admin editors, with the error under the
   field and the last submitted value kept, so a validation error
   never costs the editor their work. */

type Base = { name: string; label: string; error?: string; help?: string; required?: boolean; className?: string };

export function TextField({
  defaultValue,
  type = "text",
  placeholder,
  ...p
}: Base & { defaultValue?: string; type?: string; placeholder?: string }) {
  return (
    <FieldShell {...p}>
      <input
        id={`f-${p.name}`}
        name={p.name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={p.required}
        aria-invalid={p.error ? true : undefined}
        className={cn(inputClass, p.error && "border-danger")}
      />
    </FieldShell>
  );
}

export function TextArea({ defaultValue, rows = 6, placeholder, ...p }: Base & { defaultValue?: string; rows?: number; placeholder?: string }) {
  return (
    <FieldShell {...p}>
      <textarea
        id={`f-${p.name}`}
        name={p.name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={p.required}
        aria-invalid={p.error ? true : undefined}
        className={cn(inputClass, "h-auto py-2 leading-relaxed", p.error && "border-danger")}
      />
    </FieldShell>
  );
}

export function Select({
  defaultValue,
  options,
  placeholder,
  ...p
}: Base & { defaultValue?: string; options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <FieldShell {...p}>
      <select
        id={`f-${p.name}`}
        name={p.name}
        defaultValue={defaultValue ?? ""}
        required={p.required}
        aria-invalid={p.error ? true : undefined}
        className={cn(inputClass, p.error && "border-danger")}
      >
        {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function FieldShell({ name, label, error, help, required, className, children }: Base & { children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={`f-${name}`} className="block text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p role="alert" className="mt-1 text-sm text-danger">
          {error}
        </p>
      ) : help ? (
        <p className="mt-1 text-xs text-n-500">{help}</p>
      ) : null}
    </div>
  );
}
