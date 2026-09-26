import React, { useRef, useState } from 'react';
import { UploadCloud, X, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { SampleImage } from './types';

interface UploadDropzoneProps {
  uploadedImage: string | null;
  uploadedFileName?: string | null;
  onImageSelected: (url: string, fileName?: string) => void;
  onImageRemoved: () => void;
  isOptional?: boolean;
}

const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'sample-portrait',
    name: 'Portrait',
    label: 'Studio Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-architecture',
    name: 'Architecture',
    label: 'Modern Minimal',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-nature',
    name: 'Nature',
    label: 'Vibrant Landscape',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  },
];

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  uploadedImage,
  uploadedFileName,
  onImageSelected,
  onImageRemoved,
  isOptional = false,
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setUploadError(null);
    // Validate image format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpe?g|png|webp)$/i)) {
      setUploadError('Please upload a valid JPG, PNG, or WEBP image file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Check size limit (25MB)
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('Image size exceeds 25MB. Please choose a smaller image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    onImageSelected(objectUrl, file.name);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleRemove = () => {
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemoved();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
          2. Photo Upload {isOptional ? <span className="font-normal text-slate-400 lowercase">(optional for text-only)</span> : null}
        </label>
        {uploadedImage && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove photo</span>
          </button>
        )}
      </div>

      {uploadedImage ? (
        /* Image Preview Box */
        <div className="relative rounded-2xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 shadow-sm">
              <img
                src={uploadedImage}
                alt="Selected reference"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Source reference photo loaded</span>
              </div>
              <p className="text-xs text-slate-700 truncate font-medium mt-0.5">
                {uploadedFileName || 'Selected photo reference'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Used as source reference for transformation
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
              aria-label="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Dropzone Box */
        <div
          id="studio-upload-dropzone"
          role="button"
          tabIndex={0}
          aria-label="Upload photo dropzone"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
            isDraggingOver
              ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/30'
              : 'border-slate-200/90 hover:border-indigo-400 bg-slate-50/40 hover:bg-slate-50/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
            id="studio-file-input"
          />

          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-sm border border-indigo-100/60">
            <UploadCloud className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <p className="text-base sm:text-lg font-bold text-slate-900">
            Drop your photo here
          </p>
          <p className="text-xs sm:text-sm text-indigo-600 font-semibold mt-0.5">
            or click to upload
          </p>
          <p className="text-xs text-slate-500 mt-2 font-normal">
            Supported: JPG, PNG, WEBP (up to 25MB)
          </p>
        </div>
      )}

      {/* Inline Upload Validation Error */}
      {uploadError && (
        <div 
          role="alert" 
          className="mt-2.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between"
        >
          <span>{uploadError}</span>
          <button 
            type="button" 
            onClick={() => setUploadError(null)}
            className="text-rose-500 hover:text-rose-700 p-0.5 cursor-pointer"
            aria-label="Dismiss error"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* "Try a sample" with 3 sample image options */}
      <div className="mt-3 flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Try a sample:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => {
                setUploadError(null);
                onImageSelected(sample.url, `${sample.label}.jpg`);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-medium border border-slate-200/70 transition-colors cursor-pointer"
            >
              <img
                src={sample.url}
                alt={sample.label}
                className="w-4 h-4 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span>{sample.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
