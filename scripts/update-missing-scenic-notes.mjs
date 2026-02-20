import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const notesBySlug = {
  'guys-on-ice': `For Guys on Ice, the scenic design focused on creating a playable frozen-lake environment that could support both broad comedy and moments of quiet sincerity. The composition balances a strong horizon line and open negative space with practical ice-fishing architecture so performers can move cleanly while the audience always reads relationship dynamics.

Material and texture choices were built around Midwestern winter vernacular, with surfaces that suggest wear, weather, and local history rather than caricature. The goal was to ground the humor in a recognizable world and give the production a visual language that felt specific to place, season, and community.`,

  'urinetown': `Urinetown was designed as a civic machine: industrial, compressed, and deliberately stratified to support the musical's satire of power, scarcity, and class. Layered levels and clear circulation paths allowed scenes to pivot quickly between public spectacle and private confrontation while preserving visual pressure on the ensemble.

The palette and detailing leaned into distressed infrastructure so the environment felt governed, policed, and monetized. Scenic transitions were structured to keep momentum high and reinforce the show's tonal shift between absurd comedy and political warning.`,

  'barefoot-in-the-park': `The design for Barefoot in the Park centered on a compact New York walk-up that amplifies the play's emotional temperature through scale, proximity, and verticality. Tight architectural boundaries and selective furnishing choices helped stage the couple's shifting rhythms while preserving clarity for fast comic timing.

Rather than over-rendering period detail, the scenic approach prioritized playable geometry and social pressure: doors, stairs, and window relationships all functioned as storytelling tools. The environment tracks the movement from romantic idealism to negotiated partnership without losing the play's wit.`,

  'freaky-friday': `Freaky Friday required a scenic system capable of fast identity shifts, tonal contrast, and high-energy ensemble flow. The design strategy emphasized modular zones and legible transitions so the audience could instantly read changing contexts while performers maintained pace through musical numbers and dialogue scenes.

Visual language was built around contemporary domestic and school-world cues, with flexible units supporting both intimacy and spectacle. The set was tuned for transformation: spaces had to feel stable enough for character stakes while remaining agile enough for the show's body-swap mechanics.`,

  'the-merry-wives-of-windsor': `The Merry Wives of Windsor was staged with a design vocabulary that supports wit, social maneuvering, and rapid shifts in perspective. Scenic composition emphasized shared public space and semi-private thresholds so eavesdropping, concealment, and reversal could play with precision.

Architectural framing and circulation were treated as engines for comedy, giving actors clear pathways for pursuit, interruption, and payoff. The result is an environment that feels playful and socially alive while still anchoring the production in a coherent civic world.`,

  'an-inspector-calls': `For An Inspector Calls, the scenic design framed the world as outwardly composed yet structurally unstable, reflecting the play's moral unmasking. Spatial order, sightlines, and entrances were orchestrated to heighten interrogation dynamics and progressively reduce the family's sense of control.

Period-informed detailing was used with restraint, allowing atmosphere and composition to carry the central tension. As revelations accumulate, the environment reads less as a protected domestic interior and more as a stage for accountability.`,

  'tomas-and-the-library-lady': `Tomás and the Library Lady was designed to honor storytelling as an act of invitation. The scenic approach created warm, readable spaces that support bilingual performance, audience access, and fluid movement between domestic reality and imaginative expansion.

Library architecture and visual motifs were treated as portals rather than static background, giving the production a sense of discovery while maintaining clarity for young audiences. The environment reinforces the play's core themes of literacy, belonging, and cultural memory.`,

  'the-penelopiad': `The Penelopiad was conceived as a layered memory space where testimony, ritual, and counter-narrative could coexist. Scenic composition privileged chorus visibility and flexible staging geometry so the production could move between epic framing and intimate address without losing theatrical tension.

Material language balanced austerity with symbolic texture, supporting the work's interrogation of authorship, gendered history, and inherited myth. The set functioned as both container and witness, giving Penelope and the maids equal visual authority within the same world.`
};

let updated = 0;
for (const [slug, design_notes] of Object.entries(notesBySlug)) {
  const { error } = await supabase
    .from('projects')
    .update({ design_notes })
    .eq('slug', slug)
    .eq('discipline', 'scenic_design');

  if (error) {
    console.error(`Failed: ${slug}`, error.message);
    continue;
  }
  console.log(`Updated notes: ${slug}`);
  updated += 1;
}

console.log(`Done. Updated ${updated} scenic projects.`);
