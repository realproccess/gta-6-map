/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense, lazy } from 'react';
import { MapPin, Image as ImageIcon, Search, Plus, Minus, Ruler, Edit2, RotateCcw, Trash2, Settings, Heart, Coffee, LogOut, Mail } from 'lucide-react';
import { MapCanvas } from './MapCanvas';

import { Pin, GameState } from './types';

// Mock data
const INITIAL_PINS: Pin[] = [
  { id: 1, lat: 500, lng: 700, info: 'Downtown Port', type: 'location' },
  { id: 2, lat: 1500, lng: 1200, info: 'Vice Beach', type: 'landmark' },
  { id: 3, lat: 1800, lng: 400, info: 'Swamps', type: 'location' },
  { id: 4, lat: 1000, lng: 900, info: 'Club Malibu', type: 'leak' },
  { id: 5, lat: 1050, lng: 850, info: 'Heist Target', type: 'mission' },
  { id: 6, lat: 1550, lng: 1250, info: 'Ocean Hotel', type: 'landmark' },
  { id: 7, lat: 600, lng: 650, info: 'Dockyard', type: 'location' },
];

const CATEGORIES = ['location', 'landmark', 'leak', 'mission'];

import { SmartDrawingToolbar } from './components/SmartDrawingToolbar';
import { MiniGameWidget } from './components/MiniGameWidget';
import { ViceDreamBackground } from './components/ViceDreamBackground';

import { LaunchCountdown } from './components/LaunchCountdown';
import { UserBubble } from './components/UserBubble';
import { supabase } from './lib/supabase';

const SupportersSidebar = lazy(() => import('./components/SupportersSidebar').then(m => ({ default: m.SupportersSidebar })));
const EcosystemSettings = lazy(() => import('./components/EcosystemSettings'));
const AuthModal = lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));
const DonateModal = lazy(() => import('./components/DonateModal').then(m => ({ default: m.DonateModal })));
const CharactersModal = lazy(() => import('./components/CharactersModal').then(m => ({ default: m.CharactersModal })));
const NewsModal = lazy(() => import('./components/NewsModal'));
const ComingSoonModal = lazy(() => import('./components/ComingSoonModal'));
const NewsletterModal = lazy(() => import('./components/NewsletterModal'));

