import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, CheckCircle2, AlertTriangle, Eye, CalendarDays } from 'lucide-react';

// The full timeline data, ordered from newest (top) to oldest (bottom)
const timelineData = [
  {
    date: 'November 19, 2026',
    title: 'GRAND THEFT AUTO VI LAUNCH',
    type: 'launch',
    desc: 'The official release date for PS5 and Xbox Series X|S. Welcome to Leonida.',
    icon: <CalendarDays className="text-white" size={24} />
  },
  {
    date: 'Summer 2026',
    title: 'Major Marketing Campaign & Trailer 3 (Expected)',
    type: 'upcoming',
    desc: 'Take-Two confirmed major marketing begins Summer 2026. The community heavily expects Trailer 3, Pre-orders, and Collector\'s Edition reveals.',
    icon: <Eye className="text-yellow-400" size={24} />
  },
  {
    date: 'June 25, 2026',
    title: 'Pre-Orders Begin',
    type: 'video',
    desc: 'Official pre-orders go live globally across digital storefronts and major retailers. Check out the latest announcement trailer below!',
    videoId: 'EiQEBYDox_k',
    icon: <CheckCircle2 className="text-pink-500" size={24} />
  },
  {
    date: 'June 3, 2026',
    title: 'Release Date Reaffirmed',
    type: 'current',
    desc: 'Take-Two officially reaffirms that GTA 6 is locked in for November 19, 2026. Industry insiders note other publishers are delaying games to avoid the GTA 6 launch window.',
    icon: <CheckCircle2 className="text-green-400" size={24} />
  },
  {
    date: 'November 6, 2025',
    title: 'Second Delay Announced',
    type: 'official',
    desc: 'Rockstar delays the game from May 2026 to the final target: November 19, 2026.',
    icon: <AlertTriangle className="text-orange-400" size={24} />
  },
  {
    date: 'May 6, 2025',
    title: 'Trailer 2 Drops',
    type: 'video',
    desc: 'Released 519 days after Trailer 1. Featured 70+ new screenshots, deep location details, and generated over 475 million views in 24 hours.',
    videoId: 'VQRLujxTm3c',
    icon: <CheckCircle2 className="text-pink-500" size={24} />
  },
  {
    date: 'May 2, 2025',
    title: 'First Delay',
    type: 'official',
    desc: 'Rockstar delays GTA 6 from Fall 2025 to May 26, 2026.',
    icon: <AlertTriangle className="text-orange-400" size={24} />
  },
  {
    date: 'December 4, 2023',
    title: 'Trailer 1 Released Early',
    type: 'video',
    desc: 'Dropped a day early due to a leak. Revealed Lucia, Jason, and the stunning return to Vice City with a 2025 launch window.',
    videoId: 'QdBZY2fkU-0',
    icon: <CheckCircle2 className="text-pink-500" size={24} />
  },
  {
    date: 'September 18, 2022',
    title: 'The Historic Leak',
    type: 'event',
    desc: 'A massive development leak hits the internet, showing early test footage of Vice City and the dual protagonists.',
    icon: <AlertTriangle className="text-red-500" size={24} />
  },
  {
    date: 'February 4, 2022',
    title: 'Active Development Confirmed',
    type: 'official',
    desc: 'Rockstar officially confirms the next entry in the Grand Theft Auto series is well underway.',
    icon: <CheckCircle2 className="text-blue-400" size={24} />
  }
];

