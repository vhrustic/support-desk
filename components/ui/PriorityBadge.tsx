import type { TicketPriority } from "@/types";

const styles: Record<TicketPriority, string> = {
  high: "bg-rose-50 text-rose-700 ring-rose-200",
  medium: "bg-orange-50 text-orange-700 ring-orange-200",
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ${styles[priority]}`}>
      {priority}
    </span>
  );
}
