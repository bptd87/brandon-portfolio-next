import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('SUPABASE_URL');
  if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_KEY');
  console.error(`Missing Supabase environment variables: ${missing.join(', ')}`);
  throw new Error(`Missing Supabase environment variables: ${missing.join(', ')}`);
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to convert Supabase timestamp to Date
export function parseDate(dateString: string | null): Date | null {
  if (!dateString) return null;
  return new Date(dateString);
}

// Helper to format Date for Supabase
export function formatDate(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString();
}
