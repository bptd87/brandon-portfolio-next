import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function parseCSV(csvContent) {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        // Handle quoted fields with commas
        const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
        const record = {};
        headers.forEach((header, i) => {
            record[header] = values[i]?.replace(/^"|"$/g, '').trim() || '';
        });
        return record;
    }).filter(record => record.id);
}

async function importScenicDirectory() {
    console.log('📖 Reading CSV file...');

    const csvContent = fs.readFileSync('./data/scenicDirectory_20260213_094712.csv', 'utf-8');
    const records = parseCSV(csvContent);

    console.log(`Found ${records.length} records to import`);

    const transformedRecords = records.map(record => ({
        name: record.title,
        description: record.description,
        category_name: getCategoryName(record.categorySlug),
        category_slug: record.categorySlug,
        url: record.url,
        status: record.enabled === '1' ? 'published' : 'draft',
        created_at: record.createdAt
    }));

    console.log('🚀 Importing to Supabase...');

    const { data, error } = await supabase
        .from('scenic_directory')
        .insert(transformedRecords)
        .select();

    if (error) {
        console.error('❌ Error importing:', error);
        process.exit(1);
    }

    console.log(`✅ Successfully imported ${data.length} records!`);
    console.log('\nSample imported record:');
    console.log(data[0]);
}

function getCategoryName(slug) {
    const categoryMap = {
        'industry': 'Industry',
        'research': 'Research',
        'software': 'Software',
        'modeling': '3D Modeling',
        'supplies': 'Supplies'
    };
    return categoryMap[slug] || slug;
}

importScenicDirectory().catch(console.error);
