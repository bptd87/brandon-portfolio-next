import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const updates = [
  { id: 309, alt: "Wide production view of The Glass Menagerie at Maples Repertory Theatre in Macon, scenic design by Brandon PT Davis." },
  { id: 310, alt: "Actors framed by the memory-play architecture in The Glass Menagerie, scenic design by Brandon PT Davis." },
  { id: 311, alt: "Full-stage composition showing layered depth in The Glass Menagerie at Maples Repertory Theatre, scenic design by Brandon PT Davis." },
  { id: 312, alt: "Performance moment centered in the fragile interior world of The Glass Menagerie, scenic design by Brandon PT Davis." },
  { id: 313, alt: "Concept rendering for The Glass Menagerie exploring atmosphere and spatial drift, scenic design by Brandon PT Davis." },
  { id: 314, alt: "House view of the scenic environment for The Glass Menagerie in Macon, scenic design by Brandon PT Davis." },
  { id: 315, alt: "Scene work across the primary platform system in The Glass Menagerie, scenic design by Brandon PT Davis." },
  { id: 316, alt: "Production still emphasizing sightlines and negative space in The Glass Menagerie, scenic design by Brandon PT Davis." },
  { id: 317, alt: "Ensemble stage picture inside the poetic world of The Glass Menagerie, scenic design by Brandon PT Davis." },
  { id: 318, alt: "Audience perspective of The Glass Menagerie with layered scenic planes, scenic design by Brandon PT Davis." },

  { id: 319, alt: "Production image of Urinetown at University of Missouri with the full scenic footprint, scenic design by Brandon PT Davis." },
  { id: 320, alt: "Cast moment on the industrial comic world of Urinetown, scenic design by Brandon PT Davis." },
  { id: 321, alt: "Wide stage angle of Urinetown showing vertical playing levels, scenic design by Brandon PT Davis." },
  { id: 322, alt: "Onstage action framed by the urban architecture in Urinetown at Mizzou, scenic design by Brandon PT Davis." },
  { id: 323, alt: "Scenic rendering for Urinetown testing massing, pathways, and tonal contrast, scenic design by Brandon PT Davis." },
  { id: 324, alt: "Production still of Urinetown highlighting ensemble traffic through the set, scenic design by Brandon PT Davis." },
  { id: 325, alt: "Scene transition on the multi-level structure for Urinetown, scenic design by Brandon PT Davis." },
  { id: 326, alt: "Rendering pass for Urinetown establishing geometry and actor flow, scenic design by Brandon PT Davis." },
  { id: 327, alt: "Perspective rendering of Urinetown with emphasis on depth and silhouette, scenic design by Brandon PT Davis." },
  { id: 328, alt: "Performance image of Urinetown with the civic-industrial set framing the cast, scenic design by Brandon PT Davis." },
  { id: 329, alt: "House-right audience view of Urinetown at University of Missouri, scenic design by Brandon PT Davis." },
  { id: 330, alt: "Final production angle showing the complete Urinetown scenic composition, scenic design by Brandon PT Davis." },
  { id: 331, alt: "Stage picture from Urinetown emphasizing texture, levels, and ensemble composition, scenic design by Brandon PT Davis." },

  { id: 150011, alt: "Performance still from American Idiot at UC Irvine with the full scenic environment, scenic design by Brandon PT Davis." },
  { id: 150012, alt: "Production image from All's Well That Ends Well at New Swan Theatre Festival, scenic design by Brandon PT Davis." },
  { id: 150015, alt: "Concept rendering for The Merry Wives of Windsor at Stephens College, scenic design by Brandon PT Davis." },
  { id: 150017, alt: "Stage image from Boeing, Boeing at Stephens College showing comic architecture, scenic design by Brandon PT Davis." },
  { id: 150019, alt: "Production still from An Inspector Calls at Okoboji Summer Theatre, scenic design by Brandon PT Davis." },
  { id: 150021, alt: "Performance image from Tomás and the Library Lady at Lake Dillon Theatre, scenic design by Brandon PT Davis." },
  { id: 150024, alt: "Stage moment from The Pajama Game at UC Irvine with full set context, scenic design by Brandon PT Davis." },
  { id: 150026, alt: "Production view from Company at UC Irvine showing integrated scenic composition, scenic design by Brandon PT Davis." },
  { id: 150028, alt: "Cast performance image across the scenic platforms in Company, scenic design by Brandon PT Davis." },
  { id: 150030, alt: "Audience perspective from Tomás and the Library Lady with layered storytelling space, scenic design by Brandon PT Davis." },
  { id: 150031, alt: "Wide stage still from Company highlighting pathways and depth, scenic design by Brandon PT Davis." },
  { id: 150033, alt: "Scene transition image from Company at University of California Irvine, scenic design by Brandon PT Davis." },
  { id: 150034, alt: "Production still from Tomás and the Library Lady emphasizing scenic clarity, scenic design by Brandon PT Davis." },
  { id: 150036, alt: "Performance still from American Idiot with bold scenic framing, scenic design by Brandon PT Davis." },
  { id: 150038, alt: "Pre-production rendering for The Pajama Game exploring period architecture and scale, scenic design by Brandon PT Davis." },
  { id: 150042, alt: "Scenic rendering for Barefoot in the Park at Okoboji Summer Theatre, scenic design by Brandon PT Davis." },
  { id: 150044, alt: "Production image from Barefoot in the Park showing apartment set composition, scenic design by Brandon PT Davis." },
  { id: 150045, alt: "Cast interaction framed by the scenic interior of Barefoot in the Park, scenic design by Brandon PT Davis." },
  { id: 150047, alt: "Performance image from All's Well That Ends Well with the New Swan stage world, scenic design by Brandon PT Davis." },
  { id: 150048, alt: "Audience-view still from Barefoot in the Park with layered set zones, scenic design by Brandon PT Davis." },
  { id: 150051, alt: "Production image from The Merry Wives of Windsor at Stephens College, scenic design by Brandon PT Davis." },
  { id: 150053, alt: "Scene moment from The Pajama Game with ensemble blocked through the scenic layout, scenic design by Brandon PT Davis." },
  { id: 150055, alt: "Scenic rendering for Angel Food Cake at Western Summer Theatre, scenic design by Brandon PT Davis." },
  { id: 150057, alt: "Stage picture from All's Well That Ends Well at New Swan Theatre Festival, scenic design by Brandon PT Davis." },
  { id: 150059, alt: "Production still from The Penelopiad at UC Irvine showing the complete scenic world, scenic design by Brandon PT Davis." },
  { id: 150064, alt: "Performance image from Head Over Heels at Theatre SilCo, scenic design by Brandon PT Davis." },
  { id: 150065, alt: "Wide production still from American Idiot at University of California Irvine, scenic design by Brandon PT Davis." },
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

  console.log("Applied manual alt pass to next 50 scenic images.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
