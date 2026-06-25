import { InviteForm } from "@/app/dashboard/invite/InviteForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireRole } from "@/lib/auth";

export default async function InvitePage() {
  await requireRole(["admin"]);

  return (
    <>
      <PageHeader title="Invite User" subtitle="Send a Supabase magic link into this tenant." />
      <InviteForm />
    </>
  );
}
