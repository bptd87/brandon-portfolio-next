import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const apply = process.argv.includes('--apply');
const supabase = createClient(supabaseUrl, supabaseKey);

const { data: projects, error } = await supabase
  .from('projects')
  .select('id,title,slug,discipline,status,subcategory,client,location,year,month,excerpt,design_notes,seo_title,seo_description,seo_keywords')
  .eq('discipline', 'scenic_design')
  .neq('status', 'archived')
  .order('year', { ascending: false, nullsFirst: false })
  .order('month', { ascending: false, nullsFirst: false });

if (error) {
  console.error(error);
  process.exit(1);
}

const normalize = (value) => (value || '').toString().trim().toLowerCase();
const compact = (value, max = 160) => {
  const t = (value || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
};

const toTitleCase = (value) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const updates = [];
const report = [];

for (const project of projects || []) {
  const title = (project.title || '').trim();
  const client = (project.client || '').trim();
  const excerpt = (project.excerpt || '').trim();
  const notes = (project.design_notes || '').trim();

  const notesPlaceholder = ['[]', '{}', 'n/a', 'none', 'null'].includes(normalize(notes));
  const duplicateTitleClient = normalize(title) && normalize(title) === normalize(client);

  const city = (project.location || '').split(',')[0]?.trim();
  const subcategory = project.subcategory ? toTitleCase(project.subcategory) : '';

  const seoTitleSuggested = `${title} Scenic Design | Brandon PT Davis`;
  const fallbackDescription = [
    `Scenic design for ${title}.`,
    subcategory ? `${subcategory} production.` : null,
    city ? `Produced in ${city}.` : null,
    'Project by Brandon PT Davis.',
  ]
    .filter(Boolean)
    .join(' ');

  const seoDescriptionSuggested = compact(excerpt || notes || fallbackDescription, 156);
  const seoKeywordsSuggested = [
    'scenic design',
    title.toLowerCase(),
    subcategory ? subcategory.toLowerCase() : null,
    city ? city.toLowerCase() : null,
    'theatre design',
    'brandon pt davis',
  ]
    .filter(Boolean)
    .join(', ');

  const missingSeoTitle = !project.seo_title || !project.seo_title.trim();
  const missingSeoDescription = !project.seo_description || !project.seo_description.trim();
  const missingSeoKeywords = !project.seo_keywords || !project.seo_keywords.trim();
  const missingExcerpt = !excerpt;
  const missingNotes = !notes || notesPlaceholder;

  const updateData = {};
  if (missingSeoTitle) updateData.seo_title = seoTitleSuggested;
  if (missingSeoDescription) updateData.seo_description = seoDescriptionSuggested;
  if (missingSeoKeywords) updateData.seo_keywords = seoKeywordsSuggested;
  if (notesPlaceholder) updateData.design_notes = null;

  report.push({
    id: project.id,
    slug: project.slug,
    title,
    flags: {
      duplicateTitleClient,
      missingExcerpt,
      missingNotes,
      missingSeoTitle,
      missingSeoDescription,
      missingSeoKeywords,
      longNotes: notes.length > 900,
    },
    suggestions: {
      seoTitle: missingSeoTitle ? seoTitleSuggested : null,
      seoDescription: missingSeoDescription ? seoDescriptionSuggested : null,
      seoKeywords: missingSeoKeywords ? seoKeywordsSuggested : null,
    },
  });

  if (Object.keys(updateData).length > 0) {
    updates.push({ id: project.id, slug: project.slug, title, updateData });
  }
}

console.log(`Scenic projects checked: ${report.length}`);
console.log(`Projects needing updates: ${updates.length}`);

const summary = report.reduce(
  (acc, item) => {
    for (const [key, value] of Object.entries(item.flags)) {
      if (value) acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  },
  {}
);

console.log('\nFlag summary:');
console.log(JSON.stringify(summary, null, 2));

console.log('\nSample findings (first 20):');
console.log(JSON.stringify(report.slice(0, 20), null, 2));

if (!apply) {
  console.log('\nDry run only. Re-run with --apply to persist suggested SEO fixes and placeholder-note cleanup.');
  process.exit(0);
}

for (const item of updates) {
  const { error: updateError } = await supabase
    .from('projects')
    .update(item.updateData)
    .eq('id', item.id);

  if (updateError) {
    console.error(`Failed update for ${item.slug} (${item.id}):`, updateError.message);
    continue;
  }
  console.log(`Updated ${item.slug} (${item.id})`);
}

console.log('\nApply pass completed.');
