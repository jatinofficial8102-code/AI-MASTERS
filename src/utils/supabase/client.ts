import { createClient } from '@supabase/supabase-js';

// Read the exact variable names specified:
// In Vite, variables must be defined in .env.local and exposed via envPrefix in vite.config.ts
const rawUrl =
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL ||
  'https://gpkfthcqlfssiptzgena.supabase.co';

const rawKey =
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  '';

export const supabaseUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';
export const supabasePublishableKey = typeof rawKey === 'string' ? rawKey.trim() : '';

// Validation logic for Supabase configuration
export function validateSupabaseConfig(): { isValid: boolean; error?: string } {
  if (!supabaseUrl) {
    return {
      isValid: false,
      error: 'NEXT_PUBLIC_SUPABASE_URL is missing. Please set your Supabase Project URL in .env.local.',
    };
  }

  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    return {
      isValid: false,
      error: 'NEXT_PUBLIC_SUPABASE_URL appears invalid. Expected format: https://<project-ref>.supabase.co',
    };
  }

  if (!supabasePublishableKey) {
    return {
      isValid: false,
      error:
        'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing in .env.local. Please copy your anon/publishable key from Supabase Dashboard → Project Settings → API Keys.',
    };
  }

  if (
    supabasePublishableKey.includes('YOUR_') ||
    supabasePublishableKey.includes('placeholder') ||
    supabasePublishableKey === 'YOUR_ACTUAL_EXISTING_PUBLISHABLE_KEY' ||
    supabasePublishableKey === 'YOUR_EXISTING_PUBLISHABLE_KEY'
  ) {
    return {
      isValid: false,
      error:
        'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local is currently set to placeholder text. Please replace it with your actual anon public key from Supabase Dashboard (Project Settings → API).',
    };
  }

  return { isValid: true };
}

const configValidation = validateSupabaseConfig();
export const isSupabaseConfigured = configValidation.isValid;
export const supabaseConfigError = configValidation.error;

if (!isSupabaseConfigured) {
  console.warn(`[Supabase Client Configuration Warning]: ${supabaseConfigError}`);
}

// Fallback dummy token prevents app runtime crashes on initial load before user provides key in .env.local
const clientKey = isSupabaseConfigured
  ? supabasePublishableKey
  : 'placeholder-public-anon-key-awaiting-configuration';

export const supabase = createClient(supabaseUrl, clientKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});
