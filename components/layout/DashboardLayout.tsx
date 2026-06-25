import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Profile } from "@/types";

export function DashboardLayout({
  profile,
  children,
}: {
  profile: Profile;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 md:flex">
      <Sidebar profile={profile} />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
    </div>
  );
}
