"use server";

import { redirect } from "next/navigation";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";
import type { ActionState } from "@/types";

function field(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function signUpAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fullName = field(formData.get("fullName"));
  const companyName = field(formData.get("companyName"));
  const email = field(formData.get("email")).toLowerCase();
  const password = field(formData.get("password"));
  const errors: Record<string, string> = {};

  if (!fullName) errors.fullName = "Full name is required.";
  if (!companyName) errors.companyName = "Company name is required.";
  if (!email) errors.email = "Email is required.";
  if (!password) errors.password = "Password is required.";
  if (Object.keys(errors).length) return { errors };

  const admin = await createAdminClient();
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  });

  if (authError || !authData.user) {
    return { message: authError?.message || "Could not create account." };
  }

  const baseSlug = slugify(companyName) || "workspace";
  const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .insert({ name: companyName, slug })
    .select("id")
    .single();

  if (tenantError || !tenant) {
    return { message: tenantError?.message || "Could not create workspace." };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: authData.user.id,
    tenant_id: tenant.id,
    full_name: fullName,
    email,
    role: "admin",
  });

  if (profileError) {
    return { message: profileError.message };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return {
      ok: true,
      message: "Workspace created. Sign in with your new account.",
    };
  }

  redirect("/dashboard");
}

export async function loginAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = field(formData.get("email")).toLowerCase();
  const password = field(formData.get("password"));
  const errors: Record<string, string> = {};

  if (!email) errors.email = "Email is required.";
  if (!password) errors.password = "Password is required.";
  if (Object.keys(errors).length) return { errors };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { message: "Invalid credentials." };

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
