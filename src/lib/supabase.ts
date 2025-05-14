
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Use environment variables or fallback to empty strings for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock client if credentials are missing (for development purposes)
export const supabase = (!supabaseUrl || !supabaseAnonKey) 
  ? createMockClient() 
  : createClient<Database>(supabaseUrl, supabaseAnonKey);

// Create a mock client that doesn't throw errors for development
function createMockClient() {
  console.warn('⚠️ Using mock Supabase client. Please set up your Supabase credentials.');
  
  // Create a mock client that returns empty data instead of throwing errors
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
      signUp: () => Promise.resolve({ data: {}, error: null }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: {}, error: null }),
        order: () => Promise.resolve({ data: [], error: null }),
        in: () => Promise.resolve({ data: [], error: null })
      }),
      insert: () => Promise.resolve({ data: {}, error: null }),
      update: () => Promise.resolve({ data: {}, error: null }),
      delete: () => Promise.resolve({ data: {}, error: null })
    })
  } as unknown as ReturnType<typeof createClient<Database>>;
}
