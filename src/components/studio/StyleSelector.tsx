import React from 'react';
import { Camera, Film, Sparkles, Box, Palette, Flame } from 'lucide-react';
import { CreationStyle } from './types';

interface StyleSelectorProps {
  selectedStyle: CreationStyle;
  onSelectStyle: (style: CreationStyle) => void;
}

interface StyleOption {
  id: CreationStyle;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  description: string;
}

const STYLES: StyleOption[] = [
  {
    id: 'Realistic',
    label: 'Realistic',
    icon: Camera,
    accentColor: 'from-blue-500 to-cyan-500',
    description: 'Natural light & true tones',
  },
  {
    id: 'Cinematic',
    label: 'Cinematic',
    icon: Film,
    accentColor: 'from-amber-500 to-rose-500',
    description: '35mm anamorphic rim lighting',
  },
  {
    id: 'Anime',
    label: 'Anime',
    icon: Sparkles,
    accentColor: 'from-fuchsia-500 to-purple-500',
    description: 'Vibrant clean illustration',
  },
  {
    id: '3D',
    label: '3D',
    icon: Box,
    accentColor: 'from-emerald-500 to-teal-500',
    description: 'Stylized smooth render',
  },
  {
    id: 'Artistic',
    label: 'Artistic',
    icon: Palette,
    accentColor: 'from-indigo-500 to-violet-500',
    description: 'Oil painterly brushwork',
  },
  {
    id: 'Fantasy',
    label: 'Fantasy',
    icon: Flame,
    accentColor: 'from-purple-500 to-pink-500',
    description: 'Ethereal glows & mythic aura',
  },
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
}) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
        4. Select Aesthetic Style
      </label>
      <div 
        role="radiogroup" 
        aria-label="Creation styles" 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
      >
        {STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;
          const Icon = style.icon;

          return (
            <button
              key={style.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              id={`style-chip-${style.id.toLowerCase()}`}
              onClick={() => onSelectStyle(style.id)}
              className={`flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                isSelected
                  ? 'bg-indigo-50/80 border-indigo-600 shadow-sm ring-1 ring-indigo-600/30'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span
                  className={`text-xs sm:text-sm font-bold block truncate leading-tight ${
                    isSelected ? 'text-indigo-950' : 'text-slate-900'
                  }`}
                >
                  {style.label}
                </span>
                <span className="text-[10px] text-slate-500 truncate block">
                  {style.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
