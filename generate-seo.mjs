import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load env
const dotenv = require('dotenv');
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!DATABASE_URL || !FORGE_API_URL || !FORGE_API_KEY) {
  console.error('Missing env vars');
  process.exit(1);
}

const mysql = require('mysql2/promise');

async function invokeLLM(messages) {
  const res = await fetch(`${FORGE_API_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FORGE_API_KEY}`,
    },
    body: JSON.stringify({
      messages,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "seo_data",
          strict: true,
          schema: {
            type: "object",
            properties: {
              seoTitle: { type: "string", description: "SEO title, max 60 chars" },
              seoDescription: { type: "string", description: "SEO meta description, max 160 chars" },
              seoKeywords: { type: "string", description: "Comma-separated keywords, max 10" },
            },
            required: ["seoTitle", "seoDescription", "seoKeywords"],
            additionalProperties: false,
          },
        },
      },
    }),
  });
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);
  
  // Get all projects missing SEO
  const [projects] = await conn.execute(
    `SELECT id, title, discipline, excerpt, description, \`client\`, year, location, subcategory 
     FROM projects WHERE (seoDescription IS NULL OR seoDescription = '')`
  );
  
  console.log(`Found ${projects.length} projects missing SEO`);
  
  for (const project of projects) {
    try {
      const disciplineLabel = {
        scenic_design: 'Scenic Design',
        experiential_design: 'Experiential Design',
        rendering: 'Rendering',
        scenic_models: 'Scenic Models',
      }[project.discipline] || project.discipline;

      const seo = await invokeLLM([
        {
          role: "system",
          content: "You are an SEO specialist for a scenic designer's portfolio website. Generate concise, compelling SEO metadata. The designer is Brandon PT Davis, a professional scenic and experiential designer."
        },
        {
          role: "user",
          content: `Generate SEO metadata for this project:
Title: ${project.title}
Discipline: ${disciplineLabel}
Client: ${project.client || 'N/A'}
Year: ${project.year || 'N/A'}
Location: ${project.location || 'N/A'}
Category: ${project.subcategory || 'N/A'}
Excerpt: ${project.excerpt || 'N/A'}
Description: ${(project.description || '').substring(0, 300)}`
        }
      ]);

      await conn.execute(
        `UPDATE projects SET seoTitle = ?, seoDescription = ?, seoKeywords = ? WHERE id = ?`,
        [seo.seoTitle, seo.seoDescription, seo.seoKeywords, project.id]
      );
      
      console.log(`✓ ${project.title}: ${seo.seoTitle}`);
    } catch (err) {
      console.error(`✗ ${project.title}: ${err.message}`);
    }
  }

  // Get all news missing SEO
  const [news] = await conn.execute(
    `SELECT id, title, excerpt, source FROM news WHERE (seoDescription IS NULL OR seoDescription = '')`
  );
  
  console.log(`\nFound ${news.length} news items missing SEO`);
  
  for (const item of news) {
    try {
      const seo = await invokeLLM([
        {
          role: "system",
          content: "You are an SEO specialist for a scenic designer's portfolio website. Generate concise, compelling SEO metadata for news items. The designer is Brandon PT Davis."
        },
        {
          role: "user",
          content: `Generate SEO metadata for this news item:
Title: ${item.title}
Source: ${item.source || 'N/A'}
Excerpt: ${(item.excerpt || '').substring(0, 300)}`
        }
      ]);

      await conn.execute(
        `UPDATE news SET seoTitle = ?, seoDescription = ?, seoKeywords = ? WHERE id = ?`,
        [seo.seoTitle, seo.seoDescription, seo.seoKeywords, item.id]
      );
      
      console.log(`✓ ${item.title}: ${seo.seoTitle}`);
    } catch (err) {
      console.error(`✗ ${item.title}: ${err.message}`);
    }
  }

  await conn.end();
  console.log('\nSEO generation complete!');
}

main().catch(console.error);
