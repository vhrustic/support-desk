"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function SignupForm() {
  const [state, action] = useActionState(signUpAction, {});

  return (
    <form action={action} className="space-y-4">
      {state.message ? (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.message}
        </p>
      ) : null}
      <label className="block text-sm font-medium text-zinc-700">
        Full Name
        <input name="fullName" required className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
        {state.errors?.fullName ? <span className="mt-1 block text-xs text-rose-600">{state.errors.fullName}</span> : null}
      </label>
      <label className="block text-sm font-medium text-zinc-700">
        Company Name
        <input name="companyName" required className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
        {state.errors?.companyName ? <span className="mt-1 block text-xs text-rose-600">{state.errors.companyName}</span> : null}
      </label>
      <label className="block text-sm font-medium text-zinc-700">
        Email
        <input name="email" type="email" required className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
        {state.errors?.email ? <span className="mt-1 block text-xs text-rose-600">{state.errors.email}</span> : null}
      </label>
      <label className="block text-sm font-medium text-zinc-700">
        Password
        <input name="password" type="password" required className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
        {state.errors?.password ? <span className="mt-1 block text-xs text-rose-600">{state.errors.password}</span> : null}
      </label>
      <SubmitButton pendingText="Creating workspace..." className="w-full">
        Get Started
      </SubmitButton>
      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-zinc-950 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
