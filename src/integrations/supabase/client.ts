import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Environment-aware Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Graceful degradation if configuration is missing
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase configuration missing - survey functionality will be disabled');
  console.warn('To enable surveys, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
}

// Create client only if configuration is available
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: localStorage,
      }
    })
  : null;

// Utility functions for availability checking
export const isSupabaseAvailable = (): boolean => {
  return supabase !== null;
};

// Test connection utility for initialization
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!supabase) {
    return false;
  }
  
  try {
    const { error } = await supabase.from('profiles').select('count').limit(1);
    return !error;
  } catch (error) {
    console.warn('Supabase connection test failed:', error);
    return false;
  }
};

// Safe wrapper for Supabase operations
export const withSupabase = <T>(
  operation: (client: typeof supabase) => T,
  fallback: T
): T => {
  if (!isSupabaseAvailable()) {
    return fallback;
  }
  return operation(supabase);
};