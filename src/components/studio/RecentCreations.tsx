import React from 'react';
import { Sparkles, Clock, Trash2, ArrowUpRight } from 'lucide-react';
import { StudioCreationResult } from './types';

interface RecentCreationsProps {
  creations: StudioCreationResult[];
  onSelectCreation: (creation: StudioCreationResult) => void;
  onClearHistory: () => void;
}

export const RecentCreations: React.FC<RecentCreationsProps> = ({
  creations,
  onSelectCreation,
  onClearHistory,
}) => {
  if (creations.length === 0) {
    return null;
  }

  return (
    <div className="w-full pt-8 sm:pt-10 border-t border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Recent Creations
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {creations.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClearHistory}
          className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear history</span>
        </button>
      </div>

      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {creations.map((item) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            aria-label={`Open recent creation: ${item.prompt}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectCreation(item);
              }
            }}
            onClick={() => onSelectCreation(item)}
            className="group relative rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-50 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/40 flex flex-col"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
              <img
                src={item.imageUrl}
                alt={item.prompt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-xs text-white">
                  {item.style}
                </span>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg bg-white/90 text-slate-800 shadow-sm">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Micro details */}
            <div className="p-2.5 bg-white flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-800 font-medium line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {item.prompt || 'Custom Visual Transformation'}
              </p>
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                <span className="uppercase font-semibold tracking-wider text-indigo-600">
                  {item.mode.replace('-', ' ')}
                </span>
                <span>
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
