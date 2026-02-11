import sharp from 'sharp';

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Compress and optimize an image buffer
 * @param buffer - Input image buffer
 * @param options - Compression options
 * @returns Optimized image buffer and metadata
 */
export async function compressImage(
  buffer: Buffer,
  options: ImageCompressionOptions = {}
): Promise<{ buffer: Buffer; width: number; height: number; format: string; size: number }> {
  const {
    maxWidth = 2048,
    maxHeight = 2048,
    quality = 85,
    format = 'webp'
  } = options;

  let pipeline = sharp(buffer);

  // Get original metadata
  const metadata = await pipeline.metadata();
  
  // Resize if needed
  if (metadata.width && metadata.height) {
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      pipeline = pipeline.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
  }

  // Convert to target format with compression
  if (format === 'webp') {
    pipeline = pipeline.webp({ quality, effort: 4 });
  } else if (format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  } else if (format === 'png') {
    pipeline = pipeline.png({ quality, compressionLevel: 9 });
  }

  // Execute pipeline
  const outputBuffer = await pipeline.toBuffer();
  const outputMetadata = await sharp(outputBuffer).metadata();

  return {
    buffer: outputBuffer,
    width: outputMetadata.width || 0,
    height: outputMetadata.height || 0,
    format: outputMetadata.format || format,
    size: outputBuffer.length
  };
}

/**
 * Generate multiple responsive image sizes
 * @param buffer - Input image buffer
 * @param sizes - Array of max widths to generate
 * @returns Array of compressed images at different sizes
 */
export async function generateResponsiveSizes(
  buffer: Buffer,
  sizes: number[] = [640, 750, 828, 1080, 1200, 1920, 2048]
): Promise<Array<{ width: number; buffer: Buffer; size: number }>> {
  const results = [];
  
  for (const width of sizes) {
    const compressed = await compressImage(buffer, {
      maxWidth: width,
      quality: 85,
      format: 'webp'
    });
    
    results.push({
      width: compressed.width,
      buffer: compressed.buffer,
      size: compressed.size
    });
  }
  
  return results;
}
