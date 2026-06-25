import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types";

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null, supabase };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: profile as Profile | null, supabase };
}

export async function requireProfile() {
  const context = await getCurrentProfile();

  if (!context.user) redirect("/login");
  if (!context.profile) redirect("/signup");

  return context as typeof context & { user: NonNullable<typeof context.user>; profile: Profile };
}

export async function requireRole(roles: UserRole[]) {
  const context = await requireProfile();

  if (!roles.includes(context.profile.role)) {
    redirect("/dashboard/tickets");
  }

  return context;
}
