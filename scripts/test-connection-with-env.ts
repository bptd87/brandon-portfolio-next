import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

console.log('🔧 Testing Supabase Connection...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Simple query
    console.log('\n📊 Checking projects table...');
    const { data, error, count } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: false });
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    console.log(`✅ Projects table accessible: ${count} rows`);
    if (data && data.length > 0) {
      console.log('First project:', data[0].title);
    }
    
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
}

testConnection();
