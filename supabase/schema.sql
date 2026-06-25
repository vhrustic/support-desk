create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete cascade,
  full_name text,
  email text,
  role text not null check (role in ('admin', 'agent', 'customer')),
  created_at timestamptz default now()
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  created_by uuid references public.profiles(id),
  assigned_to uuid references public.profiles(id),
  title text not null,
  description text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.ticket_comments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.tickets(id) on delete cascade,
  author_id uuid references public.profiles(id),
  body text not null,
  is_internal boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  tenant_id uuid references public.tenants(id) on delete cascade,
  role text not null check (role in ('agent', 'customer')),
  accepted_at timestamptz,
  created_at timestamptz default now()
);

create or replace function public.custom_jwt_claims()
returns jsonb language plpgsql stable as $$
declare
  _tenant_id uuid;
  _role text;
begin
  select tenant_id, role
  into _tenant_id, _role
  from public.profiles
  where id = auth.uid();

  return jsonb_build_object(
    'tenant_id', _tenant_id,
    'user_role', _role
  );
end;
$$;

create or replace function public.current_tenant_id() returns uuid as $$
  select nullif(auth.jwt() ->> 'tenant_id', '')::uuid;
$$ language sql stable;

create or replace function public.current_user_role() returns text as $$
  select auth.jwt() ->> 'user_role';
$$ language sql stable;

create or replace function public.profile_tenant_id() returns uuid
language sql stable security definer
set search_path = public
as $$
  select tenant_id
  from public.profiles
  where id = auth.uid();
$$;

create or replace function public.profile_user_role() returns text
language sql stable security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid();
$$;

create or replace function public.effective_tenant_id() returns uuid as $$
  select coalesce(public.current_tenant_id(), public.profile_tenant_id());
$$ language sql stable;

create or replace function public.effective_user_role() returns text as $$
  select coalesce(public.current_user_role(), public.profile_user_role());
$$ language sql stable;

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_comments enable row level security;
alter table public.invitations enable row level security;

drop policy if exists tenant_read_own on public.tenants;
create policy tenant_read_own on public.tenants
  for select using (id = public.effective_tenant_id());

drop policy if exists tenant_insert_authenticated on public.tenants;
create policy tenant_insert_authenticated on public.tenants
  for insert with check (auth.uid() is not null);

drop policy if exists profiles_read_own_tenant on public.profiles;
create policy profiles_read_own_tenant on public.profiles
  for select using (tenant_id = public.effective_tenant_id() or id = auth.uid());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert with check (id = auth.uid());

drop policy if exists profiles_admin_update_agents on public.profiles;
create policy profiles_admin_update_agents on public.profiles
  for update using (
    tenant_id = public.effective_tenant_id()
    and public.effective_user_role() = 'admin'
  )
  with check (tenant_id = public.effective_tenant_id());

drop policy if exists tickets_customer_select on public.tickets;
create policy tickets_customer_select on public.tickets
  for select using (
    tenant_id = public.effective_tenant_id() and (
      public.effective_user_role() in ('admin', 'agent')
      or created_by = auth.uid()
    )
  );

drop policy if exists tickets_customer_insert on public.tickets;
create policy tickets_customer_insert on public.tickets
  for insert with check (
    tenant_id = public.effective_tenant_id()
    and created_by = auth.uid()
  );

drop policy if exists tickets_agent_update on public.tickets;
create policy tickets_agent_update on public.tickets
  for update using (
    tenant_id = public.effective_tenant_id()
    and public.effective_user_role() in ('admin', 'agent')
  )
  with check (tenant_id = public.effective_tenant_id());

drop policy if exists comments_select on public.ticket_comments;
create policy comments_select on public.ticket_comments
  for select using (
    exists (
      select 1 from public.tickets t
      where t.id = ticket_id
        and t.tenant_id = public.effective_tenant_id()
        and (
          public.effective_user_role() in ('admin', 'agent')
          or (is_internal = false and t.created_by = auth.uid())
        )
    )
  );

drop policy if exists comments_insert on public.ticket_comments;
create policy comments_insert on public.ticket_comments
  for insert with check (
    exists (
      select 1 from public.tickets t
      where t.id = ticket_id
        and t.tenant_id = public.effective_tenant_id()
    )
    and author_id = auth.uid()
  );

drop policy if exists invitations_admin_select on public.invitations;
create policy invitations_admin_select on public.invitations
  for select using (
    tenant_id = public.effective_tenant_id()
    and public.effective_user_role() = 'admin'
  );

drop policy if exists invitations_admin_insert on public.invitations;
create policy invitations_admin_insert on public.invitations
  for insert with check (
    tenant_id = public.effective_tenant_id()
    and public.effective_user_role() = 'admin'
  );

create index if not exists profiles_tenant_role_idx on public.profiles(tenant_id, role);
create index if not exists tickets_tenant_idx on public.tickets(tenant_id);
create index if not exists tickets_created_by_idx on public.tickets(created_by);
create index if not exists ticket_comments_ticket_idx on public.ticket_comments(ticket_id);
