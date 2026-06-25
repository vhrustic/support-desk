"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile, requireRole } from "@/lib/auth";
import type { ActionState, TicketPriority, TicketStatus } from "@/types";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

const statuses: TicketStatus[] = ["open", "in_progress", "resolved", "closed"];
const priorities: TicketPriority[] = ["low", "medium", "high"];

export async function createTicketAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user, profile, supabase } = await requireRole(["customer"]);
  const title = text(formData, "title");
  const description = text(formData, "description");
  const priorityValue = text(formData, "priority") as TicketPriority;
  const errors: Record<string, string> = {};

  if (!title) errors.title = "Title is required.";
  if (!description) errors.description = "Description is required.";
  if (!priorities.includes(priorityValue)) errors.priority = "Choose a priority.";
  if (Object.keys(errors).length) return { errors };

  const { data, error } = await supabase
    .from("tickets")
    .insert({
      tenant_id: profile.tenant_id,
      created_by: user.id,
      title,
      description,
      priority: priorityValue,
      status: "open",
    })
    .select("id")
    .single();

  if (error || !data) return { message: error?.message || "Ticket was not created." };

  revalidatePath("/dashboard/tickets");
  redirect(`/dashboard/tickets/${data.id}`);
}

export async function updateTicketStatusAction(formData: FormData) {
  const { supabase } = await requireRole(["admin", "agent"]);
  const ticketId = text(formData, "ticketId");
  const status = text(formData, "status") as TicketStatus;

  if (!ticketId || !statuses.includes(status)) return;

  await supabase
    .from("tickets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", ticketId);

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath("/dashboard/tickets");
}

export async function assignTicketAction(formData: FormData) {
  const { supabase } = await requireRole(["admin", "agent"]);
  const ticketId = text(formData, "ticketId");
  const assignedTo = text(formData, "assignedTo");

  if (!ticketId) return;

  await supabase
    .from("tickets")
    .update({
      assigned_to: assignedTo || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticketId);

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath("/dashboard/tickets");
}

export async function ensureCustomerForNewTicket() {
  const { profile } = await requireProfile();
  if (profile.role !== "customer") redirect("/dashboard/tickets");
  return profile;
}
