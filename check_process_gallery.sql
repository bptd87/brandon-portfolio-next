-- Check what's in the experiential_process_gallery table
SELECT 
  id,
  category,
  project_id,
  display_title,
  image_url,
  video_url,
  sort_order,
  active,
  created_at
FROM experiential_process_gallery
ORDER BY created_at DESC
LIMIT 20;

-- Check if project_id column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'experiential_process_gallery'
ORDER BY ordinal_position;

-- Count items by category
SELECT category, COUNT(*) as count
FROM experiential_process_gallery
WHERE active = true
GROUP BY category
ORDER BY category;
