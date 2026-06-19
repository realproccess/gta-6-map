import React from 'react';
import { GameState } from '../types';
import { Target, XCircle } from 'lucide-react';

interface MiniGameWidgetProps {
  gameState: GameState;
  startGame: () => void;
  stopGame: () => void;
  onOpenComingSoon?: (feature: string) => void;
}

export function MiniGameWidget({ gameState, startGame, stopGame, onOpenComingSoon }: MiniGameWidgetProps) {
  if (!gameState.isPlaying) {
    return (
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 minigame-container play-guesser-btn">
        <button 
          onClick={() => { import('./haptics').then(m => m.Haptics.heavy()); onOpenComingSoon?.('GUESSER MODE'); }}
          className="bg-pink-600 text-white font-bold rounded-full transition-all text-xs px-3 py-1.5 md:text-base md:px-6 md:py-3 haptic-btn"
        >
          PLAY GUESSER MODE
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-80 sm:w-96 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl text-white animate-in slide-in-from-bottom-8 minigame-container">
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-pink-400">
          <Target size={16} />
          <span className="font-bold tracking-widest text-xs">FIND THIS LOCATION</span>
        </div>
        <button onClick={stopGame} className="text-white/50 hover:text-white transition-colors">
          <XCircle size={18} />
        </button>
      </div>
      
      {gameState.currentScreenshot && (
        <div className="w-full h-40 bg-gray-900 rounded-lg mb-4 overflow-hidden border border-white/10 relative">
          <img src={gameState.currentScreenshot} alt="Target Location" className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <p className="text-[10px] font-mono text-pink-300">GEO-DATA CORRUPTED. MANUAL OVERRIDE REQUIRED.</p>
          </div>
        </div>
      )}

      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] text-white/50 font-bold tracking-wider mb-1">CURRENT SCORE</div>
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 leading-none">
            {gameState.score.toLocaleString()}
          </div>
        </div>
        
        <div className="text-right">
          {gameState.userGuess ? (
            <span className="text-xs font-bold text-cyan-400 animate-pulse">CALCULATING PROXIMITY...</span>
          ) : (
            <span className="text-xs font-bold text-white/70">CLICK MAP TO GUESS</span>
          )}
        </div>
      </div>
    </div>
  );
}
