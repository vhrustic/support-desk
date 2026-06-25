"use client";

import { useActionState } from "react";
import { inviteUserAction } from "@/lib/actions/invite";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function InviteForm() {
  const [state, action] = useActionState(inviteUserAction, {});

  return (
    <form action={action} className="max-w-lg space-y-5 rounded-lg border border-zinc-200 bg-white p-5">
      {state.message ? (
        <p className={`rounded-md px-3 py-2 text-sm ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          {state.message}
        </p>
      ) : null}
      <label className="block text-sm font-medium text-zinc-700">
        Email
        <input name="email" type="email" required className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
        {state.errors?.email ? <span className="mt-1 block text-xs text-rose-600">{state.errors.email}</span> : null}
      </label>
      <label className="block text-sm font-medium text-zinc-700">
        Role
        <select name="role" defaultValue="agent" className="mt-1 h-10 rounded-md border border-zinc-300 bg-white px-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
          <option value="agent">Agent</option>
          <option value="customer">Customer</option>
        </select>
        {state.errors?.role ? <span className="mt-1 block text-xs text-rose-600">{state.errors.role}</span> : null}
      </label>
      <SubmitButton pendingText="Sending...">Send Invite</SubmitButton>
    </form>
  );
}
