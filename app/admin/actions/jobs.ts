"use server";

import { redirect } from "next/navigation";
import { AdminAuthError, audit, requireUser } from "@/lib/admin/auth";
import { createJob, deleteJob, getJob, parseJobForm, setJobStatus, updateJob } from "@/lib/admin/jobs";
import { refreshPublicSite } from "@/lib/admin/revalidate";

export type JobFormState = {
  errors?: Record<string, string>;
  values?: Record<string, string>;
  message?: string;
  saved?: string;
};

async function guard() {
  try {
    return { user: await requireUser("jobs") };
  } catch (e) {
    return { error: e instanceof AdminAuthError && e.status === 403 ? "You can't manage jobs." : "Your session ended. Sign in again." };
  }
}

/** Create or update. The pressed button decides: "draft", "publish" or "save". */
export async function saveJob(_prev: JobFormState, formData: FormData): Promise<JobFormState> {
  const g = await guard();
  if (!g.user) return { message: g.error };
  const id = Number(formData.get("recordId")) || 0;
  const intent = String(formData.get("intent") ?? "save");
  const { raw, parsed } = parseJobForm(formData);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0]);
      if (!errors[k]) errors[k] = issue.message;
    }
    return { errors, values: raw, message: "Some fields need attention." };
  }

  if (!id) {
    const newId = createJob(parsed.data, intent === "publish" ? "published" : "draft");
    audit(g.user, intent === "publish" ? "job.created_published" : "job.created", "job", newId);
    refreshPublicSite();
    redirect(`/admin/jobs/${newId}/edit?saved=${intent === "publish" ? "published" : "created"}`);
  }

  if (!getJob(id)) return { message: "That job no longer exists." };
  updateJob(id, parsed.data, formData.get("is_sample") === "on");
  if (intent === "publish") setJobStatus(id, "published");
  if (intent === "draft") setJobStatus(id, "draft");
  audit(g.user, "job.updated", "job", id);
  refreshPublicSite();
  return { values: raw, saved: intent === "publish" ? "Saved and published." : intent === "draft" ? "Saved as a draft (not on the site)." : "Saved." };
}

export async function changeJobStatus(formData: FormData) {
  const g = await guard();
  if (!g.user) redirect("/admin/login");
  const id = Number(formData.get("recordId"));
  const status = formData.get("status") === "published" ? "published" : "draft";
  if (getJob(id)) {
    setJobStatus(id, status);
    audit(g.user, status === "published" ? "job.published" : "job.unpublished", "job", id);
    refreshPublicSite();
  }
  redirect(String(formData.get("back") ?? "/admin/jobs").startsWith("/admin/") ? String(formData.get("back")) : "/admin/jobs");
}

export async function removeJob(formData: FormData) {
  const g = await guard();
  if (!g.user) redirect("/admin/login");
  const id = Number(formData.get("recordId"));
  if (getJob(id)) {
    deleteJob(id);
    audit(g.user, "job.deleted", "job", id);
    refreshPublicSite();
  }
  redirect("/admin/jobs?deleted=1");
}
