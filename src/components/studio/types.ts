export type CreationMode = 'ai-photo' | 'ai-image' | 'ai-video' | 'fun';

export type CreationStyle = 
  | 'Realistic' 
  | 'Cinematic' 
  | 'Anime' 
  | '3D' 
  | 'Artistic' 
  | 'Fantasy';

export interface StudioCreationResult {
  id: string;
  imageUrl: string;
  mode: CreationMode;
  style: CreationStyle;
  prompt: string;
  originalImage?: string | null;
  createdAt: number;
  isVideo?: boolean;
}

export interface ProviderConfig {
  hasApiKey: boolean;
  provider: string;
  aiConnected: boolean;
}

export interface SampleImage {
  id: string;
  name: string;
  label: string;
  url: string;
}
