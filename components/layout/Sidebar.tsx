import Link from "next/link";
import { signOutAction } from "@/lib/actions/auth";
import { RoleBadge } from "@/components/ui/RoleBadge";
import type { Profile } from "@/types";

const navByRole = {
  admin: [
    { label: "Tickets", href: "/dashboard/tickets" },
    { label: "Agents", href: "/dashboard/agents" },
    { label: "Invite User", href: "/dashboard/invite" },
  ],
  agent: [{ label: "Tickets", href: "/dashboard/tickets" }],
  customer: [
    { label: "Tickets", href: "/dashboard/tickets" },
    { label: "My Tickets", href: "/dashboard/tickets" },
  ],
};

export function Sidebar({ profile }: { profile: Profile }) {
  return (
    <aside className="flex w-full flex-col border-b border-zinc-200 bg-white px-4 py-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:px-5">
      <Link href="/dashboard/tickets" className="text-lg font-semibold tracking-tight text-zinc-950">
        SupportDesk
      </Link>
      <nav className="mt-6 flex gap-2 md:flex-col">
        {navByRole[profile.role].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-zinc-200 pt-4 md:mt-auto md:block">
        <div>
          <p className="max-w-40 truncate text-sm font-medium text-zinc-950">
            {profile.full_name || profile.email || "Support user"}
          </p>
          <div className="mt-2">
            <RoleBadge role={profile.role} />
          </div>
        </div>
        <form action={signOutAction} className="md:mt-4">
          <button className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
