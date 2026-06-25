# SupportDesk

**Live demo:** [https://support-desk-rose.vercel.app/](https://support-desk-rose.vercel.app/)

SupportDesk is a multi-tenant SaaS customer support ticket system built with **Next.js 16**, **Supabase Auth/Postgres**, **Row Level Security**, **Server Actions**, **TypeScript**, and **Tailwind CSS**.

The app demonstrates how to build a tenant-isolated support workspace where every company has its own data boundary enforced by Supabase RLS, not just by application-side filtering.

## What The App Does

Each tenant represents a company workspace. Users inside a tenant can have one of three roles:

- **Admin**: can view all tickets in the tenant, manage agents, and invite users.
- **Agent**: can view all tenant tickets, reply, add internal notes, assign tickets, and update ticket status.
- **Customer**: can create tickets, view only their own tickets, and reply to public ticket threads.

Core product features:

- Tenant onboarding through `/signup`
- Email/password login through Supabase Auth
- Role-based dashboard sidebar
- Ticket list with client-side status and priority filters
- Customer ticket creation flow
- Ticket detail page with comments and internal notes
- Agent assignment and status updates for agents/admins
- Admin-only agent management
- Admin-only invite flow using Supabase Admin Auth
- Demo seed data for local review

## Why This Project Matters

This project is designed to show practical Supabase SaaS patterns:

- **Multi-tenancy**: every primary table includes `tenant_id`, and reads/writes are scoped to the authenticated user's tenant.
- **RLS-first authorization**: tenant isolation and role permissions are enforced in Postgres policies.
- **JWT custom claims**: `tenant_id` and `user_role` are added to the Supabase Auth JWT so RLS policies can make authorization decisions without extra joins.
- **Server Actions**: all mutations are handled through Next.js server actions instead of a separate API backend.
- **Service key discipline**: the Supabase secret key is used only for admin operations such as inviting users and seeding demo data.

## Tech Stack

- **Framework**: Next.js 16 App Router
- **Auth and Database**: Supabase Auth + PostgreSQL
- **Authorization**: Supabase Row Level Security
- **Mutations**: Next.js Server Actions
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

## Demo Accounts

After running the seed script, these accounts are available:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@acme.test` | `password123` |
| Agent | `agent@acme.test` | `password123` |
| Customer | `customer@acme.test` | `password123` |

Seed output:

```text
Seed complete: admin@acme.test, agent@acme.test, customer@acme.test / password123
```

## Local Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Supabase Project

Create a Supabase project, then open the SQL Editor and run:

```text
supabase/schema.sql
```

The schema creates:

- `tenants`
- `profiles`
- `tickets`
- `ticket_comments`
- `invitations`
- RLS policies
- JWT helper functions
- `public.custom_jwt_claims()`

### 3. Configure Supabase Auth Hook

In Supabase Dashboard:

1. Go to **Authentication**.
2. Open **Hooks**.
3. Register `public.custom_jwt_claims()` as the custom access token hook.

This injects these custom claims into the user JWT:

```json
{
  "tenant_id": "...",
  "user_role": "admin"
}
```

The RLS policies use those claims to scope tenant access and role permissions.

### 4. Configure Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_sb_publishable_key
SUPABASE_SECRET_KEY=your_sb_secret_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Notes:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is safe to expose in the browser when RLS is correctly enabled.
- `SUPABASE_SECRET_KEY` must stay server-only. It bypasses RLS and is used only for Supabase Admin Auth operations and seeding.
- `NEXT_PUBLIC_SITE_URL` is used as a fallback for auth redirect URLs. In production, set it to your Vercel URL.

### 5. Seed Demo Data

Run the seed script with `.env.local` loaded:

```bash
npx dotenv-cli -e .env.local -- npm run seed
```

The seed script creates:

- Acme Corp tenant
- One admin
- One agent
- One customer
- Five demo tickets
- Public comments and internal notes

### 6. Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Useful Commands

```bash
npm run dev
```

Starts the local development server.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run build
```

Builds the app for production.

```bash
npm run seed
```

Runs the seed script. Use `dotenv-cli` or another env loader when running locally with `.env.local`.

## Route Overview

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/login` | Sign in |
| `/signup` | Create a new tenant workspace |
| `/auth/callback` | Supabase auth callback |
| `/dashboard` | Redirects to tickets |
| `/dashboard/tickets` | Ticket list |
| `/dashboard/tickets/new` | Customer ticket creation |
| `/dashboard/tickets/[id]` | Ticket detail, comments, metadata, actions |
| `/dashboard/agents` | Admin-only agent management |
| `/dashboard/invite` | Admin-only user invites |

## RLS Design

RLS is enabled on all main tables.

High-level policy behavior:

- Users can only read their own tenant record.
- Users can read profiles in their tenant.
- Customers can only read tickets they created.
- Agents and admins can read all tickets in their tenant.
- Customers can create tickets only for themselves.
- Only agents and admins can update tickets.
- Customers cannot see internal notes.
- Admin-only areas are protected both in the app and by role-aware database policies.

The application intentionally does not rely only on UI checks for authorization. UI checks improve usability, but the database remains the source of truth.

## Deployment Notes

This app is ready to deploy on Vercel.

Set these Vercel environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_sb_publishable_key
SUPABASE_SECRET_KEY=your_sb_secret_key
NEXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app
```

Before testing the deployed app:

1. Apply `supabase/schema.sql` to the Supabase project.
2. Register the custom access token hook.
3. Seed demo data if desired.
4. Add the Vercel URL to the top of this README.
5. Add your Vercel URL to Supabase Auth redirect URLs so invite links can return to `/auth/callback`.

## Security Notes

- RLS must stay enabled for tenant isolation.
- Never expose `SUPABASE_SECRET_KEY` in browser code.
- Do not use the secret key for normal reads.
- Normal app reads and writes go through the publishable key with the signed-in user's session.
- The secret key is reserved for trusted server-side admin operations.
