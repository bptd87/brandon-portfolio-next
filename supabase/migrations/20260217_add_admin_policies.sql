-- Add RLS policies for authenticated users (admin operations)
-- This allows authenticated users to perform CRUD operations on all tables

-- Projects policies
CREATE POLICY "Authenticated users can insert projects" ON projects
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects" ON projects
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete projects" ON projects
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view all projects" ON projects
  FOR SELECT TO authenticated USING (true);

-- Project Images policies
CREATE POLICY "Authenticated users can insert project images" ON project_images
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update project images" ON project_images
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete project images" ON project_images
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view all project images" ON project_images
  FOR SELECT TO authenticated USING (true);

-- News policies
CREATE POLICY "Authenticated users can insert news" ON news
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update news" ON news
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete news" ON news
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view all news" ON news
  FOR SELECT TO authenticated USING (true);

-- Articles policies
CREATE POLICY "Authenticated users can insert articles" ON articles
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles" ON articles
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete articles" ON articles
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view all articles" ON articles
  FOR SELECT TO authenticated USING (true);

-- Categories policies
CREATE POLICY "Authenticated users can insert categories" ON categories
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories" ON categories
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete categories" ON categories
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view all categories" ON categories
  FOR SELECT TO authenticated USING (true);

-- Tags policies
CREATE POLICY "Authenticated users can insert tags" ON tags
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update tags" ON tags
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete tags" ON tags
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view all tags" ON tags
  FOR SELECT TO authenticated USING (true);
