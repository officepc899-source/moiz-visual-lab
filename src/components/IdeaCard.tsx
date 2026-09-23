import React from 'react';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { IdeaItem, RoutePath } from '../types';

interface IdeaCardProps {
  idea: IdeaItem;
  onClick: (route: RoutePath) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onClick }) => {
  return (
    <div
      id={`idea-card-${idea.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(idea.route);
        }
      }}
      onClick={() => onClick(idea.route)}
      className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={idea.image}
          alt={idea.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        <div className="absolute top-3.5 left-3.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 backdrop-blur-md text-slate-800 shadow-sm">
            {idea.category}
          </span>
        </div>

        <div className="absolute bottom-3.5 right-3.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/60 backdrop-blur-md text-white border border-white/20">
            {idea.count}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {idea.title}
          </h3>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            {idea.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-indigo-600">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Explore Concepts
          </span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
