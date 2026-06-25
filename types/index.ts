export type UserRole = "admin" | "agent" | "customer";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export type Profile = {
  id: string;
  tenant_id: string | null;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  created_at: string | null;
};

export type Ticket = {
  id: string;
  tenant_id: string | null;
  created_by: string | null;
  assigned_to: string | null;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string | null;
  updated_at: string | null;
};

export type TicketWithPeople = Ticket & {
  creator: Pick<Profile, "id" | "full_name" | "email"> | null;
  assignee: Pick<Profile, "id" | "full_name" | "email"> | null;
};

export type TicketComment = {
  id: string;
  ticket_id: string | null;
  author_id: string | null;
  body: string;
  is_internal: boolean | null;
  created_at: string | null;
  author: Pick<Profile, "id" | "full_name" | "email" | "role"> | null;
};

export type ActionState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
};
