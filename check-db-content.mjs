import Database from 'better-sqlite3';

const db = new Database('./dev.db');

const article = db.prepare(`
  SELECT id, title, content 
  FROM articles 
  WHERE slug = 'lighting-styles-in-ai-models'
`).get();

if (article) {
  console.log('Article found:', article.title);
  
  try {
    const content = JSON.parse(article.content);
    console.log('\n=== Content sections:', content.length);
    
    // Find sections containing FAQ
    content.forEach((section, index) => {
      const sectionContent = section.content || '';
      if (sectionContent.toLowerCase().includes('faq')) {
        console.log(`\n--- Section ${index} (type: ${section.type}) ---`);
        console.log('Content length:', sectionContent.length);
        console.log('First 1000 chars:');
        console.log(sectionContent.substring(0, 1000));
      }
    });
    
    // Check the last few sections (FAQ is usually at the end)
    console.log('\n=== Last 3 sections ===');
    const lastSections = content.slice(-3);
    lastSections.forEach((section, index) => {
      console.log(`\nSection ${content.length - 3 + index} (type: ${section.type}):`, 
        (section.content || '').substring(0, 200));
    });
  } catch (e) {
    console.log('Error parsing content:', e.message);
  }
} else {
  console.log('Article not found');
}

db.close();
