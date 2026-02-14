
import 'dotenv/config';
import { supabase } from '../server/supabase';

async function fixProjectImageType() {
    const projectId = 120001; // From previous inspection
    console.log(`Fixing image type for project: ${projectId}`);

    const { data, error } = await supabase
        .from('project_images')
        .update({ image_type: 'rendering' })
        .eq('project_id', projectId)
        .is('image_type', null);

    if (error) {
        console.error('Error fixing image type:', error);
    } else {
        console.log('Successfully updated image type to "rendering".', data);
    }
}

fixProjectImageType();
