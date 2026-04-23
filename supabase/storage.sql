-- ============================================================
-- Supabase Storage — Event Images Bucket
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Create public bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-images',
  'event-images',
  true,
  10485760,  -- 10 MB limit per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Allow public read (anyone can see the images via URL)
create policy "Public read event images"
  on storage.objects for select
  using (bucket_id = 'event-images');

-- Allow service role to upload/delete (used by the API route)
create policy "Service role manage event images"
  on storage.objects for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
