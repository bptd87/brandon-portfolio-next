import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const scenicAlt = (title) => `${title} scenic design by Brandon PT Davis`;
const renderingAlt = (title) => `${title} scenic design rendering by Brandon PT Davis`;

async function run() {
  const summary = {
    mode: apply ? "APPLY" : "DRY_RUN",
    normalized: {
      scenic_project_images: 0,
      rendering_project_images: 0,
    },
  };

  const { data: projects, error: projectsErr } = await supabase
    .from("projects")
    .select("id,title,discipline");
  if (projectsErr) throw projectsErr;

  const scenicProjects = (projects || []).filter(
    (p) => p.discipline === "scenic_design" || p.discipline === "rendering" || p.discipline === null
  );
  const scenicIds = scenicProjects.map((p) => p.id);
  const scenicTitleById = new Map(scenicProjects.map((p) => [p.id, p.title || "Production"]));

  if (scenicIds.length > 0) {
    const { data: images, error: imagesErr } = await supabase
      .from("project_images")
      .select("id,project_id,alt_text,image_url")
      .in("project_id", scenicIds)
      .not("image_url", "is", null);
    if (imagesErr) throw imagesErr;

    for (const row of images || []) {
      const nextAlt = scenicAlt(scenicTitleById.get(row.project_id) || "Production");
      if (row.alt_text === nextAlt) continue;
      if (apply) {
        const { error } = await supabase.from("project_images").update({ alt_text: nextAlt }).eq("id", row.id);
        if (error) throw new Error(`project_images#${row.id}: ${error.message}`);
      }
      summary.normalized.scenic_project_images++;
    }
  }

  const { data: renderingProjects, error: renderingProjectsErr } = await supabase
    .from("rendering_projects")
    .select("id,title");
  if (renderingProjectsErr) throw renderingProjectsErr;
  const renderingTitleById = new Map((renderingProjects || []).map((p) => [p.id, p.title || "Rendering Project"]));

  const { data: renderingImages, error: renderingImagesErr } = await supabase
    .from("rendering_project_images")
    .select("id,rendering_project_id,alt_text,image_url")
    .not("image_url", "is", null);
  if (renderingImagesErr) throw renderingImagesErr;

  for (const row of renderingImages || []) {
    const nextAlt = renderingAlt(renderingTitleById.get(row.rendering_project_id) || "Rendering Project");
    if (row.alt_text === nextAlt) continue;
    if (apply) {
      const { error } = await supabase
        .from("rendering_project_images")
        .update({ alt_text: nextAlt })
        .eq("id", row.id);
      if (error) throw new Error(`rendering_project_images#${row.id}: ${error.message}`);
    }
    summary.normalized.rendering_project_images++;
  }

  console.log(JSON.stringify(summary, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
