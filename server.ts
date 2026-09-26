import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
// AI Studio development server must listen on port 3000
const PORT = process.env.NODE_ENV === 'production' && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Production security headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Body parsing with safe size limit for base64 uploads (max 30MB)
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Helper: validate buffer magic bytes
function validateImageMagicBytes(buffer: Buffer): { valid: boolean; detectedMime: string | null } {
  if (buffer.length < 12) return { valid: false, detectedMime: null };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedMime: 'image/jpeg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, detectedMime: 'image/png' };
  }

  // WEBP: RIFF .... WEBP
  const isRiff = buffer.toString('ascii', 0, 4) === 'RIFF';
  const isWebp = buffer.toString('ascii', 8, 12) === 'WEBP';
  if (isRiff && isWebp) {
    return { valid: true, detectedMime: 'image/webp' };
  }

  return { valid: false, detectedMime: null };
}

// -------------------------------------------------------------
// AI Provider Abstraction Interface
// -------------------------------------------------------------
export interface GenerationRequest {
  prompt: string;
  mode: 'ai-image' | 'ai-photo' | 'ai-video' | 'fun';
  style: string;
  image?: {
    data?: string;
    mimeType?: string;
    url?: string;
  };
}

export interface GenerationResult {
  imageUrl: string;
  metadata: {
    provider: string;
    model: string;
    mode: string;
    style: string;
    prompt: string;
    timestamp: number;
  };
}

export interface AIProvider {
  readonly id: string;
  readonly name: string;
  isConfigured(): boolean;
  checkHealth(): Promise<{ connected: boolean; message: string }>;
  generate(req: GenerationRequest): Promise<GenerationResult>;
}

// -------------------------------------------------------------
// Gemini Provider Implementation
// -------------------------------------------------------------
class GeminiAIProvider implements AIProvider {
  readonly id = 'gemini';
  readonly name = 'Google Gemini AI';
  private client: GoogleGenAI | null = null;
  private quotaChecked = false;
  private quotaAvailable = false;
  private quotaMessage = '';

  isConfigured(): boolean {
    const key = process.env.GEMINI_API_KEY;
    return Boolean(key && key.trim() !== '' && key !== 'MY_GEMINI_API_KEY');
  }

