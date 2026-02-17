-- Add gallery_only flag to projects table
-- This allows projects to be used only in galleries without creating public project pages
ALTER TABLE projects
ADD COLUMN gallery_only BOOLEAN DEFAULT FALSE;

-- Create index for filtering out gallery-only items
CREATE INDEX idx_projects_gallery_only ON projects(gallery_only);
