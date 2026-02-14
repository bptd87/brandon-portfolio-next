
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSupabaseData() {
    console.log('Checking Supabase data counts...');

    const tables = [
        'projects',
        'users',
        'articles',
        'rendering_gallery',
        'model_gallery',
        'experiential_gallery'
    ];

    for (const table of tables) {
        const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error(`Error checking ${table}:`, error.message);
        } else {
            console.log(`- ${table}: ${count} rows`);
        }
    }
}

checkSupabaseData();
