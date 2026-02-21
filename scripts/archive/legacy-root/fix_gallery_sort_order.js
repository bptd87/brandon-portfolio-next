import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function fixSortOrder() {
  console.log('🔧 Fixing rendering_gallery sort order...\n');

  const { data: gallery } = await supabase
    .from('rendering_gallery')
    .select('id, rendering_project_id, display_title, sort_order')
    .order('id'); // Order by ID to maintain original insertion order

  if (!gallery) {
    console.log('No gallery items found');
    process.exit(0);
  }

  console.log(`Found ${gallery.length} items. Assigning sequential sort order:\n`);

  for (let i = 0; i < gallery.length; i++) {
    const item = gallery[i];
    const newSortOrder = i + 1;
    
    console.log(`${newSortOrder}. ${item.display_title} (was: ${item.sort_order}, now: ${newSortOrder})`);
    
    await supabase
      .from('rendering_gallery')
      .update({ sort_order: newSortOrder })
      .eq('id', item.id);
  }

  console.log('\n✅ Sort order fixed!');
  process.exit(0);
}

fixSortOrder();
