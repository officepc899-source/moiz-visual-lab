import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

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

// Lazy Gemini AI Client Initialization (avoids crashing if key is absent)
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Preset visual visuals for mock fallback when requested
const MOCK_VISUALS: Record<string, string> = {
  'ai-photo-Realistic': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
  'ai-photo-Cinematic': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85',
  'ai-photo-Anime': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=85',
  'ai-photo-3D': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
  'ai-photo-Artistic': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
  'ai-photo-Fantasy': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',

  'ai-image-Realistic': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
  'ai-image-Cinematic': 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=85',
  'ai-image-Anime': 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=85',
  'ai-image-3D': 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=85',
  'ai-image-Artistic': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
  'ai-image-Fantasy': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',

  'ai-video-Realistic': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
  'ai-video-Cinematic': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85',
  'ai-video-Anime': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85',
  'ai-video-3D': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
  'ai-video-Artistic': 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=85',
  'ai-video-Fantasy': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',

  'fun-Realistic': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=85',
  'fun-Cinematic': 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=85',
  'fun-Anime': 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=85',
  'fun-3D': 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=85',
  'fun-Artistic': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
  'fun-Fantasy': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
};

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
app.get('/api/config', (_req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
  res.json({
    hasApiKey: hasKey,
    provider: 'Google Gemini AI',
    model: 'gemini-3.1-flash-lite-image',
    modes: {
      'ai-image': { live: hasKey, description: 'Text to image generation' },
      'ai-photo': { live: hasKey, description: 'Photo transformation & editing' },
      'ai-video': { live: false, description: 'Prototype mode' },
      'fun': { live: false, description: 'Prototype mode' },
    },
    mockModeAvailable: true,
  });
});

