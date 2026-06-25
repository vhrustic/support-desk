import Link from "next/link";

type Props = {
  title: string;
  message: string;
  cta?: {
    label: string;
    href: string;
  };
};

export function EmptyState({ title, message, cta }: Props) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white px-6 text-center">
      <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-sky-50 text-xl text-sky-700">
        +
      </div>
      <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
      <p className="mt-1 max-w-md text-sm leading-6 text-zinc-600">{message}</p>
      {cta ? (
        <Link
          href={cta.href}
          className="mt-5 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          {cta.label}
        </Link>
      ) : null}
    </div>
  );
}
