"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import type { ActionState } from "@/types";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function inviteUserAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { profile } = await requireRole(["admin"]);
  const email = text(formData, "email").toLowerCase();
  const role = text(formData, "role");

  if (!email) return { errors: { email: "Email is required." } };
  if (role !== "agent" && role !== "customer") {
    return { errors: { role: "Choose a role." } };
  }
  if (!profile.tenant_id) return { message: "Your profile is missing a tenant." };

  const admin = await createAdminClient();
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: {
      tenant_id: profile.tenant_id,
      role,
    },
  });

  if (inviteError) return { message: inviteError.message };

  const { error: invitationError } = await admin.from("invitations").insert({
    email,
    tenant_id: profile.tenant_id,
    role,
  });

  if (invitationError) return { message: invitationError.message };

  revalidatePath("/dashboard/invite");
  return { ok: true, message: `Invite sent to ${email}` };
}