// Generation Endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { mode, prompt, style = 'Realistic', image, allowMockFallback = false } = req.body;

    // Validate mode
    const allowedModes = ['ai-image', 'ai-photo', 'ai-video', 'fun'];
    if (!mode || !allowedModes.includes(mode)) {
      return res.status(400).json({
        success: false,
        error: `Invalid creation mode. Must be one of: ${allowedModes.join(', ')}`,
      });
    }

    // AI Video and Fun are in prototype mode for now
    if (mode === 'ai-video' || mode === 'fun') {
      const fallbackUrl = MOCK_VISUALS[`${mode}-${style}`] || MOCK_VISUALS['ai-image-Realistic'];
      return res.json({
        success: true,
        isMock: true,
        imageUrl: fallbackUrl,
        mode,
        style,
        message: `${mode === 'ai-video' ? 'AI Video' : 'Fun'} is currently in prototype mode.`,
      });
    }

    // Check Gemini API Key
    const ai = getGenAI();
    if (!ai) {
      if (allowMockFallback) {
        const fallbackUrl = MOCK_VISUALS[`${mode}-${style}`] || MOCK_VISUALS['ai-image-Realistic'];
        return res.json({
          success: true,
          isMock: true,
          imageUrl: fallbackUrl,
          mode,
          style,
          message: 'Real AI generation is not configured. GEMINI_API_KEY is missing. Using prototype preview.',
        });
      }

      return res.status(503).json({
        success: false,
        code: 'NO_API_KEY',
        error: 'Gemini API key is not configured on the server. Please set GEMINI_API_KEY in the environment secrets to enable real generation.',
        canMock: true,
      });
    }

    // Input Validation
    const cleanPrompt = typeof prompt === 'string' ? prompt.trim() : '';
    if (mode === 'ai-image' && !cleanPrompt) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a text prompt describing the image you want to generate.',
      });
    }

    if (cleanPrompt.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Prompt length exceeds the 2,000 character maximum limit.',
      });
    }

    // Style prompt enhancer
    const styleDescriptions: Record<string, string> = {
      Realistic: 'photorealistic, ultra detailed, natural lighting, 8k resolution, authentic textures',
      Cinematic: 'cinematic lighting, dramatic atmosphere, anamorphic lens, film still aesthetic, 35mm photography',
      Anime: 'high quality modern anime aesthetic, vibrant expressive colors, detailed cel shading, Makoto Shinkai style',
      '3D': 'modern 3D digital render, Pixar / Octane render aesthetic, smooth materials, volumetric lighting',
      Artistic: 'fine art painting style, expressive brushstrokes, rich canvas texture, creative color palette',
      Fantasy: 'ethereal fantasy style, magical glowing accents, enchanted mystical environment, mythical wonder',
    };
    const styleEnrichment = styleDescriptions[style] || styleDescriptions.Realistic;

    // ---------------------------------------------------------
    // 1. AI Image: Text to Image
    // ---------------------------------------------------------
    if (mode === 'ai-image') {
      const fullPrompt = `${cleanPrompt}. Style: ${style} aesthetic, ${styleEnrichment}. High quality, visually stunning, clean composition.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          const imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          return res.json({
            success: true,
            isMock: false,
            imageUrl,
            mode,
            style,
          });
        }
      }

      // Check if text was returned explaining rejection
      const textPart = parts.find((p) => !!p.text);
      return res.status(502).json({
        success: false,
        code: 'GENERATION_FAILED',
        error: textPart?.text || 'The AI model could not generate an image for this prompt. Please try adjusting your prompt.',
      });
    }

    // ---------------------------------------------------------
    // 2. AI Photo: Image to Image / Photo transformation
    // ---------------------------------------------------------
    if (mode === 'ai-photo') {
      if (!image || (!image.data && !image.url)) {
        return res.status(400).json({
          success: false,
          error: 'An uploaded photo is required for AI Photo transformation.',
        });
      }

      // Server-side image validation
      let base64Data = image.data || '';
      let claimedMime = image.mimeType || 'image/jpeg';

      if (!base64Data && image.url) {
        try {
          const fetchRes = await fetch(image.url);
          if (!fetchRes.ok) {
            return res.status(400).json({
              success: false,
              error: 'Failed to retrieve selected image from source URL.',
            });
          }
          const arrayBuffer = await fetchRes.arrayBuffer();
          const fetchedBuffer = Buffer.from(arrayBuffer);
          base64Data = fetchedBuffer.toString('base64');
          claimedMime = fetchRes.headers.get('content-type') || 'image/jpeg';
        } catch {
          return res.status(400).json({
            success: false,
            error: 'Could not fetch sample image for transformation.',
          });
        }
      }

      // Strip data URI prefix if present
      if (base64Data.startsWith('data:')) {
        const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          claimedMime = matches[1];
          base64Data = matches[2];
        } else {
          const commaIdx = base64Data.indexOf(',');
          if (commaIdx !== -1) {
            base64Data = base64Data.substring(commaIdx + 1);
          }
        }
      }

      // Decode buffer for server-side verification
      let buffer: Buffer;
      try {
        buffer = Buffer.from(base64Data, 'base64');
      } catch {
        return res.status(400).json({
          success: false,
          error: 'Invalid image data payload. Could not decode base64.',
        });
      }

      // Validate size (max 25MB)
      if (buffer.length > 25 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          error: 'Uploaded image file exceeds the 25MB maximum size limit.',
        });
      }

      // Validate magic bytes
      const { valid, detectedMime } = validateImageMagicBytes(buffer);
      if (!valid || !detectedMime) {
        return res.status(400).json({
          success: false,
          error: 'Unsupported image file type. Please upload a valid JPG, PNG, or WEBP image file.',
        });
      }

      // Build photo transformation prompt
      const userInstruction = cleanPrompt || 'Transform this photo';
      const fullPrompt = `${userInstruction}. Apply a ${style} aesthetic (${styleEnrichment}). Preserve the essential character and composition of the subject while rendering it in high-resolution visual quality.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: detectedMime,
              },
            },
            {
              text: fullPrompt,
            },
          ],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          const imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          return res.json({
            success: true,
            isMock: false,
            imageUrl,
            mode,
            style,
          });
        }
      }

      const textPart = parts.find((p) => !!p.text);
      return res.status(502).json({
        success: false,
        code: 'TRANSFORMATION_FAILED',
        error: textPart?.text || 'The AI model could not transform this image. Please try a different photo or prompt.',
      });
    }

    return res.status(400).json({ success: false, error: 'Unhandled mode.' });
  } catch (err: unknown) {
    // If user explicitly requested mock fallback preview after error
    if (req.body?.allowMockFallback) {
      const fallbackUrl = MOCK_VISUALS[`${req.body.mode}-${req.body.style}`] || MOCK_VISUALS['ai-image-Realistic'];
      return res.json({
        success: true,
        isMock: true,
        imageUrl: fallbackUrl,
        mode: req.body.mode,
        style: req.body.style,
        message: 'Previewing in prototype mode.',
      });
    }

    // Sanitize error: never leak API keys or secrets
    const rawError = err instanceof Error ? err.message : String(err);
    const sanitizedError = rawError.replace(/key=[a-zA-Z0-9_\-]+/gi, 'key=***');

    // Detect rate limit / quota
    if (sanitizedError.includes('429') || sanitizedError.includes('RESOURCE_EXHAUSTED') || sanitizedError.includes('quota')) {
      return res.status(429).json({
        success: false,
        code: 'QUOTA_EXCEEDED',
        error: 'AI generation quota exceeded. A billing-enabled Gemini API key is required for image generation.',
        canMock: true,
      });
    }

    // Detect safety block
    if (sanitizedError.includes('SAFETY') || sanitizedError.includes('blocked')) {
      return res.status(400).json({
        success: false,
        code: 'SAFETY_BLOCKED',
        error: 'The prompt or image could not be processed due to safety policies. Please adjust your input.',
        canMock: true,
      });
    }

    return res.status(500).json({
      success: false,
      code: 'API_ERROR',
      error: sanitizedError || 'An unexpected error occurred during image generation.',
      canMock: true,
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
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
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
