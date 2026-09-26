import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Wand2 } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CreationCard } from './components/CreationCard';
import { TrendingGallery } from './components/TrendingGallery';
import { QuickCreate } from './components/QuickCreate';
import { FunExperienceCard } from './components/FunExperienceCard';
import { IdeaCard } from './components/IdeaCard';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { RouteView } from './components/RouteView';
import { RoutePath, TrendingItem } from './types';
import { CREATION_EXPERIENCES, FUN_EXPERIENCES, SIMPLE_IDEAS } from './data/mockData';

const normalizeRoute = (rawPath: string): RoutePath => {
  const clean = rawPath.endsWith('/') && rawPath.length > 1 ? rawPath.slice(0, -1) : rawPath;
  const validRoutes: RoutePath[] = [
    '/',
    '/create',
    '/ai-photo',
    '/ai-image',
    '/ai-video',
    '/fun',
    '/ideas',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/faq'
  ];
  return validRoutes.includes(clean as RoutePath) ? (clean as RoutePath) : '/404';
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<RoutePath>(() => {
    return normalizeRoute(window.location.pathname);
  });

  const [activePromptPreset, setActivePromptPreset] = useState<string>('');

  // SEO metadata management per route
  useEffect(() => {
    const routeMeta: Record<RoutePath, { title: string; description: string }> = {
      '/': {
        title: 'MOIZ VISUAL LAB — Create Something Amazing',
        description: 'Transform your photos and visual ideas into stunning imagery, stylized portraits, and motion loops with simple creative experiences.',
      },
      '/create': {
        title: 'Create Studio — MOIZ VISUAL LAB',
        description: 'Explore our unified creative studio for AI photo transformations, prompt-based image synthesis, and dynamic visual styling.',
      },
      '/ai-photo': {
        title: 'AI Photo Transformation — MOIZ VISUAL LAB',
        description: 'Upload your photos and restyle them with studio lighting, cinematic aesthetics, fine-art oil painting, anime, and 3D effects.',
      },
      '/ai-image': {
        title: 'AI Image Generation — MOIZ VISUAL LAB',
        description: 'Generate high-quality digital artwork, character concepts, and realistic photography from descriptive text prompts.',
      },
      '/ai-video': {
        title: 'AI Video Motion — MOIZ VISUAL LAB',
        description: 'Preview dynamic motion effects, camera pans, and ambient video loop prototypes in MOIZ VISUAL LAB.',
      },
      '/fun': {
        title: 'Fun & Creative Experiences — MOIZ VISUAL LAB',
        description: 'Reimagine portraits with playful artistic themes including Cyberpunk avatars, Anime heroes, Retro 80s styles, and 3D figurines.',
      },
      '/ideas': {
        title: 'Creative Inspiration & Ideas — MOIZ VISUAL LAB',
        description: 'Browse curated visual prompts, lighting guides, and composition techniques to spark your next digital art project.',
      },
      '/blog': {
        title: 'MOIZ Journal & Insights — MOIZ VISUAL LAB',
        description: 'Read perspectives on modern digital aesthetics, photography lighting tips, and intuitive creative workflows.',
      },
      '/about': {
        title: 'About Us — MOIZ VISUAL LAB',
        description: 'Learn about MOIZ VISUAL LAB, our mission, core visual experiences, and design philosophy for accessible creative expression.',
      },
      '/contact': {
        title: 'Contact Us — MOIZ VISUAL LAB',
        description: 'Get in touch with MOIZ VISUAL LAB. Send inquiries, feedback, or reach our team directly at officepc899@gmail.com.',
      },
      '/privacy': {
        title: 'Privacy Policy — MOIZ VISUAL LAB',
        description: 'Understand how MOIZ VISUAL LAB protects your data, processes uploaded photos in-session, and handles user privacy with integrity.',
      },
      '/terms': {
        title: 'Terms of Use — MOIZ VISUAL LAB',
        description: 'Review the terms and conditions, acceptable use policies, and creative guidelines governing the use of MOIZ VISUAL LAB.',
      },
      '/faq': {
        title: 'Frequently Asked Questions — MOIZ VISUAL LAB',
        description: 'Find answers to common questions regarding supported file formats, creation downloads, prototype modes, and getting started.',
      },
      '/404': {
        title: 'Page Not Found — MOIZ VISUAL LAB',
        description: 'The requested page could not be found. Return to MOIZ VISUAL LAB home or explore the Create Studio.',
      },
    };

    const currentMeta = routeMeta[currentRoute] || routeMeta['/'];
    document.title = currentMeta.title;

    // Update meta description tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', currentMeta.description);

    // Compute canonical URL for current route, safeguarding against localhost or development URLs
    const PRODUCTION_CANONICAL_ORIGIN = 'https://ais-pre-t6y6n2fxa6gpzgpthscvni-58294370003.asia-east1.run.app';
    const origin = window.location.origin;
    const isDevOrLocal = !origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('-dev-');
    const baseOrigin = isDevOrLocal ? PRODUCTION_CANONICAL_ORIGIN : origin;
    const canonicalUrl = `${baseOrigin}${currentRoute === '/' ? '/' : currentRoute}`;

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Update OpenGraph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', currentMeta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', currentMeta.description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonicalUrl);

    // Update Twitter card tags
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', currentMeta.title);

    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', currentMeta.description);

    // FAQPage Structured Data (Only on /faq route)
    const existingFaqScript = document.getElementById('schema-faq');
    if (currentRoute === '/faq') {
      const faqStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'What is MOIZ VISUAL LAB?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'MOIZ VISUAL LAB is a modern creative platform where you can transform everyday photographs and creative concepts into polished visual art, stylized portraits, and motion previews.',
            },
          },
          {
            '@type': 'Question',
            'name': 'What can I create?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'You can create across four distinct creative experiences: AI Photo (restyling photos), AI Image (text-to-image synthesis), AI Video (motion previews), and Fun Experiences (playful stylized themes).',
            },
          },
          {
            '@type': 'Question',
            'name': 'Can I upload photos?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes! In AI Photo mode, you can drag and drop or browse to upload any portrait, landscape, or subject photo from your device.',
            },
          },
          {
            '@type': 'Question',
            'name': 'Which image formats are supported?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'We support standard high-resolution digital image formats: JPG/JPEG, PNG, and WEBP files up to 25MB.',
            },
          },
          {
            '@type': 'Question',
            'name': 'Is AI generation currently available?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Our server supports live integration for Google Gemini AI (gemini-3.1-flash-lite-image). In environments where an AI key or quota is not yet configured, the studio clearly indicates that AI generation is not connected and never displays simulated or fake generated images.',
            },
          },
          {
            '@type': 'Question',
            'name': 'Can I download creations?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes, absolutely. Every creation produced includes a direct Download button as high-quality image files without watermarks.',
            },
          },
          {
            '@type': 'Question',
            'name': 'Is an account required?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'No account or login is required to start creating with MOIZ VISUAL LAB. You can immediately access the Create Studio in your browser.',
            },
          },
          {
            '@type': 'Question',
            'name': 'How can I contact you?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'You can reach us directly via email at officepc899@gmail.com or through our Contact page.',
            },
          },
        ],
      };

      if (!existingFaqScript) {
        const script = document.createElement('script');
        script.id = 'schema-faq';
        script.type = 'application/ld+json';
        script.text = JSON.stringify(faqStructuredData);
        document.head.appendChild(script);
      } else {
        existingFaqScript.textContent = JSON.stringify(faqStructuredData);
      }
    } else if (existingFaqScript) {
      existingFaqScript.remove();
    }
  }, [currentRoute]);

  // Handle browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(normalizeRoute(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: RoutePath) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToQuickCreate = () => {
    if (currentRoute !== '/') {
      setCurrentRoute('/');
      window.history.pushState({}, '', '/');
      setTimeout(() => {
        const elem = document.getElementById('quick-create-section');
        elem?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const elem = document.getElementById('quick-create-section');
      elem?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTrending = () => {
    if (currentRoute !== '/') {
      setCurrentRoute('/');
      window.history.pushState({}, '', '/');
      setTimeout(() => {
        const elem = document.getElementById('trending-creations-section');
        elem?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const elem = document.getElementById('trending-creations-section');
      elem?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTryTrending = (item: TrendingItem) => {
    setActivePromptPreset(item.promptDescription);
    scrollToQuickCreate();
  };

  const handleTryFunExperience = (route: RoutePath, title: string) => {
    setActivePromptPreset(`Create visual transformation: ${title}`);
    scrollToQuickCreate();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-purple-100 selection:text-purple-900 font-sans">
      {/* Header */}
      <Header currentRoute={currentRoute} onNavigate={navigateTo} />

      {/* Main Content */}
      <main className="flex-grow">
        {currentRoute === '/' ? (
          /* HOMEPAGE VIEW */
          <div className="space-y-4 md:space-y-8">
            {/* SECTION 1 — HERO */}
            <Hero
              onStartCreating={scrollToQuickCreate}
              onExplore={scrollToTrending}
              onNavigate={navigateTo}
            />

            {/* SECTION 2 — CREATE (ONLY 4 MAIN CARDS) */}
            <section id="what-to-create-section" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl text-left mb-12">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Choose Your Experience</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                  What Do You Want To Create?
                </h2>
                <p className="mt-2 text-base sm:text-lg text-slate-600">
                  Choose an experience and start creating.
                </p>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {CREATION_EXPERIENCES.map((exp) => (
                  <CreationCard
                    key={exp.id}
                    experience={exp}
                    onSelect={navigateTo}
                  />
                ))}
              </div>
            </section>

            {/* SECTION 3 — TRENDING CREATIONS */}
            <TrendingGallery
              onTryThis={handleTryTrending}
              onNavigate={navigateTo}
            />

            {/* SECTION 4 — QUICK CREATE */}
            <QuickCreate
              key={activePromptPreset} // resets or updates with preset if clicked
              initialPrompt={activePromptPreset}
              onNavigateToStudio={() => navigateTo('/create')}
            />

            {/* SECTION 5 — FUN EXPERIENCES */}
            <section id="just-for-fun-section" className="py-16 md:py-24 bg-slate-50/70 border-y border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl text-left mb-12">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-3">
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Playful Lab</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                    Just For Fun
                  </h2>
                  <p className="mt-2 text-base sm:text-lg text-slate-600">
                    Reimagine yourself through iconic styles, movie posters, and avatars.
                  </p>
                </div>

                {/* 4 Fun Experience Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {FUN_EXPERIENCES.map((exp) => (
                    <FunExperienceCard
                      key={exp.id}
                      experience={exp}
                      onTryNow={handleTryFunExperience}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 6 — SIMPLE IDEAS */}
            <section id="need-an-idea-section" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl text-left mb-12">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Creative Prompts & Workflows</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                  Need an Idea?
                </h2>
                <p className="mt-2 text-base sm:text-lg text-slate-600">
                  Curated recipes and tips to spark your next visual project.
                </p>
              </div>

              {/* 4 Clean Idea Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {SIMPLE_IDEAS.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onClick={navigateTo}
                  />
                ))}
              </div>
            </section>

            {/* SECTION 7 — FINAL CTA */}
            <CTA
              onStartCreating={scrollToQuickCreate}
              onNavigate={navigateTo}
            />
          </div>
        ) : (
          /* SUB-ROUTE / STUDIO / PLACEHOLDER VIEWS */
          <RouteView route={currentRoute} onNavigate={navigateTo} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
