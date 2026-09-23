import React from 'react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { RoutePath } from '../types';

interface HeroProps {
  onStartCreating: () => void;
  onExplore: () => void;
  onNavigate: (route: RoutePath) => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartCreating, onExplore, onNavigate }) => {
  return (
    <section id="hero-section" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Subtle purple & blue gradient background blurs for depth */}
      <div
        className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl pointer-events-none transform -translate-y-12"
        aria-hidden="true"
      />
      <div
        className="absolute top-24 left-10 -z-10 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            {/* Small Badge */}
            <div
              id="hero-badge"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100/80 text-indigo-700 text-xs sm:text-sm font-semibold tracking-wide"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Powered Creativity</span>
            </div>

            {/* Large Heading */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
            >
              Create Something <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Amazing
              </span>
            </h1>

            {/* Supporting Text */}
            <p
              id="hero-supporting-text"
              className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-xl"
            >
              Turn your photos and ideas into beautiful visuals with simple AI-powered experiences.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <button
                id="hero-primary-start-creating-btn"
                onClick={onStartCreating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold text-base px-7 py-3.5 rounded-2xl shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-300/50 transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <span>Start Creating</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-secondary-explore-btn"
                onClick={onExplore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-base px-6 py-3.5 rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <Compass className="w-5 h-5 text-slate-500" />
                <span>Explore</span>
              </button>
            </div>

            {/* Subtle Capability Highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Photo Enhancement
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Text to Image Art
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Motion Video
              </span>
            </div>
          </div>

          {/* Right Column: Visual Transformation Before / After Box */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <BeforeAfterSlider />
          </div>
        </div>
      </div>
    </section>
  );
};
