import { getAllArticles } from './server/db.js';

const articles = await getAllArticles();

console.log('\n=== Article Cover Images ===\n');
articles.forEach((article, index) => {
  console.log(`${index + 1}. ${article.title}`);
  console.log(`   Slug: ${article.slug}`);
  console.log(`   Cover: ${article.coverImageUrl || 'NULL'}`);
  console.log('');
});

// Check for duplicates
const urlCounts: Record<string, number> = {};
articles.forEach(article => {
  if (article.coverImageUrl) {
    urlCounts[article.coverImageUrl] = (urlCounts[article.coverImageUrl] || 0) + 1;
  }
});

console.log('\n=== Duplicate Cover Images ===\n');
let foundDuplicates = false;
Object.entries(urlCounts).forEach(([url, count]) => {
  if (count > 1) {
    foundDuplicates = true;
    console.log(`${count} articles using: ${url}`);
    const dupes = articles.filter(a => a.coverImageUrl === url);
    dupes.forEach(d => console.log(`  - ${d.title}`));
    console.log('');
  }
});

if (!foundDuplicates) {
  console.log('No duplicate cover images found.');
}

// Check for missing cover images
console.log('\n=== Missing Cover Images ===\n');
const missing = articles.filter(a => !a.coverImageUrl);
if (missing.length > 0) {
  missing.forEach(article => {
    console.log(`- ${article.title} (${article.slug})`);
  });
} else {
  console.log('All articles have cover images.');
}

process.exit(0);
