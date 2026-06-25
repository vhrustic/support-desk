import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requireProfile } from "@/lib/auth";

export default async function Layout({ children }: { children: ReactNode }) {
  const { profile } = await requireProfile();
  return <DashboardLayout profile={profile}>{children}</DashboardLayout>;
}
