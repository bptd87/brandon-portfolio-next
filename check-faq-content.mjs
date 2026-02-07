import Database from 'better-sqlite3';

const db = new Database('./dev.db');

const article = db.prepare(`
  SELECT id, title, content 
  FROM articles 
  WHERE slug = 'lighting-styles-in-ai-models'
`).get();

if (article) {
  console.log('Article found:', article.title);
  console.log('\n=== Content Structure ===');
  
  try {
    const content = JSON.parse(article.content);
    console.log('Content is JSON array with', content.length, 'sections');
    
    // Find FAQ-related sections
    content.forEach((section, index) => {
      if (section.type === 'html' && section.content && section.content.toLowerCase().includes('faq')) {
        console.log(`\n--- Section ${index} (type: ${section.type}) ---`);
        console.log(section.content.substring(0, 1000));
      }
      if (section.type === 'html' && section.content && section.content.includes('Q:')) {
        console.log(`\n--- Section ${index} with Q: pattern (type: ${section.type}) ---`);
        console.log(section.content.substring(0, 2000));
      }
    });
  } catch (e) {
    console.log('Content is not JSON, showing raw content:');
    console.log(article.content.substring(0, 1000));
  }
} else {
  console.log('Article not found');
}

db.close();