const theoryArticles = [
  {
    id: 1,
    title: "5 Locations That Will Dominate Online Multiplayer",
    date: "Jun 19, 2026",
    preview: "Which areas of Leonida will become the PvP hotspots?",
    content: `Based on GTA's multiplayer history, these 5 zones will dominate:

🔴 PORT AUTHORITY — Naval heists, speed boat chases, smuggling runs
🔴 DOWNTOWN CORE — Urban PvP, bank robberies, street battles
🔴 INDUSTRIAL SECTOR — Warehouse takeovers, supply runs
🔴 MANSION DISTRICT — High-value targets, stealth missions
🔴 AIRFIELD COMPLEX — Vehicle dominance, crew battles

Where do YOU think players will congregate?`,
  },
  {
    id: 2,
    title: "The Best Heist Spawn Locations (Theory)",
    date: "Jun 18, 2026",
    preview: "Predicting where GTA 6 heists will originate...",
    content: `Every heist starts somewhere. Our predictions:

🎯 DOCKS — Naval & smuggling heists
🎯 BANK TOWERS — Financial crimes, vault raids
🎯 AIRPORT — Vehicle & cargo theft
🎯 CORPORATE HQ — Data theft, espionage
🎯 CASINO — High-stakes robberies
🎯 POWER PLANT — Sabotage missions

Study these locations now. You'll know the meta before launch day.`,
  },
  {
    id: 3,
    title: "Character Territories: Who Controls What?",
    date: "Jun 17, 2026",
    preview: "Predicting which areas each protagonist will own...",
    content: `Character control zones on Leonida:

👤 JASON — South Side (Industrial, working-class roots)
👤 LUCIA — Downtown (Financial district, high society connections)
👤 UNKNOWN 3RD — Airfield & remote zones (Military background suspected)

Territory control = story missions, safehouse locations, gang warfare zones.

Understanding the political landscape gives you Day 1 advantage.`,
  },
];

