"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { displayName, formatDate } from "@/lib/format";
import type { TicketPriority, TicketStatus, TicketWithPeople, UserRole } from "@/types";

const statusOptions: Array<"all" | TicketStatus> = [
  "all",
  "open",
  "in_progress",
  "resolved",
  "closed",
];
const priorityOptions: Array<"all" | TicketPriority> = ["all", "high", "medium", "low"];

function label(value: string) {
  return value === "all" ? "All" : value.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function TicketFilters({
  tickets,
  role,
}: {
  tickets: TicketWithPeople[];
  role: UserRole;
}) {
  const [status, setStatus] = useState<"all" | TicketStatus>("all");
  const [priority, setPriority] = useState<"all" | TicketPriority>("all");

  const filtered = useMemo(
    () =>
      tickets.filter((ticket) => {
        const statusMatch = status === "all" || ticket.status === status;
        const priorityMatch = priority === "all" || ticket.priority === priority;
        return statusMatch && priorityMatch;
      }),
    [priority, status, tickets],
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row">
        <label className="text-sm font-medium text-zinc-700">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as "all" | TicketStatus)}
            className="mt-1 h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {label(option)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-zinc-700">
          Priority
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as "all" | TicketPriority)}
            className="mt-1 h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {label(option)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No tickets found"
          message="Try another filter or create a new request."
          cta={role === "customer" ? { href: "/dashboard/tickets/new", label: "Create Ticket" } : undefined}
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Created by</th>
                  <th className="px-4 py-3">Assigned to</th>
                  <th className="px-4 py-3">Created date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-4 font-medium text-zinc-950">
                      <Link href={`/dashboard/tickets/${ticket.id}`} className="hover:underline">
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-4 py-4">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-4 py-4 text-zinc-600">{displayName(ticket.creator)}</td>
                    <td className="px-4 py-4 text-zinc-600">
                      {ticket.assignee ? displayName(ticket.assignee) : "Unassigned"}
                    </td>
                    <td className="px-4 py-4 text-zinc-600">{formatDate(ticket.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
