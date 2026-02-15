-- Fix for Supabase (Postgres) potentially missing columns, trying lowercase and snake_case variants
-- Ensure projectimages (lowercase) or projectImages (unquoted) active/other columns exist
DO $$ BEGIN -- Try adding to 'projectimages' (lowercase is standard Postgres default)
BEGIN
ALTER TABLE projectimages
ADD COLUMN IF NOT EXISTS "imageType" text DEFAULT 'production';
ALTER TABLE projectimages
ADD COLUMN IF NOT EXISTS "videoUrl" text;
ALTER TABLE projectimages
ADD COLUMN IF NOT EXISTS "title" text;
EXCEPTION
WHEN undefined_table THEN -- If 'projectimages' not found, try 'project_images' (snake_case)
BEGIN
ALTER TABLE project_images
ADD COLUMN IF NOT EXISTS "imageType" text DEFAULT 'production';
ALTER TABLE project_images
ADD COLUMN IF NOT EXISTS "videoUrl" text;
ALTER TABLE project_images
ADD COLUMN IF NOT EXISTS "title" text;
EXCEPTION
WHEN undefined_table THEN RAISE NOTICE 'Could not find projectimages or project_images table.';
END;
END;
END $$;