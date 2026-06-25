import { LoginForm } from "@/app/login/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Sign in</h1>
        <p className="mt-2 text-sm text-zinc-600">Return to your support workspace.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
