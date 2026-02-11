import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import imageProxyRouter from './imageProxy';

describe('Image Proxy (90% Quality)', () => {
  const app = express();
  app.use('/api', imageProxyRouter);

  it('should resize and return image with correct headers at 90% quality', async () => {
    const testImageUrl = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/QGemJViDZXujRwhK.webp';
    
    const response = await request(app)
      .get(`/api/img?url=${encodeURIComponent(testImageUrl)}&w=640`)
      .expect(200);

    // Check content type
    expect(response.headers['content-type']).toBe('image/webp');
    
    // Check cache headers
    expect(response.headers['cache-control']).toBe('public, max-age=31536000, immutable');
    
    // Check that image data is returned
    expect(response.body).toBeInstanceOf(Buffer);
    expect(response.body.length).toBeGreaterThan(0);
    
    // At 90% quality, file should be larger than 50KB (higher quality = larger file)
    expect(response.body.length).toBeGreaterThan(50000);
  }, 30000); // 30 second timeout for image download and processing

  it('should reject invalid URL parameter', async () => {
    await request(app)
      .get('/api/img?w=640')
      .expect(400);
  });

  it('should reject invalid width parameter', async () => {
    const testImageUrl = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/QGemJViDZXujRwhK.webp';
    
    await request(app)
      .get(`/api/img?url=${encodeURIComponent(testImageUrl)}&w=50`)
      .expect(400);
  });

  it('should reject non-CDN domains', async () => {
    const maliciousUrl = 'https://evil.com/image.jpg';
    
    await request(app)
      .get(`/api/img?url=${encodeURIComponent(maliciousUrl)}&w=640`)
      .expect(403);
  });

  it('should cache resized images', async () => {
    const testImageUrl = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/QGemJViDZXujRwhK.webp';
    
    // First request
    const start1 = Date.now();
    await request(app)
      .get(`/api/img?url=${encodeURIComponent(testImageUrl)}&w=768`)
      .expect(200);
    const duration1 = Date.now() - start1;
    
    // Second request (should be cached and faster)
    const start2 = Date.now();
    await request(app)
      .get(`/api/img?url=${encodeURIComponent(testImageUrl)}&w=768`)
      .expect(200);
    const duration2 = Date.now() - start2;
    
    // Cached request should be significantly faster
    expect(duration2).toBeLessThan(duration1 * 0.5);
  }, 60000); // 60 second timeout for two requests
});
