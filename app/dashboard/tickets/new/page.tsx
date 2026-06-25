import { PageHeader } from "@/components/ui/PageHeader";
import { ensureCustomerForNewTicket } from "@/lib/actions/tickets";
import { CreateTicketForm } from "@/app/dashboard/tickets/new/CreateTicketForm";

export default async function NewTicketPage() {
  await ensureCustomerForNewTicket();

  return (
    <>
      <PageHeader
        title="Create Ticket"
        subtitle="Send a new support request to your tenant workspace."
      />
      <CreateTicketForm />
    </>
  );
}
