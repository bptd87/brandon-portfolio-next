import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkImages() {
  // Check Northwind Mare Tavern (ID: 2)
  console.log('=== The Northwind Mare Tavern (ID: 2) ===');
  console.log('\nIn rendering_project_images:');
  const { data: northwindNew } = await supabase
    .from('rendering_project_images')
    .select('id, image_url, sort_order, caption')
    .eq('rendering_project_id', 2)
    .order('sort_order');
  
  console.log(`Found ${northwindNew?.length || 0} images:`);
  northwindNew?.forEach((img, i) => {
    console.log(`${i + 1}. [Order: ${img.sort_order}]`);
    console.log(`   ${img.image_url}`);
  });
  
  console.log('\nIn project_images (old table):');
  const { data: northwindOld } = await supabase
    .from('project_images')
    .select('id, image_url, sort_order, caption')
    .eq('project_id', 2)
    .order('sort_order');
  
  console.log(`Found ${northwindOld?.length || 0} images:`);
  northwindOld?.forEach((img, i) => {
    console.log(`${i + 1}. [Order: ${img.sort_order}]`);
    console.log(`   ${img.image_url}`);
  });
  
  console.log('\n=== Ashes of the Underworld (ID: 3) ===');
  console.log('\nIn rendering_project_images:');
  const { data: ashesNew } = await supabase
    .from('rendering_project_images')
    .select('id, image_url, sort_order, caption')
    .eq('rendering_project_id', 3)
    .order('sort_order');
  
  console.log(`Found ${ashesNew?.length || 0} images:`);
  ashesNew?.forEach((img, i) => {
    console.log(`${i + 1}. [Order: ${img.sort_order}]`);
    console.log(`   ${img.image_url}`);
  });
  
  console.log('\nIn project_images (old table):');
  const { data: ashesOld } = await supabase
    .from('project_images')
    .select('id, image_url, sort_order, caption')
    .eq('project_id', 3)
    .order('sort_order');
  
  console.log(`Found ${ashesOld?.length || 0} images:`);
  ashesOld?.forEach((img, i) => {
    console.log(`${i + 1}. [Order: ${img.sort_order}]`);
    console.log(`   ${img.image_url}`);
  });
}

checkImages();
