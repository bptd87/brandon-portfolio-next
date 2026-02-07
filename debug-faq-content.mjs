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
      if (section.type === 'html' && section.content && section.content.toLowerCase().includes('faq')) {
        console.log(`\n--- Section ${index} (type: ${section.type}) ---`);
        console.log('First 2000 chars:');
        console.log(section.content.substring(0, 2000));
        console.log('\n... checking for Q: pattern ...');
        const hasQ = section.content.includes('Q:');
        console.log('Contains Q:?', hasQ);
        if (hasQ) {
          // Show the exact HTML around the first Q:
          const qIndex = section.content.indexOf('Q:');
          console.log('\nHTML around first Q: (200 chars before and after):');
          console.log(section.content.substring(Math.max(0, qIndex - 200), qIndex + 400));
        }
      }
    });
  } catch (e) {
    console.log('Error parsing content:', e.message);
  }
} else {
  console.log('Article not found');
}

db.close();
