import React, { useState } from 'react';
import { X, Maximize2, MapPin, ArrowLeft } from 'lucide-react';

const charactersData = [
  {
    id: 'jason',
    name: 'Jason Duval',
    quote: "Jason wants an easy life, but things just keep getting harder.",
    bio: "Jason grew up around grifters and crooks. After a stint in the Army trying to shake off his troubled teens, he found himself in the Keys doing what he knows best, working for local drug runners. It might be time to try something new.",
    subtext: "If anything happens, I'm right behind you. Another day in paradise, right?",
    imageUrl: '/jason.jpg',
    region: 'Leonida Keys'
  },
  {
    id: 'lucia',
    name: 'Lucia Caminos',
    quote: "Lucia's father taught her to fight as soon as she could walk.",
    bio: "Life has been coming at her swinging ever since. Fighting for her family landed her in the Leonida Penitentiary. Sheer luck got her out. Lucia's learned her lesson — only smart moves from here. More than anything, Lucia wants the good life her mom has dreamed of since their days in Liberty City — but instead of half-baked fantasies, Lucia is prepared to take matters into her own hands.",
    subtext: "Fresh out of prison and ready to change the odds in her favor, Lucia's committed to her plan — no matter what it takes. A life with Jason could be her way out.",
    imageUrl: '/luci.jpg',
    region: 'Vice City'
  },
  {
    id: 'cal',
    name: 'Cal Hampton',
    quote: "What if everything on the internet was true?",
    bio: "Jason's friend and a fellow associate of Brian's, Cal feels safest hanging at home, snooping on Coast Guard comms with a few beers and some private browser tabs open. The psychopaths are in charge. Get used to it. Cal is at the low tide of America and happy there. Casual paranoia loves company, but his friend Jason has bigger plans.",
    subtext: "There are way too many birds flying around in perfect formation.",
    imageUrl: '/cal.jpg',
    region: 'Vice City'
  },
  {
    id: 'boobie',
    name: 'Boobie Ike',
    quote: "It's all about heart — the Jack of Hearts.",
    bio: "Boobie is a local Vice City legend — and acts like it. One of the few to transform his time in the streets into a legitimate empire spanning real estate, a strip club, and a recording studio — Boobie's all smiles until it's time to talk business.",
    subtext: "The club money pay for the studio, and the drug money pay for it all. Top quality cuts. Boobie might seem like he's just out for himself, but it's his partnership with the young aspiring music mogul Dre'Quan for Only Raw Records that he's most invested in — now they just need a hit.",
    imageUrl: '/Boobie.jpg',
    region: 'Leonida Keys'
  },
  {
    id: 'drequan',
    name: "Dre'Quan Priest",
    quote: "Only Raw... Records",
    bio: "Dre'Quan was always more of a hustler than a gangster. Even when he was dealing on the streets to make ends meet, breaking into music was the goal. Dancers are like my A&Rs. If the record's a hit, DJs gonna be spinnin' it.",
    subtext: "You're with the label now. Now that he's signed the Real Dimez, Dre'Quan's days of booking acts into Boobie's strip club might be numbered as he sets his sights on the Vice City scene.",
    imageUrl: '/Dre.webp',
    region: 'Grassrivers'
  },
  {
    id: 'realdimez',
    name: 'Real Dimez',
    quote: "Viral videos. Viral hooks.",
    bio: "Bae-Luxe and Roxy aka Real Dimez have been friends since high school — girls with the savvy to turn their time shaking down local dealers into cold, hard cash via spicy rap tracks and a relentless social media presence.",
    subtext: "All my dimes in this club. Meet my twin, make it a dub. One hit away from fame. An early hit single with local rapper DWNPLY took Real Dimez to new heights. Now, after five years and a whole lot of trouble, they're signed to Only Raw Records, hoping lightning can strike twice.",
    imageUrl: '/Real.jpg',
    region: 'Port Gellhorn'
  },
  {
    id: 'raul',
    name: 'Raul Bautista',
    quote: "Experience counts.",
    bio: "Confidence, charm, and cunning — Raul's a seasoned bank robber always on the hunt for talent ready to take the risks that bring the biggest rewards. Life is full of surprises, my friend. I think we'd all be wise to remember that.",
    subtext: "A professional adapts. Raul's recklessness raises the stakes with every score. Sooner or later, his crew will have to double down or pull their chips from the table.",
    imageUrl: '/Raul.jpg',
    region: 'Ambrosia'
  },
  {
    id: 'brian',
    name: 'Brian Heder',
    quote: "Nothing better than a Mudslide at sunset.",
    bio: "Brian's a classic drug runner from the golden age of smuggling in the Keys. Still moving product through his boat yard with his third wife, Lori, Brian's been around long enough to let others do his dirty work. I hauled so much grass in that plane, I could make the state of Leonida levitate.",
    subtext: "Looks like a Leonida beach bum — moves like a great white shark. Brian's letting Jason live rent-free at one of his properties — so long as he helps with local shakedowns, and stops by for Lori's sangria once in a while.",
    imageUrl: '/Brian.webp',
    region: 'Mount Kalaga'
  }
];

