# Supabase Integration for Todo Frontend

This app uses Supabase as the backend database. It expects these environment variables to be set:

- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Do not hardcode these values in code. The deployment platform will inject them from the `.env` configuration.

## Current configuration (applied)

The following steps were executed on the Supabase project:

1) Table verification and alignment
- Confirmed table: public.todos
- Columns now include:
  - id bigint primary key
  - title text not null
  - completed boolean not null default false
  - created_at timestamptz not null default now()  (pre-existing)
  - inserted_at timestamptz default now()          (added for frontend expectation)

Note: The frontend reads inserted_at. We preserved created_at and added inserted_at so both exist. Defaults ensure new rows receive timestamps.

2) RLS and policies (development setup)
- RLS enabled on public.todos
- Permissive policies created (dev-only):

```sql
alter table public.todos enable row level security;

create policy "Allow read to anon" on public.todos for select using (true);
create policy "Allow insert to anon" on public.todos for insert with check (true);
create policy "Allow update to anon" on public.todos for update using (true);
create policy "Allow delete to anon" on public.todos for delete using (true);
```

Warning: These policies allow anonymous full CRUD and are not suitable for production.

## Client initialization

The Supabase client is created in `todo_frontend/src/App.js` via:
- createSupabaseClient()

It reads the above environment variables and initializes the client using `@supabase/supabase-js`.

## Environment variables

Ensure the following are configured in the container or deployment environment:

- REACT_APP_SUPABASE_URL=https://<your-project-ref>.supabase.co
- REACT_APP_SUPABASE_KEY=<anon-or-service-role-key>

For local development, add them to a `.env` file at the root of `todo_frontend` as:
```
REACT_APP_SUPABASE_URL=...
REACT_APP_SUPABASE_KEY=...
```

## Database schema reference

If you need to recreate from scratch with bigint ids (matching the current table):

```sql
create table if not exists public.todos (
  id bigserial primary key,
  title text not null,
  completed boolean not null default false,
  created_at timestamp with time zone not null default now(),
  inserted_at timestamp with time zone default now()
);
```

(Alternatively, you can use uuid primary keys. If so, ensure uuid extension and compatible defaults.)

## Frontend notes

- The app relies on column `inserted_at` for ordering and display. This has been added and defaults to now().
- CRUD operations are performed via Supabase JS on table `todos`.
- No auth is required in this dev setup due to permissive RLS.

## Production hardening checklist

- Replace permissive RLS policies with user-scoped policies using auth.uid().
- Introduce an owner column (uuid) and set RLS to restrict access to owner = auth.uid().
- Store service secrets in Vault or Supabase secrets (never in code).
- Add rate limiting and validation as needed.

## Optional: Auth redirects (if enabling auth later)

If you later add user sign up with Supabase, set the email redirect using your site URL env var:

- REACT_APP_SITE_URL

When calling Supabase auth methods, pass dynamic redirect URLs derived from REACT_APP_SITE_URL (never hardcode URLs).
