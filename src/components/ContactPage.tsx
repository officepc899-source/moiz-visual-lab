import React, { useState } from 'react';
import { 
  Mail, Copy, Check, Send, ExternalLink, CheckCircle2, AlertCircle, MessageSquare 
} from 'lucide-react';

const CONTACT_EMAIL = 'officepc899@gmail.com';

export const ContactPage: React.FC = () => {
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Field validation errors
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; message?: boolean }>({});

  // Submission & Copy state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Email format regex validation
  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

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
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleCopyDraft = async () => {
    const draftText = `From: ${name} <${email}>\nSubject: Inquiry via MOIZ VISUAL LAB Contact Form\n\nMessage:\n${message}`;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(draftText);
      } else {
        const el = document.createElement('textarea');
        el.value = draftText;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2500);
    } catch {
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2500);
    }
  };

  const validateForm = () => {
    const nextErrors: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) {
      nextErrors.name = 'Please enter your name.';
    }

    if (!email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!validateEmail(email)) {
      nextErrors.email = 'Please enter a valid email address (e.g., name@domain.com).';
    }

    if (!message.trim()) {
      nextErrors.message = 'Please enter your message or question.';
    } else if (message.trim().length < 5) {
      nextErrors.message = 'Please provide a message with at least 5 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    if (!validateForm()) {
      return;
    }

    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    setErrors({});
    setTouched({});
  };

  // Generate mailto link with pre-filled content
  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Inquiry from ${name || 'MOIZ VISUAL LAB User'}`
  )}&body=${encodeURIComponent(
    `Hello MOIZ VISUAL LAB Team,\n\n${message}\n\n---\nSender Name: ${name}\nSender Email: ${email}`
  )}`;

  return (
    <div id="contact-page" className="max-w-4xl mx-auto space-y-10">
      {/* 1. Header: Heading & Short Description */}
      <div className="text-left border-b border-slate-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Contact</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
          Get in Touch
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          Have a question, suggestion, or feedback? We’d love to hear from you.
        </p>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Email Us Section */}
        <div className="md:col-span-5 space-y-6">
          <div 
            id="email-us-card"
            className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 text-slate-900 shadow-xs"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Email Us
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              Prefer writing directly from your mail client? You can reach us anytime at:
            </p>

            {/* Clickable Email with mailto */}
            <div className="mb-4">
              <a
                id="contact-email-link"
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-block font-mono text-sm sm:text-base font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors break-all"
                title="Send email via mailto"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            {/* Accessible Copy Email Button */}
            <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center gap-3">
              <button
                id="copy-email-btn"
                type="button"
                onClick={handleCopyEmail}
                aria-label="Copy Email address to clipboard"
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  copiedEmail
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 shadow-xs active:scale-[0.98]'
                }`}
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <a
                id="open-mailto-btn"
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/70 border border-indigo-200/70 transition-colors"
              >
                <span>Launch Mail</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-[11px] text-slate-500 mt-4 leading-normal">
              ✦ We typically respond to questions and inquiries within 1–2 business days.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 text-slate-600 text-xs leading-relaxed shadow-xs">
            <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Feedback & Ideas</span>
            </h3>
            <p className="text-slate-500">
              Have feature requests or transformation styles you’d like to see added to MOIZ VISUAL LAB? We welcome all creator thoughts.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="md:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            {isSubmitted ? (
              /* Confirmation Screen (Honest about local confirmation & offers mailto fallback) */
              <div 
                id="contact-submitted-state" 
                className="py-4 text-left space-y-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Message Prepared
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Thank you, <span className="font-semibold text-slate-800">{name}</span>! Your message has been validated and recorded for this session.
                  </p>
                </div>

                {/* Clear, honest transparency card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
                  <p className="font-semibold text-slate-800">
                    Direct Email Delivery Options:
                  </p>
                  <p className="leading-relaxed text-slate-500">
                    Because this visual lab instance does not currently run an automated background SMTP server, you can launch your email client with your message pre-filled, or copy your draft text.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    id="contact-launch-client-btn"
                    href={mailtoUrl}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-xs transition-all cursor-pointer"
                  >
                    <span>Open in Email Client</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    id="contact-copy-draft-btn"
                    type="button"
                    onClick={handleCopyDraft}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-xs cursor-pointer"
                  >
                    {copiedDraft ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Draft Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Message Text</span>
                      </>
                    )}
                  </button>

                  <button
                    id="contact-reset-btn"
                    type="button"
                    onClick={handleResetForm}
                    className="text-xs text-slate-500 hover:text-slate-700 underline font-medium px-2 py-1 cursor-pointer"
                  >
                    Write another message
                  </button>
                </div>
              </div>
            ) : (
              /* Contact Form */
              <form 
                id="contact-form" 
                onSubmit={handleSubmit} 
                noValidate 
                className="space-y-5"
              >
                <div className="border-b border-slate-100 pb-3 mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Send a Message
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill in your details below and we’ll get back to you.
                  </p>
                </div>

                {/* Field 1: Name */}
                <div>
                  <label 
                    htmlFor="contact-name-input"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (touched.name && errors.name) {
                        setErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, name: true }));
                      if (!name.trim()) {
                        setErrors((prev) => ({ ...prev, name: 'Please enter your name.' }));
                      }
                    }}
                    placeholder="Your Name"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      touched.name && errors.name
                        ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                        : 'border-slate-200/90 focus:ring-indigo-500/20 focus:border-indigo-500'
                    }`}
                  />
                  {touched.name && errors.name && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Field 2: Email */}
                <div>
                  <label 
                    htmlFor="contact-email-input"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched.email && errors.email) {
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, email: true }));
                      if (!email.trim()) {
                        setErrors((prev) => ({ ...prev, email: 'Please enter your email address.' }));
                      } else if (!validateEmail(email)) {
                        setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
                      }
                    }}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      touched.email && errors.email
                        ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                        : 'border-slate-200/90 focus:ring-indigo-500/20 focus:border-indigo-500'
                    }`}
                  />
                  {touched.email && errors.email && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Field 3: Message */}
                <div>
                  <label 
                    htmlFor="contact-message-input"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="contact-message-input"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (touched.message && errors.message) {
                        setErrors((prev) => ({ ...prev, message: undefined }));
                      }
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, message: true }));
                      if (!message.trim()) {
                        setErrors((prev) => ({ ...prev, message: 'Please enter your message.' }));
                      }
                    }}
                    placeholder="Describe your inquiry, suggestion, or question…"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 resize-y min-h-[110px] ${
                      touched.message && errors.message
                        ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                        : 'border-slate-200/90 focus:ring-indigo-500/20 focus:border-indigo-500'
                    }`}
                  />
                  {touched.message && errors.message && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Field 4: Send Message button */}
                <div className="pt-2">
                  <button
                    id="contact-send-button"
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-indigo-200/60 transition-all cursor-pointer active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  ✦ Submitting provides a validated message confirmation and direct mailto link.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
