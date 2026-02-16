-- Fix storage bucket policies for authenticated uploads
-- Run this if you're getting "new row violates row-level security policy" errors

-- Ensure the about-images bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('about-images', 'about-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated deletes" ON storage.objects;

-- Public read access to all files in about-images bucket
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'about-images');

-- Authenticated users can upload to about-images bucket
CREATE POLICY "Authenticated uploads" ON storage.objects
  FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'about-images');

-- Authenticated users can update their uploads
CREATE POLICY "Authenticated updates" ON storage.objects
  FOR UPDATE 
  TO authenticated
  USING (bucket_id = 'about-images')
  WITH CHECK (bucket_id = 'about-images');

-- Authenticated users can delete their uploads
CREATE POLICY "Authenticated deletes" ON storage.objects
  FOR DELETE 
  TO authenticated
  USING (bucket_id = 'about-images');
