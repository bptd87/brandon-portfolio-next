-- Rollback news→articles migration
-- Remove articles that were copied from news table
-- (identified by matching slugs between news and articles tables)

DELETE FROM "public"."articles"
WHERE "slug" IN (
  SELECT "slug" FROM "public"."news"
);

-- Optional: Verify deletion
-- SELECT COUNT(*) FROM "public"."articles" WHERE "slug" IN (SELECT "slug" FROM "public"."news");
