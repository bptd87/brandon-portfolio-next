
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
// Validating we have the SERVICE key for writing if RLS is on, but ANON might work if policies allow.
// Ideally use SERVICE_KEY.

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const tutorialFilePath = path.resolve(__dirname, '../client/src/pages/TutorialDetail.tsx');
const fileContent = fs.readFileSync(tutorialFilePath, 'utf8');

// Extract the tutorials object
const startMarker = 'const tutorials: Record<string, any> = {';
const startIndex = fileContent.indexOf(startMarker);

if (startIndex === -1) {
  console.error('Could not find tutorials object start');
  process.exit(1);
}

let openBraces = 0;
let endIndex = -1;
let foundStart = false;

// Start scanning from the opening brace of the object
const objectStartIndex = startIndex + startMarker.length - 1; // pointing to '{'

for (let i = objectStartIndex; i < fileContent.length; i++) {
  if (fileContent[i] === '{') {
    openBraces++;
    foundStart = true;
  } else if (fileContent[i] === '}') {
    openBraces--;
  }

  if (foundStart && openBraces === 0) {
    endIndex = i + 1;
    break;
  }
}

if (endIndex === -1) {
  console.error('Could not find tutorials object end');
  process.exit(1);
}

const tutorialsString = fileContent.substring(objectStartIndex, endIndex);

// Evaluate the string to get the object
// We might need to handle some TS specific syntax if present inside the object, 
// but looking at the file, it seems to be standard JS object notation.
let tutorials;
try {
  // Use Function constructor to evaluate safely-ish
  const cleanString = tutorialsString; 
  tutorials = eval('(' + cleanString + ')');
} catch (e) {
  console.error('Error parsing tutorials object:', e);
  console.log('String start:', tutorialsString.substring(0, 100));
  process.exit(1);
}

async function migrate() {
  console.log(`Found ${Object.keys(tutorials).length} tutorials to migrate.`);

  for (const [slug, data] of Object.entries(tutorials)) {
    console.log(`Migrating ${slug}...`);

    // Map fields to snake_case for DB
    const updatePayload = {
      title: data.title,
      slug: data.slug,
      video_url: data.youtubeId,
      category: data.category,
      difficulty: data.difficulty,
      duration: data.duration, // Note: DB might expect integer seconds or string depending on schema. 
      // Checking old schema/db.ts: duration is number | null. 
      // But in the file it is string "4:24" OR number?
      // Step 1649 line 2316: `typeof tutorial.duration === 'number'` check implies it can be number.
      // But looking at data: `duration: "13:20"` (string).
      // Wait, db.ts `createTutorial` expects `duration` (number | null).
      // The `tutorials` values are STRINGS like "13:20".
      // I should parse this to seconds if the DB expects integer. 
      // Let's check `db.ts` again. line 1037: `duration: number | null;`
      // So I MUST convert "MM:SS" to seconds.
      
      description: data.description,
      overview: data.overview, // JSONB
      learning_objectives: data.learningObjectives, // JSONB array
      key_concepts: data.keyConcepts, // JSONB array
      pro_tips: data.proTips, // JSONB array
      shortcuts: data.shortcuts, // JSONB array
      common_pitfalls: data.commonPitfalls, // JSONB array
      transcript: data.transcript, // JSONB array
      related_resources: data.relatedResources, // JSONB array
      related_tutorials: data.relatedTutorials, // JSONB array
      
      // Additional fields if present in DB but not in source:
      // status, featured, etc. I'll leave them as default or ignore.
      updated_at: new Date().toISOString(),
    };

    // Convert duration
    if (typeof data.duration === 'string') {
      const parts = data.duration.split(':').map(Number);
      if (parts.length === 2) {
        updatePayload.duration = parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        updatePayload.duration = parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
    } else {
        updatePayload.duration = data.duration;
    }

    // Try to update existing first
    const { data: existing, error: findError } = await supabase
      .from('tutorials')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (findError) {
      console.error(`Error checking tutorial ${slug}:`, findError);
      continue;
    }

    if (existing) {
      // Update
      const { error: updateError } = await supabase
        .from('tutorials')
        .update(updatePayload)
        .eq('id', existing.id);

      if (updateError) {
        console.error(`Error updating ${slug}:`, updateError);
      } else {
        console.log(`Updated ${slug}`);
      }
    } else {
      // Insert
      // We might need 'status' and 'featured' defaults
      updatePayload.status = 'published';
      updatePayload.featured = false;
      
      const { error: insertError } = await supabase
        .from('tutorials')
        .insert(updatePayload);

      if (insertError) {
        console.error(`Error inserting ${slug}:`, insertError);
      } else {
        console.log(`Inserted ${slug}`);
      }
    }
  }
  
  console.log('Migration complete.');
}

migrate();
