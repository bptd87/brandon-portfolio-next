import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const ANON_KEY = process.env.SUPABASE_ANON_KEY!;

console.log('🔍 Checking Supabase project status...');
console.log('Project URL:', SUPABASE_URL);

async function checkStatus() {
  try {
    console.log('\n1️⃣ Trying to wake the project...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`
      },
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });
    
    console.log('Status:', response.status);
    console.log('Response:', await response.text());
    
    if (response.status === 200 || response.status === 404) {
      console.log('\n✅ Project is awake!');
    }
  } catch (error: any) {
    if (error.name === 'TimeoutError') {
      console.log('\n❌ Project is not responding (timeout)');
      console.log('This usually means:');
      console.log('  - Free tier project is paused');
      console.log('  - Need to restart it from Supabase dashboard');
      console.log('  - Or project has been suspended');
    } else {
      console.log('\n❌ Error:', error.message);
    }
  }
}

checkStatus();
