import { createClient } from '@supabase/supabase-js';
import { readPublicEnv } from './readPublicEnv';

const supabaseUrl = readPublicEnv('NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL', 'SUPABASE_URL');
const supabaseAnonKey = readPublicEnv(
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_ANON_KEY'
);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && typeof console !== 'undefined') {
  console.warn(
    '[supabase] Missing public Supabase environment variables. Falling back to a placeholder client.'
  );
}

const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.payload.signature';

export const supabase = createClient(
  supabaseUrl || fallbackUrl,
  supabaseAnonKey || fallbackAnonKey
);
