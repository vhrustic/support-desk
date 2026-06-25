"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/Spinner";

export function SubmitButton({
  children,
  pendingText = "Saving...",
  className = "",
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {pending ? <Spinner /> : null}
      {pending ? pendingText : children}
    </button>
  );
}
