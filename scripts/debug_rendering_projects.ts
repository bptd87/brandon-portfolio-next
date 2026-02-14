
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl ? supabaseUrl.substring(0, 10) + '...' : 'MISSING');
console.log("Supabase Key:", supabaseKey ? 'PRESENT' : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjects() {
    console.log("--- Checking Projects ---");
    const { data: projects, error: pError } = await supabase
        .from('projects')
        .select('id, title, discipline, status');

    if (pError) {
        console.error("Error fetching projects:", pError);
    } else {
        console.log(`Found ${projects?.length} total projects:`);
        projects?.forEach(p => console.log(`- [${p.id}] ${p.title} (${p.discipline}, ${p.status})`));
    }

    console.log("\n--- Checking Rendering Gallery ---");
    const { data: gallery, error: gError } = await supabase
        .from('rendering_gallery')
        .select('*, project:projects(title)');

    if (gError) {
        console.error("Error fetching gallery:", gError);
        if (gError.code === '42P01') {
            console.log("Table 'rendering_gallery' does not exist yet.");
        }
    } else {
        console.log(`Found ${gallery?.length} gallery items:`);
        gallery?.forEach(g => console.log(`- [${g.id}] Project: ${g.project?.title} (Sort: ${g.sort_order})`));
    }
}

checkProjects();
