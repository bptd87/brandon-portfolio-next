import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('Supabase Connection', () => {
  it('should connect to Supabase with valid credentials', async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    
    expect(supabaseUrl).toBeDefined();
    expect(supabaseKey).toBeDefined();
    
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    
    // Test connection by querying a table
    const { data, error } = await supabase
      .from('categories')
      .select('count', { count: 'exact', head: true });
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
  
  it('should be able to query projects table', async () => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    
    const { data, error } = await supabase
      .from('projects')
      .select('id, title')
      .limit(1);
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
