import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Wand2, X } from 'lucide-react';
import { TRENDING_CREATIONS } from '../data/mockData';
import { TrendingItem, RoutePath } from '../types';

interface TrendingGalleryProps {
  onTryThis: (item: TrendingItem) => void;
  onNavigate: (route: RoutePath) => void;
}

export const TrendingGallery: React.FC<TrendingGalleryProps> = ({ onTryThis, onNavigate }) => {
  const [selectedPreview, setSelectedPreview] = useState<TrendingItem | null>(null);

  useEffect(() => {
    if (!selectedPreview) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPreview(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPreview]);

  const handleTry = (e: React.MouseEvent, item: TrendingItem) => {
    e.stopPropagation();
    onTryThis(item);
  };

  return (
    <section id="trending-creations-section" className="py-16 md:py-24 bg-slate-50/60 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Trending Creations
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-600">
            Get inspired by creative transformations.
          </p>
        </div>

        {/* Responsive Grid Gallery (6 Visual Examples) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {TRENDING_CREATIONS.map((item) => (
            <div
              key={item.id}
              id={`trending-card-${item.id}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedPreview(item);
                }
              }}
              onClick={() => setSelectedPreview(item)}
              className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              {/* Image Container with high-res visual */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Subtle gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Category Pill */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/50 backdrop-blur-md text-white border border-white/20">
                    {item.category}
                  </span>
                </div>

                {/* Transformation type tag bottom of image */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5">
                  <p className="text-xs font-medium text-white/90 truncate">
                    ✦ {item.transformationType}
                  </p>
                </div>
              </div>

              {/* Card Footer / Details */}
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 truncate mt-0.5">
                    {item.promptDescription}
                  </p>
                </div>

                {/* "Try This" Action Button */}
                <button
                  id={`btn-try-this-${item.id}`}
                  onClick={(e) => handleTry(e, item)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 group-hover:bg-indigo-600 text-slate-700 group-hover:text-white transition-colors cursor-pointer shadow-sm"
                  aria-label={`Try this transformation: ${item.title}`}
                >
                  <span>Try This</span>
                  <Wand2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspect Modal Preview */}
      {selectedPreview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="trending-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedPreview(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/11] bg-slate-900">
              <img
                src={selectedPreview.image}
                alt={selectedPreview.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedPreview(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-sm">
                  {selectedPreview.category}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 id="trending-modal-title" className="text-xl font-bold text-slate-900">{selectedPreview.title}</h3>
              <p className="text-sm font-medium text-indigo-600 mt-1">
                Style: {selectedPreview.transformationType}
              </p>
              <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{selectedPreview.promptDescription}"
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedPreview(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={(e) => {
                    handleTry(e, selectedPreview);
                    setSelectedPreview(null);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer"
                >
                  <span>Use This Style</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
