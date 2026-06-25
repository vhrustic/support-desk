import { notFound } from "next/navigation";
import { CommentForm } from "@/app/dashboard/tickets/[id]/CommentForm";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { assignTicketAction, updateTicketStatusAction } from "@/lib/actions/tickets";
import { requireProfile } from "@/lib/auth";
import { displayName, formatDate, formatDateTime } from "@/lib/format";
import type { Profile, TicketComment, TicketWithPeople } from "@/types";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile, supabase } = await requireProfile();
  const [{ data: ticket }, { data: comments }, { data: agents }] = await Promise.all([
    supabase
      .from("tickets")
      .select(
        "*, creator:profiles!tickets_created_by_fkey(id, full_name, email), assignee:profiles!tickets_assigned_to_fkey(id, full_name, email)",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("ticket_comments")
      .select("*, author:profiles!ticket_comments_author_id_fkey(id, full_name, email, role)")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "agent")
      .order("full_name", { ascending: true }),
  ]);

  if (!ticket) notFound();

  const typedTicket = ticket as TicketWithPeople;
  const canManage = profile.role === "admin" || profile.role === "agent";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="min-w-0 rounded-lg border border-zinc-200 bg-white p-5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">{typedTicket.title}</h1>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{typedTicket.description}</p>

        <div className="mt-8 border-t border-zinc-200 pt-6">
          <h2 className="text-base font-semibold text-zinc-950">Comments</h2>
          <div className="mt-4 space-y-4">
            {((comments || []) as TicketComment[]).length === 0 ? (
              <p className="text-sm text-zinc-600">No comments yet.</p>
            ) : (
              ((comments || []) as TicketComment[]).map((comment) => (
                <article
                  key={comment.id}
                  className={`rounded-lg border p-4 ${comment.is_internal ? "border-zinc-300 bg-zinc-100" : "border-zinc-200 bg-white"}`}
                >
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium text-zinc-950">{displayName(comment.author)}</span>
                    <span className="text-zinc-500">{formatDateTime(comment.created_at)}</span>
                    {comment.is_internal ? (
                      <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700">
                        Internal Note
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{comment.body}</p>
                </article>
              ))
            )}
          </div>
          <CommentForm ticketId={typedTicket.id} role={profile.role} />
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold text-zinc-950">Ticket Details</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500">Status</dt>
              <dd><StatusBadge status={typedTicket.status} /></dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500">Priority</dt>
              <dd><PriorityBadge priority={typedTicket.priority} /></dd>
            </div>
            <div>
              <dt className="text-zinc-500">Created by</dt>
              <dd className="mt-1 font-medium text-zinc-950">{displayName(typedTicket.creator)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Assigned to</dt>
              <dd className="mt-1 font-medium text-zinc-950">{typedTicket.assignee ? displayName(typedTicket.assignee) : "Unassigned"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Created date</dt>
              <dd className="mt-1 font-medium text-zinc-950">{formatDate(typedTicket.created_at)}</dd>
            </div>
          </dl>
        </div>

        {canManage ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-base font-semibold text-zinc-950">Actions</h2>
            <form action={updateTicketStatusAction} className="mt-4 space-y-2">
              <input type="hidden" name="ticketId" value={typedTicket.id} />
              <label className="block text-sm font-medium text-zinc-700">
                Change Status
                <select name="status" defaultValue={typedTicket.status} className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
              <button className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">Update Status</button>
            </form>
            <form action={assignTicketAction} className="mt-5 space-y-2">
              <input type="hidden" name="ticketId" value={typedTicket.id} />
              <label className="block text-sm font-medium text-zinc-700">
                Assign to Agent
                <select name="assignedTo" defaultValue={typedTicket.assigned_to || ""} className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
                  <option value="">Unassigned</option>
                  {((agents || []) as Profile[]).map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {displayName(agent)}
                    </option>
                  ))}
                </select>
              </label>
              <button className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">Assign</button>
            </form>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
