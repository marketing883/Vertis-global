"use server";

import { redirect } from "next/navigation";
import { AdminAuthError, audit, requireUser } from "@/lib/admin/auth";
import { contentTypeBySection } from "@/lib/content-types";
import {
  createContent,
  deleteContent,
  getContent,
  parseContentForm,
  setContentStatus,
  updateContent,
} from "@/lib/admin/content";
import { refreshPublicSite } from "@/lib/admin/revalidate";

export type ContentFormState = {
  errors?: Record<string, string>;
  values?: Record<string, string>;
  message?: string;
  saved?: string;
};

async function guard(section: string) {
  const type = contentTypeBySection(section);
  if (!type) return { error: "Unknown section." };
  try {
    return { type, user: await requireUser(section) };
  } catch (e) {
    return { error: e instanceof AdminAuthError && e.status === 403 ? "You can't manage content." : "Your session ended. Sign in again." };
  }
}

/** Create or update. The pressed button decides: "draft", "publish" or "save". */
export async function saveContent(_prev: ContentFormState, formData: FormData): Promise<ContentFormState> {
  const g = await guard(String(formData.get("section") ?? ""));
  if (!g.user || !g.type) return { message: g.error };
  const { type, user } = g;
  const id = Number(formData.get("recordId")) || 0;
  const intent = String(formData.get("intent") ?? "save");
  const { values, errors, input } = parseContentForm(type, formData);
  if (!input) return { errors, values, message: "Some fields need attention." };

  if (!id) {
    const newId = createContent(type, input, intent === "publish" ? "published" : "draft");
    audit(user, `${type.id}.created${intent === "publish" ? "_published" : ""}`, "content", newId);
    refreshPublicSite();
    redirect(`/admin/${type.section}/${newId}/edit?saved=${intent === "publish" ? "published" : "created"}`);
  }

  if (!getContent(type, id)) return { message: "That item no longer exists." };
  updateContent(type, id, input);
  if (intent === "publish") setContentStatus(type, id, "published");
  if (intent === "draft") setContentStatus(type, id, "draft");
  audit(user, `${type.id}.updated`, "content", id);
  refreshPublicSite();
  const after = getContent(type, id);
  return {
    values: { ...values, slug: after?.slug ?? values.slug ?? "" },
    saved: intent === "publish" ? "Saved and published." : intent === "draft" ? "Saved as a draft (not on the site)." : "Saved.",
  };
}

function safeBack(value: FormDataEntryValue | null, fallback: string) {
  const s = String(value ?? "");
  return /^\/admin\/[A-Za-z0-9/_?=&%.+-]*$/.test(s) ? s : fallback;
}

export async function changeContentStatus(formData: FormData) {
  const section = String(formData.get("section") ?? "");
  const g = await guard(section);
  if (!g.user || !g.type) redirect("/admin/login");
  const id = Number(formData.get("recordId"));
  const status = formData.get("status") === "published" ? "published" : "draft";
  if (getContent(g.type, id)) {
    setContentStatus(g.type, id, status);
    audit(g.user, `${g.type.id}.${status === "published" ? "published" : "unpublished"}`, "content", id);
    refreshPublicSite();
  }
  redirect(safeBack(formData.get("back"), `/admin/${g.type.section}`));
}

export async function removeContent(formData: FormData) {
  const section = String(formData.get("section") ?? "");
  const g = await guard(section);
  if (!g.user || !g.type) redirect("/admin/login");
  const id = Number(formData.get("recordId"));
  if (getContent(g.type, id)) {
    deleteContent(g.type, id);
    audit(g.user, `${g.type.id}.deleted`, "content", id);
    refreshPublicSite();
  }
  redirect(`/admin/${g.type.section}?deleted=1`);
}
