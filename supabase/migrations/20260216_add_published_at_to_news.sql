-- Add published_at column to news table for consistent chronological ordering
ALTER TABLE "public"."news" 
ADD COLUMN "published_at" timestamptz DEFAULT now();

-- Set published_at for existing news (use date field if present, otherwise created_at)
UPDATE "public"."news" 
SET "published_at" = COALESCE("date", "created_at") 
WHERE "published_at" IS NULL;

-- Make published_at NOT NULL after backfilling
ALTER TABLE "public"."news" 
ALTER COLUMN "published_at" SET NOT NULL;

-- Add index for efficient sorting by published_at
CREATE INDEX "idx_news_published_at" 
ON "public"."news"("published_at" DESC);

-- Add index for filtering by status and published_at (common query pattern)
CREATE INDEX "idx_news_status_published" 
ON "public"."news"("status", "published_at" DESC);
