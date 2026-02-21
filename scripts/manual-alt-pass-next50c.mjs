import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const updates = [
  { id: 150161, alt: "Production still from Barefoot in the Park at Okoboji Summer Theatre, scenic design by Brandon PT Davis." },
  { id: 150162, alt: "Stage image from All's Well That Ends Well at New Swan Theatre Festival, scenic design by Brandon PT Davis." },
  { id: 150165, alt: "Performance still from Company at UC Irvine with the scenic world in view, scenic design by Brandon PT Davis." },
  { id: 150166, alt: "Production image from Parliament Square at University of California Irvine, scenic design by Brandon PT Davis." },
  { id: 150170, alt: "Stage moment from The Merry Wives of Windsor at Stephens College, scenic design by Brandon PT Davis." },
  { id: 150172, alt: "Scenic rendering from The Pajama Game testing composition and movement, scenic design by Brandon PT Davis." },
  { id: 150176, alt: "Rendering concept from American Idiot at UC Irvine, scenic design by Brandon PT Davis." },
  { id: 150177, alt: "Production still from Tomás and the Library Lady at Lake Dillon Theatre, scenic design by Brandon PT Davis." },
  { id: 150178, alt: "Performance image from All's Well That Ends Well with actor pathways visible, scenic design by Brandon PT Davis." },
  { id: 150181, alt: "Production still from The Merry Wives of Windsor showing scenic depth, scenic design by Brandon PT Davis." },
  { id: 150183, alt: "Performance image from An Inspector Calls at Okoboji Summer Theatre, scenic design by Brandon PT Davis." },
  { id: 150184, alt: "Stage still from Hamlet with full scenic environment, scenic design by Brandon PT Davis." },
  { id: 150185, alt: "Production image from Boeing, Boeing at Stephens College with complete set context, scenic design by Brandon PT Davis." },
  { id: 150188, alt: "Performance still from Parliament Square emphasizing scenic structure and depth, scenic design by Brandon PT Davis." },
  { id: 150191, alt: "Scenic rendering from ¡LOTERIA: GAME ON! at Theatre SilCo, scenic design by Brandon PT Davis." },
  { id: 150193, alt: "Production image from Barefoot in the Park with practical interior scenic details, scenic design by Brandon PT Davis." },
  { id: 150196, alt: "Onstage image from American Idiot at UC Irvine, scenic design by Brandon PT Davis." },
  { id: 150197, alt: "Performance still from The Merry Wives of Windsor at Stephens College, scenic design by Brandon PT Davis." },
  { id: 150201, alt: "Stage image from Head Over Heels at Theatre SilCo highlighting layered scenic planes, scenic design by Brandon PT Davis." },
  { id: 150202, alt: "Production still from Parliament Square with cast framed by scenic architecture, scenic design by Brandon PT Davis." },
  { id: 150204, alt: "Rendering study from The Pajama Game exploring set geometry, scenic design by Brandon PT Davis." },
  { id: 150205, alt: "Performance still from Parliament Square at UC Irvine with full set context, scenic design by Brandon PT Davis." },
  { id: 150206, alt: "Production image from The Pajama Game showing ensemble movement through the set, scenic design by Brandon PT Davis." },
  { id: 150208, alt: "Cast image from Company at University of California Irvine, scenic design by Brandon PT Davis." },
  { id: 150212, alt: "Concept rendering from The Merry Wives of Windsor at Stephens College, scenic design by Brandon PT Davis." },
  { id: 150213, alt: "Production still from ¡LOTERIA: GAME ON! with complete scenic environment, scenic design by Brandon PT Davis." },
  { id: 150214, alt: "Stage image from Parliament Square emphasizing scenic depth and pathways, scenic design by Brandon PT Davis." },
  { id: 150216, alt: "Production still from A Funny Thing Happened on the Way to the Forum at Lake Dillon Theatre, scenic design by Brandon PT Davis." },
  { id: 150218, alt: "Rendering pass from The Merry Wives of Windsor focused on stage composition, scenic design by Brandon PT Davis." },
  { id: 150219, alt: "Performance image from The Pajama Game with scenic architecture and ensemble blocking, scenic design by Brandon PT Davis." },
  { id: 150221, alt: "Stage still from An Inspector Calls at Okoboji Summer Theatre showing scenic tension, scenic design by Brandon PT Davis." },
  { id: 150222, alt: "Rendering image from ¡LOTERIA: GAME ON! exploring scenic color and arrangement, scenic design by Brandon PT Davis." },
  { id: 150225, alt: "Concept rendering from Tomás and the Library Lady at Lake Dillon Theatre, scenic design by Brandon PT Davis." },
  { id: 150226, alt: "Production still from Barefoot in the Park with full scenic interior in view, scenic design by Brandon PT Davis." },
  { id: 150227, alt: "Performance image from The Penelopiad at UC Irvine, scenic design by Brandon PT Davis." },
  { id: 150228, alt: "Stage still from A Funny Thing Happened on the Way to the Forum at Silverthorne, scenic design by Brandon PT Davis." },
  { id: 150229, alt: "Production image from All's Well That Ends Well at New Swan with cast and scenic world visible, scenic design by Brandon PT Davis." },
  { id: 150230, alt: "Scenic rendering from The Pajama Game exploring period set language, scenic design by Brandon PT Davis." },
  { id: 150231, alt: "Performance still from Head Over Heels at Theatre SilCo, scenic design by Brandon PT Davis." },
  { id: 150232, alt: "Production still from The Penelopiad showing layered scenic planes and actor pathways, scenic design by Brandon PT Davis." },
  { id: 150233, alt: "Onstage image from ¡LOTERIA: GAME ON! with vibrant scenic framing, scenic design by Brandon PT Davis." },
  { id: 150235, alt: "Performance still from A Funny Thing Happened on the Way to the Forum at Lake Dillon Theatre, scenic design by Brandon PT Davis." },
  { id: 150237, alt: "Production image from The Merry Wives of Windsor emphasizing architecture and cast composition, scenic design by Brandon PT Davis." },
  { id: 150239, alt: "Stage image from The Penelopiad at UC Irvine with symbolic scenic form, scenic design by Brandon PT Davis." },
  { id: 150240, alt: "Production still from Company with integrated scenic composition and cast, scenic design by Brandon PT Davis." },
  { id: 150241, alt: "Scenic rendering from Parliament Square at UC Irvine, scenic design by Brandon PT Davis." },
  { id: 150242, alt: "Rendering concept from The Pajama Game with focus on proportion and sightlines, scenic design by Brandon PT Davis." },
  { id: 150243, alt: "Production still from Boeing, Boeing at Stephens College showing full set context, scenic design by Brandon PT Davis." },
  { id: 150245, alt: "Performance image from The Penelopiad with complete scenic world visible, scenic design by Brandon PT Davis." },
  { id: 150250, alt: "Stage still from The Merry Wives of Windsor at Stephens College with scenic detail and depth, scenic design by Brandon PT Davis." },
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

  console.log("Applied manual alt pass to batch 4 scenic images.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
