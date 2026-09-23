import React from 'react';
import { Sparkles, Wand2, X } from 'lucide-react';

interface PromptInputProps {
  prompt: string;
  onChangePrompt: (prompt: string) => void;
}

const EXAMPLE_PROMPTS = [
  'Turn my photo into a cinematic portrait',
  'Create a fantasy background',
  'Make this photo look artistic',
  'Turn this image into a cartoon',
];

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onChangePrompt,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor="studio-prompt-textarea"
          className="block text-xs font-bold uppercase tracking-wider text-slate-600"
        >
          3. What do you want to create?
        </label>
        {prompt && (
          <button
            type="button"
            onClick={() => onChangePrompt('')}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          id="studio-prompt-textarea"
          rows={3}
          value={prompt}
          onChange={(e) => onChangePrompt(e.target.value)}
          placeholder="Describe your idea… (e.g. Studio portrait with soft cinematic lighting, glowing rim light, and natural textures)"
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 placeholder:text-slate-400 resize-none transition-all shadow-sm bg-white"
        />
      </div>

      {/* Clickable example prompts */}
      <div className="mt-2.5">
        <span className="text-xs font-medium text-slate-500 mr-2 inline-flex items-center gap-1">
          <Wand2 className="w-3.5 h-3.5 text-indigo-500" />
          Quick ideas:
        </span>
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          {EXAMPLE_PROMPTS.map((example, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChangePrompt(example)}
              className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-colors cursor-pointer border border-slate-200/60 text-left break-words max-w-full"
            >
              “{example}”
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
