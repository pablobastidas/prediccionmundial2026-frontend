import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    // 5-second fallback timeout to prevent infinite loading state if Supabase fails to respond
    const timeoutId = setTimeout(() => {
      if (active) {
        setLoading(false);
      }
    }, 5000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active) {
        clearTimeout(timeoutId);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.access_token) {
          const maxAge = session.expires_in || 3600;
          document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
        }
      }
    }).catch((err) => {
      console.error("Error getting session:", err);
      if (active) {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (active) {
        setUser(session?.user ?? null);
        setLoading(false);

        // Sync access token to cookie
        if (session?.access_token) {
          const maxAge = session.expires_in || 3600;
          document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
        } else {
          document.cookie = `sb-access-token=; path=/; max-age=0; SameSite=Lax; Secure`;
        }

        if (event === 'TOKEN_REFRESHED') {
          console.log("Supabase session token refreshed successfully");
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSessionExpired(true);
          // Redirect to login only if we are on a protected page
          if (typeof window !== 'undefined' && !['/login', '/register'].includes(window.location.pathname)) {
            router.push('/login?message=session_expired');
          }
        }
      }
    });

    return () => {
      active = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signOut, isAuthenticated: !!user, sessionExpired };
};
