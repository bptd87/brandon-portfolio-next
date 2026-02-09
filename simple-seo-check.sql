SELECT 
  title,
  discipline,
  CASE 
    WHEN seoKeywords IS NULL THEN 0
    ELSE LENGTH(seoKeywords) - LENGTH(REPLACE(seoKeywords, ',', '')) + 1 
  END as keyword_count,
  CASE 
    WHEN excerpt IS NULL THEN 0
    ELSE LENGTH(excerpt)
  END as desc_length
FROM projects 
WHERE status = 'published'
AND (
  (seoKeywords IS NOT NULL AND LENGTH(seoKeywords) - LENGTH(REPLACE(seoKeywords, ',', '')) + 1 > 8)
  OR (excerpt IS NOT NULL AND (LENGTH(excerpt) < 50 OR LENGTH(excerpt) > 160))
  OR excerpt IS NULL
  OR seoKeywords IS NULL
)
ORDER BY discipline, title
LIMIT 20;