  private getClient(): GoogleGenAI | null {
    if (!this.isConfigured()) return null;
    if (!this.client) {
      this.client = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY!.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return this.client;
  }

  async checkHealth(): Promise<{ connected: boolean; message: string }> {
    if (this.quotaChecked) {
      return { connected: this.quotaAvailable, message: this.quotaMessage };
    }

    const client = this.getClient();
    if (!client) {
      this.quotaChecked = true;
      this.quotaAvailable = false;
      this.quotaMessage = 'AI generation is not connected yet. Please configure an AI image provider.';
      return { connected: false, message: this.quotaMessage };
    }

    try {
      const res = await client.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: { parts: [{ text: 'probe' }] },
        config: { imageConfig: { aspectRatio: '1:1' } },
      });
      const parts = res.candidates?.[0]?.content?.parts || [];
      const hasImg = parts.some((p) => Boolean(p.inlineData?.data));
      this.quotaChecked = true;
      this.quotaAvailable = hasImg;
      this.quotaMessage = hasImg
        ? 'Live Gemini image generation connected and ready.'
        : 'Model did not return image synthesis data.';
      return { connected: this.quotaAvailable, message: this.quotaMessage };
    } catch (err: unknown) {
      this.quotaChecked = true;
      this.quotaAvailable = false;
      const raw = err instanceof Error ? err.message : String(err);
      if (raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED') || raw.includes('quota')) {
        this.quotaMessage = 'Free-tier Gemini key has zero quota for image models. A billing-enabled API key is required.';
      } else {
        this.quotaMessage = 'AI provider error during connection test.';
      }
      return { connected: false, message: this.quotaMessage };
    }
  }

  async generate(req: GenerationRequest): Promise<GenerationResult> {
    const client = this.getClient();
    if (!client) {
      const err = new Error('AI generation is not connected yet. Please configure an AI image provider.');
      (err as any).code = 'AI_NOT_CONNECTED';
      throw err;
    }

    if (req.mode === 'ai-video') {
      const err = new Error('AI Video motion synthesis is not supported by the current image provider. A dedicated video provider is required.');
      (err as any).code = 'NOT_SUPPORTED';
      throw err;
    }

    const styleDescriptions: Record<string, string> = {
      Realistic: 'photorealistic, ultra detailed, natural lighting, 8k resolution, authentic textures',
      Cinematic: 'cinematic lighting, dramatic atmosphere, anamorphic lens, film still aesthetic, 35mm photography',
      Anime: 'high quality modern anime aesthetic, vibrant expressive colors, detailed cel shading, Makoto Shinkai style',
      '3D': 'modern 3D digital render, Pixar / Octane render aesthetic, smooth materials, volumetric lighting',
      Artistic: 'fine art painting style, expressive brushstrokes, rich canvas texture, creative color palette',
      Fantasy: 'ethereal fantasy style, magical glowing accents, enchanted mystical environment, mythical wonder',
    };
    const styleEnrichment = styleDescriptions[req.style] || styleDescriptions.Realistic;

    let imageBuffer: Buffer | null = null;
    let detectedMime = 'image/jpeg';

    if (req.image && (req.image.data || req.image.url)) {
      let base64Data = req.image.data || '';
      if (!base64Data && req.image.url) {
        const fetchRes = await fetch(req.image.url);
        if (!fetchRes.ok) {
          const err = new Error('Failed to retrieve selected image from source URL.');
          (err as any).code = 'INVALID_INPUT';
          throw err;
        }
        const ab = await fetchRes.arrayBuffer();
        base64Data = Buffer.from(ab).toString('base64');
      }

      if (base64Data.startsWith('data:')) {
        const commaIdx = base64Data.indexOf(',');
        if (commaIdx !== -1) {
          base64Data = base64Data.substring(commaIdx + 1);
        }
      }

      try {
        imageBuffer = Buffer.from(base64Data, 'base64');
      } catch {
        const err = new Error('Invalid image data payload. Could not decode base64.');
        (err as any).code = 'INVALID_INPUT';
        throw err;
      }

      if (imageBuffer.length > 25 * 1024 * 1024) {
        const err = new Error('Uploaded image file exceeds the 25MB maximum size limit.');
        (err as any).code = 'INVALID_INPUT';
        throw err;
      }

      const check = validateImageMagicBytes(imageBuffer);
      if (!check.valid || !check.detectedMime) {
        const err = new Error('Unsupported image file type. Please upload a valid JPG, PNG, or WEBP image file.');
        (err as any).code = 'INVALID_INPUT';
        throw err;
      }
      detectedMime = check.detectedMime;
    }

    if (req.mode === 'ai-photo' && !imageBuffer) {
      const err = new Error('An uploaded photo is required for AI Photo transformation.');
      (err as any).code = 'INVALID_INPUT';
      throw err;
    }

    const userPrompt = req.prompt.trim();
    let fullPrompt = '';
    if (req.mode === 'ai-photo') {
      const instruction = userPrompt || 'Transform this photo';
      fullPrompt = `${instruction}. Apply a ${req.style} aesthetic (${styleEnrichment}). Preserve the essential character and composition of the subject while rendering it in high-resolution visual quality.`;
    } else if (req.mode === 'fun') {
      const instruction = userPrompt || 'Create a playful, stylized character avatar';
      fullPrompt = `${instruction}. Style: ${req.style} creative rendering, ${styleEnrichment}. Vibrant, high quality, expressive character design.`;
    } else {
      fullPrompt = `${userPrompt}. Style: ${req.style} aesthetic, ${styleEnrichment}. High quality, visually stunning, clean composition.`;
    }

    const parts: any[] = [];
    if (imageBuffer) {
      parts.push({
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: detectedMime,
        },
      });
    }
    parts.push({ text: fullPrompt });

    try {
      const response = await client.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      const candParts = response.candidates?.[0]?.content?.parts || [];
      for (const part of candParts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          const imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          return {
            imageUrl,
            metadata: {
              provider: 'gemini',
              model: 'gemini-3.1-flash-lite-image',
              mode: req.mode,
              style: req.style,
              prompt: userPrompt,
              timestamp: Date.now(),
            },
          };
        }
      }

      const textPart = candParts.find((p) => Boolean(p.text));
      const err = new Error(textPart?.text || 'The AI model could not generate an image for this prompt. Please try adjusting your prompt.');
      (err as any).code = 'GENERATION_FAILED';
      throw err;
    } catch (apiErr: unknown) {
      const raw = apiErr instanceof Error ? apiErr.message : String(apiErr);
      const sanitized = raw.replace(/key=[a-zA-Z0-9_\-]+/gi, 'key=***');

      if (sanitized.includes('429') || sanitized.includes('RESOURCE_EXHAUSTED') || sanitized.includes('quota')) {
        const err = new Error('AI generation quota exceeded. A billing-enabled Gemini API key is required for image generation.');
        (err as any).code = 'QUOTA_EXCEEDED';
        throw err;
      }

      if (sanitized.includes('SAFETY') || sanitized.includes('blocked')) {
        const err = new Error('The prompt or image could not be processed due to safety policies. Please adjust your input.');
        (err as any).code = 'SAFETY_BLOCKED';
        throw err;
      }

      if ((apiErr as any)?.code) {
        throw apiErr;
      }

      const err = new Error(sanitized || 'An unexpected error occurred during image generation.');
      (err as any).code = 'API_ERROR';
      throw err;
    }
  }
}

