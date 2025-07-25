import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase, isSupabaseAvailable, testSupabaseConnection } from "@/integrations/supabase/client";
import type { User, Session, AuthError } from '@supabase/supabase-js';

// Enhanced auth context interface with initialization state
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean; // Key for stability - tracks if auth system is ready
  available: boolean; // Tracks if Supabase is available
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: AuthError }>;
  signUp: (email: string, password: string) => Promise<{ data?: any; error?: AuthError }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Main Auth Provider with progressive enhancement
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [supabaseAvailable, setSupabaseAvailable] = useState(false);
  const [connectionTested, setConnectionTested] = useState(false);

  // Test Supabase availability on mount
  useEffect(() => {
    const testConnection = async () => {
      if (!isSupabaseAvailable()) {
        setSupabaseAvailable(false);
        setConnectionTested(true);
        return;
      }

      try {
        const available = await testSupabaseConnection();
        setSupabaseAvailable(available);
      } catch (error) {
        console.warn('Supabase connection test failed:', error);
        setSupabaseAvailable(false);
      } finally {
        setConnectionTested(true);
      }
    };

    testConnection();
  }, []);

  // Render appropriate provider based on availability
  if (!connectionTested) {
    // Show loading while testing connection
    return <AuthLoadingProvider>{children}</AuthLoadingProvider>;
  }

  if (!supabaseAvailable) {
    // Graceful fallback when Supabase unavailable
    return <AuthUnavailableProvider>{children}</AuthUnavailableProvider>;
  }

  // Full Supabase auth when available
  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
};

// Loading state provider while testing connection
const AuthLoadingProvider = ({ children }: { children: ReactNode }) => {
  const value: AuthContextType = {
    user: null,
    session: null,
    loading: true,
    initialized: false,
    available: false,
    signOut: async () => {},
    signIn: async () => ({ error: { message: 'Authentication system initializing' } as AuthError }),
    signUp: async () => ({ error: { message: 'Authentication system initializing' } as AuthError }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Fallback provider when Supabase is unavailable
const AuthUnavailableProvider = ({ children }: { children: ReactNode }) => {
  const value: AuthContextType = {
    user: null,
    session: null,
    loading: false,
    initialized: true,
    available: false,
    signOut: async () => {
      console.warn('Authentication unavailable - Supabase not configured');
    },
    signIn: async () => ({ 
      error: { message: 'Authentication unavailable - please check configuration' } as AuthError 
    }),
    signUp: async () => ({ 
      error: { message: 'Authentication unavailable - please check configuration' } as AuthError 
    }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Full Supabase authentication provider
const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    // Single source of truth for auth state - onAuthStateChange fires immediately with current session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setInitialized(true);

        // Handle auth events for better UX
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        } else if (event === 'SIGNED_IN') {
          console.log('User signed in');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!supabase) return;
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: { message: 'Authentication unavailable' } as AuthError };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      return { error: { message: 'Authentication unavailable' } as AuthError };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    return { data, error };
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    initialized,
    available: true,
    signOut,
    signIn,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Utility hook to check if auth is ready for use
export const useAuthReady = () => {
  const { initialized, available } = useAuth();
  return initialized && available;
};