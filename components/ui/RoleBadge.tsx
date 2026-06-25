import type { UserRole } from "@/types";

const styles: Record<UserRole, string> = {
  admin: "bg-violet-50 text-violet-700 ring-violet-200",
  agent: "bg-blue-50 text-blue-700 ring-blue-200",
  customer: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ${styles[role]}`}>
      {role}
    </span>
  );
}
