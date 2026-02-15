import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

async function checkCount() {
    const { count, error } = await supabase
        .from('rendering_gallery')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(`Rendering Gallery Count: ${count}`);
    }
}

checkCount();
