
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    // Dynamic import to allow dotenv to load first
    const { supabase } = await import('../server/db');

    console.log("Fixing 'The Northwind Mare Tavern' image types...");

    // 1. Get Project ID
    const { data: projects, error } = await supabase
        .from('projects')
        .select('id')
        .ilike('title', '%Northwind Mare%')
        .limit(1);

    if (error || !projects || projects.length === 0) {
        console.error("Project not found:", error);
        return;
    }

    const projectId = projects[0].id;
    console.log(`Found project ID: ${projectId}`);

    // 2. Update project_images where image_type is null or not 'rendering'
    const { data: updated, error: updateError } = await supabase
        .from('project_images')
        .update({ image_type: 'rendering' })
        .eq('project_id', projectId)
        .select();

    if (updateError) {
        console.error("Error updating images:", updateError);
    } else {
        console.log(`Updated ${updated?.length} images to type 'rendering'.`);
        updated?.forEach(img => {
            console.log(`- ID ${img.id}: ${img.image_url}`);
        });
    }
}

main().catch(console.error);
