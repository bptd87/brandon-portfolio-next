-- Add published_at column to articles table for proper chronological ordering
ALTER TABLE "public"."articles" 
ADD COLUMN "published_at" timestamptz DEFAULT now();

-- Set published_at for existing articles (use created_at as best approximation)
UPDATE "public"."articles" 
SET "published_at" = "created_at" 
WHERE "published_at" IS NULL;

-- Make published_at NOT NULL after backfilling
ALTER TABLE "public"."articles" 
ALTER COLUMN "published_at" SET NOT NULL;

-- Add index for efficient sorting by published_at
CREATE INDEX "idx_articles_published_at" 
ON "public"."articles"("published_at" DESC);

-- Add index for filtering by status and published_at (common query pattern)
CREATE INDEX "idx_articles_status_published" 
ON "public"."articles"("status", "published_at" DESC);
