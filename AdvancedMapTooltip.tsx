import React from 'react';
import { Copy, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AdvancedMapTooltipProps {
  title: string;
  imageUrl?: string;
  coordinates: string;
  isConfirmed?: boolean;
  source?: string;
}

export function AdvancedMapTooltip({ title, imageUrl, coordinates, isConfirmed = true, source = 'Community' }: AdvancedMapTooltipProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(coordinates);
    // In a full app, trigger a toast notification here
  };

  return (
    <div className="w-72 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-2xl text-white font-sans m-0">
      {/* Media Header */}
      <div className="h-32 w-full bg-gray-900 relative">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover opacity-90" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#090a0a] border-b border-white/10">
            <span className="text-xs text-gray-500 font-mono">NO MEDIA AVAILABLE</span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          {isConfirmed ? (
            <span className="bg-green-500/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-lg">
              <CheckCircle2 size={12}/> CONFIRMED
            </span>
          ) : (
            <span className="bg-amber-500/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-lg">
              <AlertTriangle size={12}/> LEAK / SPECULATION
            </span>
          )}
        </div>
      </div>
      
      {/* Data Body */}
      <div className="p-4 space-y-3">
        <h3 className="font-black text-lg tracking-tight leading-none text-white m-0">{title}</h3>
        
        <div className="flex items-center justify-between bg-white/5 rounded-lg p-2 border border-white/5">
          <code className="text-xs text-pink-300 font-mono">{coordinates}</code>
          <button onClick={handleCopy} className="text-white/50 hover:text-white transition-colors" title="Copy Coordinates">
            <Copy size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-white/60 pt-2 border-t border-white/10">
          <span>Source: {source}</span>
          <button className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-bold">
            Full View <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
