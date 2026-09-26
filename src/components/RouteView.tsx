import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { RoutePath } from '../types';
import { CreateStudio } from './studio/CreateStudio';
import { ContactPage } from './ContactPage';
import { AboutPage } from './AboutPage';
import { PrivacyPage } from './PrivacyPage';
import { TermsPage } from './TermsPage';
import { FaqPage } from './FaqPage';
import { SIMPLE_IDEAS } from '../data/mockData';

interface RouteViewProps {
  route: RoutePath;
  onNavigate: (route: RoutePath) => void;
}

export const RouteView: React.FC<RouteViewProps> = ({ route, onNavigate }) => {
  // Dedicated Create Studio Workspace
  if (route === '/create') {
    return <CreateStudio initialMode="ai-image" onNavigate={onNavigate} />;
  }

  if (route === '/ai-photo') {
    return <CreateStudio initialMode="ai-photo" onNavigate={onNavigate} />;
  }

  if (route === '/ai-image') {
    return <CreateStudio initialMode="ai-image" onNavigate={onNavigate} />;
  }

  if (route === '/ai-video') {
    return <CreateStudio initialMode="ai-video" onNavigate={onNavigate} />;
  }

  if (route === '/fun') {
    return <CreateStudio initialMode="fun" onNavigate={onNavigate} />;
  }

  return (
    <div className="py-10 md:py-16 bg-white min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* --- /ideas --- */}
        {route === '/ideas' && (
          <div className="space-y-8">
            <div className="text-left border-b border-slate-100 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Creative Inspiration</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Need an Idea?
              </h1>
              <p className="mt-2 text-base text-slate-600">
                Discover prompt recipes, lighting tricks, and transformation techniques.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {SIMPLE_IDEAS.map((idea) => (
                <div key={idea.id} className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                    {idea.category} • {idea.count}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{idea.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{idea.description}</p>
                  <button
                    onClick={() => onNavigate('/create')}
                    className="mt-4 text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Use in Creation Studio →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- /blog --- */}
        {route === '/blog' && (
          <div className="space-y-8">
            <div className="text-left border-b border-slate-100 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>MOIZ Journal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Creative Visual Articles
              </h1>
              <p className="mt-2 text-base text-slate-600">
                Insights, tutorials, and perspectives on the modern creative workflow.
              </p>
            </div>

            <div className="space-y-6">
              <article className="p-6 rounded-3xl border border-slate-200 bg-white hover:border-indigo-200 transition-colors">
                <span className="text-xs font-semibold text-indigo-600">Design Perspective</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Why Simplicity Trumps Complexity in Modern Visual Creation
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  How modern AI platforms are moving away from cluttered parameter consoles toward focused, artistic creative experiences.
                </p>
              </article>

              <article className="p-6 rounded-3xl border border-slate-200 bg-white hover:border-indigo-200 transition-colors">
                <span className="text-xs font-semibold text-indigo-600">Photography Tips</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Mastering Studio Rim Lighting for Portrait Transforms
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  How gentle backlight and color grading balance creates immediate depth in digital portraits.
                </p>
              </article>
            </div>
          </div>
        )}

        {/* --- /about --- */}
        {route === '/about' && <AboutPage onNavigate={onNavigate} />}

        {/* --- /contact --- */}
        {route === '/contact' && <ContactPage />}

        {/* --- /faq --- */}
        {route === '/faq' && <FaqPage onNavigate={onNavigate} />}

        {/* --- /privacy --- */}
        {route === '/privacy' && <PrivacyPage />}

        {/* --- /terms --- */}
        {route === '/terms' && <TermsPage />}

        {/* --- /404 or Unknown Route --- */}
        {route === '/404' && (
          <div className="text-center py-16 sm:py-24 max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl border border-indigo-100">
              404
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Page Not Found
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              We couldn't find the page you're looking for. It may have been moved or the URL might be mistyped.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => onNavigate('/')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
              >
                Return to Home
              </button>
              <button
                onClick={() => onNavigate('/create')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Open Create Studio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
