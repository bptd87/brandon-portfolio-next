-- Create a bucket named 'portfolio' if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true) ON CONFLICT (id) DO NOTHING;
-- Policy to allow authenticated users to upload files to 'portfolio' bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR
INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio');
-- Policy to allow public to view files in 'portfolio' bucket
CREATE POLICY "Allow public view" ON storage.objects FOR
SELECT TO public USING (bucket_id = 'portfolio');
-- Policy to allow authenticated users to update their own files (or all files for admin)
CREATE POLICY "Allow authenticated updates" ON storage.objects FOR
UPDATE TO authenticated USING (bucket_id = 'portfolio');
-- Policy to allow authenticated users to delete files
CREATE POLICY "Allow authenticated deletes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio');