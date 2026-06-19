import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Heart, X } from 'lucide-react';

interface Supporter {
  id: string;
  name: string;
  amount: number;
  message: string;
  created_at: string;
}

interface SupportersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportersSidebar({ isOpen, onClose }: SupportersSidebarProps) {
  const [supporters, setSupporters] = useState<Supporter[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    // Fetch initial supporters
    const fetchSupporters = async () => {
      const { data, error } = await supabase
        .from('supporters')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (!error && data) {
        setSupporters(data);
      }
    };

    fetchSupporters();

    // Subscribe to new supporters in real-time
    const subscription = supabase
      .channel('public:supporters')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'supporters' },
        (payload) => {
          setSupporters((current) => [payload.new as Supporter, ...current]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <aside className="ui-panel absolute left-24 top-24 bottom-24 w-80 z-40 p-6 text-white flex flex-col animate-in slide-in-from-left-8 fade-in duration-300">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <h2 className="text-lg font-black tracking-widest flex items-center gap-2">
          <Heart size={20} className="text-pink-500" />
          SUPPORTERS
        </h2>
        <button onClick={onClose} className="close-btn text-white/50 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {supporters.length === 0 ? (
          <div className="text-center text-white/50 py-10 font-medium italic">
            No supporters yet. Be the first!
          </div>
        ) : (
          supporters.map((supporter) => (
            <div key={supporter.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-pink-400 capitalize">{supporter.name}</span>
                <span className="text-xs font-mono bg-pink-500/20 text-pink-200 px-2 py-1 rounded-md">
                  ${supporter.amount.toFixed(2)}
                </span>
              </div>
              {supporter.message && (
                <p className="text-sm text-white/80 leading-relaxed italic">"{supporter.message}"</p>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
