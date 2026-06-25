import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { TicketFilters } from "@/app/dashboard/tickets/TicketFilters";
import { requireProfile } from "@/lib/auth";
import type { TicketWithPeople } from "@/types";

export default async function TicketsPage() {
  const { profile, supabase } = await requireProfile();
  const { data } = await supabase
    .from("tickets")
    .select(
      "*, creator:profiles!tickets_created_by_fkey(id, full_name, email), assignee:profiles!tickets_assigned_to_fkey(id, full_name, email)",
    )
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title={profile.role === "customer" ? "My Tickets" : "Tickets"}
        subtitle="Requests visible through Supabase row-level security."
        action={
          profile.role === "customer" ? (
            <Link
              href="/dashboard/tickets/new"
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Create Ticket
            </Link>
          ) : null
        }
      />
      <TicketFilters tickets={(data || []) as TicketWithPeople[]} role={profile.role} />
    </>
  );
}
