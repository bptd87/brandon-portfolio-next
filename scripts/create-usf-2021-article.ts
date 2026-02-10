import { getDb } from "../server/db.ts";

const db = getDb();

const slug = "utah-shakespeare-festival-2021-season";
const title = "Assistant Scenic Designer: Utah Shakespeare Festival 2021 Season";
const excerpt = "Supporting Jo Winiarski's scenic designs for The Pirates of Penzance and Ragtime during an on-site summer season in Cedar City, Utah.";

const coverImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/GylqmxfQkYVLmWgD.jpg"; // Pirates of Penzance

const blocks = [
  {
    type: "text",
    content: "The 2021 season at Utah Shakespeare Festival marked my first summer working on-site in Cedar City, Utah, providing drafting and technical support for scenic designer Jo Winiarski. This season included two major musical productions: Gilbert and Sullivan's *The Pirates of Penzance* and the powerful American musical *Ragtime*."
  },
  {
    type: "header",
    content: "The Productions"
  },
  {
    type: "text",
    content: "**The Pirates of Penzance** brought Gilbert and Sullivan's beloved comic opera to life with a vibrant, nautical-themed scenic design featuring a turquoise ship deck and dynamic playing spaces. The production ran June 25 - October 9, 2021 in the Randall L. Jones Theatre.\\n\\n**Ragtime** presented a more complex scenic challenge, depicting early 20th-century America through a multi-level set design that allowed for fluid transitions between the interwoven stories of three families. The production showcased Jo Winiarski's ability to create evocative period environments that served the emotional arc of this sweeping musical."
  },
  {
    type: "image",
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/cYgONREtTaoPNIbQ.jpg",
    caption: "Ragtime at Utah Shakespeare Festival, 2021. Scenic design by Jo Winiarski. Photo by Karl Hugh, courtesy Utah Shakespeare Festival."
  },
  {
    type: "header",
    content: "On-Site Technical Process"
  },
  {
    type: "text",
    content: "Working on-site at the Festival provided invaluable experience in the technical rehearsal and load-in process. Being present in Cedar City allowed for real-time problem-solving during the build and installation of these complex scenic designs, and direct collaboration with the Festival's skilled technical staff as the productions moved from drafting to realized stagecraft."
  },
  {
    type: "header",
    content: "About Utah Shakespeare Festival"
  },
  {
    type: "text",
    content: "The Utah Shakespeare Festival in Cedar City is one of the nation's premier regional theatre companies, recipient of the Tony Award for Outstanding Regional Theatre. The Festival produces eight plays each summer in rotating repertory across three theatres, combining Shakespeare's works with classic and contemporary plays and musicals."
  },
  {
    type: "link",
    text: "Visit Utah Shakespeare Festival",
    url: "https://www.bard.org"
  }
];

async function main() {
  const categoryResult = await db.execute(
    "SELECT id FROM categories WHERE name = 'Assistant Scenic Design' LIMIT 1"
  );
  
  let categoryId;
  if (categoryResult.rows.length === 0) {
    const insertResult = await db.execute(
      "INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)",
      [90002, "Assistant Scenic Design", "assistant-scenic-design", "Productions where Brandon provided drafting and technical support as assistant scenic designer"]
    );
    categoryId = 90002;
  } else {
    categoryId = categoryResult.rows[0].id;
  }

  // Check if article already exists
  const existing = await db.execute(
    "SELECT id FROM news WHERE slug = ? LIMIT 1",
    [slug]
  );

  if (existing.rows.length > 0) {
    // Update existing
    await db.execute(
      "UPDATE news SET title = ?, excerpt = ?, coverImageUrl = ?, blocks = ?, categoryId = ?, publishedAt = ? WHERE slug = ?",
      [title, excerpt, coverImage, JSON.stringify(blocks), categoryId, new Date("2021-10-09").toISOString(), slug]
    );
    console.log("✓ Updated existing article:", title);
  } else {
    // Create new
    await db.execute(
      "INSERT INTO news (slug, title, excerpt, coverImageUrl, blocks, categoryId, publishedAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [slug, title, excerpt, coverImage, JSON.stringify(blocks), categoryId, new Date("2021-10-09").toISOString(), new Date().toISOString()]
    );
    console.log("✓ Created new article:", title);
  }
}

main().catch(console.error);
