"use client";

import { useActionState } from "react";
import { saveContent, type ContentFormState } from "@/app/admin/actions/content";
import type { ContentType } from "@/lib/content-types";
import { buttonClass, Card } from "@/components/admin/ui";
import { Select, TextArea, TextField } from "@/components/admin/Fields";
import { MediaField } from "@/components/admin/MediaField";

/* The editor for every content type. Common fields first, then the
   type's own (lib/content-types.ts), stored in the item's data. */
export function ContentForm({
  type,
  id,
  initial,
  status,
}: {
  type: ContentType;
  id?: number;
  initial: Record<string, string>;
  status?: "draft" | "published";
}) {
  const [state, action, pending] = useActionState<ContentFormState, FormData>(saveContent, {});
  const v = state.values ?? initial;
  const e = state.errors ?? {};
  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="section" value={type.section} />
      {/* Not name="id": an input called "id" shadows form.id, and React
          then drops the pressed button's "intent" from the form data. */}
      {id ? <input type="hidden" name="recordId" value={id} /> : null}
      {state.message ? (
        <p role="alert" className="rounded-md bg-[#fde8e8] px-4 py-3 text-sm text-[#9b1c1c]">{state.message}</p>
      ) : null}
      {state.saved ? (
        <p role="status" className="rounded-md bg-[#eefaf2] px-4 py-3 text-sm text-[#1d6b3f]">{state.saved}</p>
      ) : null}

      <Card className="grid gap-5 p-6 md:grid-cols-2">
        <TextField name="title" label="Title" required defaultValue={v.title} error={e.title} className="md:col-span-2" />
        <TextArea
          name="excerpt"
          label="Summary"
          required
          rows={3}
          defaultValue={v.excerpt}
          error={e.excerpt}
          help="One or two sentences for lists, link previews and search results."
          className="md:col-span-2"
        />
        {type.categories ? (
          <Select
            name="category"
            label={type.categoryLabel ?? "Category"}
            required={type.id === "blog"}
            options={type.categories.map((c) => ({ value: c, label: c }))}
            placeholder={type.id === "blog" ? "Choose…" : "None"}
            defaultValue={v.category}
            error={e.category}
          />
        ) : null}
        <TextField name="author" label="Author" defaultValue={v.author} error={e.author} help="Optional." />
        <TextField
          name="slug"
          label="Address"
          defaultValue={v.slug}
          error={e.slug}
          placeholder="worked out from the title"
          help={`${type.publicPath}/<address>. Kept once published so shared links keep working.`}
        />
        <TextField
          name="published_on"
          label="Date shown"
          type="date"
          defaultValue={v.published_on}
          error={e.published_on}
          help="Optional. Defaults to the day it is first published."
        />
      </Card>

      {type.hasCover ? (
        <Card className="grid gap-5 p-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <MediaField
              name="cover_image"
              label="Cover image"
              kind="image"
              defaultValue={v.cover_image}
              error={e.cover_image}
              help="JPG, PNG or WebP, under 8MB. Wide images (3:2) work best."
            />
          </div>
          <TextField name="cover_alt" label="Image description" defaultValue={v.cover_alt} error={e.cover_alt} help="What the image shows, for screen readers." className="md:col-span-2" />
        </Card>
      ) : null}

      {type.extra.length ? (
        <Card className="grid gap-5 p-6 md:grid-cols-2">
          {type.extra.map((f) =>
            f.kind === "pdf" ? (
              <div key={f.name} className="md:col-span-2">
                <MediaField name={`x_${f.name}`} label={f.label} kind="pdf" defaultValue={v[`x_${f.name}`]} error={e[`x_${f.name}`]} help={f.help} required={f.required} />
              </div>
            ) : f.kind === "textarea" ? (
              <TextArea key={f.name} name={`x_${f.name}`} label={f.label} rows={4} defaultValue={v[`x_${f.name}`]} error={e[`x_${f.name}`]} help={f.help} required={f.required} className="md:col-span-2" />
            ) : (
              <TextField
                key={f.name}
                name={`x_${f.name}`}
                label={f.label}
                type={f.kind === "datetime" ? "datetime-local" : f.kind === "number" ? "number" : f.kind === "url" ? "url" : "text"}
                placeholder={f.kind === "url" ? "https://" : undefined}
                defaultValue={v[`x_${f.name}`]}
                error={e[`x_${f.name}`]}
                help={f.help}
                required={f.required}
                className={f.kind === "url" ? "md:col-span-2" : undefined}
              />
            ),
          )}
        </Card>
      ) : null}

      {type.hasBody ? (
        <Card className="p-6">
          <TextArea
            name="body"
            label={type.id === "webinar" ? "About the webinar" : "Article"}
            rows={18}
            defaultValue={v.body}
            error={e.body}
            help='Leave a blank line between paragraphs. Start a line with "## " for a heading, "### " for a smaller one, and "- " for a bullet list.'
          />
        </Card>
      ) : null}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-n-200 bg-paper/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
        {!id || status === "draft" ? (
          <>
            <button type="submit" name="intent" value="publish" disabled={pending} className={buttonClass.primary}>
              {pending ? "Saving…" : "Publish"}
            </button>
            <button type="submit" name="intent" value="draft" disabled={pending} className={buttonClass.secondary}>
              Save draft
            </button>
          </>
        ) : (
          <>
            <button type="submit" name="intent" value="save" disabled={pending} className={buttonClass.primary}>
              {pending ? "Saving…" : "Save changes"}
            </button>
            <button type="submit" name="intent" value="draft" disabled={pending} className={buttonClass.secondary}>
              Save and unpublish
            </button>
          </>
        )}
        <span className="text-xs text-n-500">Fields marked * are required.</span>
      </div>
    </form>
  );
}
