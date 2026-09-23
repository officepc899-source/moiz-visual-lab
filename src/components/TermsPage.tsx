import React, { useState } from 'react';
import { FileText, CheckCircle2, ShieldAlert, AlertTriangle, Scale, Copy, Check } from 'lucide-react';

const CONTACT_EMAIL = 'officepc899@gmail.com';

export const TermsPage: React.FC = () => {
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
    <div id="terms-page" className="max-w-4xl mx-auto space-y-10">
      {/* 1. Header */}
      <div className="text-left border-b border-slate-100 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Platform Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
          Terms of Use
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          The guidelines, rights, and responsibilities governing your use of MOIZ VISUAL LAB.
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Effective Date: September 2026 • Version 1.2
        </p>
      </div>

      {/* 2. Welcome Summary */}
      <div className="p-6 rounded-3xl bg-slate-50/90 border border-slate-200/90 text-slate-700 space-y-2">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Scale className="w-4 h-4 text-indigo-600" />
          <span>Agreement to Terms</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          By accessing or using MOIZ VISUAL LAB (&quot;the Platform&quot;), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Use. If you do not agree with any part of these terms, please refrain from using the platform.
        </p>
      </div>

      {/* 3. Detailed Terms Sections */}
      <div className="space-y-8 text-slate-700">
        {/* Section 1: Acceptable Use */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">1</span>
            <span>Acceptable Use</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              MOIZ VISUAL LAB is provided to support lawful, positive creative expression, artistic experimentation, and graphic production. You agree to use the platform in compliance with all applicable local, national, and international laws and regulations.
            </p>
            <p>
              You agree not to bypass rate limits, probe security vulnerabilities, reverse-engineer proprietary algorithms, or introduce automated scrapers, denial-of-service scripts, or malicious code into the platform.
            </p>
          </div>
        </section>

        {/* Section 2: User-Uploaded Content */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">2</span>
            <span>User-Uploaded Content & Ownership</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              You retain all ownership rights, copyrights, and intellectual property interests in the original photographs, artwork, or text prompts you upload or submit to MOIZ VISUAL LAB.
            </p>
            <p>
              By uploading media to the platform, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>You own the content or have secured all necessary permissions, licenses, or authorizations to use and transform it.</li>
              <li>Your uploaded content does not infringe upon any third party&apos;s copyright, trademark, privacy right, or publicity right.</li>
              <li>You grant MOIZ VISUAL LAB a limited, temporary license to process, resize, and transmit the media solely for the purpose of executing the requested transformation session.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: AI-Generated Content */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">3</span>
            <span>AI-Generated Content</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              Output imagery generated through the studio is produced via algorithmic synthesis models. To the extent permitted by applicable copyright laws, MOIZ VISUAL LAB does not assert proprietary ownership claims over the unique artistic imagery generated from your prompts and inputs.
            </p>
            <p>
              You are free to download, edit, and utilize your generated visual creations for personal, social, and commercial projects, provided that your use does not violate applicable laws, trademark rights, or these terms. You assume full responsibility for your subsequent publication or deployment of generated visuals.
            </p>
          </div>
        </section>

        {/* Section 4: Prohibited Content */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-mono">4</span>
            <span className="text-rose-900">Prohibited Content & Activities</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              You may <strong>not</strong> upload, generate, or attempt to synthesize content that involves:
            </p>
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-rose-900 text-xs space-y-2">
              <ul className="list-disc list-inside space-y-1">
                <li>Child sexual abuse material (CSAM) or any exploitation of minors.</li>
                <li>Non-consensual intimate imagery, defamatory deepfakes, or harassment of individuals.</li>
                <li>Hate speech, incitement to imminent violence, or graphic depictions of gratuitous harm.</li>
                <li>Fraudulent impersonation, deceptive manipulation, or illegal commercial acts.</li>
                <li>Content that infringes registered trademarks, industrial patents, or third-party copyrights without authorization.</li>
              </ul>
            </div>
            <p className="text-xs text-slate-500">
              Violations may result in immediate request termination, IP-level blocks, or referral to law enforcement authorities where legally required.
            </p>
          </div>
        </section>

        {/* Section 5: Intellectual Property of MOIZ VISUAL LAB */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">5</span>
            <span>Platform Intellectual Property</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              The MOIZ VISUAL LAB brand name, website design, visual architecture, interface components, logos, icons, layout compositions, and underlying code are the intellectual property of MOIZ VISUAL LAB and are protected by applicable intellectual property legislation.
            </p>
            <p>
              You may not clone, redistribute, mirror, or repackage the platform interface without prior written consent.
            </p>
          </div>
        </section>

        {/* Section 6: Service Availability & Prototype Features */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">6</span>
            <span>Service Availability & Prototype Notice</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              We strive for high uptime and smooth performance, but the platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis. Features may be updated, modified, or temporarily paused for maintenance, model upgrades, or cloud provider quota adjustments.
            </p>
            <p>
              <strong>Prototype Features Notice:</strong> Certain modalities—including AI Video motion loops and experimental style concepts—are explicitly offered in prototype preview mode. Such features showcase interface mechanics and interactive prototypes and should not be relied upon for mission-critical production rendering.
            </p>
          </div>
        </section>

        {/* Section 7: Third-Party Services */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">7</span>
            <span>Third-Party Services</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              The platform interfaces with third-party service providers, including cloud hosting facilities and machine learning APIs (such as Google Gemini). We do not control and cannot be held responsible for third-party upstream outages, latency, or API specification adjustments.
            </p>
          </div>
        </section>

        {/* Section 8: Disclaimer of Warranties */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">8</span>
            <span>Disclaimer of Warranties</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p className="uppercase text-xs tracking-wider text-slate-500 font-semibold">
              Provided As-Is
            </p>
            <p>
              TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, MOIZ VISUAL LAB DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT GENERATED IMAGES WILL BE ACCURATE, COMPLETE, OR FREE FROM UNINTENDED ARTIFACTS.
            </p>
          </div>
        </section>

        {/* Section 9: Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">9</span>
            <span>Limitation of Liability</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              IN NO EVENT SHALL MOIZ VISUAL LAB, ITS CREATORS, OR CONTRIBUTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THE PLATFORM, LOSS OF DATA, OR RELIANCE ON GENERATED VISUAL OUTPUTS.
            </p>
          </div>
        </section>

        {/* Section 10: Changes to Terms */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">10</span>
            <span>Changes to Terms</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2 pl-8">
            <p>
              We reserve the right to revise or update these Terms of Use at any time. When modifications occur, the &quot;Effective Date&quot; at the top of this document will be updated. Your continued use of the platform after the posting of revised terms confirms your acceptance of those changes.
            </p>
          </div>
        </section>

        {/* Section 11: Contact Information */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-mono">11</span>
            <span>Inquiries & Contact</span>
          </h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-3 pl-8">
            <p>
              If you have any questions regarding these Terms of Use or wish to discuss acceptable use permissions, please reach out to:
            </p>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500 font-medium">Terms & Legal Inquiries</p>
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
