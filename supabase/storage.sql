-- ============================================================
-- Supabase Storage — Event Media Bucket (images + audio)
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Create or update bucket to allow images AND audio (50 MB max)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-images',
  'event-images',
  true,
  52428800,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav',
    'audio/x-m4a', 'audio/mp4', 'audio/aac'
  ]
)
on conflict (id) do update set
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Policies (drop first to avoid "already exists" error on re-run)
drop policy if exists "Public read event images"       on storage.objects;
drop policy if exists "Service role manage event images" on storage.objects;

create policy "Public read event images"
  on storage.objects for select
  using (bucket_id = 'event-images');

create policy "Service role manage event images"
  on storage.objects for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
