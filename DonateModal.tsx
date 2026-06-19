import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const KOFI_ID = "leonidamapecosystem"; 

  if (!isOpen) return null;

  const handleClose = () => {
    import('./haptics').then(m => m.Haptics.light());
    setShowPayment(false);
    setIsLoading(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8 overflow-y-auto">
      <div className="ko-fi-modal ui-panel relative w-full max-w-md p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 text-white">
        
        {/* BACK BUTTON */}
        {showPayment && (
          <button 
            onClick={() => {
              import('./haptics').then(m => m.Haptics.light());
              setShowPayment(false);
            }}
            className="absolute top-4 sm:top-6 left-4 sm:left-6 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 haptic-btn"
            title="Go Back"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
        )}

        {/* CLOSE BUTTON - Always visible */}
        <button 
          onClick={handleClose}
          className="kofi-modal-close-btn haptic-btn"
          title="Close Modal"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        {!showPayment ? (
          <>
            <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter text-white mb-4 gta-3d-title mt-8 sm:mt-0">
              Keep the Ecosystem Alive
            </h2>

            <p className="text-white/90 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 font-medium">
              Building this ultimate interactive map and community hub takes a ton of time, energy, and server resources. If you use the map and want to support the solo development leading up to the game's launch, any tip helps keep the servers running and the updates coming.
            </p>

            <button
              onClick={() => {
                import('./haptics').then(m => m.Haptics.success());
                setShowPayment(true);
              }}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 rounded-xl font-black italic text-sm sm:text-lg tracking-wider text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(244,63,94,0.4)] haptic-btn"
            >
              ☕ <span className="hidden sm:inline">Buy me a coffee /</span> Ko-fi
            </button>
          </>
        ) : (
          <>
            <div className={`mt-12 sm:mt-4 rounded-xl overflow-hidden bg-[#121218] kofi-iframe-container relative`} style={{ minHeight: '600px' }}>
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#121218] animate-pulse">
                  <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400 font-bold tracking-widest text-xs uppercase italic">Loading Secure Widget...</p>
                </div>
              )}
              <iframe 
                src={`https://ko-fi.com/${KOFI_ID}/?hidefeed=true&widget=true&embed=true&preview=true&dark=true`} 
                className="w-full h-full border-none relative z-20"
                style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s', minHeight: '600px' }}
                onLoad={() => setIsLoading(false)}
                title="Ko-fi Donation Widget"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
