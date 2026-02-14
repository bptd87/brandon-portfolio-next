
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifySchema() {
    console.log('Verifying active column in rendering_gallery...');

    // Try to select the 'active' column specifically
    const { data, error } = await supabase
        .from('rendering_gallery')
        .select('id, active')
        .limit(1);

    if (error) {
        console.error('Error selecting active column:', error.message);
        console.log('FAILED: "active" column likely missing or schema cache stale.');
    } else {
        console.log('SUCCESS: Selected "active" column without error.');
        console.log('Sample data:', data);
    }

    // Also check model_gallery and experiential_gallery
    const { error: modelError } = await supabase.from('model_gallery').select('active').limit(1);
    if (modelError) console.error('Error checking model_gallery:', modelError.message);
    else console.log('SUCCESS: model_gallery has active column.');

    const { error: expError } = await supabase.from('experiential_gallery').select('active').limit(1);
    if (expError) console.error('Error checking experiential_gallery:', expError.message);
    else console.log('SUCCESS: experiential_gallery has active column.');
}

verifySchema();
