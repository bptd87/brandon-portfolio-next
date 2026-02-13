
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

async function checkSchema() {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching tutorials:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Tutorial keys:', Object.keys(data[0]).sort());
  } else {
    // If no data, we can't see keys easily.
    console.log('No tutorials found to check schema.');
  }
}

checkSchema();
