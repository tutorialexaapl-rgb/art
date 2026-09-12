import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.endsWith('.supabase.co')
);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '%c[Atelier] Supabase nie jest skonfigurowane.\n' +
    'Aplikacja działa w trybie mock data (fallback).\n' +
    'Aby włączyć Supabase, ustaw zmienne środowiskowe:\n' +
    '  VITE_SUPABASE_URL=https://<project>.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=<anon-key>\n' +
    'Uwaga: NIGDY nie używaj service role key w frontendzie.',
    'color:#e0a020;font-size:13px;font-weight:bold;'
  );
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : ({} as SupabaseClient);
