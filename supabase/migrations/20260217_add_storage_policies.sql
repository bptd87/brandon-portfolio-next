-- Add RLS policies for Supabase Storage buckets
-- This allows authenticated users to upload/update/delete files in storage

-- News bucket policies
CREATE POLICY "Authenticated users can upload to news bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'news');

CREATE POLICY "Authenticated users can update news bucket"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'news');

CREATE POLICY "Authenticated users can delete from news bucket"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'news');

-- Articles bucket policies
CREATE POLICY "Authenticated users can upload to articles bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'articles');

CREATE POLICY "Authenticated users can update articles bucket"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'articles');

CREATE POLICY "Authenticated users can delete from articles bucket"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'articles');

-- News gallery bucket policies
CREATE POLICY "Authenticated users can upload to news_gallery bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'news_gallery');

CREATE POLICY "Authenticated users can update news_gallery bucket"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'news_gallery');

CREATE POLICY "Authenticated users can delete from news_gallery bucket"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'news_gallery');

-- Articles gallery bucket policies
CREATE POLICY "Authenticated users can upload to articles_gallery bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'articles_gallery');

CREATE POLICY "Authenticated users can update articles_gallery bucket"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'articles_gallery');

CREATE POLICY "Authenticated users can delete from articles_gallery bucket"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'articles_gallery');
