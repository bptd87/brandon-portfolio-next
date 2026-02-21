import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const updates = [
  { id: 202, alt: "Wide stage view of the courtyard-inspired set for Much Ado About Nothing at New Swan Theatre Festival in Irvine, scenic design by Brandon PT Davis." },
  { id: 200, alt: "Actors crossing the multi-level wooden platform set in Much Ado About Nothing, scenic design by Brandon PT Davis." },
  { id: 204, alt: "Night-lit stage composition showing arches and playing levels in Much Ado About Nothing, scenic design by Brandon PT Davis." },
  { id: 201, alt: "Scene transition on the open-air Shakespearean set for Much Ado About Nothing at New Swan, scenic design by Brandon PT Davis." },
  { id: 203, alt: "Ensemble stage picture framed by the rustic architecture of Much Ado About Nothing, scenic design by Brandon PT Davis." },

  { id: 94, alt: "Performance moment on the Sun Records-inspired set for Million Dollar Quartet at South Coast Repertory, scenic design by Brandon PT Davis." },
  { id: 92, alt: "Concept rendering of the period recording studio environment for Million Dollar Quartet, scenic design by Brandon PT Davis." },
  { id: 98, alt: "Band-centered stage composition with warm practical lighting in Million Dollar Quartet, scenic design by Brandon PT Davis." },
  { id: 95, alt: "Rendering study showing depth, instrument placement, and sightlines for Million Dollar Quartet, scenic design by Brandon PT Davis." },
  { id: 100, alt: "Cast blocking across the studio set architecture in Million Dollar Quartet at SCR, scenic design by Brandon PT Davis." },
  { id: 90, alt: "Early rendering pass for Million Dollar Quartet emphasizing period texture and performance focus, scenic design by Brandon PT Davis." },
  { id: 96, alt: "Onstage action framed by the recording booth and studio details in Million Dollar Quartet, scenic design by Brandon PT Davis." },
  { id: 91, alt: "Production image highlighting the full studio footprint for Million Dollar Quartet, scenic design by Brandon PT Davis." },
  { id: 99, alt: "Full-stage view of Million Dollar Quartet with integrated band platform and actor pathways, scenic design by Brandon PT Davis." },
  { id: 97, alt: "Scene work on the vintage studio interior built for Million Dollar Quartet, scenic design by Brandon PT Davis." },
  { id: 93, alt: "Wide audience-view perspective of the Million Dollar Quartet set at South Coast Repertory, scenic design by Brandon PT Davis." },

  { id: 19, alt: "Primary stage composition for Romero at University of Missouri, scenic design by Brandon PT Davis." },
  { id: 22, alt: "Actors positioned within the architectural and symbolic scenic world of Romero, scenic design by Brandon PT Davis." },
  { id: 18, alt: "Lighting and scenic texture interplay in a dramatic scene from Romero, scenic design by Brandon PT Davis." },
  { id: 17, alt: "Wide house perspective of the Romero set with layered playing spaces, scenic design by Brandon PT Davis." },
  { id: 20, alt: "Scene transition across the central platform system in Romero at University of Missouri, scenic design by Brandon PT Davis." },
  { id: 21, alt: "Final production view of Romero showing the full environment and actor pathways, scenic design by Brandon PT Davis." },

  { id: 283, alt: "Full-stage production view for Freaky Friday at Okoboji Summer Theatre, scenic design by Brandon PT Davis." },
  { id: 284, alt: "Kitchen and interior architecture details featured in Freaky Friday, scenic design by Brandon PT Davis." },
  { id: 285, alt: "Cast performance moment against the practical interior set of Freaky Friday, scenic design by Brandon PT Davis." },
  { id: 286, alt: "Stage picture showing traffic flow and furniture layout in Freaky Friday, scenic design by Brandon PT Davis." },
  { id: 287, alt: "Scene shift on the multi-area set for Freaky Friday at Okoboji, scenic design by Brandon PT Davis." },
  { id: 288, alt: "Audience-view angle of the Freaky Friday environment with layered scenic depth, scenic design by Brandon PT Davis." },
  { id: 289, alt: "Ensemble moment anchored by the central scenic architecture in Freaky Friday, scenic design by Brandon PT Davis." },
  { id: 290, alt: "Rendering study for Freaky Friday showing key set zones and sightline clarity, scenic design by Brandon PT Davis." },
  { id: 291, alt: "Color rendering of the Freaky Friday set exploring material tone and composition, scenic design by Brandon PT Davis." },
  { id: 292, alt: "Pre-production rendering for Freaky Friday with focus on spatial rhythm and actor movement, scenic design by Brandon PT Davis." },

  { id: 150245, alt: "Performance image from The Penelopiad at UC Irvine showing the primary scenic composition, scenic design by Brandon PT Davis." },
  { id: 150239, alt: "Stage moment framed by the abstract architectural world of The Penelopiad, scenic design by Brandon PT Davis." },
  { id: 150077, alt: "Ensemble blocking across the central platform in The Penelopiad, scenic design by Brandon PT Davis." },
  { id: 150227, alt: "Production still highlighting depth and negative space in The Penelopiad set, scenic design by Brandon PT Davis." },
  { id: 150132, alt: "Dramatic scene work within the textured environment of The Penelopiad at UC Irvine, scenic design by Brandon PT Davis." },
  { id: 150232, alt: "Wide perspective of The Penelopiad showing layered levels and actor pathways, scenic design by Brandon PT Davis." },
  { id: 150154, alt: "Concept rendering for The Penelopiad exploring tone, silhouette, and stage geometry, scenic design by Brandon PT Davis." },
  { id: 150085, alt: "Stage image from The Penelopiad emphasizing spatial storytelling and composition, scenic design by Brandon PT Davis." },
  { id: 150099, alt: "Performance still with actors positioned through multiple scenic planes in The Penelopiad, scenic design by Brandon PT Davis." },
  { id: 150059, alt: "Final production angle of The Penelopiad environment at University of California Irvine, scenic design by Brandon PT Davis." },

  { id: 210, alt: "Production image of Guys on Ice at The Great American Melodrama with full set context, scenic design by Brandon PT Davis." },
  { id: 207, alt: "Cast interaction framed by the cabin-inspired scenic world of Guys on Ice, scenic design by Brandon PT Davis." },
  { id: 208, alt: "Wide stage view showing environment and actor pathways in Guys on Ice, scenic design by Brandon PT Davis." },
  { id: 205, alt: "Scenic rendering for Guys on Ice with focus on atmosphere, structure, and sightlines, scenic design by Brandon PT Davis." },
  { id: 209, alt: "Performance moment across the central scenic playing area in Guys on Ice, scenic design by Brandon PT Davis." },
  { id: 206, alt: "Audience perspective of the completed Guys on Ice set at The Great American Melodrama, scenic design by Brandon PT Davis." },

  { id: 150100, alt: "Stage production image from Company at UC Irvine showing the integrated scenic composition, scenic design by Brandon PT Davis." },
  { id: 150102, alt: "Scenic rendering for Company exploring architectural rhythm and performance flow, scenic design by Brandon PT Davis." },
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
    if (error) {
      throw new Error(`Failed update ${item.id}: ${error.message}`);
    }
  }

  console.log("Applied manual alt pass to top 50 scenic images.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