const GAME_LOCATIONS = [
  { lat: 500, lng: 500, img: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=500&q=80' },
  { lat: 1500, lng: 1000, img: 'https://images.unsplash.com/photo-1444525873963-75d329ef9e1b?w=500&q=80' },
];

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(CATEGORIES);
  const [activeTool, setActiveTool] = useState('select');
  const [activeColor, setActiveColor] = useState('#8A2BE2');
  const [drawingsCount, setDrawingsCount] = useState(0);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isSupportersOpen, setIsSupportersOpen] = useState(false);
  const [isCharactersOpen, setIsCharactersOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [comingSoonTitle, setComingSoonTitle] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [sessionUser, setSessionUser] = useState<string | null>(null);

  const isAnyModalOpen = isAuthModalOpen || isDonateOpen || isCharactersOpen || isNewsOpen || isNewsletterOpen || !!comingSoonTitle || isSettingsOpen || isSupportersOpen;

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUsername(session.user.id, session.user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchUsername(session.user.id, session.user.email);
      } else {
        setSessionUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUsername = async (userId: string, email?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();
        
      if (data && data.username) {
        setSessionUser(data.username);
      } else if (email) {
        setSessionUser(email.split('@')[0]);
      }
    } catch (err) {
      console.error('Error fetching username:', err);
    }
  };

  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    currentScreenshot: null,
    actualCoords: null,
    userGuess: null,
    score: 0,
  });

  const toggleFilter = (category: string) => {
    setActiveFilters(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const startGame = () => {
    const loc = GAME_LOCATIONS[Math.floor(Math.random() * GAME_LOCATIONS.length)];
    setGameState({
      isPlaying: true,
      currentScreenshot: loc.img,
      actualCoords: [loc.lat, loc.lng],
      userGuess: null,
      score: gameState.score,
    });
  };

  const stopGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      currentScreenshot: null,
      actualCoords: null,
      userGuess: null,
    }));
  };

  const handleGuess = (lat: number, lng: number) => {
    if (!gameState.actualCoords) return;
    
    const dist = Math.sqrt(
      Math.pow(lat - gameState.actualCoords[0], 2) + 
      Math.pow(lng - gameState.actualCoords[1], 2)
    );
    
    const points = Math.max(0, Math.floor(5000 - dist * 2));
    
    setGameState(prev => ({
      ...prev,
      userGuess: [lat, lng],
      score: prev.score + points,
    }));
    
    setTimeout(() => {
      setGameState(curr => {
         if (curr.isPlaying) {
             const loc = GAME_LOCATIONS[Math.floor(Math.random() * GAME_LOCATIONS.length)];
             return {
                 ...curr,
                 currentScreenshot: loc.img,
                 actualCoords: [loc.lat, loc.lng],
                 userGuess: null
             }
         }
         return curr;
      });
    }, 3000);
  };

  return (
    <div className={`main-app-wrapper relative w-screen h-screen overflow-hidden font-sans select-none text-white ${isAnyModalOpen ? 'modal-open' : ''}`}>
      <ViceDreamBackground />

      {/* MAP LAYER */}
      <div className={`absolute inset-0 z-10 ${activeTool !== 'select' ? 'map-drawing-active' : ''}`}>
        <MapCanvas 
          pins={INITIAL_PINS} 
          activeFilters={activeFilters}
          gameState={gameState}
          handleGuess={handleGuess}
          onCoordsChange={() => {}}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          activeColor={activeColor}
          drawingsRefresher={drawingsCount}
        />
      </div>

      {/* TOP HEADER PILL / NAV */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center py-4 px-8 pointer-events-none landscape:py-1">
        {/* The Hero Hub Container - Significantly larger footprint */}
        <div 
          className="flex items-center gap-2 sm:gap-4 md:gap-8 lg:gap-32 bg-black/10 backdrop-blur-sm rounded-xl px-2 sm:px-6 md:px-8 py-2 sm:py-4 md:py-4 border border-white/10 pointer-events-auto landscape:px-6 landscape:py-2 landscape:gap-6"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          
          {/* Navigation - Massive text for desktop */}
          <nav className="flex gap-2 sm:gap-4 md:gap-8 lg:gap-16 landscape:gap-4">
            <button 
              onClick={() => { import('./lib/haptics').then(m => m.Haptics.success()); setIsDonateOpen(true); }}
              className="text-[10px] sm:text-sm md:text-xl lg:text-4xl xl:text-5xl font-black uppercase text-white hover:text-yellow-400 transition-colors [text-shadow:_4px_4px_0_rgb(0_0_0)] landscape:text-lg"
            >
              TIP
            </button>
            
            {!sessionUser && (
              <>
                <button 
                  onClick={() => { import('./lib/haptics').then(m => m.Haptics.light()); setAuthMode('signup'); setIsAuthModalOpen(true); }}
                  className="text-[10px] sm:text-sm md:text-xl lg:text-4xl xl:text-5xl font-black uppercase text-white hover:text-cyan-400 transition-colors [text-shadow:_4px_4px_0_rgb(0_0_0)] landscape:text-lg"
                >
                  SIGN UP
                </button>
                
                <button 
                  onClick={() => { import('./lib/haptics').then(m => m.Haptics.light()); setAuthMode('signin'); setIsAuthModalOpen(true); }}
                  className="text-[10px] sm:text-sm md:text-xl lg:text-4xl xl:text-5xl font-black uppercase text-white hover:text-pink-400 transition-colors [text-shadow:_4px_4px_0_rgb(0_0_0)] landscape:text-lg"
                >
                  SIGN IN
                </button>
              </>
            )}
          </nav>

          {/* Countdown - Massive and bold */}
          <div className="border-l-2 md:border-l-4 border-white/50 pl-2 sm:pl-4 md:pl-8 flex items-center landscape:pl-4">
            <LaunchCountdown />
          </div>
          
        </div>
      </header>

      {/* LEFT TOOLBAR */}
      <SmartDrawingToolbar 
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        activeColor={activeColor}
        setActiveColor={setActiveColor}
        clearDrawings={() => setDrawingsCount(c => c + 1)}
        onOpenCharacters={() => setIsCharactersOpen(prev => !prev)}
        onOpenNews={() => setIsNewsOpen(prev => !prev)}
        onOpenComingSoon={(title) => setComingSoonTitle(title)}
      />

      {sessionUser && <UserBubble username={sessionUser} onSignOut={() => setSessionUser(null)} />}

      {/* Sign Out Button - Only show if logged in */}
      {sessionUser && (
        <button 
          onClick={async () => {
             await supabase.auth.signOut();
             setSessionUser(null);
          }}
          className="absolute right-3 sm:right-6 top-3 sm:top-6 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 sm:px-4 py-2 text-white font-semibold tracking-wide text-xs sm:text-sm hover:bg-white/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          title="Sign Out"
        >
          <LogOut size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      )}

      {/* RIGHT SIDE BUTTONS */}
      <div 
        className="right-action-dock"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* CONTACT BUTTON */}
        <button 
          onClick={() => { import('./lib/haptics').then(m => m.Haptics.light()); setIsNewsletterOpen(true); }}
          className="group shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-110 transition-transform haptic-btn"
          title="Contact"
        >
          <Mail size={18} className="text-white/90 group-hover:text-pink-400 transition-colors" />
        </button>

        {/* SETTINGS GEAR BUTTON */}
        <button 
          onClick={() => { import('./lib/haptics').then(m => m.Haptics.light()); setIsSettingsOpen(!isSettingsOpen); }}
          className="group shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-110 transition-transform haptic-btn"
          title="Ecosystem Settings"
        >
          <Settings size={18} className={`text-white/90 transition-transform duration-300 ${isSettingsOpen ? 'animate-[spin_4s_linear_infinite]' : 'group-hover:rotate-45'}`} />
        </button>

        {/* SUPPORT HEART BUTTON */}
        <button 
          onClick={() => { import('./lib/haptics').then(m => m.Haptics.success()); setIsDonateOpen(true); }}
          className="group shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-110 transition-transform haptic-btn"
          title="Support the Project"
        >
          <Heart size={18} className="text-white/90 group-hover:text-pink-500 transition-colors" />
        </button>
      </div>

      <Suspense fallback={<div className="hidden">Loading...</div>}>
        {isSupportersOpen && <SupportersSidebar isOpen={isSupportersOpen} onClose={() => setIsSupportersOpen(false)} />}
        
        {isSettingsOpen && <EcosystemSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onOpenDonate={() => setIsDonateOpen(true)} />}

        <MiniGameWidget gameState={gameState} startGame={startGame} stopGame={stopGame} onOpenComingSoon={setComingSoonTitle} />

        {isAuthModalOpen && <AuthModal 
          isOpen={isAuthModalOpen}
          initialMode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(username) => setSessionUser(username)}
        />}

        {isDonateOpen && <DonateModal 
          isOpen={isDonateOpen}
          onClose={() => setIsDonateOpen(false)}
        />}

        {isCharactersOpen && <CharactersModal
          isOpen={isCharactersOpen}
          onClose={() => setIsCharactersOpen(false)}
        />}

        {isNewsOpen && <NewsModal
          isOpen={isNewsOpen}
          onClose={() => setIsNewsOpen(false)}
        />}

        {!!comingSoonTitle && <ComingSoonModal
          isOpen={!!comingSoonTitle}
          onClose={() => setComingSoonTitle(null)}
          title={comingSoonTitle || ''}
          onOpenNewsletter={() => setIsNewsletterOpen(true)}
        />}

        {isNewsletterOpen && <NewsletterModal 
          isOpen={isNewsletterOpen}
          onClose={() => setIsNewsletterOpen(false)}
        />}
      </Suspense>

    </div>
  );
}
