import { drizzle } from "drizzle-orm/mysql2";
import { news, categories } from "./drizzle/schema.js";
import { eq } from "drizzle-orm";
import "dotenv/config";

const db = drizzle(process.env.DATABASE_URL);

async function addNewsArticle() {
  try {
    // Find "Project Launch" category
    const [projectLaunchCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.name, "Project Launch"))
      .limit(1);

    if (!projectLaunchCategory) {
      console.error("Project Launch category not found. Creating it...");
      const [newCategory] = await db.insert(categories).values({
        name: "Project Launch",
        slug: "project-launch",
        description: "New project announcements and launches",
      });
      console.log("Created Project Launch category");
    }

    const categoryId = projectLaunchCategory?.id;

    // Create news article
    const slug = "returning-to-new-swan-theatre-festival-2026";
    
    const newsData = {
      title: "Returning to New Swan Theatre Festival in 2026",
      slug,
      excerpt: "Scenic designer Brandon PT Davis returns to the New Swan Shakespeare Festival for the 2026 season, bringing his narrative-driven design approach to a repertory lineup spanning two distinct American eras.",
      coverImageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/FlARIIXPqvRDxDht.webp",
      categoryId,
      location: "New Swan Theatre Festival",
      date: new Date("2025-11-28"),
      publishedAt: new Date("2025-11-28"),
      blocks: [
        {
          type: "text",
          content: "Scenic designer Brandon PT Davis returns to the New Swan Shakespeare Festival for the 2026 season, bringing his narrative-driven design approach to a repertory lineup spanning two distinct American eras. Davis will design the scenery for both The Merry Wives of Windsor Cove, a musical reimagining set in a rock-and-roll 1950s Southern California surf town, and a stark, Dust Bowl–era staging of Romeo and Juliet."
        },
        {
          type: "text",
          content: "Running July 7 through August 30, the season challenges Davis to create a single architectural gesture capable of transforming from a sun-drenched beach party into a landscape of scarcity and survival, all within the intimacy of the festival's 130-seat mini-Elizabethan theatre. Building on his previous collaborations with New Swan, Davis's designs will support the distinct directorial visions of Eli Simon and Rachael VanWormer, grounding the alternating productions in their specific historical contexts."
        },
        {
          type: "text",
          content: "Merry Wives will embrace the color and energy of mid-century surf culture, while Romeo and Juliet strips the stage back to reflect the harsh realities of the Great Depression. Tickets for the 2026 season go on sale in April, with Davis's transformative scenery providing the visual foundation for a summer of comedy, tragedy, and live music under the stars."
        },
        {
          type: "link",
          url: "https://newswanshakespeare.com/",
          label: "Visit New Swan Shakespeare Festival"
        }
      ],
    };

    await db.insert(news).values(newsData);
    
    console.log("✅ News article created successfully!");
    console.log(`   Title: ${newsData.title}`);
    console.log(`   Slug: ${newsData.slug}`);
    console.log(`   URL: /news/${newsData.slug}`);
    
  } catch (error) {
    console.error("Error creating news article:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

addNewsArticle();
