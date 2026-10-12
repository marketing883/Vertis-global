"use server";

import { redirect } from "next/navigation";
import { AdminAuthError, audit, requireUser } from "@/lib/admin/auth";
import { STATUSES, deleteApplication, getApplication, updateApplication, type Status } from "@/lib/applications";
import { cleanText } from "@/lib/validation/candidate";

export type ApplicationFormState = { message?: string; saved?: boolean; error?: boolean };

const NOTES_MAX = 5000;

/** Status and recruiter notes. Admins and recruiters (hr) both may. */
export async function saveApplicationReview(_prev: ApplicationFormState, formData: FormData): Promise<ApplicationFormState> {
  let user;
  try {
    user = await requireUser("job-applications");
  } catch (e) {
    return { error: true, message: e instanceof AdminAuthError && e.status === 403 ? "You can't manage applications." : "Your session ended. Sign in again." };
  }
  const id = Number(formData.get("recordId"));
  const status = String(formData.get("status") ?? "");
  const notes = cleanText(formData.get("notes"), true);
  if (!STATUSES.some((s) => s.id === status)) return { error: true, message: "Choose a status." };
  if (notes.length > NOTES_MAX) return { error: true, message: `Keep notes under ${NOTES_MAX} characters.` };
  const before = Number.isInteger(id) ? getApplication(id) : null;
  if (!before) return { error: true, message: "That application no longer exists." };
  updateApplication(id, status as Status, notes);
  if (before.status !== status) audit(user, `application.status.${status}`, "application", id);
  if (before.internal_notes !== notes) audit(user, "application.notes", "application", id);
  return { saved: true, message: "Saved." };
}

/** Removes an application and its resume for good. Admins only, for
    requests such as a candidate asking to be forgotten. */
export async function removeApplication(formData: FormData) {
  let user;
  try {
    user = await requireUser("job-applications");
  } catch {
    redirect("/admin/login");
  }
  const id = Number(formData.get("recordId"));
  if (user.role !== "admin") redirect(`/admin/job-applications/${id}`);
  if (Number.isInteger(id) && getApplication(id)) {
    await deleteApplication(id);
    audit(user, "application.deleted", "application", id);
  }
  redirect("/admin/job-applications?deleted=1");
}
