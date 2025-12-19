import React, { useState } from 'react';

interface UIOverlayProps {
  currentMode: 'WISH' | 'CHAOS';
  setMode: (mode: 'WISH' | 'CHAOS') => void;
  blurLevel: number;
  setBlurLevel: (val: number) => void;
  snowSize: number;
  setSnowSize: (val: number) => void;
  title: string;
  setTitle: (val: string) => void;
  subtitle: string;
  setSubtitle: (val: string) => void;
  isFrozen: boolean;
  setIsFrozen: (val: boolean) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ 
  currentMode, setMode, blurLevel, setBlurLevel, snowSize, setSnowSize,
  title, setTitle, subtitle, setSubtitle, isFrozen, setIsFrozen
}) => {
  const [showControls, setShowControls] = useState(false);

  return (
    <>
      {/* Center Top: Editable Titles */}
      <div className="absolute top-12 left-0 right-0 text-center z-10 opacity-90 pointer-events-none">
         <div className="pointer-events-auto inline-block px-4 max-w-[90vw]">
            <h1 
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setTitle(e.currentTarget.textContent || '')}
              className="font-serif text-3xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-[0.2em] uppercase focus:outline-none focus:ring-1 focus:ring-white/20 rounded-lg cursor-text transition-all leading-tight"
            >
              {title}
            </h1>
            <p 
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setSubtitle(e.currentTarget.textContent || '')}
              className="font-sans text-[10px] text-gray-500 mt-4 tracking-[0.5em] focus:outline-none focus:text-white transition-colors cursor-text"
            >
              {subtitle}
            </p>
         </div>
      </div>

      {/* Bottom Integrated UI Container */}
      <div className="absolute bottom-12 left-0 right-0 z-20 px-12 flex flex-col items-center gap-4 pointer-events-none">
        
        {/* Control Panel: Floating above the main pill */}
        {showControls && (
          <div className="w-64 bg-black/40 border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex flex-col gap-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto mb-2">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label className="text-[9px] tracking-[0.2em] text-gray-400">SNOW DENSITY</label>
                <span className="text-[9px] text-white/50">{Math.round(snowSize * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" value={snowSize}
                onChange={(e) => setSnowSize(parseFloat(e.target.value))}
                className="w-full h-[2px] bg-white/10 appearance-none cursor-pointer rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label className="text-[9px] tracking-[0.2em] text-gray-400">LENS FOCUS</label>
                <span className="text-[9px] text-white/50">{Math.round(blurLevel * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" value={blurLevel}
                onChange={(e) => setBlurLevel(parseFloat(e.target.value))}
                className="w-full h-[2px] bg-white/10 appearance-none cursor-pointer rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          </div>
        )}

        {/* The Unified Luxury Pill */}
        <div className={`
          flex items-center pointer-events-auto rounded-full border transition-all duration-700 ease-in-out backdrop-blur-md shadow-2xl
          ${currentMode === 'CHAOS' 
            ? 'bg-purple-500/10 border-purple-400/40 shadow-[0_0_50px_rgba(168,85,247,0.2)]' 
            : 'bg-white/5 border-white/20'}
        `}>
          {/* FREEZE Toggle: Left Integrated Button */}
          <button
            onClick={() => setIsFrozen(!isFrozen)}
            className={`w-12 h-12 flex items-center justify-center text-lg transition-all active:scale-90 ${isFrozen ? 'text-white' : 'text-white/30 hover:text-white'}`}
            aria-label="Toggle Freeze"
          >
            {isFrozen ? '▶' : '−'}
          </button>

          {/* Minimalist Separator */}
          <div className="w-[1px] h-4 bg-white/10" />

          {/* Main Action Area */}
          <button
            onClick={() => setMode(currentMode === 'CHAOS' ? 'WISH' : 'CHAOS')}
            className="px-6 py-4 font-serif tracking-[0.3em] text-[10px] md:text-xs text-white/80 hover:text-white transition-colors active:scale-95"
          >
            {currentMode === 'CHAOS' ? 'REASSEMBLE' : 'UNLEASH CHAOS'}
          </button>
          
          {/* Minimalist Separator */}
          <div className="w-[1px] h-4 bg-white/10" />
          
          {/* Integrated Control Button */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="w-12 h-12 flex items-center justify-center text-lg text-white/30 hover:text-white transition-all active:scale-90"
            aria-label="Toggle Controls"
          >
            {showControls ? '✕' : '+'}
          </button>
        </div>
      </div>
    </>
  );
};

export default UIOverlay;