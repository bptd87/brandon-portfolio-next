-- Add analytics columns to scenic_directory
ALTER TABLE scenic_directory
ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_clicked_at TIMESTAMP WITH TIME ZONE;
-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scenic_directory_click_count ON scenic_directory(click_count DESC);
CREATE INDEX IF NOT EXISTS idx_scenic_directory_like_count ON scenic_directory(like_count DESC);
-- Drop the function first if it exists to avoid errors
DROP FUNCTION IF EXISTS increment_scenic_directory_clicks;
-- Create function for atomic increment
CREATE OR REPLACE FUNCTION increment_scenic_directory_clicks(directory_id BIGINT) RETURNS VOID AS $$ BEGIN
UPDATE scenic_directory
SET click_count = click_count + 1,
    last_clicked_at = NOW()
WHERE id = directory_id;
END;
$$ LANGUAGE plpgsql;
-- Drop function if exists
DROP FUNCTION IF EXISTS toggle_scenic_directory_like;
-- Create function for toggling likes (simple increment/decrement)
-- In a real app with user tracking, you'd have a separate likes table
-- But for now we just want a simple counter as requested
CREATE OR REPLACE FUNCTION toggle_scenic_directory_like(directory_id BIGINT) RETURNS INTEGER AS $$
DECLARE new_count INTEGER;
BEGIN
UPDATE scenic_directory
SET like_count = like_count + 1
WHERE id = directory_id
RETURNING like_count INTO new_count;
RETURN new_count;
END;
$$ LANGUAGE plpgsql;