import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const BUCKET_NAME = 'portfolio-assets';
const FOLDER = 'design-history';

const SOURCE_DIR = 'client/public/assets/design-history';
const TARGET_FILE = 'client/src/pages/DesignHistoryTimeline.tsx';

async function compressAndUpload() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    console.log('🔍 Reading source directory...');
    const files = fs.readdirSync(SOURCE_DIR);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

    console.log(`📦 Found ${imageFiles.length} images to process`);

    const urlMapping: Record<string, string> = {};

    for (const filename of imageFiles) {
        const sourcePath = path.join(SOURCE_DIR, filename);
        const stats = fs.statSync(sourcePath);

        // Skip tiny error files
        if (stats.size < 1000) {
            console.log(`⏭️  Skipping tiny file: ${filename}`);
            continue;
        }

        console.log(`\n🖼️  Processing: ${filename} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);

        // Convert to WebP
        const webpFilename = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp');

        try {
            const compressed = await sharp(sourcePath)
                .webp({ quality: 85 })
                .toBuffer();

            console.log(`   ✅ Compressed: ${(compressed.length / 1024).toFixed(0)}KB (${((1 - compressed.length / stats.size) * 100).toFixed(0)}% reduction)`);

            // Upload to Supabase
            const uploadPath = `${FOLDER}/${webpFilename}`;
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(uploadPath, compressed, {
                    contentType: 'image/webp',
                    upsert: true
                });

            if (error) {
                console.error(`   ❌ Upload failed: ${error.message}`);
                continue;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(uploadPath);

            console.log(`   ☁️  Uploaded: ${publicUrl}`);

            // Map old filename to new URL
            urlMapping[`/assets/design-history/${filename}`] = publicUrl;

        } catch (error) {
            console.error(`   ❌ Failed to process: ${error}`);
        }
    }

    console.log('\n📝 Updating DesignHistoryTimeline.tsx...');
    let content = fs.readFileSync(TARGET_FILE, 'utf-8');

    let replacements = 0;
    for (const [oldPath, newUrl] of Object.entries(urlMapping)) {
        const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = content.match(regex);
        if (matches) {
            content = content.replace(regex, newUrl);
            replacements += matches.length;
        }
    }

    fs.writeFileSync(TARGET_FILE, content, 'utf-8');
    console.log(`✅ Updated ${replacements} references in DesignHistoryTimeline.tsx`);

    console.log('\n🎉 Migration complete!');
    console.log(`   Processed: ${Object.keys(urlMapping).length} images`);
    console.log(`   You can now delete: ${SOURCE_DIR}`);
}

compressAndUpload().catch(console.error);
