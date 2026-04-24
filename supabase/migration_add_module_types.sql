-- ============================================================
-- Migration: add parents + envelope_rain to module_type enum
-- Run this in the Supabase SQL Editor (one-time)
-- ============================================================

ALTER TYPE module_type ADD VALUE IF NOT EXISTS 'parents';
ALTER TYPE module_type ADD VALUE IF NOT EXISTS 'envelope_rain';
