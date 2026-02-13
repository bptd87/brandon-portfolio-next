
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env
try {
  const envConfig = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val) {
      process.env[key.trim()] = val.trim();
    }
  });
} catch (e) {
  console.log('Error reading .env', e);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function backfillImages() {
  console.log('Fetching tutorials with video_url...');
  
  const { data: tutorials, error } = await supabase
    .from('tutorials')
    .select('id, slug, video_url, cover_image');

  if (error) {
    console.error('Error fetching tutorials:', error);
    process.exit(1);
  }

  console.log(`Found ${tutorials.length} tutorials.`);

  for (const tutorial of tutorials) {
    if (!tutorial.video_url) {
      console.log(`Skipping ${tutorial.slug} (no video_url)`);
      continue;
    }

    let videoId = tutorial.video_url;
    
    // Check if it's already a URL
    const ytMatch = tutorial.video_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch && ytMatch[1]) {
      videoId = ytMatch[1];
    }

    // Sanity check ID length (YouTube IDs are 11 chars)
    if (videoId.length !== 11) {
       console.log(`Skipping ${tutorial.slug} - Invalid ID/URL format: ${tutorial.video_url}`);
       continue;
    }

    const coverImageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const fullVideoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Update if cover is missing OR if video_url is not a full URL
    if (tutorial.cover_image === coverImageUrl && tutorial.video_url === fullVideoUrl) {
      console.log(`Skipping ${tutorial.slug} (already up to date)`);
      continue;
    }

    console.log(`Updating ${tutorial.slug}: data...`);

    const { error: updateError } = await supabase
      .from('tutorials')
      .update({ 
          cover_image: coverImageUrl,
          video_url: fullVideoUrl 
      })
      .eq('id', tutorial.id);

    if (updateError) {
      console.error(`Error updating ${tutorial.slug}:`, updateError);
    } else {
        console.log(`Updated ${tutorial.slug}`);
    }
  }
}

backfillImages();
