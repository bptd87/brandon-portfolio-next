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
  
  // Download original image
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  
  const buffer = Buffer.from(await response.arrayBuffer());
  
  // Resize image with 90% quality (higher than before)
  const resized = await sharp(buffer)
    .resize(width, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
    .webp({ quality: 90 }) // Increased from 80% to 90%
    .toBuffer();
  
  // Cache result
  imageCache.set(cacheKey, {
    buffer: resized,
    contentType: 'image/webp',
    timestamp: Date.now(),
  });
  
  return { buffer: resized, contentType: 'image/webp' };
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
    const allowedDomains = ['manuscdn.com', 'cloudfront.net'];
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
