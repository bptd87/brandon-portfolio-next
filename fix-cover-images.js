import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function fixCoverImages() {
  // Update Northwind Mare Tavern
  await supabase
    .from('rendering_projects')
    .update({
      cover_image_url: 'https://res.cloudinary.com/dsq2xg1iw/image/upload/v1771102730/brandon-portfolio/projects/1771102729312-Nano_Banana_Pro_using_this_vehicle_in_image_one_upated_the_second_imag_of_the_back_with_screen__do_n_2_bloom_low_2x.png'
    })
    .eq('id', 2);
  console.log('✓ Updated Northwind Mare Tavern to Cloudinary image');
  
  // Update Ashes of the Underworld
  await supabase
    .from('rendering_projects')
    .update({
      cover_image_url: 'https://res.cloudinary.com/dsq2xg1iw/image/upload/v1771226855/brandon-portfolio/projects/1771226855050-123EC95D-9F48-4292-9576-7FF272705190_1_105_c.jpg'
    })
    .eq('id', 3);
  console.log('✓ Updated Ashes of the Underworld to Cloudinary image');
}

fixCoverImages();
