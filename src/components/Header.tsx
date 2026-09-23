import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ArrowRight, Compass, Lightbulb, BookOpen, Layers } from 'lucide-react';
import { RoutePath } from '../types';

interface HeaderProps {
  currentRoute: RoutePath;
  onNavigate: (route: RoutePath) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navLinks: { label: string; route: RoutePath; icon?: React.ReactNode; targetId?: string }[] = [
    { label: 'Create', route: '/create', icon: <Layers className="w-4 h-4" /> },
    { label: 'Explore', route: '/', targetId: 'trending-creations-section', icon: <Compass className="w-4 h-4" /> },
    { label: 'Ideas', route: '/ideas', icon: <Lightbulb className="w-4 h-4" /> },
    { label: 'Blog', route: '/blog', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const handleLinkClick = (e: React.MouseEvent, route: RoutePath, targetId?: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(route);
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else if (route === '/' && window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
          : 'bg-white border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo / Brand Name */}
          <button
            id="brand-logo-btn"
            onClick={(e) => handleLinkClick(e, '/')}
            className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
            aria-label="MOIZ VISUAL LAB home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                MOIZ VISUAL LAB
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-600 -mt-1">
                Creative Studio
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <a
                  key={link.label}
                  id={`nav-link-${link.label.toLowerCase()}`}
                  href={link.targetId ? `/#${link.targetId}` : link.route}
                  onClick={(e) => handleLinkClick(e, link.route, link.targetId)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              id="header-create-now-btn"
              href="/create"
              onClick={(e) => handleLinkClick(e, '/create')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-indigo-100 hover:shadow-md hover:shadow-indigo-200 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              <span>Create Now</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Right Controls: Create Now + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <a
              id="mobile-header-create-now-btn"
              href="/create"
              onClick={(e) => handleLinkClick(e, '/create')}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm cursor-pointer"
            >
              <span>Create Now</span>
            </a>

            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="md:hidden border-b border-slate-100 bg-white px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                id={`mobile-nav-link-${link.label.toLowerCase()}`}
                href={link.targetId ? `/#${link.targetId}` : link.route}
                onClick={(e) => handleLinkClick(e, link.route, link.targetId)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 text-base font-medium rounded-lg text-left transition-colors cursor-pointer ${
                  currentRoute === link.route
                    ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
            <a
              href="/ai-photo"
              onClick={(e) => handleLinkClick(e, '/ai-photo')}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-left transition-colors cursor-pointer"
            >
              ✦ AI Photo Studio
            </a>
            <a
              href="/ai-image"
              onClick={(e) => handleLinkClick(e, '/ai-image')}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-left transition-colors cursor-pointer"
            >
              ✦ AI Image Gen
            </a>
            <a
              href="/ai-video"
              onClick={(e) => handleLinkClick(e, '/ai-video')}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-left transition-colors cursor-pointer"
            >
              ✦ AI Video Motion
            </a>
            <a
              href="/fun"
              onClick={(e) => handleLinkClick(e, '/fun')}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-left transition-colors cursor-pointer"
            >
              ✦ Just For Fun
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
