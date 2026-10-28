// Supabase SSR session refresh middleware helper
import { createServerClient } from '@supabase/ssr';

export async function updateSession(request?: any) {
  const env = (typeof globalThis !== 'undefined' && (globalThis as any).process?.env) || {};

  const supabaseUrl =
    env.NEXT_PUBLIC_SUPABASE_URL ||
    env.VITE_SUPABASE_URL ||
    'https://gpkfthcqlfssiptzgena.supabase.co';

  const supabaseAnonKey =
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    '';

  let response: any = null;

  if (request) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = {
            cookies: {
              setAll: () => {},
            },
          };
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return { response, user };
  }

  return { response: null, user: null };
}
