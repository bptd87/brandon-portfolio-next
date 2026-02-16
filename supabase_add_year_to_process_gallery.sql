-- Add year field to experiential_process_gallery
-- This allows each gallery item to have an associated year/date

ALTER TABLE experiential_process_gallery 
  ADD COLUMN IF NOT EXISTS year INTEGER;

-- Create index for year-based queries
CREATE INDEX IF NOT EXISTS idx_process_gallery_year ON experiential_process_gallery(year);
