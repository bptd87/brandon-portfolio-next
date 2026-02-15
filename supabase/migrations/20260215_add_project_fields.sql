-- Add missing fields for project subcategory filters
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS subcategory text;

-- Optional: allow discipline to be stored consistently for filters
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS discipline text;

-- Helpful index for filtering
CREATE INDEX IF NOT EXISTS projects_subcategory_idx ON public.projects (subcategory);
CREATE INDEX IF NOT EXISTS projects_discipline_idx ON public.projects (discipline);
