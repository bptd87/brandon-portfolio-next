-- Create experiential process gallery table for workflow/process images
-- Categories: technical-toolkit, technical-drawing, 3d-modeling, buildability

CREATE TABLE experiential_process_gallery (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('technical-toolkit', 'technical-drawing', '3d-modeling', 'buildability')),
  image_url TEXT NOT NULL,
  image_key TEXT,
  alt_text TEXT,
  display_title TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for category lookups
CREATE INDEX idx_process_gallery_category ON experiential_process_gallery(category);

-- Add RLS policies
ALTER TABLE experiential_process_gallery ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON experiential_process_gallery
  FOR SELECT USING (true);

-- Allow authenticated users to manage (for admin)
CREATE POLICY "Allow authenticated insert" ON experiential_process_gallery
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON experiential_process_gallery
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON experiential_process_gallery
  FOR DELETE USING (true);

-- Create storage bucket for process gallery images (run this separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('experiential-process', 'experiential-process', true);
