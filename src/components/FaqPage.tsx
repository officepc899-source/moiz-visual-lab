import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, Mail, Download, Layers, ShieldCheck, ExternalLink } from 'lucide-react';
import { RoutePath } from '../types';

interface FaqPageProps {
  onNavigate?: (route: RoutePath) => void;
}

const CONTACT_EMAIL = 'officepc899@gmail.com';

interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      question: 'What is MOIZ VISUAL LAB?',
      answer: (
        <p>
          <strong>MOIZ VISUAL LAB</strong> is a modern creative platform where you can transform everyday photographs and creative concepts into polished visual art, stylized portraits, and motion previews. Designed with clean whitespace and intuitive workflows, it removes the complexity of traditional image synthesis so creators can focus purely on visual ideas.
        </p>
      ),
    },
    {
      id: 'faq-2',
      question: 'What can I create?',
      answer: (
        <div className="space-y-2">
          <p>
            You can create across four distinct creative experiences:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
            <li><strong>AI Photo:</strong> Restyle your existing photos into studio portraits, cinematic visuals, oil paintings, anime, or 3D aesthetics.</li>
            <li><strong>AI Image:</strong> Type a descriptive prompt to generate brand-new visual artwork, characters, landscapes, or concepts.</li>
            <li><strong>AI Video:</strong> Generate dynamic motion loop concepts and cinematic visual panning previews.</li>
            <li><strong>Fun Experiences:</strong> Explore playful stylized themes like Cyberpunk avatars, Anime Heroes, Retro 80s movie posters, and 3D Figurines.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'faq-3',
      question: 'Can I upload photos?',
      answer: (
        <p>
          Yes! In the <strong>AI Photo</strong> mode, you can drag and drop or browse to upload any portrait, landscape, or subject photo from your device. You can also click any of our curated sample cards in the studio to quickly test different styles without uploading your own file.
        </p>
      ),
    },
    {
      id: 'faq-4',
      question: 'Which image formats are supported?',
      answer: (
        <div className="space-y-1.5">
          <p>
            We support standard high-resolution digital image formats:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
            <li><strong>JPG / JPEG:</strong> Standard photography format.</li>
            <li><strong>PNG:</strong> Lossless graphics and images with transparent backgrounds.</li>
            <li><strong>WEBP:</strong> Modern web-optimized image format.</li>
          </ul>
          <p className="text-xs text-slate-500 pt-1">
            Files up to <strong>25MB</strong> are supported and verified via magic-byte inspection to ensure secure processing.
          </p>
        </div>
      ),
    },
    {
      id: 'faq-5',
      question: 'Is AI generation currently available?',
      answer: (
        <div className="space-y-2">
          <p>
            <strong>Live AI Connection Status:</strong>
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-700 space-y-1.5 leading-relaxed">
            <p>
              • <strong>AI Image & AI Photo:</strong> Our server supports live integration for Google Gemini AI (<code className="bg-slate-200/70 px-1 py-0.5 rounded text-[11px] font-mono">gemini-3.1-flash-lite-image</code>). When an active API key with quota is configured, generative outputs are synthesized in real-time.
            </p>
            <p>
              • <strong>Transparent Status:</strong> If an AI provider key is not connected or quota is exceeded, the studio clearly displays "AI generation is not connected yet" rather than showing fake results or placeholders.
            </p>
            <p>
              • <strong>AI Video:</strong> Video motion generation is an experimental modality while video motion models are being integrated.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'faq-6',
      question: 'Can I download creations?',
      answer: (
        <p>
          Yes, absolutely! Every creation produced in the studio includes a direct <strong>Download</strong> button. Generated images download directly to your device as high-quality image files without watermarks or complex steps.
        </p>
      ),
    },
    {
      id: 'faq-7',
      question: 'Is an account required?',
      answer: (
        <p>
          No account or login is required to start creating with MOIZ VISUAL LAB. You can immediately access the Create Studio, upload photos, test prompts, and download your creations right in your browser.
        </p>
      ),
    },
    {
      id: 'faq-8',
      question: 'How can I contact you?',
      answer: (
        <div className="space-y-2">
          <p>
            We welcome questions, suggestions, feedback, and collaboration ideas! You can reach us directly at:
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors font-mono"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>{CONTACT_EMAIL}</span>
            </a>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 underline cursor-pointer"
              >
                <span>Visit Contact Page</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div id="faq-page" className="max-w-4xl mx-auto space-y-10">
      {/* 1. Header */}
      <div className="text-left border-b border-slate-100 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Help & Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          Everything you need to know about creating, uploading, and generating with MOIZ VISUAL LAB.
        </p>
      </div>

      {/* 2. FAQ Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-xs transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                aria-expanded={isOpen}
                aria-controls={`${faq.id}-content`}
                className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <span className="text-base sm:text-lg">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div
                  id={`${faq.id}-content`}
                  className="px-5 sm:px-6 pb-5 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Still have questions banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Have more questions?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            We are always here to help. Reach out to our team anytime.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onNavigate && (
            <button
              onClick={() => onNavigate('/contact')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              Contact Us
            </button>
          )}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs sm:text-sm transition-colors"
          >
            Email Directly
          </a>
        </div>
      </div>
    </div>
  );
};
