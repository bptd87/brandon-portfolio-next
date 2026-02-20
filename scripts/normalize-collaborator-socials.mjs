import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

function toInstagramUrl(value) {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.replace(/^@+/, '').trim();
  return handle ? `https://www.instagram.com/${handle}/` : null;
}

function toInstagramHandle(value) {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const handle = url.pathname.split('/').filter(Boolean)[0];
      return handle ? `@${handle}` : null;
    } catch {
      return null;
    }
  }

  const normalized = trimmed.replace(/^@+/, '').trim();
  return normalized ? `@${normalized}` : null;
}

const { data: collaborators, error } = await supabase
  .from('collaborators')
  .select('*')
  .order('id');

if (error) {
  console.error(error);
  process.exit(1);
}

let touched = 0;
for (const row of collaborators || []) {
  const website = row.website ?? null;
  const websiteUrl = row.websiteUrl ?? row.website_url ?? null;
  const portfolioUrl = row.portfolioUrl ?? row.portfolio_url ?? null;
  const instagramUrl = row.instagramUrl ?? row.instagram_url ?? null;
  const instagramHandle = row.instagramHandle ?? row.instagram_handle ?? null;

  const nextWebsiteUrl = websiteUrl || website || portfolioUrl || null;
  const nextWebsite = website || websiteUrl || portfolioUrl || null;
  const nextInstagramUrl = instagramUrl || toInstagramUrl(instagramHandle);
  const nextInstagramHandle = toInstagramHandle(instagramHandle) || toInstagramHandle(instagramUrl);

  const updates = {};

  if (nextWebsite !== website) updates.website = nextWebsite;
  if (nextWebsiteUrl !== websiteUrl) updates.websiteUrl = nextWebsiteUrl;
  if (nextInstagramUrl !== instagramUrl) updates.instagramUrl = nextInstagramUrl;
  if (nextInstagramHandle !== instagramHandle) updates.instagramHandle = nextInstagramHandle;

  if (Object.keys(updates).length === 0) continue;

  const { error: updateError } = await supabase
    .from('collaborators')
    .update(updates)
    .eq('id', row.id);

  if (updateError) {
    console.error(`Failed for collaborator ${row.id} (${row.name})`, updateError);
    continue;
  }

  touched += 1;
  console.log(`Updated ${row.id}: ${row.name}`);
}

console.log(`Done. Updated ${touched} collaborator records.`);