// -------------------------------------------------------------
// Unconfigured Fallback Provider
// -------------------------------------------------------------
class UnconfiguredProvider implements AIProvider {
  readonly id: string;
  readonly name: string;

  constructor(id: string) {
    this.id = id;
    this.name = id ? id.toUpperCase() : 'None';
  }

  isConfigured(): boolean {
    return false;
  }

  async checkHealth(): Promise<{ connected: boolean; message: string }> {
    return {
      connected: false,
      message: 'AI generation is not connected yet. Please configure an AI image provider.',
    };
  }

  async generate(): Promise<GenerationResult> {
    const err = new Error('AI generation is not connected yet. Please configure an AI image provider.');
    (err as any).code = 'AI_NOT_CONNECTED';
    throw err;
  }
}

// Provider Factory based on AI_PROVIDER environment variable
function getActiveProvider(): AIProvider {
  const providerType = (process.env.AI_PROVIDER || 'gemini').toLowerCase().trim();
  if (providerType === 'gemini') {
    return new GeminiAIProvider();
  }
  return new UnconfiguredProvider(providerType);
}

// -------------------------------------------------------------
// SEO & Search Engine Endpoints (robots.txt & sitemap.xml)
// -------------------------------------------------------------
const PRODUCTION_APP_URL = 'https://ais-pre-t6y6n2fxa6gpzgpthscvni-58294370003.asia-east1.run.app';

function getBaseUrl(req: express.Request): string {
  // If explicitly configured canonical URL (free of dev or local patterns)
  if (process.env.CANONICAL_URL) {
    const rawCanonical = process.env.CANONICAL_URL.replace(/\/+$/, '');
    if (!rawCanonical.includes('-dev-') && !rawCanonical.includes('localhost') && !rawCanonical.includes('127.0.0.1')) {
      return rawCanonical;
    }
  }

  // If APP_URL is provided and not a development or local URL
  if (process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL') {
    const rawAppUrl = process.env.APP_URL.replace(/\/+$/, '');
    if (!rawAppUrl.includes('-dev-') && !rawAppUrl.includes('localhost') && !rawAppUrl.includes('127.0.0.1')) {
      return rawAppUrl;
    }
  }

  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = typeof forwardedProto === 'string' ? forwardedProto.split(',')[0].trim() : req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host') || '';

  // Never use localhost or development URLs for public sitemap or canonical locations
  if (!host || host.includes('localhost') || host.includes('127.0.0.1') || host.includes('-dev-')) {
    return PRODUCTION_APP_URL;
  }
  return `${protocol}://${host}`;
}

