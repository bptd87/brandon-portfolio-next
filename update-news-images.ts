import { getDb } from "./server/db";
import { news } from "./drizzle/schema";
import { eq } from "drizzle-orm";

const imageUrls = {
  "million-dollar-quartet-scr-debut": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/pOtllUHbMSKjInbH.jpg",
  "assisting-the-play-that-goes-wrong": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/JwePmolmRzgieJpB.jpg",
  "fifth-season-utah-shakespeare-festival": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/JqtQtRNJCNeNogNY.jpg",
  "40-productions-at-okoboji-summer-theatre": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/VdzeUUFSZsbCQGuM.jpg",
};

async function updateNewsImages() {
  const db = getDb();
  
  for (const [slug, coverImageUrl] of Object.entries(imageUrls)) {
    await db
      .update(news)
      .set({ coverImageUrl })
      .where(eq(news.slug, slug));
    
    console.log(`✅ Updated ${slug} with cover image`);
  }
  
  console.log("\n🎉 All news articles updated with cover images!");
  process.exit(0);
}

updateNewsImages().catch((error) => {
  console.error("❌ Error updating news images:", error);
  process.exit(1);
});
