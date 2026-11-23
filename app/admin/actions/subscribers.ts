"use server";

import { redirect } from "next/navigation";
import { audit, requireUser } from "@/lib/admin/auth";
import { removeSubscriber } from "@/lib/subscribers";

/** Takes someone off the list, e.g. when they reply "unsubscribe". */
export async function deleteSubscriber(formData: FormData) {
  let user;
  try {
    user = await requireUser("subscribers");
  } catch {
    redirect("/admin/login");
  }
  const id = Number(formData.get("recordId"));
  if (Number.isInteger(id) && id > 0) {
    removeSubscriber(id);
    audit(user, "subscriber.removed", "subscriber", id);
  }
  redirect("/admin/subscribers?removed=1");
}
