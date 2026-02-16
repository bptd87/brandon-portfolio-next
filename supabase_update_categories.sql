-- Create or update experiential_process_gallery table with all 7 categories
-- Run this to set up the complete table structure

-- Create the table if it doesn't exist
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

-- Drop the old constraint if it exists
ALTER TABLE experiential_process_gallery 
  DROP CONSTRAINT IF EXISTS experiential_process_gallery_category_check;

-- Add new constraint with all 7 categories
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

-- Create index for category lookups
CREATE INDEX IF NOT EXISTS idx_process_gallery_category ON experiential_process_gallery(category);

-- Ensure RLS is enabled
ALTER TABLE experiential_process_gallery ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies with proper TO authenticated clause
DROP POLICY IF EXISTS "Allow public read access" ON experiential_process_gallery;
DROP POLICY IF EXISTS "Allow authenticated insert" ON experiential_process_gallery;
DROP POLICY IF EXISTS "Allow authenticated update" ON experiential_process_gallery;
DROP POLICY IF EXISTS "Allow authenticated delete" ON experiential_process_gallery;

-- Public can read all active items
CREATE POLICY "Allow public read access" ON experiential_process_gallery
  FOR SELECT 
  USING (true);

-- Authenticated users can insert
CREATE POLICY "Allow authenticated insert" ON experiential_process_gallery
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Allow authenticated update" ON experiential_process_gallery
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "Allow authenticated delete" ON experiential_process_gallery
  FOR DELETE 
  TO authenticated 
  USING (true);
