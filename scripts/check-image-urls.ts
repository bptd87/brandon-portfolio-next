import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function checkImageUrls() {
  const { data, error } = await supabase
    .from('projects')
    .select('title, cover_image_url')
    .limit(10);
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Sample project images:');
    data?.forEach(proj => {
      console.log(`\n${proj.title}:`);
      console.log(`  ${proj.cover_image_url}`);
      if (proj.cover_image_url?.includes('cloudinary')) {
        console.log('  ✓ Uses Cloudinary');
      } else if (proj.cover_image_url?.includes('supabase')) {
        console.log('  ✓ Uses Supabase Storage');
      } else {
        console.log('  ⚠ Unknown source');
      }
    });
  }
}

checkImageUrls().catch(console.error);
