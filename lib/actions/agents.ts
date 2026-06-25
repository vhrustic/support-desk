"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";

export async function removeAgentAction(formData: FormData) {
  const { supabase } = await requireRole(["admin"]);
  const agentId = formData.get("agentId");

  if (typeof agentId !== "string" || !agentId) return;

  await supabase.from("profiles").update({ role: "customer" }).eq("id", agentId);
  revalidatePath("/dashboard/agents");
}
