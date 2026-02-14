import 'dotenv/config';
import { getProjectBySlug } from '../server/db';
import { supabase } from '../server/supabase';

async function inspectProject() {
    const slug = 'the-northwind-mare-tavern';
    console.log(`Inspecting project: ${slug}`);

    try {
        const project = await getProjectBySlug(slug);

        if (!project) {
            console.log('Project NOT FOUND in database.');
            return;
        }

        console.log('Project details:', {
            id: project.id,
            title: project.title,
            discipline: project.discipline,
            status: project.status,
            coverImageUrl: project.coverImageUrl
        });

        console.log('Images:', project.images.length);
        project.images.forEach(img => {
            console.log({
                id: img.id,
                type: img.imageType,
                url: img.imageUrl,
                caption: img.caption
            });
        });

    } catch (error) {
        console.error('Error inspecting project:', error);
    }
}

inspectProject();
