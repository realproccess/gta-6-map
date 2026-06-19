import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const supabaseUrl = rawUrl?.trim().replace(/\/$/, '') ?? '';
const supabaseAnonKey = rawKey?.trim() ?? '';

if (import.meta.env.DEV) {
  console.log('[Supabase] URL:', supabaseUrl || '⚠️ MISSING');
  console.log('[Supabase] Key present:', supabaseAnonKey ? 'yes' : '⚠️ MISSING');
  console.log('[Supabase] URL valid format:', /^https:\/\/.+\.supabase\.co$/.test(supabaseUrl) ? '✅' : '❌ unexpected format');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);