-- Add project support to experiential_process_gallery
-- This allows each gallery item to have multiple images/videos via the projects system

-- Add project_id column
ALTER TABLE experiential_process_gallery 
  ADD COLUMN IF NOT EXISTS project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE;

-- Create index for project lookups
CREATE INDEX IF NOT EXISTS idx_process_gallery_project ON experiential_process_gallery(project_id);

-- Make image_url optional (since video-only items don't need it)
ALTER TABLE experiential_process_gallery 
  ALTER COLUMN image_url DROP NOT NULL;

-- Update RLS policies to allow project-based access
DROP POLICY IF EXISTS "Enable read access for all users" ON experiential_process_gallery;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON experiential_process_gallery;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON experiential_process_gallery;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON experiential_process_gallery;

-- Recreate RLS policies
ALTER TABLE experiential_process_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON experiential_process_gallery
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON experiential_process_gallery
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON experiential_process_gallery
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users" ON experiential_process_gallery
  FOR DELETE TO authenticated USING (true);
