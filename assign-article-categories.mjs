import Database from 'better-sqlite3';

const db = new Database('./dev.db');

// First, check what categories exist
console.log('\n=== Existing Categories ===');
const categories = db.prepare('SELECT * FROM categories').all();
console.log(categories);

// Check current article category assignments
console.log('\n=== Current Article Categories ===');
const articles = db.prepare('SELECT id, title, categoryId FROM articles ORDER BY id').all();
articles.forEach(article => {
  console.log(`${article.id}: "${article.title}" -> categoryId: ${article.categoryId}`);
});

// Count articles without categories
const uncategorized = articles.filter(a => !a.categoryId);
console.log(`\n${uncategorized.length} articles without categories`);

// Assign categories based on article titles and content
// Design Process = 1, Technology = 2, History = 3, etc.
const categoryAssignments = {
  // Technology articles
  'computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care': 2,
  'empowering-theatre-production-students-with-computer-literacy': 2,
  'sora-in-the-studio-testing-ais-potential-for-theatrical-design': 2,
  'lighting-styles-in-ai-models-how-lighting-changes-everything': 2,
  'video-game-environments': 2,
  
  // Design Process articles
  'navigating-the-scenic-design-process-a-comprehensive-guide': 1,
  'the-art-of-presenting-theatre-design-a-guide-for-designers': 1,
  'artistic-vision-in-scenic-design-finding-my-creative-voice': 1,
  'what-makes-a-good-scenic-design-rendering': 1,
  'you-re-wasting-my-time-a-scenic-design-lesson-in-growth-and-revision': 1,
  'becoming-a-scenic-designer': 1,
  'the-modern-theatrical-design-portfolio-a-guide-for-2026': 1,
  'online-portfolio-theatrical-design-2026': 1,
  
  // History articles
  'the-golden-age-of-broadway-a-defining-era-in-musical-theatre': 3,
  'opera-s-foundations-the-first-act-in-american-entertainment': 3,
  'the-evolution-of-themed-entertainment-from-ancient-gardens-to-modern-immersive-experienceses-everything': 3,
  'the-1960s-musical-revolution-when-hollywood-s-golden-formula-met-rock-and-rebellion': 3,
  'the-golden-age-of-cinema-musicals-in-the-spotlight': 3,
  'the-lights-were-already-on-maude-adams-legacy-at-stephens-college': 3,
  
  // Project Case Studies (if category exists, otherwise Design Process)
  'designing-the-keller-home-a-look-back-at-all-my-sons': 1,
  'framing-the-martyr-scenic-design-as-memory-work-in-romero': 1,
  'building-the-visual-world-art-direction-in-film-television': 1,
  'minimalist-scenic-design-dominating-regional-theatres-in-2025': 1,
  'urinetown-scenic-design-building-a-dystopia-that-feels-uncomfortably-familiar': 1,
};

// Update articles with category assignments
console.log('\n=== Assigning Categories ===');
const updateStmt = db.prepare('UPDATE articles SET categoryId = ? WHERE slug = ?');

Object.entries(categoryAssignments).forEach(([slug, categoryId]) => {
  try {
    const result = updateStmt.run(categoryId, slug);
    if (result.changes > 0) {
      console.log(`✓ Assigned category ${categoryId} to: ${slug}`);
    } else {
      console.log(`✗ No article found with slug: ${slug}`);
    }
  } catch (error) {
    console.error(`Error assigning category to ${slug}:`, error.message);
  }
});

// Check final state
console.log('\n=== Final Article Categories ===');
const finalArticles = db.prepare('SELECT id, title, categoryId FROM articles ORDER BY categoryId, id').all();
finalArticles.forEach(article => {
  const category = categories.find(c => c.id === article.categoryId);
  console.log(`${article.id}: "${article.title}" -> ${category ? category.name : 'UNCATEGORIZED'}`);
});

db.close();
console.log('\n✓ Category assignment complete!');