export default function NewsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [rightTab, setRightTab] = useState<'timeline' | 'theories'>('timeline');
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  // Countdown Timer Logic targeting Nov 19, 2026
  useEffect(() => {
    if (!isOpen) return;
    
    const targetDate = new Date('November 19, 2026 00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      
      <div className="ui-panel relative w-full max-w-6xl flex flex-col text-white">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 uppercase">
            HYPE METRICS
          </h2>
          
          <button 
            onClick={onClose}
            className="modal-close-btn hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-6 hide-scrollbar grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: The Countdown & Intel Hub */}
          <div className="lg:col-span-5 space-y-8">
          
          {/* Big 3D Release Date Header */}
          <div className="text-center p-8 bg-gradient-to-br from-[#1a1a24] to-[#0d0d12] rounded-3xl border border-white/5 shadow-2xl">
            <h1 className="text-5xl lg:text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_4px_0_rgba(236,72,153,0.8)] mb-2 uppercase tracking-tighter">
              November 19, 2026
            </h1>
            <p className="text-pink-400 font-bold tracking-[0.2em] uppercase text-sm mb-8">Official Release Date</p>
            
            {/* Live Countdown */}
            <div className="grid grid-cols-4 gap-2 lg:gap-4">
              {[
                { label: 'DAYS', value: timeLeft.days },
                { label: 'HOURS', value: timeLeft.hours },
                { label: 'MINS', value: timeLeft.minutes },
                { label: 'SECS', value: timeLeft.seconds }
              ].map((time, idx) => (
                <div key={idx} className="bg-black/50 rounded-xl p-3 border border-white/10 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{time.value}</span>
                  <span className="text-[10px] text-gray-400 font-bold tracking-widest">{time.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
            <h3 className="text-xl font-black text-white italic mb-4 border-b border-white/10 pb-2">HYPE METRICS</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex justify-between items-center text-gray-300">
                <span>Days Since Trailer 2</span>
                <span className="text-pink-400 font-bold">~28 Days</span>
              </li>
              <li className="flex justify-between items-center text-gray-300">
                <span>Trailer 1 to Trailer 2 Gap</span>
                <span className="text-purple-400 font-bold">519 Days</span>
              </li>
              <li className="flex justify-between items-center text-gray-300">
                <span>Trailer 2 24hr Views</span>
                <span className="text-white font-bold">475M+</span>
              </li>
            </ul>
          </div>

          {/* Status Breakdown */}
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
              <h4 className="text-green-400 font-black italic mb-2 flex items-center gap-2"><CheckCircle2 size={18}/> CONFIRMED FACTS</h4>
              <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
                <li>Launch locked for Nov 19, 2026.</li>
                <li>Summer 2026 major marketing campaign.</li>
                <li>Pre-orders are NOT officially live yet.</li>
              </ul>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5">
              <h4 className="text-yellow-400 font-black italic mb-2 flex items-center gap-2"><Eye size={18}/> TOP RUMORS</h4>
              <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
                <li>Trailer 3 (Expected Late June/July).</li>
                <li>Collector's Edition expected this Fall.</li>
                <li>Lucia may start the game with an ankle monitor.</li>
              </ul>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Timeline + Theory Articles tabs */}
        <div className="lg:col-span-7">
          <div className="bg-[#121218] rounded-3xl p-8 border border-white/5 shadow-2xl relative">

            {/* Tab switcher */}
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => { setRightTab('timeline'); setSelectedArticle(null); }}
                className={`px-4 py-2 rounded-xl text-sm font-black italic tracking-widest uppercase transition-colors ${
                  rightTab === 'timeline'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                The Timeline
              </button>
              <button
                onClick={() => { setRightTab('theories'); setSelectedArticle(null); }}
                className={`px-4 py-2 rounded-xl text-sm font-black italic tracking-widest uppercase transition-colors ${
                  rightTab === 'theories'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                Theory Articles
              </button>
            </div>

            {/* TIMELINE TAB */}
            {rightTab === 'timeline' && (
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 via-purple-500 to-gray-700"></div>

                <div className="space-y-12 relative z-10">
                  {timelineData.map((item, index) => (
                    <div key={index} className="flex gap-6 relative">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-4 border-[#121218] shadow-lg ${
                        item.type === 'launch' ? 'bg-gradient-to-r from-pink-500 to-purple-500' :
                        item.type === 'upcoming' ? 'bg-gray-800' : 'bg-[#1a1a24]'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-6 border border-white/5">
                        <span className={`text-xs font-bold tracking-widest uppercase mb-2 block ${
                          item.type === 'launch' ? 'text-pink-400' : 'text-gray-400'
                        }`}>
                          {item.date}
                        </span>
                        <h3 className="text-2xl font-black text-white italic mb-3">{item.title}</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">{item.desc}</p>
                        {item.videoId && (
                          <div className="mt-4 rounded-xl overflow-hidden border border-white/10 shadow-lg relative pt-[56.25%]">
                            <iframe
                              className="absolute top-0 left-0 w-full h-full"
                              src={`https://www.youtube.com/embed/${item.videoId}`}
                              title="GTA 6 Trailer"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* THEORY ARTICLES TAB */}
            {rightTab === 'theories' && (
              <div>
                {selectedArticle === null ? (
                  <>
                    <h2 className="text-3xl font-black italic text-white mb-8 tracking-widest">THEORY ARTICLES</h2>
                    <div className="space-y-4">
                      {theoryArticles.map((article) => (
                        <button
                          key={article.id}
                          onClick={() => setSelectedArticle(article.id)}
                          className="w-full text-left bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-6 border border-white/5 hover:border-pink-500/30 group"
                        >
                          <span className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-2">{article.date}</span>
                          <h3 className="text-xl font-black text-white italic mb-2 group-hover:text-pink-300 transition-colors">{article.title}</h3>
                          <p className="text-gray-400 text-sm leading-relaxed">{article.preview}</p>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="flex items-center gap-2 text-pink-400 hover:text-pink-300 font-bold text-sm mb-6 transition-colors"
                    >
                      <ArrowLeft size={16} /> Back to Theory Articles
                    </button>
                    {(() => {
                      const article = theoryArticles.find(a => a.id === selectedArticle)!;
                      return (
                        <>
                          <span className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-3">{article.date}</span>
                          <h2 className="text-3xl font-black italic text-white mb-8 tracking-widest leading-tight">{article.title}</h2>
                          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{article.content}</p>
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
