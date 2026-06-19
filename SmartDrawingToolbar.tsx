import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ruler, CircleDashed, Brush, Trash2, MousePointer2, Users, Car, Crosshair, ShieldAlert, Newspaper, Banknote } from 'lucide-react';

interface SmartDrawingToolbarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  activeColor: string;
  setActiveColor: (color: string) => void;
  clearDrawings: () => void;
  onOpenCharacters?: () => void;
  onOpenNews?: () => void;
  onOpenComingSoon?: (title: string) => void;
}

const toolColors = ['#8A2BE2', '#FF69B4', '#00FF00', '#FFFF00'];

export function SmartDrawingToolbar({ activeTool, setActiveTool, activeColor, setActiveColor, clearDrawings, onOpenCharacters, onOpenNews, onOpenComingSoon }: SmartDrawingToolbarProps) {
  return (
    <div 
      className="left-sidebar your-left-sidebar-container"
      onClick={(e) => e.stopPropagation()} 
      onTouchStart={(e) => e.stopPropagation()} 
      onTouchEnd={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* 1. App Logo (Top) */}
      <div className="w-16 h-16 mx-auto shrink-0 mb-1 -mt-2">
        <img src="/ed5cf9a9-0d87-4a55-aaa8-beb896d10005.png" alt="Logo" className="w-full h-full object-contain scale-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
      </div>

      <button onClick={() => { import('../lib/haptics').then(m => m.Haptics.light()); onOpenNews?.() }} className="tool-btn haptic-btn tool-icon-btn relative shrink-0 flex flex-col items-center justify-center gap-1 p-2 w-14 rounded-xl transition-all duration-200 group text-white/70 hover:bg-white/15 hover:text-white">
        <Newspaper size={20} />
        <span className="text-[8.5px] font-bold uppercase tracking-wider text-white text-center leading-tight">News</span>
      </button>
      <button onClick={() => { import('../lib/haptics').then(m => m.Haptics.heavy()); onOpenCharacters?.() }} className="tool-btn haptic-btn tool-icon-btn relative shrink-0 flex flex-col items-center justify-center gap-1 p-2 w-14 rounded-xl transition-all duration-200 group text-white/70 hover:bg-white/15 hover:text-white">
        <Users size={20} />
        <span className="text-[7.5px] font-bold uppercase tracking-wider text-white text-center leading-tight">Characters</span>
      </button>

      {/* Extras Divider */}
      <div className="w-8 h-px bg-white/20 mt-1 mb-1" />

      {/* 2. Select Button */}
      <ToolButton 
        icon={<MousePointer2 size={20} />} 
        label="ARROW" 
        onClick={() => setActiveTool('select')} 
        active={activeTool === 'select'}
      />

      {/* 3. Draw Brush */}
      <ToolButton 
        icon={<Brush size={20} />} 
        label="DRAW BRUSH" 
        onClick={() => setActiveTool('draw')} 
        active={activeTool === 'draw'}
        activeColor={activeColor}
        setActiveColor={setActiveColor}
        showColors={activeTool === 'draw'}
      />
      
      {/* 4. Circle Tool */}
      <ToolButton 
        icon={<CircleDashed size={20} />} 
        label="CIRCLE" 
        onClick={() => setActiveTool('circle')} 
        active={activeTool === 'circle'}
        activeColor={activeColor}
        setActiveColor={setActiveColor}
        showColors={activeTool === 'circle'}
      />
      
      {/* 5. Measure Tool */}
      <ToolButton 
        icon={<Ruler size={20} />} 
        label="MEASURE" 
        onClick={() => setActiveTool('measure')} 
        active={activeTool === 'measure'}
        activeColor={activeColor}
        setActiveColor={setActiveColor}
        showColors={activeTool === 'measure'}
      />

      {/* 6. Delete Button */}
      <ToolButton 
        icon={<Trash2 size={20} />} 
        label="DELETE" 
        onClick={() => setActiveTool('delete')} 
        active={activeTool === 'delete'}
        showDeleteOptions={activeTool === 'delete'}
        clearDrawings={clearDrawings}
      />

      {/* Extras Divider */}
      <div className="w-8 h-px bg-white/20 mt-2 mb-1" />

      {/* 7. Extra Tools Below */}
      <button onClick={() => { import('../lib/haptics').then(m => m.Haptics.light()); onOpenComingSoon?.('MONEY METHODS') }} className="tool-btn haptic-btn tool-icon-btn relative shrink-0 flex flex-col items-center justify-center gap-1 p-2 w-14 rounded-xl transition-all duration-200 group text-white/70 hover:bg-white/15 hover:text-white">
        <Banknote size={20} />
        <span className="text-[7.5px] font-bold uppercase tracking-wider text-white text-center leading-tight">Money Methods</span>
      </button>
      <button onClick={() => { import('../lib/haptics').then(m => m.Haptics.light()); onOpenComingSoon?.('HEISTS') }} className="tool-btn haptic-btn tool-icon-btn relative shrink-0 flex flex-col items-center justify-center gap-1 p-2 w-14 rounded-xl transition-all duration-200 group text-white/70 hover:bg-white/15 hover:text-white">
        <ShieldAlert size={20} />
        <span className="text-[8px] font-bold uppercase tracking-wider text-white text-center leading-tight">Heists</span>
      </button>
      <button onClick={() => { import('../lib/haptics').then(m => m.Haptics.light()); onOpenComingSoon?.('VEHICLES') }} className="tool-btn haptic-btn tool-icon-btn relative shrink-0 flex flex-col items-center justify-center gap-1 p-2 w-14 rounded-xl transition-all duration-200 group text-white/70 hover:bg-white/15 hover:text-white">
        <Car size={20} />
        <span className="text-[8px] font-bold uppercase tracking-wider text-white text-center leading-tight">Cars</span>
      </button>
      <button onClick={() => { import('../lib/haptics').then(m => m.Haptics.light()); onOpenComingSoon?.('WEAPONS') }} className="tool-btn haptic-btn tool-icon-btn relative shrink-0 flex flex-col items-center justify-center gap-1 p-2 w-14 rounded-xl transition-all duration-200 group text-white/70 hover:bg-white/15 hover:text-white mb-2">
        <Crosshair size={20} />
        <span className="text-[8px] font-bold uppercase tracking-wider text-white text-center leading-tight">Weapons</span>
      </button>
    </div>
  );
}

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  activeColor?: string;
  setActiveColor?: (color: string) => void;
  showColors?: boolean;
  showDeleteOptions?: boolean;
  clearDrawings?: () => void;
}

