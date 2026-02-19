-- Add gallery_only field to rendering and experiential project tables

ALTER TABLE rendering_projects 
ADD COLUMN gallery_only BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE experiential_projects 
ADD COLUMN gallery_only BOOLEAN NOT NULL DEFAULT false;

-- Add index for filtering
CREATE INDEX rendering_projects_gallery_only_idx ON rendering_projects(gallery_only);
CREATE INDEX experiential_projects_gallery_only_idx ON experiential_projects(gallery_only);

-- Update existing records: mark projects without slugs or with minimal content as gallery_only
UPDATE rendering_projects 
SET gallery_only = true 
WHERE slug IS NULL OR slug = '' OR design_notes IS NULL;

UPDATE experiential_projects 
SET gallery_only = true 
WHERE slug IS NULL OR slug = '' OR design_notes IS NULL;

COMMENT ON COLUMN rendering_projects.gallery_only IS 'If true, displays only in gallery modal. If false, has full project detail page.';
COMMENT ON COLUMN experiential_projects.gallery_only IS 'If true, displays only in gallery modal. If false, has full project detail page.';
