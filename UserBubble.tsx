import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { LogOut, User } from 'lucide-react';

interface UserBubbleProps {
  username: string;
  onSignOut: () => void;
}

export function UserBubble({ username, onSignOut }: UserBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    // Positioned below the header (top:70px) and centered so it never covers
    // the VI logo, TIP text, or countdown timer (header is z-50, this is z-30).
    <div className="absolute top-[70px] left-1/2 -translate-x-1/2 z-30 max-w-xs w-auto">
      <div className="relative flex justify-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1 hover:bg-white/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shrink-0">
            <User size={10} className="text-white" />
          </div>
          <span className="text-white text-xs font-semibold tracking-wide max-w-[100px] truncate">@{username}</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-full overflow-hidden bg-white/10 backdrop-blur-[15px] border border-white/20 rounded-[20px] shadow-xl">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
