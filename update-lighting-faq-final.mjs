import Database from 'better-sqlite3';

const db = Database('./dev.db');

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

// Find the section with FAQ content
let faqSectionIndex = -1;
for (let i = 0; i < content.length; i++) {
  const section = content[i];
  if (section.type === 'html' && section.content && section.content.includes('FAQs About Lighting in AI Art Generation')) {
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

// Find where the FAQ heading starts
const faqHeadingMatch = htmlContent.match(/<h2[^>]*>FAQs About Lighting in AI Art Generation<\/h2>/);
if (!faqHeadingMatch) {
  console.log('FAQ heading not found');
  process.exit(1);
}

const faqHeadingIndex = htmlContent.indexOf(faqHeadingMatch[0]);
const beforeFaqHtml = htmlContent.substring(0, faqHeadingIndex).trim();
console.log('Content before FAQ:', beforeFaqHtml.length, 'chars');

// Create FAQ items
const faqItems = [
  {
    question: "How do lighting prompts differ between Sora and Midjourney?",
    answer: "Sora tends to respond well to cinematic language and detailed descriptions of light quality, while Midjourney often works best with concise technical terms and artistic references. Sora can process longer, more narrative prompts about lighting effects, whereas Midjourney generally prefers specific style tags."
  },
  {
    question: "Can AI-generated lighting replace traditional lighting design?",
    answer: "No, AI-generated lighting is a visualization tool rather than a replacement for professional lighting design. It helps in conceptualizing and communicating ideas but doesn't account for the technical limitations and opportunities of real-world lighting equipment."
  },
  {
    question: "How important is lighting terminology in AI prompts?",
    answer: "Very important. Using specific lighting terminology (like \"high-key,\" \"volumetric,\" or \"diffused\") yields much more consistent results than vague descriptions. Learning the vocabulary of lighting design significantly improves AI outputs."
  },
  {
    question: "Can I combine multiple lighting styles in one AI prompt?",
    answer: "Yes, but with limitations. Combining complementary styles (like \"golden hour with volumetric light\") often works well, but contradictory lighting (like \"bright high-key\" and \"dark low-key\") can confuse the AI and produce inconsistent results."
  },
  {
    question: "How has the language of lighting evolved in AI art generation?",
    answer: "The terminology has become more sophisticated as AI models have advanced. Early models responded primarily to basic terms like \"dark\" or \"bright,\" while newer models like Sora understand nuanced concepts like \"practicals,\" \"motivated lighting,\" and \"rim light\" that come from cinematography and stage lighting."
  },
  {
    question: "What's the best way to structure a lighting prompt for consistent results?",
    answer: "Place the lighting description at the end of your prompt, after establishing the scene details. This helps the AI prioritize the lighting style over other elements in the scene, creating more consistent and intentional results."
  },
  {
    question: "Can LLMs like ChatGPT help improve my lighting prompts?",
    answer: "Absolutely. LLMs can help translate your creative vision into technical prompt language, suggesting specific lighting terms that might enhance your concept. They can also help troubleshoot why certain prompts aren't yielding the results you want."
  }
];

console.log(`Created ${faqItems.length} FAQ items`);

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

// Update the database
const updateStmt = db.prepare(`
  UPDATE articles 
  SET content = ? 
  WHERE id = ?
`);

updateStmt.run(JSON.stringify(newContent), article.id);

console.log('✅ Article updated successfully!');
console.log('FAQ accordion structure created with', faqItems.length, 'items');

db.close();
