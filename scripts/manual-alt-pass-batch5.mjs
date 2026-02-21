import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const updates = [
  { id: 150251, alt: "Production still from Boeing, Boeing at Stephens College in Columbia, scenic design by Brandon PT Davis." },
  { id: 150252, alt: "Scenic rendering from A Funny Thing Happened on the Way to the Forum at Lake Dillon Theatre, scenic design by Brandon PT Davis." },

  { id: 60, alt: "Production image from Bell, Book, and Candle at Okoboji Summer Theatre, scenic design by Brandon PT Davis." },
  { id: 61, alt: "Performance still from Bell, Book, and Candle with full scenic context, scenic design by Brandon PT Davis." },
  { id: 62, alt: "Stage image from Bell, Book, and Candle showing actor pathways through the set, scenic design by Brandon PT Davis." },
  { id: 63, alt: "Production still from Bell, Book, and Candle with practical scenic detail, scenic design by Brandon PT Davis." },
  { id: 64, alt: "Audience-view image from Bell, Book, and Candle at Okoboji, scenic design by Brandon PT Davis." },
  { id: 65, alt: "Concept rendering for Bell, Book, and Candle exploring scenic composition, scenic design by Brandon PT Davis." },

  { id: 68, alt: "Scenic rendering study for project 96246012 2A71 42D9 85E2 77E5D3BAFAAE 1 105d, scenic design by Brandon PT Davis." },
  { id: 69, alt: "Alternate scenic rendering angle for project 96246012 2A71 42D9 85E2 77E5D3BAFAAE 1 105d, scenic design by Brandon PT Davis." },
  { id: 70, alt: "Concept rendering pass for project 96246012 2A71 42D9 85E2 77E5D3BAFAAE 1 105d, scenic design by Brandon PT Davis." },

  { id: 107, alt: "Scenic rendering for Toyota Gold Cup Final 29 with event-scale composition, scenic design by Brandon PT Davis." },
  { id: 108, alt: "Rendering variation for Toyota Gold Cup Final 29 exploring layout and sightlines, scenic design by Brandon PT Davis." },
  { id: 109, alt: "Concept rendering view for Toyota Gold Cup Final 29, scenic design by Brandon PT Davis." },

  { id: 244, alt: "Production still from All My Sons at Stephens College in Columbia, scenic design by Brandon PT Davis." },
  { id: 245, alt: "Performance image from All My Sons with scenic architecture in full view, scenic design by Brandon PT Davis." },
  { id: 246, alt: "Stage picture from All My Sons showing cast placement through the set, scenic design by Brandon PT Davis." },
  { id: 247, alt: "Production still from All My Sons highlighting scenic depth and composition, scenic design by Brandon PT Davis." },
  { id: 248, alt: "Audience-view image from All My Sons at Stephens College, scenic design by Brandon PT Davis." },
  { id: 249, alt: "Performance still from All My Sons with complete scenic environment, scenic design by Brandon PT Davis." },
  { id: 250, alt: "Concept rendering from All My Sons exploring scenic massing and rhythm, scenic design by Brandon PT Davis." },

  { id: 284, alt: "Production still from Freaky Friday at Okoboji Summer Theatre, scenic design by Brandon PT Davis." },
  { id: 285, alt: "Performance image from Freaky Friday with the full set in view, scenic design by Brandon PT Davis." },
  { id: 286, alt: "Stage picture from Freaky Friday emphasizing actor flow and scenic layout, scenic design by Brandon PT Davis." },
  { id: 287, alt: "Production image from Freaky Friday with layered scenic zones, scenic design by Brandon PT Davis." },
  { id: 288, alt: "Audience-view still from Freaky Friday at Okoboji with complete scenic context, scenic design by Brandon PT Davis." },
  { id: 289, alt: "Performance still from Freaky Friday with cast framed by set architecture, scenic design by Brandon PT Davis." },
  { id: 290, alt: "Concept rendering from Freaky Friday exploring scenic proportion and pathways, scenic design by Brandon PT Davis." },
  { id: 291, alt: "Rendering variation for Freaky Friday showing scenic color and composition, scenic design by Brandon PT Davis." },
  { id: 292, alt: "Final rendering pass for Freaky Friday at Okoboji Summer Theatre, scenic design by Brandon PT Davis." },
];

async function run() {
  console.log(`Mode: ${apply ? "APPLY" : "DRY_RUN"}`);
  console.log(`Records: ${updates.length}`);

  if (!apply) {
    console.log(updates.slice(0, 5));
    return;
  }

  for (const item of updates) {
    const { error } = await supabase.from("project_images").update({ alt_text: item.alt }).eq("id", item.id);
    if (error) throw new Error(`Failed update ${item.id}: ${error.message}`);
  }

  console.log("Applied manual alt pass to batch 5 scenic images.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
