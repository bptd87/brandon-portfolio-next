-- Complete setup for Experiential Portfolio tables and storage
-- Run this entire script in Supabase SQL Editor

-- ============================================
-- 1. PROCESS GALLERY TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS experiential_process_gallery (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_key TEXT,
  video_url TEXT,
  alt_text TEXT,
  display_title TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Drop old constraint if exists
ALTER TABLE experiential_process_gallery 
  DROP CONSTRAINT IF EXISTS experiential_process_gallery_category_check;

-- Add constraint with all 7 categories
ALTER TABLE experiential_process_gallery 
  ADD CONSTRAINT experiential_process_gallery_category_check 
  CHECK (category IN (
    'workflow-toolkit', 
    'workflow-drawing', 
    'workflow-modeling', 
    'workflow-buildability',
    'rendering', 
    'technical-drawing', 
    'live-events'
  ));

-- Create index
CREATE INDEX IF NOT EXISTS idx_process_gallery_category ON experiential_process_gallery(category);

-- Enable RLS
ALTER TABLE experiential_process_gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON experiential_process_gallery;
DROP POLICY IF EXISTS "Allow authenticated insert" ON experiential_process_gallery;
DROP POLICY IF EXISTS "Allow authenticated update" ON experiential_process_gallery;
DROP POLICY IF EXISTS "Allow authenticated delete" ON experiential_process_gallery;

-- Create RLS policies
CREATE POLICY "Allow public read access" ON experiential_process_gallery
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON experiential_process_gallery
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON experiential_process_gallery
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON experiential_process_gallery
  FOR DELETE TO authenticated USING (true);

-- ============================================
-- 2. BRANDS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS experiential_brands (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  logo_key TEXT,
  website_url TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE experiential_brands ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON experiential_brands;
DROP POLICY IF EXISTS "Allow authenticated insert" ON experiential_brands;
DROP POLICY IF EXISTS "Allow authenticated update" ON experiential_brands;
DROP POLICY IF EXISTS "Allow authenticated delete" ON experiential_brands;

-- Create RLS policies
CREATE POLICY "Allow public read access" ON experiential_brands 
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON experiential_brands 
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON experiential_brands 
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON experiential_brands 
  FOR DELETE TO authenticated USING (true);

-- Seed brands (only if not exists)
INSERT INTO experiential_brands (name, sort_order) VALUES
  ('Red Bull', 1),
  ('Lumenati', 2),
  ('FirstBank', 3),
  ('New Swan Shakespeare Festival', 4),
  ('Utah Shakespeare Festival', 5),
  ('South Coast Repertory', 6),
  ('Okoboji Summer Theatre', 7)
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. SITE SETTINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON site_settings;
DROP POLICY IF EXISTS "Allow authenticated write" ON site_settings;

-- Create RLS policies
CREATE POLICY "Allow public read access" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated write" ON site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES 
  ('experiential_workflow_graphic', NULL)
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 4. STORAGE BUCKET SETUP
-- ============================================

-- Ensure the about-images bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('about-images', 'about-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated deletes" ON storage.objects;

-- Create storage policies
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'about-images');

CREATE POLICY "Authenticated uploads" ON storage.objects
  FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'about-images');

CREATE POLICY "Authenticated updates" ON storage.objects
  FOR UPDATE 
  TO authenticated
  USING (bucket_id = 'about-images')
  WITH CHECK (bucket_id = 'about-images');

CREATE POLICY "Authenticated deletes" ON storage.objects
  FOR DELETE 
  TO authenticated
  USING (bucket_id = 'about-images');

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- You should now be able to:
-- 1. Upload images to the about-images bucket
-- 2. Add workflow and gallery images via admin
-- 3. Manage brands with logos
