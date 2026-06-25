import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center bg-white">
      <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            SupportDesk
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
            Support that scales with your team
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            A clean multi-tenant workspace where customers submit tickets,
            agents resolve them, and admins keep every organization isolated.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 px-5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-zinc-200 pb-3">
            <span className="text-sm font-medium text-zinc-700">Open tickets</span>
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-200">
              Tenant scoped
            </span>
          </div>
          {["Login issue", "Billing question", "API timeout"].map((title, index) => (
            <div
              key={title}
              className="mb-3 rounded-md border border-zinc-200 bg-white p-4 last:mb-0"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-zinc-950">{title}</p>
                <span className="text-xs text-zinc-500">#{1024 + index}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-600">
                Assigned within Acme Corp workspace
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
