import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const hasText = (v) => typeof v === "string" && v.trim().length > 0;

const scenicAlt = (title) => `${title} scenic design by Brandon PT Davis`;
const renderingAlt = (title) => `${title} scenic design rendering by Brandon PT Davis`;
const experientialAlt = (title) => `${title} experiential design by Brandon PT Davis`;
const articleAlt = (title) => `${title} scenic design by Brandon PT Davis`;
const newsAlt = (title) => `${title} scenic design update by Brandon PT Davis`;

async function updateRow(table, idField, id, patch) {
  if (!apply) return;
  const { error } = await supabase.from(table).update(patch).eq(idField, id);
  if (error) throw new Error(`${table}#${id}: ${error.message}`);
}

async function run() {
  const summary = {
    mode: apply ? "APPLY" : "DRY_RUN",
    updated: {
      project_images: 0,
      rendering_project_images: 0,
      experiential_project_images: 0,
      rendering_gallery: 0,
      experiential_gallery: 0,
      news_cover_alt: 0,
      article_blocks: 0,
      news_blocks: 0,
    },
  };

  const { data: projects, error: projectsErr } = await supabase
    .from("projects")
    .select("id,title,discipline");
  if (projectsErr) throw projectsErr;
  const projectById = new Map((projects || []).map((p) => [p.id, p]));

  const { data: projectImages, error: projectImagesErr } = await supabase
    .from("project_images")
    .select("id,project_id,alt_text,image_url")
    .not("image_url", "is", null);
  if (projectImagesErr) throw projectImagesErr;

  for (const row of projectImages || []) {
    if (hasText(row.alt_text)) continue;
    const proj = projectById.get(row.project_id);
    const title = proj?.title || "Production";
    const discipline = proj?.discipline || "scenic_design";
    const nextAlt = discipline === "experiential_design" ? experientialAlt(title) : scenicAlt(title);
    await updateRow("project_images", "id", row.id, { alt_text: nextAlt });
    summary.updated.project_images++;
  }

  const { data: renderingProjects, error: renderingProjectsErr } = await supabase
    .from("rendering_projects")
    .select("id,title");
  if (renderingProjectsErr) throw renderingProjectsErr;
  const renderingById = new Map((renderingProjects || []).map((p) => [p.id, p]));

  const { data: renderingImages, error: renderingImagesErr } = await supabase
    .from("rendering_project_images")
    .select("id,rendering_project_id,alt_text,image_url")
    .not("image_url", "is", null);
  if (renderingImagesErr) throw renderingImagesErr;

  for (const row of renderingImages || []) {
    if (hasText(row.alt_text)) continue;
    const title = renderingById.get(row.rendering_project_id)?.title || "Rendering Project";
    await updateRow("rendering_project_images", "id", row.id, { alt_text: renderingAlt(title) });
    summary.updated.rendering_project_images++;
  }

  const { data: experientialProjects, error: experientialProjectsErr } = await supabase
    .from("experiential_projects")
    .select("id,title");
  if (experientialProjectsErr) throw experientialProjectsErr;
  const experientialById = new Map((experientialProjects || []).map((p) => [p.id, p]));

  const { data: experientialImages, error: experientialImagesErr } = await supabase
    .from("experiential_project_images")
    .select("id,experiential_project_id,alt_text,image_url")
    .not("image_url", "is", null);
  if (experientialImagesErr) throw experientialImagesErr;

  for (const row of experientialImages || []) {
    if (hasText(row.alt_text)) continue;
    const title = experientialById.get(row.experiential_project_id)?.title || "Experiential Project";
    await updateRow("experiential_project_images", "id", row.id, { alt_text: experientialAlt(title) });
    summary.updated.experiential_project_images++;
  }

  const { data: renderingGallery, error: renderingGalleryErr } = await supabase
    .from("rendering_gallery")
    .select("id,rendering_project_id,alt_text");
  if (renderingGalleryErr) throw renderingGalleryErr;

  for (const row of renderingGallery || []) {
    if (hasText(row.alt_text)) continue;
    const title = renderingById.get(row.rendering_project_id)?.title || "Rendering Project";
    await updateRow("rendering_gallery", "id", row.id, { alt_text: renderingAlt(title) });
    summary.updated.rendering_gallery++;
  }

  const { data: experientialGallery, error: experientialGalleryErr } = await supabase
    .from("experiential_gallery")
    .select("id,experiential_project_id,alt_text");
  if (experientialGalleryErr) throw experientialGalleryErr;

  for (const row of experientialGallery || []) {
    if (hasText(row.alt_text)) continue;
    const title = experientialById.get(row.experiential_project_id)?.title || "Experiential Project";
    await updateRow("experiential_gallery", "id", row.id, { alt_text: experientialAlt(title) });
    summary.updated.experiential_gallery++;
  }

  const { data: newsRows, error: newsErr } = await supabase
    .from("news")
    .select("id,title,cover_image,cover_image_alt_text,blocks,status");
  if (newsErr) throw newsErr;

  for (const row of newsRows || []) {
    if (row.cover_image && !hasText(row.cover_image_alt_text)) {
      await updateRow("news", "id", row.id, { cover_image_alt_text: newsAlt(row.title || "Production") });
      summary.updated.news_cover_alt++;
    }

    const blocks = Array.isArray(row.blocks) ? row.blocks : [];
    let changed = false;
    const nextBlocks = blocks.map((block) => {
      if (block?.type === "image" && block?.url && !hasText(block.alt)) {
        changed = true;
        return { ...block, alt: newsAlt(row.title || "Production") };
      }
      if (block?.type === "gallery" && Array.isArray(block.images)) {
        const images = block.images.map((img) => {
          if (img?.url && !hasText(img.alt)) {
            changed = true;
            return { ...img, alt: newsAlt(row.title || "Production") };
          }
          return img;
        });
        return { ...block, images };
      }
      return block;
    });
    if (changed) {
      await updateRow("news", "id", row.id, { blocks: nextBlocks });
      summary.updated.news_blocks++;
    }
  }

  const { data: articles, error: articlesErr } = await supabase
    .from("articles")
    .select("id,title,content,status");
  if (articlesErr) throw articlesErr;

  for (const row of articles || []) {
    let blocks = row.content;
    if (typeof blocks === "string") {
      try {
        blocks = JSON.parse(blocks);
      } catch {
        blocks = [];
      }
    }
    if (!Array.isArray(blocks)) continue;

    let changed = false;
    const nextBlocks = blocks.map((block) => {
      if (block?.type === "image" && block?.url && !hasText(block.alt)) {
        changed = true;
        return { ...block, alt: articleAlt(row.title || "Production") };
      }
      if (block?.type === "gallery" && Array.isArray(block.images)) {
        const images = block.images.map((img) => {
          if (img?.url && !hasText(img.alt)) {
            changed = true;
            return { ...img, alt: articleAlt(row.title || "Production") };
          }
          return img;
        });
        return { ...block, images };
      }
      return block;
    });

    if (changed) {
      await updateRow("articles", "id", row.id, { content: JSON.stringify(nextBlocks) });
      summary.updated.article_blocks++;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