const PUBLIC_ROUTES: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/create', priority: '0.9', changefreq: 'weekly' },
  { path: '/ai-photo', priority: '0.9', changefreq: 'weekly' },
  { path: '/ai-image', priority: '0.9', changefreq: 'weekly' },
  { path: '/ai-video', priority: '0.8', changefreq: 'monthly' },
  { path: '/fun', priority: '0.8', changefreq: 'monthly' },
  { path: '/ideas', priority: '0.8', changefreq: 'weekly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms', priority: '0.5', changefreq: 'yearly' },
  { path: '/faq', priority: '0.8', changefreq: 'monthly' },
];

app.get('/robots.txt', (req, res) => {
  const baseUrl = getBaseUrl(req);
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = getBaseUrl(req);
  const today = new Date().toISOString().split('T')[0];
  const urlTags = PUBLIC_ROUTES.map(
    (r) => `  <url>
    <loc>${baseUrl}${r.path === '/' ? '/' : r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags}
</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Provider Config status (Never sends the actual key)
app.get('/api/config', async (_req, res) => {
  const provider = getActiveProvider();
  const configured = provider.isConfigured();
  if (!configured) {
    return res.json({
      hasApiKey: false,
      provider: provider.name,
      aiConnected: false,
      statusMessage: 'AI generation is not connected yet. Please configure an AI image provider.',
      model: 'none',
    });
  }

  const { connected, message } = await provider.checkHealth();
  res.json({
    hasApiKey: configured,
    provider: provider.name,
    aiConnected: connected,
    statusMessage: message,
    model: 'gemini-3.1-flash-lite-image',
  });
});

// Generation Endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { mode, prompt, style = 'Realistic', image } = req.body;

    // Validate mode
    const allowedModes = ['ai-image', 'ai-photo', 'ai-video', 'fun'];
    if (!mode || !allowedModes.includes(mode)) {
      return res.status(400).json({
        success: false,
        error: `Invalid creation mode. Must be one of: ${allowedModes.join(', ')}`,
      });
    }

    const provider = getActiveProvider();
    if (!provider.isConfigured()) {
      return res.status(503).json({
        success: false,
        code: 'AI_NOT_CONNECTED',
        error: 'AI generation is not connected yet. Please configure an AI image provider.',
      });
    }

    // Input Validation
    const cleanPrompt = typeof prompt === 'string' ? prompt.trim() : '';
    if ((mode === 'ai-image' || !image) && !cleanPrompt) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a text prompt describing what you want to create.',
      });
    }

    if (cleanPrompt.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Prompt length exceeds the 2,000 character maximum limit.',
      });
    }

    const result = await provider.generate({
      mode,
      prompt: cleanPrompt,
      style,
      image,
    });

    return res.json({
      success: true,
      imageUrl: result.imageUrl,
      metadata: result.metadata,
    });
  } catch (err: unknown) {
    const errorObj = err as { code?: string; message?: string };
    const code = errorObj.code || 'API_ERROR';
    const message = errorObj.message || 'Generation failed.';

    if (code === 'AI_NOT_CONNECTED') {
      return res.status(503).json({
        success: false,
        code: 'AI_NOT_CONNECTED',
        error: 'AI generation is not connected yet. Please configure an AI image provider.',
      });
    }

    if (code === 'QUOTA_EXCEEDED') {
      return res.status(429).json({
        success: false,
        code: 'QUOTA_EXCEEDED',
        error: 'AI generation quota exceeded. A billing-enabled Gemini API key is required for image generation.',
      });
    }

    if (code === 'NOT_SUPPORTED') {
      return res.status(501).json({
        success: false,
        code: 'NOT_SUPPORTED',
        error: message,
      });
    }

    if (code === 'INVALID_INPUT' || code === 'SAFETY_BLOCKED') {
      return res.status(400).json({
        success: false,
        code,
        error: message,
      });
    }

    return res.status(500).json({
      success: false,
      code: 'API_ERROR',
      error: message,
    });
  }
});

// Global production error handler (prevents leaking stack traces)
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    error: 'An unexpected internal server error occurred.',
  });
});

// -------------------------------------------------------------
// Server Start & Vite Middleware Integration
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Serve transformed index.html for all non-API GET requests in dev mode
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath, { maxAge: '1d', etag: true }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MOIZ VISUAL LAB server running on port ${PORT}`);
  });
}

startServer();
