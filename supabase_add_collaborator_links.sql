-- Add social media and portfolio URL columns to collaborators table

ALTER TABLE collaborators 
ADD COLUMN IF NOT EXISTS "portfolioUrl" text,
ADD COLUMN IF NOT EXISTS "websiteUrl" text,
ADD COLUMN IF NOT EXISTS "instagramUrl" text,
ADD COLUMN IF NOT EXISTS "instagramHandle" varchar(100);

-- Optional: If you want to copy existing website data to websiteUrl
-- UPDATE collaborators SET "websiteUrl" = website WHERE website IS NOT NULL AND "websiteUrl" IS NULL;
