-- ============================================================
-- Auth Schema — Run this COMPLETELY in one go in the SQL Editor
-- ============================================================

-- ── 1. CLEANUP: drop trigger/function if they exist from a failed previous run
-- ─────────────────────────────────────────────────────────────────────────────
drop trigger  if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

-- ── 2. PROFILES TABLE
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  role       text not null default 'user'
               check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Allow each user to read their own profile
drop policy if exists "Users read own profile" on profiles;
create policy "Users read own profile"
  on profiles for select
  using (auth.uid() = id);

-- Allow admins to read all profiles
drop policy if exists "Admins read all profiles" on profiles;
create policy "Admins read all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Allow admins to update (change roles)
drop policy if exists "Admins update profiles" on profiles;
create policy "Admins update profiles"
  on profiles for update
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Service role has full access (used by API routes)
drop policy if exists "Service role full access profiles" on profiles;
create policy "Service role full access profiles"
  on profiles for all
  using (auth.role() = 'service_role');

-- ── 3. TRIGGER: auto-create profile on user signup
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── 4. EVENT OWNERSHIP: add created_by column to events
-- ─────────────────────────────────────────────────────────────────────────────
alter table events add column if not exists created_by uuid references auth.users(id);

-- ── 5. EVENT ASSIGNMENTS TABLE
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists event_assignments (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references events(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  assigned_by uuid references auth.users(id),
  created_at  timestamptz not null default now(),
  unique(event_id, user_id)
);

alter table event_assignments enable row level security;

drop policy if exists "Admins manage assignments" on event_assignments;
create policy "Admins manage assignments"
  on event_assignments for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Users read own assignments" on event_assignments;
create policy "Users read own assignments"
  on event_assignments for select
  using (user_id = auth.uid());

drop policy if exists "Service role full access assignments" on event_assignments;
create policy "Service role full access assignments"
  on event_assignments for all
  using (auth.role() = 'service_role');

-- ── 6. Backfill profiles for any users already in auth.users
-- ─────────────────────────────────────────────────────────────────────────────
insert into profiles (id, name, role)
select
  id,
  coalesce(raw_user_meta_data->>'name', email),
  'user'
from auth.users
on conflict (id) do nothing;
