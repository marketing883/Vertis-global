"use client";

import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { buttonClass, inputClass } from "@/components/admin/ui";
import { FieldShell } from "@/components/admin/Fields";
import { cn } from "@/lib/utils";

/* An image or PDF field: upload a file (checked and stored on the
   server, see lib/media.ts) or keep a path to a file on the site. The
   field's value is the path, so the form works the same either way. */
export function MediaField({
  name,
  label,
  kind,
  defaultValue,
  error,
  help,
  required,
}: {
  name: string;
  label: string;
  kind: "image" | "pdf";
  defaultValue?: string;
  error?: string;
  help?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const picker = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setProblem(null);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("kind", kind);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !json.url) setProblem(json.error ?? "Upload failed. Try again.");
      else setValue(json.url);
    } catch {
      setProblem("Upload failed. Check your connection and try again.");
    } finally {
      setBusy(false);
      if (picker.current) picker.current.value = "";
    }
  }

  return (
    <FieldShell name={name} label={label} error={problem ?? error} help={help} required={required}>
      <div className="flex flex-wrap items-start gap-4">
        {value && kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-24 w-36 rounded-md border border-n-200 object-cover" />
        ) : value && kind === "pdf" ? (
          <a href={value} target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-2 text-sm text-accent hover:underline">
            <FileText className="size-4" aria-hidden="true" /> Open current PDF
          </a>
        ) : null}
        <div className="flex min-w-60 flex-1 flex-col gap-2">
          <div className="flex gap-2">
            <input
              id={`f-${name}`}
              name={name}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={kind === "image" ? "/photos/… or upload" : "Upload a PDF"}
              aria-invalid={error || problem ? true : undefined}
              className={cn(inputClass, (error || problem) && "border-danger")}
            />
            {value ? (
              <button type="button" onClick={() => setValue("")} className={buttonClass.secondary} title="Remove">
                <X className="size-4" aria-hidden="true" />
                <span className="sr-only">Remove</span>
              </button>
            ) : null}
          </div>
          <div>
            <input
              ref={picker}
              type="file"
              accept={kind === "image" ? "image/jpeg,image/png,image/webp" : "application/pdf"}
              className="sr-only"
              id={`f-${name}-file`}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void upload(f);
              }}
            />
            <label htmlFor={`f-${name}-file`} className={cn(buttonClass.secondary, "cursor-pointer", busy && "pointer-events-none opacity-60")}>
              <Upload className="size-4" aria-hidden="true" />
              {busy ? "Uploading…" : kind === "image" ? "Upload image" : "Upload PDF"}
            </label>
          </div>
        </div>
      </div>
    </FieldShell>
  );
}
