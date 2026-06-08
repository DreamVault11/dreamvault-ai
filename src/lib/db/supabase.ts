// @ts-nocheck - Supabase types need gen-types from live DB
// Supabase client for server-side operations
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

// Server-side client with service role (for admin operations)
// WARNING: Only use in API routes, never expose to client
let _serverClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdmin() {
  if (!_serverClient) {
    if (!supabaseServiceKey) {
      throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
    }
    _serverClient = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _serverClient;
}

// Anon client for public operations (uses RLS)
let _anonClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient() {
  if (!_anonClient) {
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    if (!supabaseAnonKey) {
      throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    _anonClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return _anonClient;
}