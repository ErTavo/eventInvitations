-- ============================================================
-- Migration v2 — Run this in the Supabase SQL Editor
-- Fixes:
--   1. module_type enum → text  (enables parents, envelope_rain, future types)
--   2. Storage bucket → audio support + 50 MB limit
--   3. create_default_modules → includes all current module types
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- 1. MODULES: change column type from enum to text
--    This allows any string type without needing ALTER TYPE each time
-- ─────────────────────────────────────────────────────────────

ALTER TABLE modules ALTER COLUMN type TYPE text;

DROP TYPE IF EXISTS module_type;


-- ─────────────────────────────────────────────────────────────
-- 2. STORAGE: allow audio files and increase size limit to 50 MB
-- ─────────────────────────────────────────────────────────────

UPDATE storage.buckets
SET
  file_size_limit    = 52428800,
  allowed_mime_types = array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav',
    'audio/x-m4a', 'audio/mp4', 'audio/aac'
  ]
WHERE id = 'event-images';


-- ─────────────────────────────────────────────────────────────
-- 3. FUNCTION: update create_default_modules to include all modules
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION create_default_modules(p_event_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO modules (event_id, type, is_active, "order", config) VALUES
    (p_event_id, 'carousel',      false, 1,  '{}'),
    (p_event_id, 'countdown',     true,  2,  '{}'),
    (p_event_id, 'music',         false, 3,  '{}'),
    (p_event_id, 'itinerary',     false, 4,  '{}'),
    (p_event_id, 'dress_code',    false, 5,  '{}'),
    (p_event_id, 'map',           false, 6,  '{}'),
    (p_event_id, 'gifts',         false, 7,  '{}'),
    (p_event_id, 'parents',       false, 8,
      '{"sectionTitle":"Nuestros padres","brideParentsLabel":"Padres de la novia","brideParentNames":[],"groomParentsLabel":"Padres del novio","groomParentNames":[],"godfathersLabel":"Nuestros padrinos","godfatherNames":[]}'
    ),
    (p_event_id, 'envelope_rain', false, 9,
      '{"envelopeRainDescription":"Tu presencia es el mejor regalo. Si deseas hacernos un obsequio, puedes hacerlo a través de:","envelopeRainAccounts":[]}'
    ),
    (p_event_id, 'rsvp',          true,  10, '{}')
  ON CONFLICT (event_id, type) DO NOTHING;
END;
$$;
