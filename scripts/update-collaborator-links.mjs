import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Get all collaborators first to see what we have
const { data: collaborators, error } = await supabase
  .from('collaborators')
  .select('*')
  .order('name');

if (error) {
  console.error('Error fetching collaborators:', error);
  process.exit(1);
}

console.log('\n=== Current Collaborators ===\n');
console.log('Collaborators with social media links:\n');
const withLinks = collaborators.filter(c => c.portfolioUrl || c.websiteUrl || c.instagramUrl);
withLinks.slice(0, 10).forEach(c => {
  console.log(`${c.id}. ${c.name} (${c.role})`);
  if (c.portfolioUrl) console.log(`   Portfolio: ${c.portfolioUrl}`);
  if (c.websiteUrl) console.log(`   Website: ${c.websiteUrl}`);
  if (c.instagramUrl) console.log(`   Instagram: ${c.instagramUrl} ${c.instagramHandle ? `(@${c.instagramHandle})` : ''}`);
  console.log('');
});

console.log(`\nFound ${withLinks.length} collaborators with social media links`);
console.log(`Total collaborators: ${collaborators.length}`);

console.log(`\nTotal: ${collaborators.length} collaborators`);
console.log('\nTo update a collaborator, add code like this to the script:');
console.log(`
// Example update for a specific collaborator:
const { error: updateError } = await supabase
  .from('collaborators')
  .update({
    website_url: 'https://example.com',
    instagram_url: 'https://instagram.com/username',
    instagram_handle: 'username'
  })
  .eq('id', COLLABORATOR_ID_HERE);

if (updateError) {
  console.error('Update error:', updateError);
} else {
  console.log('Updated successfully!');
}
`);
