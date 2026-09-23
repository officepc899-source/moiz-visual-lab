import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Sparkles, Image as ImageIcon, X, ArrowRight, CheckCircle2, RefreshCw, Wand2 } from 'lucide-react';

interface QuickCreateProps {
  initialPrompt?: string;
  onNavigateToStudio?: () => void;
}

export const QuickCreate: React.FC<QuickCreateProps> = ({ initialPrompt = '', onNavigateToStudio }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    image: string;
    prompt: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setCleanUploadedImage = (url: string | null) => {
    if (uploadedImage && uploadedImage.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(url);
    setSimulationResult(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (uploadedImage && uploadedImage.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  const PRESET_SUGGESTIONS = [
    'Studio portrait with soft cinematic lighting',
    '3D animated character avatar with warm rim light',
    'Impressionist watercolor landscape at sunset',
    'Cyberpunk neon aesthetic with subtle bokeh'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setCleanUploadedImage(url);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setCleanUploadedImage(url);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleSamplePhotoPick = (url: string) => {
    setCleanUploadedImage(url);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const effectivePrompt = prompt.trim() || 'High-contrast editorial portrait with studio key lighting';
    if (!prompt.trim() && !uploadedImage) {
      setPrompt(effectivePrompt);
    }

    setIsSimulating(true);
    setSimulationResult(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Front-end prototype simulation
    timeoutRef.current = setTimeout(() => {
      setIsSimulating(false);
      setSimulationResult({
        image: uploadedImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
        prompt: effectivePrompt,
      });
    }, 1100);
  };

  return (
    <section id="quick-create-section" className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Create in Seconds
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-600">
            Upload a photo or describe what you want to create.
          </p>
        </div>

        {/* Creation Box Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100/80 overflow-hidden p-6 sm:p-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Upload Area */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                1. Upload a Photo (Optional)
              </label>

              {uploadedImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={uploadedImage}
                      alt="Uploaded preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Photo ready for transformation
                      </p>
                      <p className="text-xs text-slate-500">Custom source uploaded</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                    aria-label="Remove photo"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div
                  id="upload-dropzone"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
                    isDraggingOver
                      ? 'border-indigo-500 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="quick-create-file-input"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Upload a photo <span className="text-slate-400 font-normal">or drag & drop</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, or WEBP up to 20MB</p>

                  {/* Sample photos to try immediately */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2">
                    <span className="text-[11px] text-slate-600 font-medium">Or try a sample:</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSamplePhotoPick('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-700 transition-colors"
                    >
                      Portrait
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSamplePhotoPick('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80');
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-700 transition-colors"
                    >
                      Landscape
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="quick-create-prompt" className="text-sm font-semibold text-slate-900">
                  2. Describe what you want to create
                </label>
                <span className="text-xs text-slate-600">or choose a preset below</span>
              </div>

              <div className="relative">
                <textarea
                  id="quick-create-prompt"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your idea… (e.g. Studio portrait with soft cinematic rim lighting and natural texture)"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 resize-none transition-all"
                />
              </div>

              {/* Inspiration Chips */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium text-slate-600 mr-1 flex items-center gap-1">
                  <Wand2 className="w-3 h-3 text-indigo-500" />
                  Ideas:
                </span>
                {PRESET_SUGGESTIONS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(preset)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors cursor-pointer truncate max-w-[220px] sm:max-w-[280px]"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-600 text-left">
                ✦ Front-end interactive preview. Zero credit card or signup required.
              </p>

              <button
                id="quick-create-generate-btn"
                type="submit"
                disabled={isSimulating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold text-sm px-7 py-3 rounded-xl shadow-md shadow-indigo-100 transition-all duration-200 cursor-pointer disabled:opacity-60"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Preparing Preview…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Prototype Front-End Experience Result Display */}
          {simulationResult && (
            <div
              id="quick-create-result-box"
              role="region"
              aria-live="polite"
              className="mt-8 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3 mb-5">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-950 leading-relaxed">
                  <span className="font-bold">Front-end Experience Preview:</span> Rendering pipeline initialized for prompt: <span className="italic font-medium">"{simulationResult.prompt}"</span>. In the next release phase, this triggers the direct neural synthesis backend.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Generated Visual Preview</span>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                    <img
                      src={simulationResult.image}
                      alt="Transformed result"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between h-full">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Transformation Details</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Resolution: 2048 x 2048 HD • Mode: Studio Retouch & Style Filter
                    </p>
                    <div className="mt-3 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="font-semibold text-indigo-600">Applied parameters:</span> Contrast enhancement, soft focal blur, and color grading harmony.
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSimulationResult(null)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/50 cursor-pointer"
                    >
                      Clear Preview
                    </button>
                    {onNavigateToStudio && (
                      <button
                        type="button"
                        onClick={onNavigateToStudio}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm cursor-pointer ml-auto"
                      >
                        <span>Open Full Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
