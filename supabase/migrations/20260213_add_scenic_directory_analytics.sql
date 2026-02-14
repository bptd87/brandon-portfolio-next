-- Add analytics columns to scenic_directory
ALTER TABLE scenic_directory
ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_clicked_at TIMESTAMP WITH TIME ZONE;
-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_scenic_directory_click_count ON scenic_directory(click_count DESC);
-- Update existing records with historical click counts from CSV
-- (Run the import script again to populate these values)