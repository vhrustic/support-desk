"use client";

import { useActionState } from "react";
import { addCommentAction } from "@/lib/actions/comments";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { UserRole } from "@/types";

export function CommentForm({ ticketId, role }: { ticketId: string; role: UserRole }) {
  const [state, action] = useActionState(addCommentAction, {});
  const canMarkInternal = role === "admin" || role === "agent";

  return (
    <form action={action} className="mt-6 space-y-3">
      <input type="hidden" name="ticketId" value={ticketId} />
      {state.message ? (
        <p className={`rounded-md px-3 py-2 text-sm ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          {state.message}
        </p>
      ) : null}
      <label className="block text-sm font-medium text-zinc-700">
        Add Comment
        <textarea
          name="body"
          required
          rows={4}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
        {state.errors?.body ? <span className="mt-1 block text-xs text-rose-600">{state.errors.body}</span> : null}
      </label>
      {canMarkInternal ? (
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
          <input name="isInternal" type="checkbox" className="size-4 rounded border-zinc-300" />
          Mark as Internal Note
        </label>
      ) : null}
      <SubmitButton pendingText="Posting...">Post Reply</SubmitButton>
    </form>
  );
}
