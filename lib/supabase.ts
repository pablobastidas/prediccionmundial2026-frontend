import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock auth for development if using dummy URL
if (supabaseUrl.includes('dummy')) {
  const MOCK_SESSION_KEY = 'sb-mock-session';
  
  const getMockSession = () => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(MOCK_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  };

  const setMockSession = (session: any) => {
    if (typeof window === 'undefined') return;
    if (session) {
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(MOCK_SESSION_KEY);
    }
  };

  let authListener: any = null;

  supabase.auth.signInWithOtp = async (args: any) => {
    console.log('Mocking signInWithOtp for:', args.email);
    await new Promise(resolve => setTimeout(resolve, 800));
    const session = { 
      access_token: `fake-token|${args.email}|${args.email.split('@')[0]}`, 
      user: { id: 'demo-id', email: args.email, user_metadata: { display_name: args.email.split('@')[0] } } 
    };
    setMockSession(session);
    if (authListener) authListener('SIGNED_IN', session);
    return { data: { user: session.user, session }, error: null } as any;
  };

  supabase.auth.signUp = async (args: any) => {
    console.log('Mocking signUp for:', args.email);
    await new Promise(resolve => setTimeout(resolve, 800));
    const displayName = args.options?.data?.full_name || args.email.split('@')[0];
    const session = { 
      access_token: `fake-token|${args.email}|${displayName}`, 
      user: { id: 'demo-id', email: args.email, user_metadata: args.options?.data || { display_name: displayName } } 
    };
    setMockSession(session);
    if (authListener) authListener('SIGNED_IN', session);
    return { data: { user: session.user, session }, error: null } as any;
  };
  
  supabase.auth.signInWithPassword = async (args: any) => {
    console.log('Mocking signInWithPassword for:', args.email);
    await new Promise(resolve => setTimeout(resolve, 800));
    const session = { 
      access_token: `fake-token|${args.email}|${args.email.split('@')[0]}`, 
      user: { id: 'demo-id', email: args.email, user_metadata: { display_name: args.email.split('@')[0] } } 
    };
    setMockSession(session);
    if (authListener) authListener('SIGNED_IN', session);
    return { data: { user: session.user, session }, error: null } as any;
  };

  supabase.auth.getSession = async () => {
    return { data: { session: getMockSession() }, error: null } as any;
  };

  supabase.auth.signOut = async () => {
    console.log('Mocking signOut');
    setMockSession(null);
    if (authListener) authListener('SIGNED_OUT', null);
    return { error: null };
  };

  supabase.auth.onAuthStateChange = (callback) => {
    authListener = callback;
    const session = getMockSession();
    // Use a small delay to simulate async behavior and avoid state updates during render
    setTimeout(() => {
      callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
    }, 0);
    return { data: { subscription: { unsubscribe: () => { authListener = null; } } } } as any;
  };
}
