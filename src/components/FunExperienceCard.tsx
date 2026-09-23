import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { FunExperience, RoutePath } from '../types';

interface FunExperienceCardProps {
  experience: FunExperience;
  onTryNow: (route: RoutePath, title: string) => void;
}

export const FunExperienceCard: React.FC<FunExperienceCardProps> = ({ experience, onTryNow }) => {
  return (
    <div
      id={`fun-experience-card-${experience.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onTryNow(experience.route, experience.title);
        }
      }}
      onClick={() => onTryNow(experience.route, experience.title)}
      className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:border-purple-200 transition-all duration-300 flex flex-col justify-between cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-purple-500/40"
    >
      {/* Visual Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={experience.image}
          alt={experience.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Soft gradient bottom overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Tag in corner */}
        <div className="absolute top-3.5 left-3.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {experience.tag}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
            {experience.title}
          </h3>
          <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {experience.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-purple-600 group-hover:text-purple-700">
            Try Now
          </span>
          <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:translate-x-1 transition-transform duration-200">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
