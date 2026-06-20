import React, { useState, useEffect } from 'react';
import { X, Heart, ShieldAlert } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDonate: () => void;
}

export default function EcosystemSettings({ isOpen, onClose, onOpenDonate }: SettingsProps) {
  const [distanceUnits, setDistanceUnits] = useState<'KM' | 'MILES'>('KM');
  const [performanceMode, setPerformanceMode] = useState(false);
  const [personalizedAds, setPersonalizedAds] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTos, setShowTos] = useState(false);

  useEffect(() => {
    // Load preferences when page loads/component mounts
    const useMiles = localStorage.getItem('leonida_pref_units_miles') === 'true';
    setDistanceUnits(useMiles ? 'MILES' : 'KM');

    const perfMode = localStorage.getItem('leonida_pref_performance') === 'true';
    setPerformanceMode(perfMode);

    const ads = localStorage.getItem('leonida_pref_ads');
    setPersonalizedAds(ads === null ? true : ads === 'true');
    
    const analytics = localStorage.getItem('leonida_pref_analytics');
    setAnalyticsData(analytics === null ? true : analytics === 'true');

    const darkMode = localStorage.getItem('leonida_pref_darkmode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isOpen]); // Reload when opened to sync with any other changes

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('leonida_pref_darkmode', newMode ? 'true' : 'false');
    if (newMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  const handleToggleUnits = () => {
    const newUnit = distanceUnits === 'KM' ? 'MILES' : 'KM';
    setDistanceUnits(newUnit);
    localStorage.setItem('leonida_pref_units_miles', newUnit === 'MILES' ? 'true' : 'false');
    window.dispatchEvent(new Event('leonida_settings_changed'));
  };

  const handleTogglePerformance = () => {
    const newMode = !performanceMode;
    setPerformanceMode(newMode);
    localStorage.setItem('leonida_pref_performance', newMode ? 'true' : 'false');
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      if (newMode) {
        mapContainer.classList.add('low-res-mode');
      } else {
        mapContainer.classList.remove('low-res-mode');
      }
    }
  };

  const handleToggleAds = () => {
    const newVal = !personalizedAds;
    setPersonalizedAds(newVal);
    localStorage.setItem('leonida_pref_ads', newVal ? 'true' : 'false');
  };

  const handleToggleAnalytics = () => {
    const newVal = !analyticsData;
    setAnalyticsData(newVal);
    localStorage.setItem('leonida_pref_analytics', newVal ? 'true' : 'false');
  };

  const clearAllLocalData = () => {
    if(window.confirm("Are you sure? This will delete all your custom map pins and settings. This cannot be undone.")) {
        localStorage.clear();
        alert("All local data wiped. Reloading map...");
        window.location.reload(); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="settings-modal-card ui-panel relative w-full max-w-[480px] flex flex-col uppercase text-white animate-in zoom-in-95 duration-300">
        
        {/* HEADER SECTION */}
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#ff69b4] uppercase block mb-1">SYSTEM UTILITY</span>
            <h2 className="text-[22px] font-black italic tracking-wider m-0 leading-tight">ECOSYSTEM SETTINGS</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 max-h-[70vh] hide-scrollbar">
          
          {/* SUPPORT BANNER */}
          <button 
            onClick={onOpenDonate}
            className="w-full text-left flex items-center gap-4 p-4 bg-gradient-to-r from-[#8a2be2]/20 to-[#ff69b4]/20 hover:from-[#8a2be2]/30 hover:to-[#ff69b4]/30 border border-[#8a2be2]/30 rounded-xl transition-all duration-300 shadow-lg group"
          >
            <div className="text-2xl group-hover:scale-110 transition-transform">💖</div>
            <div>
              <span className="block text-[10px] font-black tracking-widest text-[#ff69b4] uppercase">SUPPORT PROJECT</span>
              <strong className="block text-sm font-bold text-white tracking-wide">SUPPORT LEONIDA MAP & ECOSYSTEM</strong>
            </div>
          </button>

          {/* APPEARANCE & PREFERENCES */}
          <div>
            <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase mb-3 flex items-center gap-2">
              <span className="text-lg">🎨</span> APPEARANCE & PREFERENCES
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-[13px] font-bold text-gray-200">Dark Mode</span>
                <button 
                  onClick={handleToggleDarkMode}
                  className={`w-[46px] h-[24px] flex items-center rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-[#ff69b4]' : 'bg-zinc-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-[22px]' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-[13px] font-bold text-gray-200">Distance Units (KM / Miles)</span>
                <button 
                  onClick={handleToggleUnits}
                  className={`w-[46px] h-[24px] flex items-center rounded-full p-1 transition-colors duration-300 ${distanceUnits === 'MILES' ? 'bg-[#ff69b4]' : 'bg-zinc-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${distanceUnits === 'MILES' ? 'translate-x-[22px]' : 'translate-x-0'}`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-[13px] font-bold text-gray-200">Performance Mode (Low Res/Fast)</span>
                <button 
                  onClick={handleTogglePerformance}
                  className={`w-[46px] h-[24px] flex items-center rounded-full p-1 transition-colors duration-300 ${performanceMode ? 'bg-[#ff69b4]' : 'bg-zinc-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${performanceMode ? 'translate-x-[22px]' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* DATA MANAGEMENT */}
          <div>
            <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase mb-3 flex items-center gap-2">
              <span className="text-lg">💾</span> DATA MANAGEMENT
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div>
                  <strong className="block text-[13px] text-gray-200 font-bold">Clear Local Cache</strong>
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">Wipes your saved map data and resets preferences.</p>
                </div>
                <button onClick={clearAllLocalData} className="px-4 py-2 bg-[#ff3333]/20 hover:bg-[#ff3333]/40 text-[#ff3333] hover:text-[#ff5555] text-[10px] font-bold uppercase tracking-wider rounded-lg border border-[#ff3333]/30 transition-colors">
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* PRIVACY & LEGAL */}
          <div>
            <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase mb-3 flex items-center gap-2">
              <span className="text-lg">🛡️</span> PRIVACY & LEGAL
            </h3>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="pr-4">
                  <strong className="block text-[13px] text-gray-200 font-bold">Personalized Ads (AdSense)</strong>
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">Allow targeted community ads to support the servers.</p>
                </div>
                <button 
                  onClick={handleToggleAds}
                  className={`w-[46px] h-[24px] flex-shrink-0 flex items-center rounded-full p-1 transition-colors duration-300 ${personalizedAds ? 'bg-[#ff69b4]' : 'bg-zinc-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${personalizedAds ? 'translate-x-[22px]' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="pr-4">
                  <strong className="block text-[13px] text-gray-200 font-bold">Anonymous Usage Data</strong>
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">Help us improve the map by sharing error logs.</p>
                </div>
                <button 
                  onClick={handleToggleAnalytics}
                  className={`w-[46px] h-[24px] flex-shrink-0 flex items-center rounded-full p-1 transition-colors duration-300 ${analyticsData ? 'bg-[#ff69b4]' : 'bg-zinc-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${analyticsData ? 'translate-x-[22px]' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-bold tracking-wide text-gray-500 pt-2 pb-2">
              <button onClick={() => setShowPrivacy(true)} className="legal-link-btn">Privacy Policy</button>
              <span className="text-gray-700">•</span>
              <button onClick={() => setShowTos(true)} className="legal-link-btn">Terms of Service</button>
            </div>

            {/* LEGAL LINKS */}
            <div className="border-t border-white/20 mt-6 pt-4">
              <p className="text-xs text-white/60 mb-3">Legal</p>
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="block text-xs text-white/60 hover:text-pink-300 mb-2">
                → Privacy Policy
              </a>
              <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="block text-xs text-white/60 hover:text-pink-300 mb-2">
                → Terms of Service
              </a>
              <a href="/about" target="_blank" rel="noopener noreferrer" className="block text-xs text-white/60 hover:text-pink-300">
                → About LeonidaMap VI
              </a>
            </div>
          </div>

        </div>
        
        {/* FOOTER METRIC */}
        <div className="p-4 bg-black/40 border-t border-white/10 text-center text-[10px] tracking-widest font-bold text-gray-500 uppercase">
          LEONIDA ENGINE V1.1.0 • ACTIVE
        </div>
      </div>

      {showPrivacy && (
        <div className="legal-page-overlay">
          <div className="legal-page-container">
            <div className="legal-header">
              <button onClick={() => setShowPrivacy(false)} className="legal-back-btn">← GO BACK</button>
              <h2>PRIVACY POLICY</h2>
            </div>
            <div className="legal-content">
              <p><strong>Last Updated: June 2026</strong></p>
              <h3>1. Introduction</h3>
              <p>Welcome to Leonida Map VI. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our interactive map and community tools.</p>
              
              <h3>2. Data We Collect</h3>
              <p><strong>Local Storage:</strong> We store your map preferences, custom drawn paths, and placed markers locally on your device (using LocalStorage). This data is not transmitted to our servers unless explicitly exported by you.</p>
              <p><strong>Usage Data:</strong> We may collect anonymous analytics regarding how the application is used (e.g., tools clicked, errors encountered) to improve performance.</p>

              <h3>3. Third-Party Services & Cookies (AdSense)</h3>
              <p>We use third-party advertising companies, including Google AdSense, to serve ads when you visit our website. These companies may use cookies to serve ads based on your prior visits to this website or other websites. You can opt out of personalized advertising by visiting Google's Ads Settings.</p>

              <h3>4. Your Rights</h3>
              <p>You have the right to clear your local cache, disable cookies through your browser, and toggle personalized ads off in our Ecosystem Settings menu.</p>
            </div>
          </div>
        </div>
      )}

      {showTos && (
        <div className="legal-page-overlay">
          <div className="legal-page-container">
            <div className="legal-header">
              <button onClick={() => setShowTos(false)} className="legal-back-btn">← GO BACK</button>
              <h2>TERMS OF SERVICE</h2>
            </div>
            <div className="legal-content">
              <p><strong>Last Updated: June 2026</strong></p>
              
              <h3>1. Disclaimer of Affiliation (IMPORTANT)</h3>
              <p><strong>LEONIDA MAP VI IS AN UNOFFICIAL, COMMUNITY-DRIVEN PROJECT. IT IS NOT AFFILIATED WITH, ENDORSED BY, SPONSORED BY, OR ASSOCIATED WITH ROCKSTAR GAMES, TAKE-TWO INTERACTIVE, OR ANY OF THEIR PARTNERS.</strong> All game assets, names, locations, and related intellectual property are the copyright and trademarks of their respective owners. This utility is provided under Fair Use for educational and community utility purposes.</p>

              <h3>2. Limitation of Liability</h3>
              <p>IN NO EVENT SHALL THE CREATORS, DEVELOPERS, OR HOSTS OF LEONIDA MAP VI BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE USE OF THIS WEB APPLICATION. You use this tool entirely at your own risk.</p>

              <h3>3. "As Is" Utility</h3>
              <p>The service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee server uptime, data retention of your custom map layers, or absolute accuracy of map locations.</p>

              <h3>4. User Conduct</h3>
              <p>By using the freehand drawing and marker tools, you agree not to generate, share, or export content that is illegal, harmful, or violates the rights of others. We reserve the right to ban IP addresses or terminate access to the app for abusive behavior.</p>

              <h3>5. Changes to Terms</h3>
              <p>We reserve the right to modify these terms at any time. Continued use of the application constitutes acceptance of the new terms.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
