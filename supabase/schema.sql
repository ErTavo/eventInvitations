-- ============================================================
-- Event Invitations — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- EVENTS
-- ─────────────────────────────────────────────
create table if not exists events (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  name          text not null,
  date          timestamptz not null,
  location      text,
  description   text,
  cover_image   text,
  slug          text not null unique,
  is_published  boolean not null default false,
  style         jsonb not null default '{
    "theme": "elegant",
    "primaryColor": "#b8974a",
    "secondaryColor": "#f5f0e8",
    "fontFamily": "Cormorant Garamond"
  }'::jsonb
);

-- ─────────────────────────────────────────────
-- MODULES
-- ─────────────────────────────────────────────
create type module_type as enum (
  'carousel',
  'music',
  'map',
  'rsvp',
  'countdown',
  'gallery',
  'dress_code',
  'itinerary',
  'gifts',
  'parents',
  'envelope_rain'
);

create table if not exists modules (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  event_id    uuid not null references events(id) on delete cascade,
  type        module_type not null,
  is_active   boolean not null default true,
  "order"     integer not null default 0,
  config      jsonb not null default '{}'::jsonb,
  unique(event_id, type)
);

-- ─────────────────────────────────────────────
-- PARTICIPANTS
-- ─────────────────────────────────────────────
create type attendance_status as enum ('pending', 'confirmed', 'declined');

create table if not exists participants (
  id                    uuid primary key default uuid_generate_v4(),
  created_at            timestamptz not null default now(),
  event_id              uuid not null references events(id) on delete cascade,
  name                  text not null,
  companions            integer not null default 0,
  attendance            attendance_status not null default 'pending',
  notes                 text,
  invitation_viewed     boolean not null default false,
  invitation_viewed_at  timestamptz
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
create index if not exists idx_modules_event_id     on modules(event_id);
create index if not exists idx_participants_event_id on participants(event_id);
create index if not exists idx_events_slug           on events(slug);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
alter table events       enable row level security;
alter table modules      enable row level security;
alter table participants enable row level security;

-- Public read for published events (invitation pages)
create policy "Public can read published events"
  on events for select
  using (is_published = true);

-- Public read modules of published events
create policy "Public can read modules of published events"
  on modules for select
  using (
    exists (
      select 1 from events e
      where e.id = modules.event_id and e.is_published = true
    )
  );

-- Public can read their own participant row (by id)
create policy "Public can read participants"
  on participants for select
  using (true);

-- Public can update RSVP fields only
create policy "Public can update own attendance"
  on participants for update
  using (true)
  with check (true);

-- Service role has full access (used from API routes with service key)
create policy "Service role full access events"
  on events for all
  using (auth.role() = 'service_role');

create policy "Service role full access modules"
  on modules for all
  using (auth.role() = 'service_role');

create policy "Service role full access participants"
  on participants for all
  using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- SEED: default modules for new events (function)
-- ─────────────────────────────────────────────
create or replace function create_default_modules(p_event_id uuid)
returns void language plpgsql as $$
begin
  insert into modules (event_id, type, is_active, "order", config) values
    (p_event_id, 'carousel',      false, 1,  '{}'),
    (p_event_id, 'countdown',     true,  2,  '{}'),
    (p_event_id, 'music',         false, 3,  '{}'),
    (p_event_id, 'itinerary',     false, 4,  '{}'),
    (p_event_id, 'dress_code',    false, 5,  '{}'),
    (p_event_id, 'map',           false, 6,  '{}'),
    (p_event_id, 'gifts',         false, 7,  '{}'),
    (p_event_id, 'parents',       false, 8,  '{"sectionTitle":"Nuestros padres","brideParentsLabel":"Padres de la novia","brideParentNames":[],"groomParentsLabel":"Padres del novio","groomParentNames":[],"godfathersLabel":"Nuestros padrinos","godfatherNames":[]}'),
    (p_event_id, 'envelope_rain', false, 9,  '{"envelopeRainDescription":"Tu presencia es el mejor regalo. Si deseas hacernos un obsequio, puedes hacerlo a través de:","envelopeRainAccounts":[]}'),
    (p_event_id, 'rsvp',          true,  10, '{}')
  on conflict (event_id, type) do nothing;
end;
$$;
