import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Try service role key first (for bypassing RLS), fall back to anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or API key in .env');
  console.error('   Required: VITE_SUPABASE_URL VITE_SUPABASE_ANON_KEY');
  console.error('   Optional: SUPABASE_SERVICE_ROLE_KEY (for RLS bypass)');
  process.exit(1);
}

const keyType = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service Role' : 'Anon';
console.log(`🔑 Using ${keyType} key`);

const supabase = createClient(supabaseUrl, supabaseKey);
const buckets = ['project-images', 'news-images', 'article-images', 'about-images'];

async function listAllFiles(bucket, prefix = '') {
  const { data, error } = await supabase.storage.from(bucket).list(prefix);
  
  let allFiles = [];
  
  if (error) return allFiles;
  
  for (const item of data || []) {
    if (item.id === null) {
      // It's a directory, recurse
      const subFiles = await listAllFiles(bucket, prefix ? `${prefix}/${item.name}` : item.name);
      allFiles = [...allFiles, ...subFiles];
    } else {
      // It's a file
      const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
      allFiles.push({ name: fullPath, size: item.metadata?.size });
    }
  }
  
  return allFiles;
}

async function updateCacheHeaders() {
  let totalFiles = 0;
  let updatedFiles = 0;
  let skippedFiles = 0;

  for (const bucket of buckets) {
    console.log(`\n📦 Processing bucket: ${bucket}`);
    
    const files = await listAllFiles(bucket);
    
    if (!files || files.length === 0) {
      console.log(`  ℹ️  No files found`);
      continue;
    }

    console.log(`  Found ${files.length} files`);

    for (const file of files) {
      totalFiles++;
      const filePath = file.name;

      try {
        // Download the file
        const { data: downloadData, error: downloadError } = await supabase.storage
          .from(bucket)
          .download(filePath);

        if (downloadError) {
          console.error(`  ❌ ${filePath} - Download failed: ${downloadError.message}`);
          continue;
        }

        // Re-upload with cache headers
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, downloadData, {
            cacheControl: '31536000',
            upsert: true,
          });

        if (uploadError) {
          // RLS error - skip but note it
          if (uploadError.message?.includes('security')) {
            console.log(`  ⏭️  ${filePath} (RLS prevents update - need service role key)`);
            skippedFiles++;
          } else {
            console.error(`  ❌ ${filePath} - ${uploadError.message}`);
          }
        } else {
          console.log(`  ✅ ${filePath}`);
          updatedFiles++;
        }
      } catch (error) {
        console.error(`  ❌ ${filePath} - ${error.message}`);
      }
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Summary:`);
  console.log(`  Total files: ${totalFiles}`);
  console.log(`  Updated: ${updatedFiles}`);
  console.log(`  Skipped (RLS): ${skippedFiles}`);
  console.log(`  Cache: 1 year (31536000 seconds)`);
  console.log(`${'='.repeat(60)}`);

  if (skippedFiles > 0) {
    console.log(`\n⚠️  RLS Policy Issue:`);
    console.log(`  Some files couldn't be updated due to storage policies.`);
    console.log(`  Options:`);
    console.log(`  1. Add SUPABASE_SERVICE_ROLE_KEY to .env (has RLS bypass)`);
    console.log(`  2. Check bucket policies in Supabase Dashboard`);
    console.log(`  3. Set cache headers when uploading new files (recommended)`);
  }

  return updatedFiles;
}

console.log('🚀 Starting cache header update...');
console.log(`URL: ${supabaseUrl}\n`);

updateCacheHeaders()
  .then((count) => {
    if (count > 0) {
      console.log('\n✨ Cache headers updated successfully!');
      process.exit(0);
    } else if (count === 0) {
      console.log('\n⚠️  No files were updated');
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('\n❌ Fatal error:', err.message);
    process.exit(1);
  });
