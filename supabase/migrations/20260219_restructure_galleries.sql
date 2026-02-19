-- Restructure: Separate rendering and experiential from scenic design projects
-- This migration creates discipline-specific project tables

-- ============ RENDERING PROJECTS TABLE ============
CREATE TABLE IF NOT EXISTS rendering_projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  excerpt TEXT,
  design_notes TEXT,
  cover_image_url TEXT,
  cover_image_key TEXT,
  location VARCHAR(255),
  client VARCHAR(255),
  year INT,
  month INT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB,
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP,
  
  CONSTRAINT rendering_projects_slug_unique UNIQUE(slug)
);

CREATE INDEX rendering_projects_status_idx ON rendering_projects(status);
CREATE INDEX rendering_projects_featured_idx ON rendering_projects(featured);
CREATE INDEX rendering_projects_year_idx ON rendering_projects(year);

-- ============ EXPERIENTIAL PROJECTS TABLE ============
CREATE TABLE IF NOT EXISTS experiential_projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  excerpt TEXT,
  design_notes TEXT,
  cover_image_url TEXT,
  cover_image_key TEXT,
  location VARCHAR(255),
  client VARCHAR(255),
  year INT,
  month INT,
  gallery_type TEXT NOT NULL DEFAULT 'rendering' CHECK (gallery_type IN ('rendering', 'technical-drawing', 'live-events')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB,
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP,
  
  CONSTRAINT experiential_projects_slug_unique UNIQUE(slug)
);

CREATE INDEX experiential_projects_status_idx ON experiential_projects(status);
CREATE INDEX experiential_projects_featured_idx ON experiential_projects(featured);
CREATE INDEX experiential_projects_gallery_type_idx ON experiential_projects(gallery_type);
CREATE INDEX experiential_projects_year_idx ON experiential_projects(year);

-- ============ RENDERING GALLERY TABLE ============
-- Restructured to reference rendering_projects instead of generic projects
-- Each gallery item shows ONE project with its cover_image + additional images from rendering_project_images
DROP TABLE IF EXISTS rendering_gallery CASCADE;

CREATE TABLE rendering_gallery (
  id SERIAL PRIMARY KEY,
  rendering_project_id INT NOT NULL REFERENCES rendering_projects(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  alt_text TEXT,
  display_title TEXT,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT rendering_gallery_project_unique UNIQUE(rendering_project_id)
);

CREATE INDEX rendering_gallery_project_idx ON rendering_gallery(rendering_project_id);
CREATE INDEX rendering_gallery_sort_idx ON rendering_gallery(sort_order);

-- ============ EXPERIENTIAL GALLERY TABLE ============
-- Restructured to reference experiential_projects instead of generic projects
DROP TABLE IF EXISTS experiential_gallery CASCADE;

CREATE TABLE experiential_gallery (
  id SERIAL PRIMARY KEY,
  experiential_project_id INT NOT NULL REFERENCES experiential_projects(id) ON DELETE CASCADE,
  gallery_type TEXT NOT NULL DEFAULT 'rendering' CHECK (gallery_type IN ('rendering', 'technical-drawing', 'live-events')),
  sort_order INT NOT NULL DEFAULT 0,
  alt_text TEXT,
  display_title TEXT,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT experiential_gallery_unique UNIQUE(experiential_project_id)
);

CREATE INDEX experiential_gallery_project_idx ON experiential_gallery(experiential_project_id);
CREATE INDEX experiential_gallery_type_idx ON experiential_gallery(gallery_type);
CREATE INDEX experiential_gallery_sort_idx ON experiential_gallery(sort_order);

-- ============ PROJECT IMAGES TABLES ============
-- Create discipline-specific image tables

CREATE TABLE IF NOT EXISTS rendering_project_images (
  id SERIAL PRIMARY KEY,
  rendering_project_id INT NOT NULL REFERENCES rendering_projects(id) ON DELETE CASCADE,
  title VARCHAR(255),
  image_url TEXT,
  image_key TEXT,
  video_url TEXT,
  image_type TEXT DEFAULT 'production' CHECK (image_type IN ('production', 'rendering', 'technical_drawing', 'video')),
  caption TEXT,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT rendering_project_images_url_unique UNIQUE(image_url)
);

CREATE INDEX rendering_project_images_project_idx ON rendering_project_images(rendering_project_id);
CREATE INDEX rendering_project_images_sort_idx ON rendering_project_images(sort_order);

CREATE TABLE IF NOT EXISTS experiential_project_images (
  id SERIAL PRIMARY KEY,
  experiential_project_id INT NOT NULL REFERENCES experiential_projects(id) ON DELETE CASCADE,
  title VARCHAR(255),
  image_url TEXT,
  image_key TEXT,
  video_url TEXT,
  image_type TEXT DEFAULT 'production' CHECK (image_type IN ('production', 'rendering', 'technical_drawing', 'video')),
  caption TEXT,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT experiential_project_images_url_unique UNIQUE(image_url)
);

CREATE INDEX experiential_project_images_project_idx ON experiential_project_images(experiential_project_id);
CREATE INDEX experiential_project_images_sort_idx ON experiential_project_images(sort_order);

-- ============ UPDATE SCENIC DESIGN PROJECTS TABLE ============
-- Keep existing projects table for scenic design only
-- These are NOT gallery-related, just core project data

COMMENT ON TABLE projects IS 'Scenic design projects portfolio - experiential rendering and set design';
