-- List columns of project_images (or projectimages)
SELECT table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name IN (
        'project_images',
        'projectimages',
        'projectImages',
        'ProjectImages'
    )
ORDER BY table_name,
    column_name;
-- Reload Schema Cache
NOTIFY pgrst,
'reload';