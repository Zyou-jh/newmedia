import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const env =
  (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};

const supabaseUrl = env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY ?? '';

// 仅当同时配置了 URL 和 anon key 时启用真实 Supabase，否则运行 Demo 模式
export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseEnabled
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
