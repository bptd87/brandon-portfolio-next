
-- Add missing columns to tutorials table
ALTER TABLE tutorials ADD COLUMN IF NOT EXISTS overview text;
ALTER TABLE tutorials ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE tutorials ADD COLUMN IF NOT EXISTS cover_image text;
ALTER TABLE tutorials ADD COLUMN IF NOT EXISTS video_url text;
