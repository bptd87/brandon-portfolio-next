import fs from 'fs';
import Database from 'better-sqlite3';

const db = new Database('./dev.db');

// Get the current article
const article = db.prepare(`
  SELECT id, slug, content 
  FROM articles 
  WHERE slug = 'lighting-styles-in-ai-models'
`).get();

if (!article) {
  console.log('Article not found');
  process.exit(1);
}

console.log('Found article:', article.slug);

// Parse the current content
const content = JSON.parse(article.content);
console.log('Current sections:', content.length);

// Find the section with FAQ content (contains "Q:" and "A:")
let faqSectionIndex = -1;
for (let i = 0; i < content.length; i++) {
  const section = content[i];
  if (section.type === 'html' && section.content && section.content.includes('Q:')) {
    faqSectionIndex = i;
    console.log(`Found FAQ section at index ${i}`);
    break;
  }
}

if (faqSectionIndex === -1) {
  console.log('FAQ section not found');
  process.exit(1);
}

// Extract the FAQ content
const faqSection = content[faqSectionIndex];
const htmlContent = faqSection.content;

// Parse the FAQ Q&A pairs
const tempDiv = htmlContent;
const qaRegex = /<p>Q:\s*([^<]+)<\/p>\s*<p>A:\s*([^<]+)<\/p>/g;
const faqItems = [];

let match;
while ((match = qaRegex.exec(htmlContent)) !== null) {
  faqItems.push({
    question: match[1].trim(),
    answer: match[2].trim()
  });
}

console.log(`Extracted ${faqItems.length} FAQ items`);

if (faqItems.length === 0) {
  console.log('No FAQ items found');
  process.exit(1);
}

// Find the FAQ heading
const faqHeadingMatch = htmlContent.match(/<h2[^>]*>.*?FAQ.*?<\/h2>/i);
let beforeFaqHtml = '';
if (faqHeadingMatch) {
  const faqHeadingIndex = htmlContent.indexOf(faqHeadingMatch[0]);
  beforeFaqHtml = htmlContent.substring(0, faqHeadingIndex).trim();
  console.log('Found FAQ heading, content before it:', beforeFaqHtml.length, 'chars');
}

// Create new content array
const newContent = [
  ...content.slice(0, faqSectionIndex),
];

// Add content before FAQ if it exists
if (beforeFaqHtml) {
  newContent.push({ type: 'html', content: beforeFaqHtml });
}

// Add FAQ section
newContent.push({
  type: 'faq',
  items: faqItems
});

console.log('New content sections:', newContent.length);
console.log('FAQ items in new content:', faqItems.length);

// Update the database
const updateStmt = db.prepare(`
  UPDATE articles 
  SET content = ? 
  WHERE id = ?
`);

updateStmt.run(JSON.stringify(newContent), article.id);

console.log('✅ Article updated successfully!');

db.close();
