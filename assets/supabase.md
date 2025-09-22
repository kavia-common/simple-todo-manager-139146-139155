# Supabase Integration for Todo Frontend

This app uses Supabase as the backend database. It expects these environment variables to be set:

- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Do not hardcode these values in code. The deployment platform will inject them from the `.env` configuration.

## Client initialization

The Supabase client is created in `src/App.js` via:
- createSupabaseClient()

It reads the above environment variables and initializes the client using `@supabase/supabase-js`.

## Database schema

Create a `todos` table:

```sql
create table if not exists public.todos (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  completed boolean not null default false,
  inserted_at timestamp with time zone default now()
);
```

Alternatively, if using bigint ids:

```sql
create table if not exists public.todos (
  id bigserial primary key,
  title text not null,
  completed boolean not null default false,
  inserted_at timestamp with time zone default now()
);
```

Ensure Row Level Security (RLS) is configured according to your needs. For quick development you can disable RLS or add permissive policies:

```sql
alter table public.todos enable row level security;

create policy "Allow read to anon" on public.todos
for select using (true);

create policy "Allow insert to anon" on public.todos
for insert with check (true);

create policy "Allow update to anon" on public.todos
for update using (true);

create policy "Allow delete to anon" on public.todos
for delete using (true);
```

Note: These policies are permissive and not suitable for production.

## Email redirect (if adding auth)

If you later add user sign up with Supabase, set the email redirect using your site URL env var:

- REACT_APP_SITE_URL

When calling `supabase.auth.signUp`, pass `emailRedirectTo: process.env.REACT_APP_SITE_URL`.

