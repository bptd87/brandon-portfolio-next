
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parsing
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) return {};
        const content = fs.readFileSync(envPath, 'utf-8');
        const env: Record<string, string> = {};
        content.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                // Remove quotes if present
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
                env[key] = value;
            }
        });
        return env;
    } catch (e) {
        console.error('Error loading .env:', e);
        return {};
    }
}

const env = loadEnv();

async function checkStack() {
    console.log('--- Checking Technology Stack ---');

    // 1. Check Database Protocol
    const dbUrl = env.DATABASE_URL;
    if (!dbUrl) {
        console.error('❌ DATABASE_URL is not defined in .env');
    } else {
        try {
            const url = new URL(dbUrl);
            console.log(`✅ DATABASE_URL Protocol: ${url.protocol}`);
            // Mask password for safety
            console.log(`ℹ️  Host: ${url.hostname}`);
        } catch (e) {
            console.error('❌ Could not parse DATABASE_URL:', e.message);
        }
    }

    // 2. Check Supabase Storage
    console.log('\n--- Checking Supabase Storage ---');
    const supaUrl = env.SUPABASE_URL;
    const supaKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supaUrl || !supaKey) {
        console.error('❌ Missing Supabase credentials (SUPABASE_URL or SUPABASE_SERVICE_KEY)');
        return;
    }

    const supabase = createClient(supaUrl, supaKey);

    try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        if (error) {
            console.error('❌ Failed to list buckets:', error.message);
        } else {
            console.log('✅ Buckets found:', buckets.map(b => b.name));
            const portfolioBucket = buckets.find(b => b.name === 'portfolio');
            if (portfolioBucket) {
                console.log('   ✅ "portfolio" bucket exists.');
            } else {
                console.error('   ❌ "portfolio" bucket is MISSING.');
                // Try to create it?
                console.log('   Attempting to create "portfolio" bucket...');
                const { data, error: createError } = await supabase.storage.createBucket('portfolio', {
                    public: true
                });
                if (createError) {
                    console.error('   ❌ Failed to create bucket:', createError.message);
                } else {
                    console.log('   ✅ Created "portfolio" bucket!');
                }
            }
        }
    } catch (e) {
        console.error('❌ Error checking storage:', e);
    }
}

checkStack();
