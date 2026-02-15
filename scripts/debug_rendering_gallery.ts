
import dotenv from 'dotenv';
dotenv.config();

console.log('SUPABASE_URL from env:', process.env.SUPABASE_URL);

async function main() {
    const { getRenderingGallery, supabase } = await import('../server/db');

    // Direct check for project_images
    console.log('Checking project_images table directly...');
    const { data: images, error } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', 1);

    if (error) {
        console.error('Error fetching project_images:', error);
    } else {
        console.log(`Found ${images?.length} images for All My Sons (project_id: 1) in DB.`);
        if (images && images.length > 0) {
            console.log('First image sample:', JSON.stringify(images[0], null, 2));
        }
    }

    console.log('Fetching rendering gallery...');
    const gallery = await getRenderingGallery();
    console.log(`Found ${gallery.length} gallery items.`);

    const allMySons = gallery.find(item => item.project?.title === 'All My Sons');
    if (allMySons) {
        console.log('All My Sons found:', JSON.stringify(allMySons, null, 2));
        console.log('Image count:', allMySons.project?.images?.length);
    } else {
        console.log('All My Sons not found in gallery.');
    }

    const northernMare = gallery.find(item => item.project?.title.includes('Northern Mare'));
    if (northernMare) {
        console.log('Northern Mare found:', JSON.stringify(northernMare, null, 2));
    } else {
        console.log('Northern Mare not found in gallery.');
    }
}

main().catch(console.error);
