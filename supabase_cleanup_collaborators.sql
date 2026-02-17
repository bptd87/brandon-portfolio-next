-- Clean up collaborators table - remove unnecessary columns

-- Remove unused columns
ALTER TABLE collaborators 
DROP COLUMN IF EXISTS website,
DROP COLUMN IF EXISTS cover_image,
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS featured,
DROP COLUMN IF EXISTS seo_title,
DROP COLUMN IF EXISTS seo_description,
DROP COLUMN IF EXISTS seo_keywords,
DROP COLUMN IF EXISTS gallery;

-- Final table will have only what the page needs:
-- id, name, role, bio, created_at
-- portfolioUrl, websiteUrl, instagramUrl, instagramHandle
