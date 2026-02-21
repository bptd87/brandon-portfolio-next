import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const updates = [
  { id: 150066, alt: "Performance still from American Idiot at UC Irvine with the scenic world in full view, scenic design by Brandon PT Davis." },
  { id: 150069, alt: "Production image from ¡LOTERIA: GAME ON! at Theatre SilCo, scenic design by Brandon PT Davis." },
  { id: 150072, alt: "Cast onstage within the colorful scenic environment of ¡LOTERIA: GAME ON!, scenic design by Brandon PT Davis." },
  { id: 150074, alt: "Performance image from The Merry Wives of Windsor at Stephens College, scenic design by Brandon PT Davis." },
  { id: 150075, alt: "Wide stage view from ¡LOTERIA: GAME ON! showing set composition and actor pathways, scenic design by Brandon PT Davis." },
  { id: 150076, alt: "Production still from Company at University of California Irvine, scenic design by Brandon PT Davis." },
  { id: 150077, alt: "Ensemble stage image from The Penelopiad at UC Irvine with layered depth, scenic design by Brandon PT Davis." },
  { id: 150080, alt: "Scene work from Tomás and the Library Lady at Lake Dillon Theatre, scenic design by Brandon PT Davis." },
  { id: 150081, alt: "Production image from The Pajama Game at UC Irvine with complete scenic context, scenic design by Brandon PT Davis." },
  { id: 150083, alt: "Performance still from The Pajama Game showing actor movement through the set, scenic design by Brandon PT Davis." },
  { id: 150085, alt: "Stage picture from The Penelopiad emphasizing spatial storytelling, scenic design by Brandon PT Davis." },
  { id: 150086, alt: "Audience-view angle from ¡LOTERIA: GAME ON! at Silverthorne, scenic design by Brandon PT Davis." },
  { id: 150090, alt: "Concept rendering for Head Over Heels at Theatre SilCo, scenic design by Brandon PT Davis." },
  { id: 150091, alt: "Production still from The Pajama Game with layered scenic planes and ensemble focus, scenic design by Brandon PT Davis." },
  { id: 150092, alt: "Performance image from Tomás and the Library Lady framed by the scenic architecture, scenic design by Brandon PT Davis." },
  { id: 150094, alt: "Onstage moment from American Idiot at UC Irvine with the full scenic build visible, scenic design by Brandon PT Davis." },
  { id: 150097, alt: "Production image from Head Over Heels at Theatre SilCo highlighting scenic color and depth, scenic design by Brandon PT Davis." },
  { id: 150098, alt: "Rendering study for Isolation in Chicago exploring atmosphere and composition, scenic design by Brandon PT Davis." },
  { id: 150099, alt: "Performance still from The Penelopiad showing actors across multiple levels, scenic design by Brandon PT Davis." },
  { id: 150100, alt: "Production still from Company at UC Irvine with integrated scenic composition, scenic design by Brandon PT Davis." },
  { id: 150102, alt: "Scenic rendering from Company testing architecture and performer flow, scenic design by Brandon PT Davis." },
  { id: 150103, alt: "Stage image from A Funny Thing Happened on the Way to the Forum at Lake Dillon Theatre, scenic design by Brandon PT Davis." },
  { id: 150104, alt: "Production image from Boeing, Boeing at Stephens College with full set context, scenic design by Brandon PT Davis." },
  { id: 150105, alt: "Performance still from American Idiot emphasizing scenic framing and rhythm, scenic design by Brandon PT Davis." },
  { id: 150113, alt: "Cast and ensemble moment from The Pajama Game at UC Irvine, scenic design by Brandon PT Davis." },
  { id: 150115, alt: "Production still from ¡LOTERIA: GAME ON! showing actor pathways through the set, scenic design by Brandon PT Davis." },
  { id: 150116, alt: "Stage picture from Company with balanced scenic geometry and depth, scenic design by Brandon PT Davis." },
  { id: 150118, alt: "Performance still from An Inspector Calls at Okoboji Summer Theatre, scenic design by Brandon PT Davis." },
  { id: 150119, alt: "Audience-view production image from The Pajama Game, scenic design by Brandon PT Davis." },
  { id: 150122, alt: "Onstage action from ¡LOTERIA: GAME ON! at Theatre SilCo, scenic design by Brandon PT Davis." },
  { id: 150125, alt: "Production still from Company at UC Irvine showing full environment and cast, scenic design by Brandon PT Davis." },
  { id: 150126, alt: "Performance image from The Pajama Game with period scenic architecture, scenic design by Brandon PT Davis." },
  { id: 150127, alt: "Stage image from Head Over Heels at Theatre SilCo showing scenic layering, scenic design by Brandon PT Davis." },
  { id: 150128, alt: "Production still from Parliament Square at UC Irvine with full scenic footprint, scenic design by Brandon PT Davis." },
  { id: 150132, alt: "Dramatic scene from The Penelopiad framed by sculptural scenic forms, scenic design by Brandon PT Davis." },
  { id: 150134, alt: "Concept rendering for An Inspector Calls at Okoboji Summer Theatre, scenic design by Brandon PT Davis." },
  { id: 150138, alt: "Scenic rendering for The Pajama Game exploring set proportions and pathways, scenic design by Brandon PT Davis." },
  { id: 150139, alt: "Rendering from Boeing, Boeing at Stephens College showing scenic massing, scenic design by Brandon PT Davis." },
  { id: 150140, alt: "Production still from Barefoot in the Park at Okoboji Summer Theatre, scenic design by Brandon PT Davis." },
  { id: 150141, alt: "Performance image from Boeing, Boeing with actors framed by scenic architecture, scenic design by Brandon PT Davis." },
  { id: 150143, alt: "Onstage moment from Parliament Square at University of California Irvine, scenic design by Brandon PT Davis." },
  { id: 150146, alt: "Production image from The Pajama Game with ensemble blocking across the scenic layout, scenic design by Brandon PT Davis." },
  { id: 150148, alt: "Stage still from Head Over Heels showing scenic transitions and actor flow, scenic design by Brandon PT Davis." },
  { id: 150150, alt: "Production image from Parliament Square highlighting depth and stage geometry, scenic design by Brandon PT Davis." },
  { id: 150152, alt: "Performance still from American Idiot with bold scenic framing, scenic design by Brandon PT Davis." },
  { id: 150153, alt: "Cast image from ¡LOTERIA: GAME ON! at Silverthorne with full stage context, scenic design by Brandon PT Davis." },
  { id: 150154, alt: "Concept rendering for The Penelopiad exploring memory-play atmosphere, scenic design by Brandon PT Davis." },
  { id: 150157, alt: "Rendering concept for Ashes of the Underworld in Chicago, scenic design by Brandon PT Davis." },
  { id: 150158, alt: "Stage picture from Barefoot in the Park showing practical interior composition, scenic design by Brandon PT Davis." },
  { id: 150159, alt: "Production still from Parliament Square at UC Irvine with layered scenic depth, scenic design by Brandon PT Davis." },
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

  console.log("Applied manual alt pass to batch 3 scenic images.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
