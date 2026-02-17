-- Migrate news articles to articles table with block transformation
-- This migration converts news records to articles with proper block type transformations

-- Insert news records into articles with transformed blocks and proper published_at date
INSERT INTO "public"."articles" (
  "title",
  "slug", 
  "excerpt",
  "content",
  "cover_image",
  "read_time",
  "status",
  "featured",
  "category_id",
  "seo_title",
  "seo_description",
  "seo_keywords",
  "published_at",
  "created_at",
  "updated_at"
)
SELECT
  n."title",
  n."slug",
  n."excerpt",
  -- Transform news blocks to article blocks format
  (
    SELECT jsonb_agg(
      CASE
        -- Transform 'text' blocks to 'paragraph'
        WHEN block->>'type' = 'text' THEN
          jsonb_build_object(
            'type', 'paragraph',
            'text', COALESCE(block->>'content', block->>'text')
          )
        -- Transform 'header' blocks to 'heading'
        WHEN block->>'type' = 'header' THEN
          jsonb_build_object(
            'type', 'heading',
            'level', COALESCE((block->>'level')::int, 2),
            'text', COALESCE(block->>'content', block->>'text')
          )
        -- Keep image blocks as-is (already compatible)
        WHEN block->>'type' = 'image' THEN block
        -- Keep link blocks (may need to convert to HTML in future)
        WHEN block->>'type' = 'link' THEN
          jsonb_build_object(
            'type', 'html',
            'html', '<a href="' || (block->>'url') || '" target="_blank">' || (block->>'text') || '</a>'
          )
        -- Transform 'team' blocks (already works with creative_team structure)
        WHEN block->>'type' = 'team' THEN
          jsonb_build_object(
            'type', 'creative_team',
            'members', COALESCE(block->'members', '[]'::jsonb)
          )
        -- Keep details blocks as-is (use in FAQ or preserve structure)
        WHEN block->>'type' = 'details' THEN
          jsonb_build_object(
            'type', 'accordion',
            'items', COALESCE(block->'items', '[]'::jsonb)
          )
        -- Keep gallery blocks as-is (already compatible)
        WHEN block->>'type' = 'gallery' THEN block
        -- Keep quote blocks as-is (already compatible)
        WHEN block->>'type' = 'quote' THEN block
        -- Default: preserve block as-is
        ELSE block
      END
    )
    FROM jsonb_array_elements(n."blocks") AS block
  ) AS transformed_blocks,
  n."cover_image",
  -- Estimate read_time: roughly 200 words per minute
  GREATEST(
    1,
    ROUND(
      (
        (SELECT COUNT(*)
         FROM jsonb_array_elements(n."blocks") AS b
         WHERE b->>'type' IN ('text', 'header', 'paragraph')
        ) * 10
      )::numeric / 200
    )::int
  ) AS read_time,
  n."status",
  n."featured",
  n."category_id",
  n."seo_title",
  n."seo_description",
  n."seo_keywords",
  n."date"::timestamptz,
  n."created_at",
  n."updated_at"
FROM "public"."news" AS n
WHERE n."status" = 'published'
ON CONFLICT DO NOTHING;

-- Log migration summary
-- SELECT 'News migrations complete. Check article counts and ordering.' AS migration_status;
