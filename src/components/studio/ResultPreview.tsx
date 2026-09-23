import React, { useState } from 'react';
import { 
  Sparkles, Download, RefreshCw, Palette, Image as ImageIcon, 
  ExternalLink, SlidersHorizontal, Check, Eye, AlertCircle, XCircle
} from 'lucide-react';
import { StudioCreationResult, CreationStyle } from './types';

interface ResultPreviewProps {
  result: StudioCreationResult | null;
  isGenerating: boolean;
  error?: string | null;
  errorCode?: string | null;
  onRetry?: () => void;
  onDismissError?: () => void;
  onFallbackToMock?: () => void;
  onCancelGenerating?: () => void;
  onCreateAgain: () => void;
  onTryAnotherStyle: () => void;
  onChangeStyle?: (style: CreationStyle) => void;
}

export const ResultPreview: React.FC<ResultPreviewProps> = ({
  result,
  isGenerating,
  error,
  errorCode,
  onRetry,
  onDismissError,
  onFallbackToMock,
  onCancelGenerating,
  onCreateAgain,
  onTryAnotherStyle,
}) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Reset image error state whenever result changes
  React.useEffect(() => {
    setImageLoadError(false);
    setShowOriginal(false);
  }, [result?.imageUrl, result?.id]);

  const handleDownload = async () => {
    if (!result || isDownloading) return;
    setIsDownloading(true);

    const filename = `moiz-visual-lab-${result.mode}-${result.style.toLowerCase()}-${Date.now()}.jpg`;

    try {
      if (result.imageUrl.startsWith('blob:') || result.imageUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = result.imageUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Try fetching as blob to force real file download
        const response = await fetch(result.imageUrl, { mode: 'cors' });
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
        } else {
          // Fallback direct link
          const link = document.createElement('a');
          link.href = result.imageUrl;
          link.download = filename;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch {
      // Fallback
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
          5. Visual Result
        </label>
        {result && (
          result.isMock ? (
            <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-semibold border border-amber-200">
              Prototype Preview
            </span>
          ) : (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              AI Generated Ready
            </span>
          )
        )}
      </div>

      <div
        id="studio-result-container"
        className="relative w-full rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-lg shadow-slate-100 min-h-[360px] sm:min-h-[440px] flex flex-col justify-between"
      >
        {/* State A: Generating */}
        {isGenerating ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 min-h-[360px]">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 animate-spin opacity-30 blur-md" />
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-md">
                <RefreshCw className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-indigo-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Creating your visual…
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
                Processing through Google Gemini AI image pipeline.
              </p>
            </div>
            {onCancelGenerating && (
              <button
                type="button"
                onClick={onCancelGenerating}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 transition-colors cursor-pointer mt-2"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel Generation</span>
              </button>
            )}
          </div>
        ) : error ? (
          /* State B: Error State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center space-y-4 min-h-[360px] bg-rose-50/30">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="max-w-md">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {errorCode === 'QUOTA_EXCEEDED' 
                  ? 'AI Generation Limit Reached' 
                  : errorCode === 'NO_API_KEY'
                  ? 'API Key Not Configured'
                  : 'Generation Could Not Complete'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed break-words">
                {error}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}

              {onFallbackToMock && (
                <button
                  type="button"
                  onClick={onFallbackToMock}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Preview in Prototype Mode</span>
                </button>
              )}

              {onDismissError && (
                <button
                  type="button"
                  onClick={onDismissError}
                  className="text-xs text-slate-500 hover:text-slate-700 px-3 py-2 cursor-pointer font-medium"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        ) : result ? (
          /* State B: Generated Result */
          <div className="flex flex-col flex-1">
            {/* Visual Viewport */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-slate-950">
              {imageLoadError ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300">
                  <ImageIcon className="w-12 h-12 text-slate-500 mb-2" />
                  <p className="text-sm font-semibold text-white">Visual Preview</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">{result.prompt}</p>
                </div>
              ) : (
                <img
                  src={showOriginal && result.originalImage ? result.originalImage : result.imageUrl}
                  alt={result.prompt || 'Generated visual'}
                  className="w-full h-full object-cover transition-all duration-300"
                  referrerPolicy="no-referrer"
                  onError={() => setImageLoadError(true)}
                />
              )}

              {/* Gradient Overlay & Badges */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Top Bar Badges */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {result.style}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600/90 text-white shadow-xs">
                    {result.mode.replace('-', ' ').toUpperCase()}
                  </span>
                  {result.isMock && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/90 text-white shadow-xs">
                      PROTOTYPE
                    </span>
                  )}
                </div>

                {result.originalImage && (
                  <button
                    type="button"
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 hover:bg-white text-slate-800 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>{showOriginal ? 'Show Result' : 'Compare Original'}</span>
                  </button>
                )}
              </div>

              {/* Bottom prompt snippet overlay */}
              <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
                <p className="text-xs sm:text-sm text-white/90 font-medium line-clamp-2 drop-shadow-sm">
                  “{result.prompt}”
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  id="studio-download-result-btn"
                  type="button"
                  disabled={isDownloading}
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-75 text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </>
                  )}
                </button>

                <button
                  id="studio-create-again-btn"
                  type="button"
                  onClick={onCreateAgain}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Create Again</span>
                </button>
              </div>

              <button
                id="studio-try-another-style-btn"
                type="button"
                onClick={onTryAnotherStyle}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer py-1.5"
              >
                <Palette className="w-4 h-4" />
                <span>Try Another Style</span>
              </button>
            </div>
          </div>
        ) : (
          /* State C: Empty Placeholder */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 min-h-[360px] bg-slate-50/50">
            {/* Subtle Placeholder Illustration */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-center text-indigo-400">
              <div className="relative">
                <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400/80 stroke-1" />
                <Sparkles className="w-5 h-5 text-indigo-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>

            <div className="max-w-xs">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Your creation will appear here
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Upload a photo or write an idea, then click <span className="font-semibold text-indigo-600">Generate ✨</span> to view your visual.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
