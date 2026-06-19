import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (username: string) => void; // Keeping for compatibility with App.tsx if needed
  initialMode?: 'signup' | 'signin';
  initialView?: 'signup' | 'signin';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode, initialView, onSuccess }) => {
  const [view, setView] = useState<'signup' | 'signin'>(initialView || initialMode || 'signup');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setView(initialView || initialMode || 'signup');
    setErrorMsg(null);
    setEmail('');
    setPassword('');
    setUsername('');
  }, [initialView, initialMode, isOpen]);

  if (!isOpen) return null;

  // Clean error state whenever switching views
  const handleViewToggle = (newView: 'signup' | 'signin') => {
    setErrorMsg(null);
    setView(newView);
  };

  // Google Authentication Handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
  
    try {
      // Dynamically detect the origin to ensure it matches Google Cloud settings exactly
      const currentOrigin = window.location.origin;
      
      // Attempt to sign in with Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Redirect back to our app after Supabase finishes the Google login
          redirectTo: currentOrigin
        },
      });
  
      if (error) throw error;
    } catch (err: any) {
      console.error('Google Auth Failed:', err);
      setErrorMsg('Connection failed. Ensure the Redirect URI in Google Cloud matches this origin: ' + window.location.origin);
      setLoading(false);
    }
  };

  // Email/Password Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Sanitize input fields to prevent dumb 'credentials wrong' formatting bugs
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;
    const cleanUsername = username.trim();

    try {
      if (view === 'signup') {
        if (!cleanUsername) {
          setErrorMsg('Username is required.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: { username: cleanUsername },
          },
        });

        if (error) throw error;
        
        // Save username to profiles if it's new
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert([
              { id: data.user.id, username: cleanUsername, email: cleanEmail }
            ]);
            if (profileError) console.error('Error saving to profiles:', profileError);
        }
        
        // Check if email confirmation is required (session might be null)
        if (data.user && !data.session) {
          setErrorMsg('Signup successful! Please check your email to confirm your account before signing in.');
          setLoading(false);
          // Auto switch to sign in so they can login after confirming
          setTimeout(() => handleViewToggle('signin'), 4000);
          return;
        }

        if (onSuccess) onSuccess(cleanUsername);
        onClose();
      } else {
        // Sign In Flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) throw error;
        onClose(); // Close modal on success
      }
    } catch (err: any) {
      const rawMsg = err.message?.toLowerCase() || '';
      console.error('[Auth] error message:', err.message);
      console.error('[Auth] status:', err.status);
      console.error('[Auth] code:', err.code);
      console.error('[Auth] full:', err);

      if (rawMsg.includes('rate limit')) {
        setErrorMsg('Too many requests — wait a minute and try again.');
      } else if (rawMsg.includes('already registered') || rawMsg.includes('user already exists') || rawMsg.includes('exists')) {
        setErrorMsg('An account with this email already exists. Please sign in!');
        setTimeout(() => handleViewToggle('signin'), 2000);
      } else if (rawMsg.includes('invalid login credentials')) {
        setErrorMsg('Wrong email or password.');
      } else {
        // Always show the real Supabase message so we can diagnose it
        setErrorMsg(err.message || 'Unknown error — check the browser console.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Premium Translucent Neon Card */}
      <div className="ui-panel relative w-full max-w-md overflow-hidden text-white">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="modal-close-btn text-gray-400 hover:text-white transition-colors text-xl font-bold"
          disabled={loading}
        >
          ✕
        </button>

        {/* Title Dynamic Header */}
        <h2 className="text-3xl font-extrabold text-center uppercase tracking-wider italic bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
          {view === 'signup' ? 'Sign Up' : 'Sign In'}
        </h2>

        {/* User-friendly Error Prompt */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg text-sm bg-red-500/20 border border-red-500/40 text-red-300 animate-pulse text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Conditional Username Input for Signup */}
          {view === 'signup' && (
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-pink-300 mb-1">Username</label>
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-purple-950/50 border border-purple-500/20 focus:border-pink-500 focus:outline-none transition-colors placeholder-gray-500"
              />
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold text-pink-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              autoComplete="off"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-purple-950/50 border border-purple-500/20 focus:border-pink-500 focus:outline-none transition-colors placeholder-gray-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold text-pink-300 mb-1">Password</label>
            <input
              type="password"
              required
              autoComplete={view === 'signup' ? "new-password" : "current-password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-purple-950/50 border border-purple-500/20 focus:border-pink-500 focus:outline-none transition-colors placeholder-gray-500"
            />
          </div>

          {/* Main Action Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 font-bold uppercase tracking-wider hover:from-pink-500 hover:to-purple-500 transition-all duration-200 transform active:scale-95 shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>

        {/* Footer View Switcher Link */}
        <div className="mt-6 text-center text-xs tracking-wide text-gray-400 font-medium">
          {view === 'signup' ? (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => handleViewToggle('signin')} className="text-pink-400 hover:underline font-bold focus:outline-none">
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={() => handleViewToggle('signup')} className="text-pink-400 hover:underline font-bold focus:outline-none">
                Sign Up
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

