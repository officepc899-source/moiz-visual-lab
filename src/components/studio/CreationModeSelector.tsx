import React from 'react';
import { Sparkles, Palette, Video, Wand2 } from 'lucide-react';
import { CreationMode } from './types';

interface CreationModeSelectorProps {
  selectedMode: CreationMode;
  onSelectMode: (mode: CreationMode) => void;
}

interface ModeOption {
  id: CreationMode;
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const MODES: ModeOption[] = [
  {
    id: 'ai-photo',
    title: 'AI Photo',
    tagline: 'Enhance & transform photos',
    icon: Sparkles,
    badge: 'Popular',
  },
  {
    id: 'ai-image',
    title: 'AI Image',
    tagline: 'Generate visuals from text',
    icon: Palette,
  },
  {
    id: 'ai-video',
    title: 'AI Video',
    tagline: 'Motion loops & animations',
    icon: Video,
  },
  {
    id: 'fun',
    title: 'Fun',
    tagline: 'Avatars & playful styles',
    icon: Wand2,
  },
];

export const CreationModeSelector: React.FC<CreationModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
}) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
        1. Select Creation Mode
      </label>
      <div 
        role="tablist"
        aria-label="Creation modes"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3"
      >
        {MODES.map((mode) => {
          const isSelected = selectedMode === mode.id;
          const Icon = mode.icon;

          return (
            <button
              key={mode.id}
              role="tab"
              aria-selected={isSelected}
              id={`mode-tab-${mode.id}`}
              onClick={() => onSelectMode(mode.id)}
              className={`relative flex flex-col items-start p-3 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-600 shadow-sm ring-1 ring-indigo-600/30'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70'
              }`}
            >
              {mode.badge && (
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-700">
                  {mode.badge}
                </span>
              )}
              
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>

              <span
                className={`text-sm sm:text-base font-bold tracking-tight block ${
                  isSelected ? 'text-indigo-950' : 'text-slate-900'
                }`}
              >
                {mode.title}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-600 mt-0.5 line-clamp-1">
                {mode.tagline}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
