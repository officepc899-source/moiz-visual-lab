import React from 'react';
import { ArrowRight, Sparkles, Palette, Clapperboard, Wand2 } from 'lucide-react';
import { CreationExperience, RoutePath } from '../types';

interface CreationCardProps {
  experience: CreationExperience;
  onSelect: (route: RoutePath) => void;
}

export const CreationCard: React.FC<CreationCardProps> = ({ experience, onSelect }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-blue-600" />;
      case 'Clapperboard':
        return <Clapperboard className="w-5 h-5 text-purple-600" />;
      case 'Wand2':
      default:
        return <Wand2 className="w-5 h-5 text-pink-600" />;
    }
  };

  return (
    <div
      id={`creation-card-${experience.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(experience.route);
        }
      }}
      onClick={() => onSelect(experience.route)}
      className="group relative flex flex-col bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:border-indigo-200 transition-all duration-300 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
    >
      {/* Thumbnail with subtle zoom effect on hover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={experience.thumbnail}
          alt={experience.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Soft vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badge in thumbnail corner if available */}
        {experience.badge && (
          <div className="absolute top-3.5 right-3.5">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-white/95 backdrop-blur-md text-slate-800 shadow-sm border border-white/50">
              {experience.badge}
            </span>
          </div>
        )}

        {/* Floating icon circle on thumbnail boundary */}
        <div className="absolute -bottom-4 left-6 w-11 h-11 rounded-2xl bg-white border border-slate-100 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
          {getIcon(experience.iconName)}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 pt-7 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {experience.title}
            </h3>
          </div>

          <p className="text-sm font-semibold text-indigo-600/90 mb-2">
            {experience.tagline}
          </p>

          <p className="text-sm text-slate-600 leading-relaxed">
            {experience.description}
          </p>

          {/* Quick feature tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {experience.features.map((feat) => (
              <span
                key={feat}
                className="text-[11px] font-medium text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-md"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
          <span>Start Creating</span>
          <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
