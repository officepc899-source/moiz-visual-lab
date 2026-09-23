import React, { useState } from 'react';
import { Shield, Lock, Eye, Mail, Server, Database, Check, Copy, AlertCircle } from 'lucide-react';

const CONTACT_EMAIL = 'officepc899@gmail.com';

export const PrivacyPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

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
    <div id="privacy-page" className="max-w-4xl mx-auto space-y-10">
      {/* 1. Header */}
      <div className="text-left border-b border-slate-100 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>Trust & Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          How MOIZ VISUAL LAB protects your personal information, treats uploaded images, and respects your digital privacy.
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Effective Date: September 2026 • Version 1.2
        </p>
      </div>

      {/* 2. Overview Banner */}
      <div className="p-6 rounded-3xl bg-slate-50/90 border border-slate-200/90 space-y-2">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-600" />
          <span>Our Privacy Commitment</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          At MOIZ VISUAL LAB, we treat your privacy with utmost integrity. We collect only the information strictly necessary to process your creative visual requests and respond to your messages. We do not sell your personal data or user-uploaded media to third parties or data brokers.
        </p>
      </div>

      {/* 3. Detailed Sections */}
      <div className="space-y-8 text-slate-700">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">1</span>
            <span>Information You Provide Directly</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              Depending on how you interact with MOIZ VISUAL LAB, you may provide certain information directly:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>
                <strong>Text Prompts & Style Preferences:</strong> The descriptive ideas, artistic styles, and keywords you submit into the Create Studio to produce image or video concepts.
              </li>
              <li>
                <strong>Contact Form Data:</strong> When submitting an inquiry through our Contact page, you provide your name, email address, and message contents.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">2</span>
            <span>Uploaded Images and Files</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              When utilizing the <strong>AI Photo</strong> transformation experience, you upload personal photos or graphical files (JPG, PNG, WEBP):
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>Strict In-Session Processing:</strong> Uploaded images are transmitted solely to compute the visual transformation requested by you.
              </li>
              <li>
                <strong>No Public Sharing:</strong> Your uploaded images are never shared publicly or listed in any public gallery without your explicit action.
              </li>
              <li>
                <strong>No AI Training on Private Work:</strong> We do not harvest or repurpose your private uploaded snapshots to train public AI models.
              </li>
              <li>
                <strong>Local Browser Previews:</strong> Object URLs or local blobs created when dragging-and-dropping images stay locally on your device and are cleared upon page refresh or modal dismissal.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">3</span>
            <span>Contact Form Inquiries</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              When you submit a message through our Contact page or send an email to <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-600 underline font-mono text-xs">{CONTACT_EMAIL}</a>, your name, email address, and message text are used exclusively to address your inquiry, provide support, or evaluate creative suggestions. We do not subscribe contact form senders to unsolicited marketing lists.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">4</span>
            <span>Cookies and Local Storage</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              MOIZ VISUAL LAB uses minimal client-side web technologies:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>Browser Local Storage:</strong> We use your browser’s local storage solely for non-tracking application preferences, such as preserving your recent creations in your current browser session so you can easily review or download them.
              </li>
              <li>
                <strong>No Third-Party Tracking Cookies:</strong> We do not place cross-site advertising cookies or behavioral trackers on your device.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">5</span>
            <span>Analytics & Server Diagnostics</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              To ensure system reliability, prevent denial-of-service abuse, and monitor API quota health, our servers may log basic diagnostic data:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>HTTP request timestamps, response status codes, and aggregate error counts.</li>
              <li>Standard non-identifying browser user-agent and operating system summaries.</li>
            </ul>
            <p>
              These logs do not track individual users across different web properties and are rotated automatically.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">6</span>
            <span>Advertising & Google AdSense Policy</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              <strong>Current Status:</strong> MOIZ VISUAL LAB currently does <strong>not</strong> display third-party advertisements, Google AdSense banners, or sponsored ad networks.
            </p>
            <p>
              If advertising or Google AdSense is introduced in future platform releases, this Privacy Policy will be proactively updated to detail third-party ad serving cookies, Google DoubleClick / interest-based advertising disclosures, and opt-out mechanisms in strict adherence to Google AdSense program policies and data protection regulations.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">7</span>
            <span>Third-Party Services</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              To provide image synthesis and cloud hosting, MOIZ VISUAL LAB utilizes established cloud and AI infrastructure:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>AI Model Infrastructure (Google Gemini API):</strong> When performing live AI transformations, the text prompt and image data are transmitted securely via encrypted server-side proxy routes to Google AI services for model inference.
              </li>
              <li>
                <strong>Cloud Hosting Infrastructure:</strong> Reliable web hosting and network delivery to serve web assets.
              </li>
            </ul>
            <p>
              These third-party providers process data under industry-standard security and confidentiality agreements.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">8</span>
            <span>Data Retention & Storage Limits</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              We practice data minimization:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>Session Images:</strong> Uploaded images processed by the server are held only in temporary working memory during model execution and are not stored in a public image repository.
              </li>
              <li>
                <strong>Client Storage:</strong> Local creations stored in your browser can be cleared by you at any time simply by clearing your browser cache or site storage.
              </li>
              <li>
                <strong>Support Correspondence:</strong> Emails sent to our contact address are retained only as long as required to resolve your request.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">9</span>
            <span>Security Measures</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              We implement industry-standard safeguards to protect information:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>Encryption in Transit:</strong> All web traffic and API calls are secured via HTTPS / TLS encryption.
              </li>
              <li>
                <strong>Zero Client Credential Exposure:</strong> API credentials and server keys are never exposed in browser scripts or frontend assets.
              </li>
              <li>
                <strong>Input Validation:</strong> File types and payloads undergo server-side magic-byte inspection and size boundary limits (25MB) to prevent malicious code execution.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 10 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">10</span>
            <span>Your Rights and Choices</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              You maintain rights over your information:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>Browser Cache Control:</strong> You can delete any saved session creations, cached images, or preferences directly in your browser settings.
              </li>
              <li>
                <strong>Access & Deletion of Correspondence:</strong> You may contact us at any time to request the deletion of emails or contact correspondence you previously submitted.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 11 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">11</span>
            <span>Children’s Privacy</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              MOIZ VISUAL LAB is a general-audience creative utility and is not directed to children under 13 years of age (or under 16 where required by local regulations). We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.
            </p>
          </div>
        </section>

        {/* Section 12 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">12</span>
            <span>Contact Information</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-3 pl-8">
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us directly:
            </p>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500 font-medium">Privacy Contact Email</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-mono text-sm sm:text-base font-bold text-indigo-600 hover:text-indigo-800 underline transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 shadow-xs transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
