import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
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
    <div className="absolute top-6 left-6 z-[1000]">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 hover:bg-white/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-white font-semibold tracking-wide">@{username}</span>
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
