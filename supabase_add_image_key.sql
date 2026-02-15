-- Fix for missing image_key and consistency in project_images
-- Add image_key if it doesn't exist
ALTER TABLE project_images
ADD COLUMN IF NOT EXISTS image_key text;
-- (Optional) If we want to clean up duplicates we could, but let's just ensure the one our code uses (image_key) exists.
-- Our code in server/db.ts now uses:
-- image_key
-- image_type (exists)
-- video_url (exists)
-- sort_order (exists)
-- project_id (exists)
-- image_url (exists)
-- alt_text (exists)
-- caption (exists)
-- title (exists)
-- Reload schema cache to be safe
NOTIFY pgrst,
'reload';