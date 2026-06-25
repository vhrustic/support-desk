"use client";

import { useActionState } from "react";
import { createTicketAction } from "@/lib/actions/tickets";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function CreateTicketForm() {
  const [state, action] = useActionState(createTicketAction, {});

  return (
    <form action={action} className="max-w-2xl space-y-5 rounded-lg border border-zinc-200 bg-white p-5">
      {state.message ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{state.message}</p> : null}
      <label className="block text-sm font-medium text-zinc-700">
        Title
        <input name="title" required className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
        {state.errors?.title ? <span className="mt-1 block text-xs text-rose-600">{state.errors.title}</span> : null}
      </label>
      <label className="block text-sm font-medium text-zinc-700">
        Description
        <textarea name="description" required rows={7} className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
        {state.errors?.description ? <span className="mt-1 block text-xs text-rose-600">{state.errors.description}</span> : null}
      </label>
      <label className="block text-sm font-medium text-zinc-700">
        Priority
        <select name="priority" defaultValue="medium" className="mt-1 h-10 rounded-md border border-zinc-300 bg-white px-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {state.errors?.priority ? <span className="mt-1 block text-xs text-rose-600">{state.errors.priority}</span> : null}
      </label>
      <SubmitButton pendingText="Creating...">Create Ticket</SubmitButton>
    </form>
  );
}
