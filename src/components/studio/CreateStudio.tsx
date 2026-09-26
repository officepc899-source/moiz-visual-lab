import React, { useState, useEffect, useRef } from 'react';
import { Layers, ArrowLeft } from 'lucide-react';
import { CreationMode, CreationStyle, StudioCreationResult, ProviderConfig } from './types';
import { CreationModeSelector } from './CreationModeSelector';
import { UploadDropzone } from './UploadDropzone';
import { PromptInput } from './PromptInput';
import { StyleSelector } from './StyleSelector';
import { GenerateButton } from './GenerateButton';
import { ResultPreview } from './ResultPreview';
import { RecentCreations } from './RecentCreations';
import { RoutePath } from '../../types';

interface CreateStudioProps {
  initialMode?: CreationMode;
  initialPrompt?: string;
  onNavigate?: (route: RoutePath) => void;
}

// Convert image url (blob or remote) to base64
async function urlToBase64(url: string): Promise<{ data: string; mimeType: string }> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const matches = result.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        resolve({ mimeType: matches[1], data: matches[2] });
      } else {
        resolve({ mimeType: blob.type || 'image/jpeg', data: result });
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const LOCAL_STORAGE_KEY = 'moiz_visual_lab_recent_creations';

export const CreateStudio: React.FC<CreateStudioProps> = ({
  initialMode = 'ai-image',
  initialPrompt = '',
  onNavigate,
}) => {
  const [selectedMode, setSelectedMode] = useState<CreationMode>(initialMode);
  const [selectedStyle, setSelectedStyle] = useState<CreationStyle>('Cinematic');
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationErrorCode, setGenerationErrorCode] = useState<string | null>(null);
  const [providerConfig, setProviderConfig] = useState<ProviderConfig | null>(null);
  const [currentResult, setCurrentResult] = useState<StudioCreationResult | null>(null);
  const [recentCreations, setRecentCreations] = useState<StudioCreationResult[]>(() => {
    try {
      ['aitoolnest', 'ai_tool_nest', 'aitoolnest_recent_creations'].forEach((k) => localStorage.removeItem(k));
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Strictly filter out legacy corrupted items where imageUrl was reused from uploaded source or old branding
          return parsed.filter(
            (c) =>
              c &&
              c.imageUrl &&
              c.imageUrl !== c.originalImage &&
              !c.imageUrl.includes('aitool') &&
              !c.imageUrl.includes('nest')
          ).slice(0, 8);
        }
      }
    } catch {
      // ignore localStorage errors
    }
    return [];
  });

  // Query server for provider config status
  useEffect(() => {
    fetch('/api/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((cfg) => {
        if (cfg) setProviderConfig(cfg);
      })
      .catch(() => {
        // Offline / static hosting fallback
        setProviderConfig({ hasApiKey: false, provider: 'none', aiConnected: false });
      });
  }, []);

  // Sync mode if initialMode prop updates
  useEffect(() => {
    setSelectedMode(initialMode);
  }, [initialMode]);

  // Sync prompt if initialPrompt prop updates
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const resultAnchorRef = useRef<HTMLDivElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  const cleanupBlobUrl = () => {
    if (blobUrlRef.current && blobUrlRef.current.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(blobUrlRef.current);
      } catch {
        // ignore
      }
      blobUrlRef.current = null;
    }
  };

  // Sync recent creations to localStorage safely
  useEffect(() => {
    try {
      const persistent = recentCreations
        .filter((c) => !c.imageUrl.startsWith('blob:'))
        .map((c) => ({
          ...c,
          originalImage: c.originalImage && c.originalImage.startsWith('blob:') ? undefined : c.originalImage,
        }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(persistent.slice(0, 8)));
    } catch {
      // ignore localStorage errors
    }
  }, [recentCreations]);

  // Cleanup object URLs and active abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      cleanupBlobUrl();
    };
  }, []);

  const handleImageSelected = (url: string, fileName?: string) => {
    cleanupBlobUrl();
    if (url.startsWith('blob:')) {
      blobUrlRef.current = url;
    }
    setUploadedImage(url);
    setUploadedFileName(fileName || 'custom-upload.jpg');
    if (generationError) {
      setGenerationError(null);
      setGenerationErrorCode(null);
    }
  };

  const handleImageRemoved = () => {
    cleanupBlobUrl();
    setUploadedImage(null);
    setUploadedFileName(null);
  };

  // Determine whether Generate button should be active
  const canGenerate = selectedMode === 'ai-photo'
    ? Boolean(uploadedImage)
    : selectedMode === 'ai-image'
    ? Boolean(prompt.trim())
    : Boolean(uploadedImage || prompt.trim());

  const disabledReason = !canGenerate
    ? selectedMode === 'ai-photo'
      ? prompt.trim()
        ? 'Upload a photo to transform, or switch to AI Image mode to generate from your prompt alone.'
        : 'Upload a photo to use AI Photo transformation.'
      : selectedMode === 'ai-image'
      ? 'Enter a description or idea to generate an AI Image.'
      : 'Upload a photo or write an idea to enable generation.'
    : undefined;

  const handleGenerate = async () => {
    if (!canGenerate || isGenerating) return;

    // Reset error state
    setGenerationError(null);
    setGenerationErrorCode(null);

    // Scroll to result on mobile so user sees progress immediately
    if (window.innerWidth < 768) {
      setTimeout(() => {
        resultAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsGenerating(true);

    // 60-second client-side timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 60000);

    try {
      let imagePayload: { data?: string; mimeType?: string; url?: string } | undefined = undefined;

      if (selectedMode === 'ai-photo' && uploadedImage) {
        if (uploadedImage.startsWith('blob:') || uploadedImage.startsWith('data:')) {
          try {
            const { data, mimeType } = await urlToBase64(uploadedImage);
            imagePayload = { data, mimeType };
          } catch {
            throw new Error('Failed to process uploaded photo. Please try re-uploading.');
          }
        } else {
          imagePayload = { url: uploadedImage };
        }
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: selectedMode,
          prompt: prompt.trim(),
          style: selectedStyle,
          image: imagePayload,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        const isNotConnected =
          response.status === 503 ||
          response.status === 404 ||
          data?.code === 'AI_NOT_CONNECTED' ||
          data?.code === 'NO_API_KEY';
        const isQuota =
          response.status === 429 ||
          data?.code === 'QUOTA_EXCEEDED';

        setGenerationError(
          isNotConnected
            ? 'AI generation is not connected yet. Please configure an AI image provider.'
            : isQuota
            ? 'AI generation quota exceeded. A billing-enabled Gemini API key is required for image generation.'
            : data?.error || 'Generation failed. Please try again.'
        );
        setGenerationErrorCode(
          isNotConnected
            ? 'AI_NOT_CONNECTED'
            : isQuota
            ? 'QUOTA_EXCEEDED'
            : data?.code || 'API_ERROR'
        );
        setIsGenerating(false);
        return;
      }

      // CRITICAL SECURITY & LOGIC CHECK: Ensure the backend returned a new image,
      // and NEVER accept an echo of the original uploaded image as the generated result.
      if (!data.imageUrl || data.imageUrl === uploadedImage) {
        setGenerationError('The backend did not produce a newly generated visual. Please try again with a descriptive prompt.');
        setGenerationErrorCode('GENERATION_FAILED');
        setIsGenerating(false);
        return;
      }

      const newCreation: StudioCreationResult = {
        id: `creation-${Date.now()}`,
        imageUrl: data.imageUrl,
        mode: selectedMode,
        style: selectedStyle,
        prompt: prompt.trim() || `${selectedStyle} style transformation with studio lighting and balanced depth`,
        originalImage: uploadedImage,
        createdAt: Date.now(),
        isVideo: selectedMode === 'ai-video',
      };

      setCurrentResult(newCreation);
      setRecentCreations((prev) => [newCreation, ...prev.filter((c) => c.id !== newCreation.id)].slice(0, 8));
      setIsGenerating(false);

      // Scroll to result container
      setTimeout(() => {
        resultAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if ((err as Error)?.name === 'AbortError') {
        setGenerationError('Generation was cancelled.');
        setGenerationErrorCode('CANCELLED');
      } else {
        setGenerationError('AI generation is not connected yet. Please configure an AI image provider.');
        setGenerationErrorCode('AI_NOT_CONNECTED');
      }
      setIsGenerating(false);
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancelGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    setGenerationError('Generation was cancelled.');
    setGenerationErrorCode('CANCELLED');
  };

  const handleDismissError = () => {
    setGenerationError(null);
    setGenerationErrorCode(null);
  };

  const handleCreateAgain = () => {
    handleGenerate();
  };

  const handleTryAnotherStyle = () => {
    const allStyles: CreationStyle[] = ['Realistic', 'Cinematic', 'Anime', '3D', 'Artistic', 'Fantasy'];
    const nextIndex = (allStyles.indexOf(selectedStyle) + 1) % allStyles.length;
    setSelectedStyle(allStyles[nextIndex]);
    document.getElementById(`style-chip-${allStyles[nextIndex].toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleSelectRecent = (creation: StudioCreationResult) => {
    setCurrentResult(creation);
    setSelectedMode(creation.mode);
    setSelectedStyle(creation.style);
    if (creation.prompt) setPrompt(creation.prompt);
    if (creation.originalImage) {
      setUploadedImage(creation.originalImage);
      setUploadedFileName('recent-original.jpg');
    }
    resultAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleClearHistory = () => {
    setRecentCreations([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const providerNote = providerConfig?.aiConnected
    ? '✦ Connected to live AI generation backend.'
    : '✦ AI generation is not connected yet. A configured backend with quota is required.';

  return (
    <div className="py-8 sm:py-12 bg-white min-h-[85vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        {onNavigate && (
          <div className="mb-6">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>
          </div>
        )}

        {/* 2. Page Heading */}
        <div className="text-left border-b border-slate-100 pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Create Studio</span>
            </div>
            {providerConfig?.aiConnected ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live AI Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                AI Not Connected
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Create Something Amazing
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600 max-w-2xl">
            Upload a photo or describe your idea and choose what you want to create.
          </p>
        </div>

        {/* Studio Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN / CONTROLS (Desktop: 7 cols, Mobile: full width) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* 3. Creation Mode Selector */}
            <CreationModeSelector
              selectedMode={selectedMode}
              onSelectMode={(mode) => {
                setSelectedMode(mode);
                if (generationError) handleDismissError();
              }}
            />

            {/* 4. Upload Area */}
            <UploadDropzone
              uploadedImage={uploadedImage}
              uploadedFileName={uploadedFileName}
              onImageSelected={handleImageSelected}
              onImageRemoved={handleImageRemoved}
              isOptional={selectedMode === 'ai-image'}
            />

            {/* 5. Prompt Area */}
            <PromptInput
              prompt={prompt}
              onChangePrompt={(text) => {
                setPrompt(text);
                if (generationError) handleDismissError();
              }}
            />

            {/* 6. Style Selector */}
            <StyleSelector
              selectedStyle={selectedStyle}
              onSelectStyle={(style) => setSelectedStyle(style)}
            />

            {/* 7. Generate Button */}
            <GenerateButton
              canGenerate={canGenerate}
              isGenerating={isGenerating}
              aiConnected={providerConfig?.aiConnected ?? false}
              onGenerate={handleGenerate}
              onCancel={handleCancelGenerating}
              disabledReason={disabledReason}
              providerNote={providerNote}
            />
          </div>

          {/* RIGHT COLUMN / RESULT AREA (Desktop: 5 cols, Mobile: immediately below controls) */}
          <div 
            ref={resultAnchorRef}
            className="lg:col-span-5 lg:sticky lg:top-24 space-y-6"
          >
            {/* 8. Result Area */}
            <ResultPreview
              result={currentResult}
              isGenerating={isGenerating}
              error={generationError}
              errorCode={generationErrorCode}
              onRetry={handleGenerate}
              onDismissError={handleDismissError}
              onCancelGenerating={handleCancelGenerating}
              onCreateAgain={handleCreateAgain}
              onTryAnotherStyle={handleTryAnotherStyle}
              onChangeStyle={(st) => setSelectedStyle(st)}
            />
          </div>
        </div>

        {/* 9. Recent Creations Gallery */}
        <div className="mt-12 sm:mt-16">
          <RecentCreations
            creations={recentCreations}
            onSelectCreation={handleSelectRecent}
            onClearHistory={handleClearHistory}
          />
        </div>
      </div>
    </div>
  );
};
