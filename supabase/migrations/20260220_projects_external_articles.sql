-- Add support for storing external/public article links per project
-- Safe to run multiple times

BEGIN;

ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS external_articles JSONB;

-- Ensure existing rows are initialized
UPDATE public.projects
SET external_articles = '[]'::jsonb
WHERE external_articles IS NULL;

-- Enforce default + non-null going forward
ALTER TABLE public.projects
ALTER COLUMN external_articles SET DEFAULT '[]'::jsonb;

ALTER TABLE public.projects
ALTER COLUMN external_articles SET NOT NULL;

COMMENT ON COLUMN public.projects.external_articles IS
'Array of external/public article objects: [{"title":"...","url":"https://...","source":"...","publishedAt":"YYYY-MM-DD","excerpt":"..."}]';

COMMIT;
