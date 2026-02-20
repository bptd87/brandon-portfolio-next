-- Add external public article links to projects (press/reviews outside the site)
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS external_articles JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.projects.external_articles IS
'Array of external article objects: [{title,url,source,publishedAt,excerpt}]';
