import React, { useState } from 'react';
import { Sparkles, Twitter, Instagram, Github, Youtube, Mail, Copy, Check } from 'lucide-react';
import { RoutePath } from '../types';

interface FooterProps {
  onNavigate: (route: RoutePath) => void;
}

const CONTACT_EMAIL = 'officepc899@gmail.com';

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);

  const footerLinks: { label: string; route: RoutePath }[] = [
    { label: 'About', route: '/about' },
    { label: 'Contact', route: '/contact' },
    { label: 'Privacy', route: '/privacy' },
    { label: 'Terms', route: '/terms' },
    { label: 'FAQ', route: '/faq' },
  ];

  const handleCopyEmail = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
      } else {
        const el = document.createElement('textarea');
        el.value = CONTACT_EMAIL;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-400 py-12 md:py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 pb-12 border-b border-slate-800">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 max-w-sm">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
              aria-label="MOIZ VISUAL LAB home"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                MOIZ VISUAL LAB
              </span>
            </button>

            <p className="text-sm text-slate-300 font-medium">
              Create. Explore. Imagine.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Turn your photos and ideas into beautiful visuals with simple AI-powered experiences.
            </p>
          </div>

          {/* Center Column: Links and Direct Contact */}
          <div className="flex flex-col items-center lg:items-start space-y-5 text-center lg:text-left">
            {/* Links list */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-sm font-medium">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  id={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  href={link.route}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(link.route);
                  }}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Contact Email in Footer */}
            <div 
              id="footer-contact-section"
              className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 text-xs"
            >
              <span className="text-slate-400 font-medium">Email:</span>
              <a
                id="footer-email-link"
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-slate-200 hover:text-indigo-400 transition-colors font-semibold underline underline-offset-4 decoration-slate-700 hover:decoration-indigo-400 break-all"
                title="Send email via mailto"
              >
                {CONTACT_EMAIL}
              </a>
              <button
                id="footer-copy-email-btn"
                type="button"
                onClick={handleCopyEmail}
                aria-label="Copy Email address to clipboard"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer active:scale-95 ml-0 sm:ml-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Placeholders */}
          <div className="flex items-center gap-3">
            <a
              href="#twitter"
              onClick={(e) => e.preventDefault()}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 flex items-center justify-center transition-colors"
              aria-label="Twitter / X profile (placeholder)"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#instagram"
              onClick={(e) => e.preventDefault()}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-pink-600 hover:text-white text-slate-400 flex items-center justify-center transition-colors"
              aria-label="Instagram profile (placeholder)"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#github"
              onClick={(e) => e.preventDefault()}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-400 flex items-center justify-center transition-colors"
              aria-label="GitHub repository (placeholder)"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="#youtube"
              onClick={(e) => e.preventDefault()}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-red-600 hover:text-white text-slate-400 flex items-center justify-center transition-colors"
              aria-label="YouTube channel (placeholder)"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} MOIZ VISUAL LAB. All rights reserved.</p>
          <p className="text-slate-600">
            A modern AI creative platform for visual transformation.
          </p>
        </div>
      </div>
    </footer>
  );
};
