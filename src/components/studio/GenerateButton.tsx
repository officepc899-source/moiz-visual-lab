import React from 'react';
import { Sparkles, RefreshCw, XCircle } from 'lucide-react';

interface GenerateButtonProps {
  canGenerate: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
  onCancel?: () => void;
  disabledReason?: string;
  providerNote?: string;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  canGenerate,
  isGenerating,
  onGenerate,
  onCancel,
  disabledReason,
  providerNote,
}) => {
  return (
    <div className="w-full flex flex-col items-center sm:items-start gap-2 pt-1">
      <div className="w-full sm:w-auto flex flex-wrap items-center gap-3">
        <button
          id="studio-generate-button"
          type="button"
          disabled={!canGenerate || isGenerating}
          onClick={onGenerate}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 font-bold text-base px-8 py-3.5 rounded-2xl shadow-md transition-all duration-200 cursor-pointer ${
            !canGenerate || isGenerating
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300/60'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-indigo-200/60 hover:shadow-lg hover:shadow-indigo-300/60 active:scale-[0.99]'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
              <span>Creating your visual…</span>
            </>
          ) : (
            <>
              <span>Generate</span>
              <span className="text-amber-200">✨</span>
            </>
          )}
        </button>

        {isGenerating && onCancel && (
          <button
            id="studio-cancel-button"
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/70 transition-colors cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        )}
      </div>

      {!canGenerate && !isGenerating && disabledReason && (
        <p className="text-xs text-slate-500 text-center sm:text-left">
          {disabledReason}
        </p>
      )}

      {/* Provider Status Note */}
      <p className="text-[11px] text-slate-600 text-center sm:text-left">
        {providerNote || '✦ Real-time visual creation studio.'}
      </p>
    </div>
  );
};
