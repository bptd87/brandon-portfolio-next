import sharp from 'sharp';

export interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export interface OptimizedImage {
  buffer: Buffer;
  format: string;
  width: number;
  height: number;
  size: number;
}

/**
 * Optimize an image by resizing, converting to WebP, and compressing
 * @param inputBuffer - Original image buffer
 * @param options - Optimization options
 * @returns Optimized image buffer and metadata
 */
export async function optimizeImage(
  inputBuffer: Buffer,
  options: OptimizeImageOptions = {}
): Promise<OptimizedImage> {
  const {
    maxWidth = 2000,
    maxHeight = 2000,
    quality = 80,
    format = 'webp',
  } = options;

  let pipeline = sharp(inputBuffer);

  // Get original metadata
  const metadata = await pipeline.metadata();

  // Resize if image is larger than max dimensions
  if (metadata.width && metadata.width > maxWidth || metadata.height && metadata.height > maxHeight) {
    pipeline = pipeline.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Convert to specified format with compression
  if (format === 'webp') {
    pipeline = pipeline.webp({ quality });
  } else if (format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality });
  } else if (format === 'png') {
    pipeline = pipeline.png({ quality });
  }

  // Execute pipeline
  const buffer = await pipeline.toBuffer();
  const info = await sharp(buffer).metadata();

  return {
    buffer,
    format: info.format || format,
    width: info.width || 0,
    height: info.height || 0,
    size: buffer.length,
  };
}

/**
 * Generate multiple sizes of an image (thumbnail, medium, full)
 * @param inputBuffer - Original image buffer
 * @returns Object with different sized versions
 */
export async function generateImageSizes(inputBuffer: Buffer) {
  const [thumbnail, medium, full] = await Promise.all([
    optimizeImage(inputBuffer, { maxWidth: 400, maxHeight: 400, quality: 75 }),
    optimizeImage(inputBuffer, { maxWidth: 1200, maxHeight: 1200, quality: 80 }),
    optimizeImage(inputBuffer, { maxWidth: 2000, maxHeight: 2000, quality: 85 }),
  ]);

  return { thumbnail, medium, full };
}