function ToolButton({ icon, label, active, onClick, activeColor, setActiveColor, showColors, showDeleteOptions, clearDrawings }: ToolButtonProps) {
  return (
    <div className="relative group/tool w-full flex flex-col items-center justify-center">
      <button 
        onClick={() => { import('../lib/haptics').then(m => m.Haptics.medium()); onClick(); }}
        className={`tool-btn haptic-btn tool-icon-btn relative w-14 rounded-xl flex flex-col items-center justify-center gap-1 p-2 transition-all duration-200 group z-10 ${active ? 'bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] text-white' : 'text-white/70 hover:bg-white/15 hover:text-white'}`}
      >
        {active && activeColor ? React.cloneElement(icon as React.ReactElement, { color: activeColor }) : icon}
        
        <span className="text-[8.5px] font-bold uppercase tracking-wider text-center leading-tight">
          {label}
        </span>
      </button>

        {/* Dropdown Color Palette / Options using AnimatePresence */}
      <AnimatePresence>
        {showColors && activeColor && setActiveColor && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            className="flex flex-col gap-2 pt-2 items-center overflow-hidden w-full z-0"
          >
            {toolColors.map((color) => (
              <button
                key={color}
                onClick={(e) => { e.stopPropagation(); setActiveColor(color); }}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 shrink-0 cursor-pointer ${
                  activeColor === color ? 'border-[#ff00ff] scale-110 shadow-[0_0_8px_#ff00ff]' : 'border-white'
                }`}
                style={{ backgroundColor: color }}
                title="Select Color"
              />
            ))}
          </motion.div>
        )}
        
        {showDeleteOptions && clearDrawings && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            className="flex flex-col gap-2 pt-2 items-center overflow-hidden w-full z-0"
          >
            <button
              onClick={(e) => { e.stopPropagation(); clearDrawings(); }}
              className="bg-[#ff3333] hover:bg-[#ff5555] text-white border-none py-1.5 px-3.5 font-bold text-[10px] uppercase rounded-xl transition-colors whitespace-nowrap"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
