import * as db from './server/db.js';

async function test() {
  console.log('Testing getRenderingGallery()...\n');
  
  const gallery = await db.getRenderingGallery();
  
  console.log(`Returned ${gallery.length} items\n`);
  
  gallery.forEach((item, i) => {
    console.log(`${i+1}. ${item.displayTitle}`);
    console.log(`   Project: ${item.project?.title} (${item.project?.year})`);
    console.log(`   Cover: ${item.project?.coverImageUrl ? 'Yes' : 'No'}`);
    console.log(`   Images: ${item.project?.images?.length || 0}`);
  });
  
  process.exit(0);
}

test().catch(console.error);
