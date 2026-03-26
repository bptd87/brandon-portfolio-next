import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const hasServerSupabaseEnv = Boolean(supabaseUrl && supabaseServiceKey);

if (!hasServerSupabaseEnv) {
  const missing = [];
  if (!supabaseUrl) missing.push('SUPABASE_URL');
  if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_KEY');
  console.error(`Missing Supabase environment variables: ${missing.join(', ')}`);
}

function createMissingSupabaseClient(): any {
  const throwMissingEnvError = () => {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY.");
  };

  const recursiveProxy = new Proxy(throwMissingEnvError, {
    get() {
      return recursiveProxy;
    },
    apply() {
      return throwMissingEnvError();
    },
  });

  return recursiveProxy;
}

// Avoid constructing the real client at import time unless service envs are present.
// This lets Next/Vercel import route modules during build without crashing.
export const supabase = hasServerSupabaseEnv
  ? createClient(supabaseUrl as string, supabaseServiceKey as string)
  : createMissingSupabaseClient();

export function serverSupabaseAvailable() {
  return hasServerSupabaseEnv;
}

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
