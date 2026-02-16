-- Drop old table if it exists (run only if you haven't added data yet)
-- DROP TABLE IF EXISTS experiential_process_gallery;

-- Create experiential content table for workflow images
-- Workflow categories: workflow-toolkit, workflow-drawing, workflow-modeling, workflow-buildability
-- Gallery categories: rendering, technical-drawing, live-events

CREATE TABLE IF NOT EXISTS experiential_process_gallery (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN (
    'workflow-toolkit', 
    'workflow-drawing', 
    'workflow-modeling', 
    'workflow-buildability',
    'rendering', 
    'technical-drawing', 
    'live-events'
  )),
  image_url TEXT NOT NULL,
  image_key TEXT,
  video_url TEXT,  -- For rendering videos/walkthroughs
  alt_text TEXT,
  display_title TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for category lookups
CREATE INDEX IF NOT EXISTS idx_process_gallery_category ON experiential_process_gallery(category);

-- Add RLS policies
ALTER TABLE experiential_process_gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON experiential_process_gallery;
DROP POLICY IF EXISTS "Allow authenticated insert" ON experiential_process_gallery;
DROP POLICY IF EXISTS "Allow authenticated update" ON experiential_process_gallery;
DROP POLICY IF EXISTS "Allow authenticated delete" ON experiential_process_gallery;

CREATE POLICY "Allow public read access" ON experiential_process_gallery
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON experiential_process_gallery
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON experiential_process_gallery
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON experiential_process_gallery
  FOR DELETE TO authenticated USING (true);

-- Separate table for site settings (workflow graphic, etc)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON site_settings;
DROP POLICY IF EXISTS "Allow authenticated write" ON site_settings;

CREATE POLICY "Allow public read access" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated write" ON site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert default workflow graphic setting
INSERT INTO site_settings (key, value) VALUES 
  ('experiential_workflow_graphic', NULL)
ON CONFLICT (key) DO NOTHING;

-- Brands/clients table
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

ALTER TABLE experiential_brands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON experiential_brands;
DROP POLICY IF EXISTS "Allow authenticated insert" ON experiential_brands;
DROP POLICY IF EXISTS "Allow authenticated update" ON experiential_brands;
DROP POLICY IF EXISTS "Allow authenticated delete" ON experiential_brands;

CREATE POLICY "Allow public read access" ON experiential_brands 
  FOR SELECT USING (true);
  
CREATE POLICY "Allow authenticated insert" ON experiential_brands 
  FOR INSERT TO authenticated WITH CHECK (true);
  
CREATE POLICY "Allow authenticated update" ON experiential_brands 
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  
CREATE POLICY "Allow authenticated delete" ON experiential_brands 
  FOR DELETE TO authenticated USING (true);

-- Seed some brands (only if not exists)
INSERT INTO experiential_brands (name, sort_order) VALUES
  ('Red Bull', 1),
  ('Lumenati', 2),
  ('FirstBank', 3),
  ('New Swan Shakespeare Festival', 4),
  ('Utah Shakespeare Festival', 5),
  ('South Coast Repertory', 6),
  ('Okoboji Summer Theatre', 7)
ON CONFLICT DO NOTHING;

-- Storage bucket policies for 'about-images' bucket
-- Run this to ensure authenticated users can upload

-- Allow public read access to about-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('about-images', 'about-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Public read access
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'about-images');

-- Authenticated write access
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'about-images');

CREATE POLICY "Allow authenticated updates" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'about-images')
  WITH CHECK (bucket_id = 'about-images');

CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'about-images');
