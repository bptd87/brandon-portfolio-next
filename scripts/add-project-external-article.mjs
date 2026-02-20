import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const [slug, url, title, source = '', publishedAt = ''] = process.argv.slice(2);

if (!slug || !url || !title) {
  console.error('Usage: node scripts/add-project-external-article.mjs <slug> <url> <title> [source] [publishedAt]');
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const { data: project, error: getError } = await supabase
  .from('projects')
  .select('id, slug, external_articles')
  .eq('slug', slug)
  .single();

if (getError || !project) {
  console.error('Project lookup failed:', getError?.message || 'Not found');
  process.exit(1);
}

const current = Array.isArray(project.external_articles) ? project.external_articles : [];
const next = [
  ...current.filter((item) => item?.url !== url),
  {
    title,
    url,
    source: source || undefined,
    publishedAt: publishedAt || undefined,
  },
];

const { error: updateError } = await supabase
  .from('projects')
  .update({ external_articles: next })
  .eq('id', project.id);

if (updateError) {
  console.error('Update failed:', updateError.message);
  process.exit(1);
}

console.log(`Added external article to ${slug}`);
