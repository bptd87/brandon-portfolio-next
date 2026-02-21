import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const hasText = (v) => typeof v === "string" && v.trim().length > 0;

function cleanText(v) {
  return String(v || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trimSentence(v, max = 150) {
  const text = cleanText(v);
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function captionToSentence(caption, title = "") {
  const c = cleanText(caption);
  if (!c) return "";
  const low = c.toLowerCase();
  const titleLow = cleanText(title).toLowerCase();
  const normalizeLoose = (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const cLoose = normalizeLoose(c);
  const tLoose = normalizeLoose(titleLow);
  if (["image", "photo", "production image", "scenic design image", "no caption"].includes(low)) return "";
  if (titleLow && (low === titleLow || low === `"${titleLow}"` || low === `'${titleLow}'`)) return "";
  if (tLoose && cLoose === tLoose) return "";
  return c.endsWith(".") ? c : `${c}.`;
}

function baseAlt({ title, imageType, venue, location }) {
  const show = title || "the production";
  const place = venue ? ` at ${venue}` : location ? ` in ${location}` : "";
  switch ((imageType || "").toLowerCase()) {
    case "rendering":
      return `Scenic rendering for ${show}${place}.`;
    case "video":
      return `Video thumbnail for ${show}${place}.`;
    case "production":
    default:
      return `Stage production photo of scenic design for ${show}${place}.`;
  }
}

function makeAlt({ title, imageType, venue, location, caption, index }) {
  const base = baseAlt({ title, imageType, venue, location });
  const cap = captionToSentence(caption, title);
  const combined = cap ? `${base} ${cap}` : base;
  const withIndex = !cap && Number.isFinite(index) ? `${combined} View ${index + 1}.` : combined;
  return trimSentence(withIndex, 170);
}

async function run() {
  const summary = {
    mode: apply ? "APPLY" : "DRY_RUN",
    updated: {
      project_images: 0,
      rendering_project_images: 0,
      rendering_gallery: 0,
    },
  };

  const { data: projects, error: projectsErr } = await supabase
    .from("projects")
    .select("id,title,discipline,client,location");
  if (projectsErr) throw projectsErr;

  const projectById = new Map((projects || []).map((p) => [p.id, p]));

  const { data: projectImages, error: projectImagesErr } = await supabase
    .from("project_images")
    .select("id,project_id,image_url,image_type,caption,alt_text,sort_order")
    .not("image_url", "is", null)
    .order("project_id", { ascending: true })
    .order("sort_order", { ascending: true });
  if (projectImagesErr) throw projectImagesErr;

  const projectImageCounter = new Map();
  for (const row of projectImages || []) {
    const project = projectById.get(row.project_id);
    if (!project) continue;

    // Only enforce scenic-focused language on scenic and rendering disciplines.
    const isScenicDiscipline =
      project.discipline === "scenic_design" || project.discipline === "rendering" || project.discipline === null;
    if (!isScenicDiscipline) continue;

    const currentCount = projectImageCounter.get(row.project_id) || 0;
    projectImageCounter.set(row.project_id, currentCount + 1);

    const nextAlt = makeAlt({
      title: project.title,
      imageType: row.image_type,
      venue: project.client && cleanText(project.client) !== cleanText(project.title) ? project.client : "",
      location: project.location,
      caption: row.caption,
      index: currentCount,
    });

    if (!hasText(nextAlt) || row.alt_text === nextAlt) continue;
    if (apply) {
      const { error } = await supabase.from("project_images").update({ alt_text: nextAlt }).eq("id", row.id);
      if (error) throw new Error(`project_images#${row.id}: ${error.message}`);
    }
    summary.updated.project_images++;
  }

  const { data: renderingProjects, error: renderingProjectsErr } = await supabase
    .from("rendering_projects")
    .select("id,title,client,location");
  if (renderingProjectsErr) throw renderingProjectsErr;
  const renderingById = new Map((renderingProjects || []).map((p) => [p.id, p]));

  const { data: renderingImages, error: renderingImagesErr } = await supabase
    .from("rendering_project_images")
    .select("id,rendering_project_id,image_url,caption,alt_text,sort_order")
    .not("image_url", "is", null)
    .order("rendering_project_id", { ascending: true })
    .order("sort_order", { ascending: true });
  if (renderingImagesErr) throw renderingImagesErr;

  const renderingImageCounter = new Map();
  for (const row of renderingImages || []) {
    const project = renderingById.get(row.rendering_project_id);
    if (!project) continue;
    const currentCount = renderingImageCounter.get(row.rendering_project_id) || 0;
    renderingImageCounter.set(row.rendering_project_id, currentCount + 1);
    const nextAlt = makeAlt({
      title: project.title,
      imageType: "rendering",
      venue: project.client && cleanText(project.client) !== cleanText(project.title) ? project.client : "",
      location: project.location,
      caption: row.caption,
      index: currentCount,
    });
    if (!hasText(nextAlt) || row.alt_text === nextAlt) continue;
    if (apply) {
      const { error } = await supabase
        .from("rendering_project_images")
        .update({ alt_text: nextAlt })
        .eq("id", row.id);
      if (error) throw new Error(`rendering_project_images#${row.id}: ${error.message}`);
    }
    summary.updated.rendering_project_images++;
  }

  const { data: renderingGallery, error: renderingGalleryErr } = await supabase
    .from("rendering_gallery")
    .select("id,rendering_project_id,display_title,description,alt_text");
  if (renderingGalleryErr) throw renderingGalleryErr;

  for (const row of renderingGallery || []) {
    const project = renderingById.get(row.rendering_project_id);
    if (!project) continue;
    const caption = cleanText(row.display_title || row.description || "");
    const nextAlt = makeAlt({
      title: project.title,
      imageType: "rendering",
      venue: project.client && cleanText(project.client) !== cleanText(project.title) ? project.client : "",
      location: project.location,
      caption,
      index: 0,
    });
    if (!hasText(nextAlt) || row.alt_text === nextAlt) continue;
    if (apply) {
      const { error } = await supabase.from("rendering_gallery").update({ alt_text: nextAlt }).eq("id", row.id);
      if (error) throw new Error(`rendering_gallery#${row.id}: ${error.message}`);
    }
    summary.updated.rendering_gallery++;
  }

  console.log(JSON.stringify(summary, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
