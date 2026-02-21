import { Router, Request, Response } from 'express';
import sharp from 'sharp';
import fetch from 'node-fetch';
import { createHash } from 'crypto';

const router = Router();

// In-memory cache for resized images (production should use Redis)
const imageCache = new Map<string, { buffer: Buffer; contentType: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Clean up old cache entries periodically
setInterval(() => {
  const now = Date.now();
  imageCache.forEach((value, key) => {
    if (now - value.timestamp > CACHE_TTL) {
      imageCache.delete(key);
    }
  });
}, 60 * 60 * 1000); // Clean every hour

async function resizeImage(sourceUrl: string, width: number): Promise<{ buffer: Buffer; contentType: string }> {
  // Generate cache key
  const cacheKey = createHash('md5').update(`${sourceUrl}-${width}`).digest('hex');

  // Check cache
  const cached = imageCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { buffer: cached.buffer, contentType: cached.contentType };
  }

  // Download original image with proper headers to avoid CloudFront blocking
  const response = await fetch(sourceUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://www.brandonptdavis.com/',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  // Detect if image is PNG (lossless) or JPEG/WebP (lossy)
  const isPNG = sourceUrl.toLowerCase().endsWith('.png') || sourceUrl.toLowerCase().includes('.png?');

  let resized: Buffer;
  let contentType: string;

  if (isPNG) {
    // Preserve PNG format for lossless quality
    resized = await sharp(buffer)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .png({ compressionLevel: 9 }) // Maximum compression, still lossless
      .toBuffer();
    contentType = 'image/png';
  } else {
    // Convert JPEG/WebP to WebP at 90% quality
    resized = await sharp(buffer)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: 85 })
      .toBuffer();
    contentType = 'image/webp';
  }

  // Cache result
  imageCache.set(cacheKey, {
    buffer: resized,
    contentType,
    timestamp: Date.now(),
  });

  return { buffer: resized, contentType };
}

// Image proxy endpoint: /api/img?url=<source>&w=<width>
router.get('/img', async (req: Request, res: Response) => {
  try {
    const { url, w } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).send('Missing or invalid url parameter');
    }

    const width = w ? parseInt(w as string, 10) : 1920;

    if (isNaN(width) || width < 100 || width > 4000) {
      return res.status(400).send('Invalid width parameter (must be 100-4000)');
    }

    // Only allow resizing from our own CDN domains for security
    const allowedDomains = ['cloudfront.net', 's3.amazonaws.com', 's3.us-west-1.amazonaws.com', 'manuscdn.com'];
    const urlObj = new URL(url);
    if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
      return res.status(403).send('URL domain not allowed');
    }

    const { buffer, contentType } = await resizeImage(url, width);

    // Set aggressive caching headers
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
      'Content-Length': buffer.length.toString(),
    });

    res.send(buffer);
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).send('Failed to process image');
  }
});

export default router;
