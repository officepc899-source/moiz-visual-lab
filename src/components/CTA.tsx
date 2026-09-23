import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { RoutePath } from '../types';

interface CTAProps {
  onStartCreating: () => void;
  onNavigate: (route: RoutePath) => void;
}

export const CTA: React.FC<CTAProps> = ({ onStartCreating, onNavigate }) => {
  return (
    <section id="final-cta-section" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Full-width subtle gradient container */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-14 sm:px-12 sm:py-20 text-center shadow-xl shadow-indigo-100">
          {/* Subtle geometric and aura background shapes */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400/20 rounded-full blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative max-w-2xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md mb-6 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>MOIZ VISUAL LAB</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Create Something Amazing?
            </h2>

            <p className="mt-4 text-base sm:text-lg text-indigo-100 max-w-xl leading-relaxed">
              Turn your photos and ideas into beautiful visuals with simple AI-powered experiences.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button
                id="cta-start-creating-btn"
                onClick={onStartCreating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-indigo-700 hover:text-indigo-800 font-bold text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-black/10 hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <span>Start Creating</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="cta-explore-btn"
                onClick={() => onNavigate('/ideas')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-base px-6 py-3.5 rounded-2xl border border-white/25 backdrop-blur-md transition-all duration-200 cursor-pointer"
              >
                <span>Explore Ideas</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
