-- Add discipline and subcategory fields to projects table
ALTER TABLE projects 
ADD COLUMN discipline ENUM('scenic_design', 'experiential_design', 'rendering', 'scenic_models') DEFAULT 'scenic_design' NOT NULL,
ADD COLUMN subcategory VARCHAR(100);

-- Add index for discipline filtering
CREATE INDEX discipline_idx ON projects(discipline);

-- Create team_members table for flexible team management
CREATE TABLE team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio TEXT,
  imageUrl TEXT,
  imageKey TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create project_team_members junction table
CREATE TABLE project_team_members (
  projectId INT NOT NULL,
  teamMemberId INT NOT NULL,
  customRole VARCHAR(255),
  sortOrder INT DEFAULT 0 NOT NULL,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (teamMemberId) REFERENCES team_members(id) ON DELETE CASCADE,
  PRIMARY KEY (projectId, teamMemberId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for junction table
CREATE INDEX project_idx ON project_team_members(projectId);
CREATE INDEX team_member_idx ON project_team_members(teamMemberId);