export function CharactersModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [zoomedChar, setZoomedChar] = useState<any>(null);

  if (!isOpen && !zoomedChar) return null;

  const handleCloseAll = () => {
    setZoomedChar(null);
    onClose();
  };

  return (
    <>
      {/* FULL SCREEN ZOOM VIEW */}
      {zoomedChar && (
        <div className="fixed top-0 left-0 w-screen h-[100dvh] bg-[#0f0c16] z-[100000] flex flex-col overflow-y-auto animate-in fade-in duration-300 pointer-events-auto">
          
          <button 
            onClick={() => {
              import('./haptics').then(m => m.Haptics.light());
              setZoomedChar(null);
            }}
            className="fixed top-4 left-4 z-[100001] bg-black/50 hover:bg-black border border-white/20 p-2 sm:px-4 sm:py-2 rounded-full text-white flex items-center gap-2 haptic-btn"
          >
            <ArrowLeft size={16} /> 
            <span className="font-bold tracking-widest text-xs hidden sm:inline">BACK</span>
          </button>
          
          <button 
            onClick={() => {
              import('./haptics').then(m => m.Haptics.light());
              handleCloseAll();
            }}
            className="fixed top-4 right-4 z-[100001] bg-black/50 hover:bg-black border border-white/20 p-2 sm:px-4 sm:py-2 rounded-full text-white flex items-center gap-2 haptic-btn"
          >
            <span className="font-bold tracking-widest text-xs hidden sm:inline">CLOSE</span>
            <X size={16} />
          </button>
          
          <div className="w-full flex-shrink-0 h-[40vh] md:h-[50vh] bg-[#0f0c16]">
            <img
              src={zoomedChar.imageUrl}
              alt={zoomedChar.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          
          <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 flex-grow">
            <div className="flex items-center gap-2 text-pink-400 mb-2 font-bold tracking-widest uppercase text-xs sm:text-base">
              <MapPin size={14} className="sm:w-5 sm:h-5" /> {zoomedChar.region}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white italic mb-3 sm:mb-4">{zoomedChar.name}</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl">{zoomedChar.bio}</p>
          </div>
        </div>
      )}

      {/* LEFT PANEL */}
      <div 
        className={`characters-panel-wrapper fixed top-6 left-2 md:left-6 lg:left-[100px] w-[calc(100vw-16px)] md:w-[380px] min-h-[500px] text-white z-[9990] transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col shadow-2xl border border-white/10 bg-[#0f0c16]/95 backdrop-blur-xl rounded-2xl landscape:w-screen landscape:h-[100dvh] landscape:min-h-0 landscape:top-0 landscape:left-0 landscape:rounded-none landscape:border-none landscape:bg-[#0f0c16] ${
          isOpen && !zoomedChar ? 'translate-x-0' : '-translate-x-[150vw]'
        }`}
      >
        <div className="character-header hidden md:flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg sm:text-xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            CHARACTERS
          </h2>
          <button 
            onClick={onClose}
            className="modal-close-btn hover:bg-white/10 rounded-full transition-colors"
            title="Close Panel"
          >
            <X size={20} />
          </button>
        </div>

        <div className="md:hidden" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: '10px',
            padding: '4px 8px'
        }}>
            <button className="nav-back-btn text-xs font-bold tracking-widest text-pink-400 hover:text-white transition-colors invisible" onClick={() => {}}>
                ← BACK TO LIST
            </button>
            <button className="nav-close-btn text-xs font-bold tracking-widest text-white hover:text-pink-400 transition-colors" onClick={onClose}>
                CLOSE ✕
            </button>
        </div>

        {/* Scrollable container */}
        <div className="flex-1 overflow-y-auto sm:p-4 space-y-6 scrollbar-hide pointer-events-auto hide-scrollbar character-card-container">
          {charactersData.map((char) => (
            <div key={char.id} className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-pink-500/50 transition-all duration-300">
              
              <div className="relative h-40 sm:h-48 md:h-56 w-full overflow-visible">
                <img 
                  src={char.imageUrl} 
                  alt={char.name}
                  className="w-full h-full object-cover object-top opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                />
                
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-widest border border-white/10 flex items-center gap-1">
                  <MapPin size={12} className="text-pink-400" />
                  {char.region}
                </div>

                <button 
                  onClick={() => setZoomedChar(char)}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-pink-600 backdrop-blur-md p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-lg"
                  title="Full Screen Image"
                >
                  <Maximize2 size={20} />
                </button>
                
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#151518] to-transparent"></div>
              </div>

              {/* Text - smaller, no longer hidden */}
              <div className="p-4 sm:p-5 bg-[#151518] relative z-10">
                <h3 className="text-2xl sm:text-3xl font-black italic mb-1">{char.name}</h3>
                <p className="text-pink-400 text-xs sm:text-sm font-semibold mb-3 italic">"{char.quote}"</p>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3">
                  {char.bio.substring(0, 120)}...
                </p>
                <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg border-l-2 border-pink-500">
                  <p className="text-[10px] sm:text-xs text-gray-300 italic">{char.subtext.substring(0, 80)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
