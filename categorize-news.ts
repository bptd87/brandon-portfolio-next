import { getDb } from "./server/db";
import { news, categories } from "./drizzle/schema";
import { eq } from "drizzle-orm";

async function categorizeNews() {
  const db = await getDb();
  if (!db) {
    console.error("❌ Failed to connect to database");
    process.exit(1);
  }
  
  // First, get the actual category IDs
  const newsCategories = await db.select().from(categories).where(eq(categories.type, "news"));
  
  console.log("News categories:", newsCategories);
  
  // Create a map of slug to ID
  const categoryMap: Record<string, number> = {};
  newsCategories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });
  
  console.log("\nCategory ID map:", categoryMap);
  
  // Now categorize articles
  const assignments = [
    // Production Debuts
    { slug: 'million-dollar-quartet-scr-debut', category: 'production-debuts' },
    { slug: 'my-season-as-scenic-designer-for-new-swan-shakespeare-festival-2025', category: 'production-debuts' },
    { slug: 'opening-night-romero-at-university-of-missouri', category: 'production-debuts' },
    { slug: 'scenic-design-for-parliament-square-california-premiere-at-uci', category: 'production-debuts' },
    { slug: 'scenic-design-for-loteria-game-on-at-theatre-silco', category: 'production-debuts' },
    { slug: 'scenic-design-for-lysistrata-at-utep-spring-2021', category: 'production-debuts' },
    
    // Collaborations
    { slug: 'assisting-the-play-that-goes-wrong', category: 'collaborations' },
    { slug: 'fifth-season-utah-shakespeare-festival', category: 'collaborations' },
    { slug: 'assisting-my-first-off-broadway-show-the-fears-april-may-2023', category: 'collaborations' },
    
    // Milestones
    { slug: '40-productions-at-okoboji-summer-theatre', category: 'milestones' },
    { slug: 'joining-united-scenic-artists-local-usa-829', category: 'milestones' },
    { slug: 'graduating-from-uci-in-the-middle-of-a-pandemic', category: 'milestones' },
    { slug: 'returning-to-stephens-college-as-assistant-professor-of-scenic-design', category: 'milestones' },
    { slug: 'new-role-at-utep-assistant-professor-of-scenic-design-technology', category: 'milestones' },
    { slug: 'heading-to-uc-irvine-for-my-mfa', category: 'milestones' },
    { slug: 'stephens-college-update-looking-ahead-to-spring-2022', category: 'milestones' },
    
    // Reviews & Press
    { slug: 'the-orange-curtain-review-praises-million-dollar-quartet-at-south-coast-repertory', category: 'reviews-press' },
    { slug: 'shut-up-sherlock-praised-in-slo-review', category: 'reviews-press' },
    { slug: 'guys-on-ice-receives-praise-in-slo-review', category: 'reviews-press' },
    { slug: 'company-at-uc-irvine-highlighted-in-stagescenela', category: 'reviews-press' },
    { slug: 'the-pajama-game-receives-praise-from-stagescenela', category: 'reviews-press' },
    { slug: 'american-idiot-at-uc-irvine-reviewed-in-the-show-report', category: 'reviews-press' },
    { slug: 'the-foreigner-praised-in-the-tribune', category: 'reviews-press' },
    { slug: 'freaky-friday-at-okoboji-summer-theatre-receives-praise', category: 'reviews-press' },
    { slug: 'forum-at-theatre-silco-featured-in-summit-daily', category: 'reviews-press' },
    
    // Opening Nights
    { slug: 'opening-night-deathtrap-at-okoboji-summer-theatre', category: 'opening-nights' },
    { slug: 'opening-night-how-to-succeed-in-business-without-really-trying-at-ost', category: 'opening-nights' },
    
    // Season Announcements
    { slug: 'returning-to-new-swan-theatre-festival-in-2026', category: 'season-announcements' },
    { slug: 'scenic-design-for-okoboji-summer-theatre-summer-2025-season', category: 'season-announcements' },
    { slug: '2024-okoboji-summer-theatre-season-scenic-designs-announced', category: 'season-announcements' },
  ];
  
  for (const assignment of assignments) {
    const categoryId = categoryMap[assignment.category];
    if (!categoryId) {
      console.error(`❌ Category not found: ${assignment.category}`);
      continue;
    }
    
    try {
      await db
        .update(news)
        .set({ categoryId })
        .where(eq(news.slug, assignment.slug));
      
      console.log(`✅ Updated ${assignment.slug} → ${assignment.category} (ID: ${categoryId})`);
    } catch (error) {
      console.error(`❌ Failed to update ${assignment.slug}:`, error);
    }
  }
  
  console.log("\n🎉 Categorization complete!");
  process.exit(0);
}

categorizeNews().catch((error) => {
  console.error("❌ Error categorizing news:", error);
  process.exit(1);
});
