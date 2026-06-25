import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.");
}

const supabase = createClient<Database>(url, secretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const users = [
  { email: "admin@acme.test", password: "password123", name: "Ada Admin", role: "admin" as const },
  { email: "agent@acme.test", password: "password123", name: "Alex Agent", role: "agent" as const },
  { email: "customer@acme.test", password: "password123", name: "Casey Customer", role: "customer" as const },
];

async function upsertAuthUser(user: (typeof users)[number]) {
  const { data: created, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: { full_name: user.name },
  });

  if (!error && created.user) return created.user.id;

  const { data } = await supabase.auth.admin.listUsers();
  const existing = data.users.find((candidate) => candidate.email === user.email);
  if (!existing) throw error;
  return existing.id;
}

async function main() {
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .upsert({ name: "Acme Corp", slug: "acme" }, { onConflict: "slug" })
    .select("id")
    .single();

  if (tenantError || !tenant) throw tenantError;

  const ids = new Map<string, string>();
  for (const user of users) {
    const id = await upsertAuthUser(user);
    ids.set(user.role, id);
    const { error } = await supabase.from("profiles").upsert({
      id,
      tenant_id: tenant.id,
      full_name: user.name,
      email: user.email,
      role: user.role,
    });
    if (error) throw error;
  }

  const customerId = ids.get("customer")!;
  const agentId = ids.get("agent")!;
  const adminId = ids.get("admin")!;

  const { data: tickets, error: ticketError } = await supabase
    .from("tickets")
    .insert([
      { tenant_id: tenant.id, created_by: customerId, assigned_to: agentId, title: "Cannot access billing page", description: "The billing page returns a blank screen after login.", status: "open", priority: "high" },
      { tenant_id: tenant.id, created_by: customerId, assigned_to: agentId, title: "Question about plan limits", description: "I need clarification on monthly API usage.", status: "in_progress", priority: "medium" },
      { tenant_id: tenant.id, created_by: customerId, title: "Update account contact", description: "Please change our account contact to ops@acme.test.", status: "resolved", priority: "low" },
      { tenant_id: tenant.id, created_by: customerId, title: "Webhook timeout", description: "Webhook deliveries time out intermittently.", status: "open", priority: "high" },
      { tenant_id: tenant.id, created_by: customerId, title: "Close old request", description: "This request can be closed.", status: "closed", priority: "low" },
    ])
    .select("id");

  if (ticketError || !tickets) throw ticketError;

  for (const ticket of tickets) {
    const { error } = await supabase.from("ticket_comments").insert([
      { ticket_id: ticket.id, author_id: customerId, body: "Thanks for taking a look.", is_internal: false },
      { ticket_id: ticket.id, author_id: agentId, body: "I am checking this now.", is_internal: false },
      { ticket_id: ticket.id, author_id: adminId, body: "Escalate if this blocks renewal.", is_internal: true },
    ]);
    if (error) throw error;
  }

  console.log("Seed complete: admin@acme.test, agent@acme.test, customer@acme.test / password123");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
