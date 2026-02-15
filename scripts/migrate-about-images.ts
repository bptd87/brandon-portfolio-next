import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// About page images to migrate
const images = [
  { name: 'profile-headshot', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/jDUthZkmakLJRTiP.jpeg' },
  { name: 'gallery-teaching', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/TsVdekRTdTHOgGda.JPG' },
  { name: 'gallery-uci', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/sgcZKfoZzxPeTUel.JPG' },
  { name: 'gallery-mentors', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/ZGRhzttUHjtimPXQ.JPG' },
  { name: 'gallery-teams', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/fPNAESGBIUQCJmkQ.JPG' },
  { name: 'gallery-collaborations', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/YgEJZLtqcTqihLMh.JPG' },
  { name: 'gallery-family', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/EeESHfPspBcRpEaU.JPG' },
  { name: 'gallery-partnerships', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/JbMFmQRXOBCttcpL.JPG' },
  { name: 'gallery-behind-scenes', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/GDSJlHzKeThOHVcF.JPG' },
];

const BUCKET = 'about-images';
const OUTPUT_DIR = './temp-images';

async function ensureBucketExists() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === BUCKET);
  
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    });
    if (error) {
      console.error('Failed to create bucket:', error.message);
      return false;
    }
    console.log(`✅ Created bucket: ${BUCKET}`);
  }
  return true;
}

async function downloadImage(url: string, filename: string): Promise<Buffer | null> {
  try {
    console.log(`📥 Downloading: ${filename}...`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
  } catch (err: any) {
    console.error(`❌ Failed to download ${filename}: ${err.message}`);
    return null;
  }
}

async function optimizeImage(buffer: Buffer, name: string, isProfile: boolean): Promise<Buffer> {
  const maxWidth = isProfile ? 800 : 600; // Profile larger, gallery smaller
  const quality = 80;
  
  return sharp(buffer)
    .resize(maxWidth, maxWidth, { 
      fit: 'inside',
      withoutEnlargement: true 
    })
    .webp({ quality })
    .toBuffer();
}

async function uploadToSupabase(buffer: Buffer, filename: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: 'image/webp',
      upsert: true
    });

  if (error) {
    console.error(`❌ Upload failed for ${filename}: ${error.message}`);
    return null;
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return urlData.publicUrl;
}

async function migrateImages() {
  console.log('🚀 Starting About page image migration...\n');

  // Ensure bucket exists
  const bucketReady = await ensureBucketExists();
  if (!bucketReady) {
    console.error('Failed to setup storage bucket');
    return;
  }

  const results: { name: string; oldUrl: string; newUrl: string }[] = [];

  for (const img of images) {
    const isProfile = img.name === 'profile-headshot';
    
    // Download
    const buffer = await downloadImage(img.url, img.name);
    if (!buffer) continue;

    // Optimize
    console.log(`🔧 Optimizing: ${img.name}...`);
    const optimized = await optimizeImage(buffer, img.name, isProfile);
    const originalSize = (buffer.length / 1024).toFixed(1);
    const newSize = (optimized.length / 1024).toFixed(1);
    console.log(`   ${originalSize}KB → ${newSize}KB`);

    // Upload
    const filename = `${img.name}.webp`;
    const newUrl = await uploadToSupabase(optimized, filename);
    if (newUrl) {
      console.log(`✅ Uploaded: ${filename}`);
      results.push({ name: img.name, oldUrl: img.url, newUrl });
    }
  }

  console.log('\n📋 Migration Results:');
  console.log('='.repeat(60));
  
  // Output the new URLs for updating code
  console.log('\n// Profile image:');
  const profile = results.find(r => r.name === 'profile-headshot');
  if (profile) {
    console.log(`src="${profile.newUrl}"`);
  }

  console.log('\n// Gallery images array:');
  console.log('const galleryImages = [');
  const galleryOrder = ['gallery-teaching', 'gallery-uci', 'gallery-mentors', 'gallery-teams', 
                        'gallery-collaborations', 'gallery-family', 'gallery-partnerships', 'gallery-behind-scenes'];
  const alts = ['Teaching scenic design to students', 'UC Irvine graduate school days', 
                'Collaborating with mentors', 'Working with creative teams', 'Creative collaborations',
                'Family and community', 'Design partnerships', 'Behind the scenes'];
  
  galleryOrder.forEach((name, i) => {
    const result = results.find(r => r.name === name);
    if (result) {
      console.log(`  { url: "${result.newUrl}", alt: "${alts[i]}" },`);
    }
  });
  console.log('];');

  console.log(`\n✅ Successfully migrated ${results.length}/${images.length} images`);
}

migrateImages().catch(console.error);
