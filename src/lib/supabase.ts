import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a mock client for development when env vars are not set
const createMockClient = () => ({
  auth: {
    signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => {
    // Chainable builder
    const builder = {
      select: function () { return this; },
      eq: function () { return this; },
      order: function () { return this; },
      insert: function () { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); },
      update: function () { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); },
      delete: function () { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); }
    };
    // Proxy: when awaited, acts like a Promise
    return new Proxy(builder, {
      get(target, prop) {
        if (prop === 'then') {
          // When awaited, resolve to { data: [], error: null }
          return Promise.resolve({ data: [], error: null }).then;
        }
        if (prop === 'catch') {
          return Promise.resolve({ data: [], error: null }).catch;
        }
        return target[prop as keyof typeof target];
      }
    });
  },
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: { message: 'Supabase Storage not configured' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  }
});

// Check if Supabase is properly configured (not placeholder values)
const isValidSupabaseConfig = supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your_supabase_project_url') &&
  supabaseUrl.startsWith('https://');

export const supabase = isValidSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export const isSupabaseConfigured = isValidSupabaseConfig;