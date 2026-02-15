import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

async function checkRelation() {
    const { data: galleryItems, error: galleryError } = await supabase
        .from('rendering_gallery')
        .select('*');

    if (galleryError) {
        console.error('Gallery Error:', galleryError);
        return;
    }

    console.log('Gallery Items:', galleryItems);

    if (galleryItems && galleryItems.length > 0) {
        const projectIds = galleryItems.map(i => i.project_id);
        const { data: projects, error: projectError } = await supabase
            .from('projects')
            .select('id, title, status')
            .in('id', projectIds);

        if (projectError) {
            console.error('Project Error:', projectError);
        } else {
            console.log('Related Projects:', projects);
        }
    }
}

checkRelation();
