import { readFileSync } from 'fs';

// Load data
const articles = JSON.parse(readFileSync('/home/ubuntu/supabase_news_all.json', 'utf8'));
const imageMap = JSON.parse(readFileSync('/tmp/news_image_map.json', 'utf8'));

// Category mapping
const categoryMap = {
  'Project Launch': 1,
  'Publication': 2,
  'Career Milestone': 3,
  'Collaboration': 4,
  'Project Update': 5,
  'Assistant Scenic Design': 4,
  'Life Updates': 6,
  'Publication/Feature': 2
};

function blocksToJson(content) {
  if (!content) return [];
  if (typeof content === 'string') return [{ type: 'text', content }];
  
  const blocks = [];
  for (const block of content) {
    if (block.type === 'paragraph' && block.content) {
      const cleaned = block.content.replace(/\u00a0/g, ' ');
      blocks.push({ type: 'text', content: cleaned });
    }
  }
  return blocks;
}

// Generate SQL statements
const statements = [];

for (let idx = 0; idx < articles.length; idx++) {
  const article = articles[idx];
  const slug = article.slug;
  const title = article.title.replace(/'/g, "''");
  const excerpt = article.excerpt.replace(/'/g, "''");
  
  const blocks = blocksToJson(article.content);
  const blocksJson = JSON.stringify(blocks).replace(/'/g, "''").replace(/\\/g, '\\\\');
  
  const coverUrl = imageMap[slug] || null;
  const catId = categoryMap[article.category] || 1;
  const dateStr = article.date ? article.date.split('T')[0] : null;
  const link = article.link || null;
  const location = article.location || null;
  const tags = article.tags || [];
  const tagsStr = tags.slice(0, 5).join(', ') || null;
  const featured = idx === 0 ? 1 : 0;
  
  const sql = `INSERT INTO news (slug, title, excerpt, blocks, coverImageUrl, categoryId, date, externalLink, location, tags, featured, status, createdAt, updatedAt, publishedAt)
VALUES ('${slug}', '${title}', '${excerpt}', '${blocksJson}', ${coverUrl ? `'${coverUrl}'` : 'NULL'}, ${catId}, ${dateStr ? `'${dateStr}'` : 'NULL'}, ${link ? `'${link}'` : 'NULL'}, ${location ? `'${location.replace(/'/g, "''")}'` : 'NULL'}, ${tagsStr ? `'${tagsStr.replace(/'/g, "''")}'` : 'NULL'}, ${featured}, 'published', NOW(), NOW(), ${dateStr ? `'${dateStr}'` : 'NULL'});`;
  
  statements.push(sql);
}

// Write to file
import { writeFileSync } from 'fs';
writeFileSync('/tmp/news_insert_statements.sql', statements.join('\n\n'));

console.log(`Generated ${statements.length} INSERT statements`);
console.log('Saved to /tmp/news_insert_statements.sql');
console.log(`\nFirst 3 articles to insert:`);
for (let i = 0; i < Math.min(3, articles.length); i++) {
  console.log(`  ${i+1}. ${articles[i].title}`);
}
