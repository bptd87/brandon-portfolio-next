-- Add creative_team column to projects table
ALTER TABLE projects
ADD COLUMN creative_team JSONB DEFAULT '{}';

-- Add helpful comment
COMMENT ON COLUMN projects.creative_team IS 'Creative team members stored as JSON array: [{name: string, role: string}]';
