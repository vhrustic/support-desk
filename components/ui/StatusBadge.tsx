import type { TicketStatus } from "@/types";

const styles: Record<TicketStatus, string> = {
  open: "bg-sky-50 text-sky-700 ring-sky-200",
  in_progress: "bg-amber-50 text-amber-800 ring-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  closed: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

const labels: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
