import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';

const SOURCE_DIR = 'client/public/assets/design-history';
const TARGET_FILE = 'client/src/pages/DesignHistoryTimeline.tsx';
const FOLDER = 'design-history';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function compressAndUpload() {
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
        const baseName = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');

        try {
            const compressed = await sharp(sourcePath)
                .webp({ quality: 85 })
                .toBuffer();

            console.log(`   ✅ Compressed: ${(compressed.length / 1024).toFixed(0)}KB (${((1 - compressed.length / stats.size) * 100).toFixed(0)}% reduction)`);

            // Upload to Cloudinary
            const result = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: FOLDER,
                        public_id: baseName,
                        format: 'webp',
                        resource_type: 'image'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(compressed);
            });

            console.log(`   ☁️  Uploaded: ${result.secure_url}`);

            // Map old filename to new URL
            urlMapping[`/assets/design-history/${filename}`] = result.secure_url;

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

    // Also update placeholder references
    const placeholderRegex = /\/android-chrome-512x512\.png/g;
    const placeholderMatches = content.match(placeholderRegex);
    if (placeholderMatches && placeholderMatches.length > 0) {
        console.log(`\n⚠️  Warning: ${placeholderMatches.length} placeholder references remain (these are for images we couldn't download)`);
    }

    console.log('\n🎉 Migration complete!');
    console.log(`   Processed: ${Object.keys(urlMapping).length} images`);
    console.log(`   Total saved: ~${Math.round((27 - (Object.keys(urlMapping).length * 0.15)))}MB`);
    console.log(`\n📁 Next steps:`);
    console.log(`   1. Verify the page loads correctly`);
    console.log(`   2. Run: rm -rf ${SOURCE_DIR}`);
    console.log(`   3. Commit and deploy`);
}

compressAndUpload().catch(console.error);
