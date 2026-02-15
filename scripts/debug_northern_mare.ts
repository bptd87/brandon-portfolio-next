
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    // Dynamic import to allow dotenv to load first
    const { supabase } = await import('../server/db');

    console.log("Searching for 'The Northwind Mare Tavern'...");

    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .ilike('title', '%Northwind Mare%');

    if (error) {
        console.error("Error fetching project:", error);
        return;
    }

    if (!projects || projects.length === 0) {
        console.log("Project not found.");
        return;
    }

    const project = projects[0];
    console.log(`Found project: ${project.title} (ID: ${project.id})`);
    console.log(`Cover Image: ${project.cover_image}`);
    console.log(`Cover Image Key: ${project.cover_image_key}`);

    // Check separate images table
    const { data: images, error: imgError } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', project.id)
        .order('sort_order', { ascending: true });

    if (imgError) {
        console.error("Error fetching project images:", imgError);
    } else {
        console.log(`Found ${images?.length} images in project_images table.`);
        images?.forEach((img, i) => {
            console.log(`[${i}] ID: ${img.id}, URL: ${img.image_url}, Type: ${img.image_type}`);
        });
    }
}

main().catch(console.error);
