import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, Eye } from 'lucide-react';

interface TransformationPair {
  id: string;
  name: string;
  before: string;
  after: string;
  category: string;
}

const DEMO_PAIRS: TransformationPair[] = [
  {
    id: 'studio-portrait',
    name: 'Portrait Retouch',
    category: 'Studio Lighting',
    // Unsplash portrait with slightly desaturated/flat lighting
    before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=70&sat=-40&con=-10',
    // High-contrast vibrant studio lighting
    after: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=95'
  },
  {
    id: 'cinematic-landscape',
    name: 'Landscape Mist',
    category: 'Cinematic Mood',
    before: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=70&sat=-30',
    after: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=95'
  },
  {
    id: 'character-cyber',
    name: 'Neon Character',
    category: 'Stylization',
    before: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=70&sat=-50',
    after: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=95'
  }
];

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(52); // Percentage 0-100
  const [activePairIndex, setActivePairIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePair = DEMO_PAIRS[activePairIndex];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(rect.width, x));
    const percent = (clamped / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Container with rounded corners, subtle border and drop shadow */}
      <div
        id="hero-before-after-box"
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label="Before and after comparison slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            setSliderPosition((prev) => Math.max(0, prev - 5));
          } else if (e.key === 'ArrowRight') {
            setSliderPosition((prev) => Math.min(100, prev + 5));
          }
        }}
        className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-200/80 bg-slate-100 select-none cursor-ew-resize group touch-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          if (e.touches.length > 0) {
            handleMove(e.touches[0].clientX);
          }
        }}
      >
        {/* AFTER IMAGE (Enhanced/Transformed - Full background) */}
        <img
          src={activePair.after}
          alt={`Transformed ${activePair.name}`}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          loading="eager"
          referrerPolicy="no-referrer"
        />

        {/* BEFORE IMAGE (Original - Clipped with clipPath for perfect responsive scaling) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        >
          <img
            src={activePair.before}
            alt={`Original ${activePair.name}`}
            className="w-full h-full object-cover pointer-events-none"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Vertical Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none shadow-[0_0_8px_rgba(0,0,0,0.4)] z-20"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Centered Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg shadow-black/20 flex items-center justify-center border-2 border-indigo-600 text-indigo-700 transition-transform group-hover:scale-105">
            <SlidersHorizontal className="w-4 h-4 rotate-90" />
          </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-slate-300" />
            Original
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md text-white border border-white/20 shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Transformed
          </span>
        </div>

        {/* Interactive hint in bottom center */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center z-10 pointer-events-none">
          <div className="px-3 py-1 rounded-full text-[11px] font-medium bg-black/45 backdrop-blur-md text-slate-200 border border-white/10">
            Drag slider left or right to compare
          </div>
        </div>
      </div>

      {/* Switcher tabs beneath the slider */}
      <div className="mt-3.5 flex items-center gap-2 overflow-x-auto max-w-full px-1 py-1 text-xs">
        <span className="text-slate-600 font-medium whitespace-nowrap text-[11px] hidden sm:inline">
          Transformation sample:
        </span>
        {DEMO_PAIRS.map((pair, index) => (
          <button
            key={pair.id}
            id={`preset-pair-${pair.id}`}
            type="button"
            onClick={() => setActivePairIndex(index)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              activePairIndex === index
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            {pair.name}
          </button>
        ))}
      </div>
    </div>
  );
};
