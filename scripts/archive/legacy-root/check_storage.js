import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (!line.startsWith('#') && line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_ANON_KEY
);

async function checkStorage() {
  try {
    console.log('===== CHECKING SUPABASE STORAGE BUCKETS =====\n');
    
    const buckets = ['projects', 'project-images', 'gallery', 'portfolio'];
    
    for (const bucketName of buckets) {
      try {
        const { data, error } = await supabase.storage.from(bucketName).list('', {
          limit: 100,
          offset: 0,
        });
        
        if (error) {
          console.log(`❌ Bucket "${bucketName}": ${error.message}`);
        } else if (data && data.length > 0) {
          console.log(`✓ Bucket "${bucketName}": ${data.length} files`);
          data.slice(0, 10).forEach(file => {
            console.log(`  - ${file.name}`);
          });
          if (data.length > 10) console.log(`  ... and ${data.length - 10} more files`);
        } else {
          console.log(`✓ Bucket "${bucketName}": empty`);
        }
      } catch (e) {
        console.log(`❌ Bucket "${bucketName}": ${e.message}`);
      }
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
}

checkStorage();
