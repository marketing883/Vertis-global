"use server";

import { redirect } from "next/navigation";
import { AdminAuthError, audit, requireUser } from "@/lib/admin/auth";
import { ENQUIRY_STATUSES, deleteEnquiry, getEnquiry, updateEnquiry, type EnquiryStatus } from "@/lib/enquiries";
import { cleanText } from "@/lib/validation/candidate";

export type EnquiryFormState = { message?: string; error?: boolean };

/** Status and internal notes for one enquiry. */
export async function saveEnquiryReview(_prev: EnquiryFormState, formData: FormData): Promise<EnquiryFormState> {
  let user;
  try {
    user = await requireUser("enquiries");
  } catch (e) {
    return { error: true, message: e instanceof AdminAuthError && e.status === 403 ? "You can't manage enquiries." : "Your session ended. Sign in again." };
  }
  const id = Number(formData.get("recordId"));
  const status = String(formData.get("status") ?? "");
  const notes = cleanText(formData.get("notes"), true);
  if (!ENQUIRY_STATUSES.some((s) => s.id === status)) return { error: true, message: "Choose a status." };
  if (notes.length > 5000) return { error: true, message: "Keep notes under 5000 characters." };
  const before = Number.isInteger(id) ? getEnquiry(id) : null;
  if (!before) return { error: true, message: "That enquiry no longer exists." };
  updateEnquiry(id, status as EnquiryStatus, notes);
  if (before.status !== status) audit(user, `enquiry.status.${status}`, "enquiry", id);
  if (before.internal_notes !== notes) audit(user, "enquiry.notes", "enquiry", id);
  return { message: "Saved." };
}

export async function removeEnquiry(formData: FormData) {
  let user;
  try {
    user = await requireUser("enquiries");
  } catch {
    redirect("/admin/login");
  }
  const id = Number(formData.get("recordId"));
  if (Number.isInteger(id) && getEnquiry(id)) {
    deleteEnquiry(id);
    audit(user, "enquiry.deleted", "enquiry", id);
  }
  redirect("/admin/enquiries?deleted=1");
}
