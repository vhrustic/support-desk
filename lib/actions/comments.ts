"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import type { ActionState } from "@/types";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function addCommentAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user, profile, supabase } = await requireProfile();
  const ticketId = text(formData, "ticketId");
  const body = text(formData, "body");
  const isInternal =
    formData.get("isInternal") === "on" &&
    (profile.role === "admin" || profile.role === "agent");

  if (!ticketId) return { message: "Missing ticket." };
  if (!body) return { errors: { body: "Comment is required." } };

  const { error } = await supabase.from("ticket_comments").insert({
    ticket_id: ticketId,
    author_id: user.id,
    body,
    is_internal: isInternal,
  });

  if (error) return { message: error.message };

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  return { ok: true, message: "Reply posted." };
}
