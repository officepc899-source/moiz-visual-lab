import React from 'react';
import { 
  Sparkles, Camera, Image as ImageIcon, Video, Wand2, 
  ArrowRight, ShieldCheck, HeartHandshake, Eye
} from 'lucide-react';
import { RoutePath } from '../types';

interface AboutPageProps {
  onNavigate?: (route: RoutePath) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div id="about-page" className="max-w-4xl mx-auto space-y-12">
      {/* 1. Header */}
      <div className="text-left border-b border-slate-100 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Platform Overview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
          About MOIZ VISUAL LAB
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
          A modern creative studio dedicated to making visual expression intuitive, accessible, and inspiring.
        </p>
      </div>

      {/* 2. What MOIZ VISUAL LAB Is */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          What is MOIZ VISUAL LAB?
        </h2>
        <div className="prose prose-slate max-w-none text-slate-600 text-base leading-relaxed space-y-3">
          <p>
            <strong>MOIZ VISUAL LAB</strong> is a visual creation and transformation platform designed for designers, photographers, content creators, and digital enthusiasts. Our platform provides a single, unified environment where users can bring creative ideas to life, reimagine existing photographs, and experiment with artistic styles.
          </p>
          <p>
            Rather than requiring users to learn complicated parameter dashboards, command-line interfaces, or complex configuration syntax, MOIZ VISUAL LAB prioritizes visual clarity, clean whitespace, and immediate feedback.
          </p>
        </div>
      </section>

      {/* 3. The Purpose of the Platform */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-50/80 border border-slate-200/90 text-slate-900 space-y-4">
        <div className="flex items-center gap-2.5 text-indigo-600 font-bold text-sm">
          <HeartHandshake className="w-5 h-5" />
          <span>The Purpose of the Platform</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Empowering Creators Through Simplicity
        </h3>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          The core purpose of MOIZ VISUAL LAB is to bridge the gap between creative imagination and visual execution. We believe that turning a snapshot into a cinematic portrait or transforming a brief thought into high-resolution concept art should feel effortless and enjoyable.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-1">Intuitive Workflows</h4>
            <p className="text-xs text-slate-500 leading-normal">
              No complex prompt engineering required. Pick a style, write your idea, and create.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-1">Curated Aesthetics</h4>
            <p className="text-xs text-slate-500 leading-normal">
              Realistic, Cinematic, Anime, 3D Render, Artistic, and Fantasy styles out of the box.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-1">Transparent Experience</h4>
            <p className="text-xs text-slate-500 leading-normal">
              Clear distinction between live AI processing pipelines and interactive prototypes.
            </p>
          </div>
        </div>
      </section>

      {/* 4. What Users Can Create */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            What You Can Create
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            MOIZ VISUAL LAB offers four primary creative modalities:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: AI Photo */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              AI Photo Transformation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Upload your own photographs or portraits and restyle them. Enhance studio lighting, apply cinematic color grading, or transform a snapshot into fine-art oil paintings and stylized 3D illustrations while maintaining subject character and composition.
            </p>
            <div className="text-xs font-semibold text-blue-600 pt-1">
              Supports: JPG, PNG, WEBP files
            </div>
          </div>

          {/* Card 2: AI Image */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              AI Image Generation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Transform descriptive text prompts and concepts into complete digital images. Generate architectural concepts, character designs, landscapes, product mockups, and surreal illustrations simply by typing what you imagine.
            </p>
            <div className="text-xs font-semibold text-purple-600 pt-1">
              Features: Prompt styling & aspect ratio support
            </div>
          </div>

          {/* Card 3: AI Video */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              AI Video & Motion
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Experience dynamic visual motion concepts, ambient video loops, and camera pan simulations. Currently featured in prototype preview mode to showcase the future of browser-based creative motion synthesis.
            </p>
            <div className="text-xs font-semibold text-indigo-600 pt-1">
              Status: Interactive Prototype Mode
            </div>
          </div>

          {/* Card 4: Fun & Creative Experiences */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Fun & Creative Experiences
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Playful, thematic portrait conversions designed for personal avatars and social media. Reimagine yourself as a Cyberpunk character, an Anime protagonist, a Retro 80s movie icon, or an adorable 3D collectible figurine.
            </p>
            <div className="text-xs font-semibold text-pink-600 pt-1">
              Themes: Cyberpunk, Anime, Retro 80s, 3D Figurine
            </div>
          </div>
        </div>
      </section>

      {/* 5. Creator Values & Integrity */}
      <section className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>Commitment to Authentic Creativity</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          MOIZ VISUAL LAB is built with transparency and respect for creators. We clearly distinguish live AI model features from prototype previews, never use misleading claims, and provide instant downloads of all generated assets without locking your work behind restrictive walls.
        </p>
      </section>

      {/* 6. Call to Action */}
      {onNavigate && (
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md">
          <div>
            <h3 className="text-lg font-bold">Ready to make something new?</h3>
            <p className="text-xs sm:text-sm text-indigo-100 mt-0.5">
              Open the Creation Studio and start transforming your ideas.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/create')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-indigo-700 font-bold text-sm shadow-sm hover:bg-indigo-50 transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
