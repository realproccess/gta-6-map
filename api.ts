/**
 * Infrastructure setup for ZadenNura platform.
 * This file contains placeholders for future API and database integrations.
 */

// FUTURE: Initialize Supabase client here once credentials are added
// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

/**
 * Validates an email address.
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * FUTURE: Authenticate user using email and password.
 * This will connect to Supabase Auth.
 */
export const loginUser = async (email: string, password: string) => {
  // TODO: Implement Supabase login
  // const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  console.log('Login placeholder for:', email);
  return { success: true, message: 'Login infrastructure ready' };
};

/**
 * FUTURE: Register user for waiting list / newsletter.
 * Currently simulates an API call.
 */
export const registerEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (validateEmail(email)) {
        // TODO: Insert email into Supabase 'waitlist' table
        // await supabase.from('waitlist').insert([{ email }])
        resolve({ success: true, message: 'Successfully registered!' });
      } else {
        resolve({ success: false, message: 'Invalid email address.' });
      }
    }, 800);
  });
};

/**
 * FUTURE: Fetch user profile data from database.
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  // TODO: Fetch from Supabase 'profiles' table
  // const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  console.log('Fetching profile placeholder for:', userId);
  return null;
};
