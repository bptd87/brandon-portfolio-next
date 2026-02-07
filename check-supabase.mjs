import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zuycsuajiuqsvopiioer.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1eWNzdWFqaXVxc3ZvcGlpb2VyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTgzOTU4NSwiZXhwIjoyMDc3NDE1NTg1fQ.TN_GzEO1M36MHZ_Xxbn8CqhbOFONUC5qOItReFTlhXs';

const supabase = createClient(supabaseUrl, supabaseKey);

// Get all tables
const { data: tables, error: tablesError } = await supabase
  .from('information_schema.tables')
  .select('table_name')
  .eq('table_schema', 'public');

if (tablesError) {
  console.log('Error fetching tables:', tablesError);
  
  // Try alternative method - query a common table name
  console.log('\nTrying common table names...');
  
  const commonTables = ['resume', 'experience', 'education', 'skills', 'work_experience', 'cv'];
  
  for (const tableName of commonTables) {
    const { data, error } = await supabase.from(tableName).select('*').limit(1);
    if (!error) {
      console.log(`\n✓ Found table: ${tableName}`);
      const { count } = await supabase.from(tableName).select('*', { count: 'exact', head: true });
      console.log(`  Rows: ${count}`);
    }
  }
} else {
  console.log('Tables found:', tables);
}

// Try to get resume data
const { data: resumeData, error: resumeError } = await supabase
  .from('resume')
  .select('*');

if (!resumeError && resumeData) {
  console.log('\nResume data:', JSON.stringify(resumeData, null, 2));
} else {
  console.log('\nNo resume table or error:', resumeError?.message);
}
