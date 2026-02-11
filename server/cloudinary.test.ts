import { describe, it, expect } from 'vitest';
import { v2 as cloudinary } from 'cloudinary';

describe('Cloudinary credentials', () => {
  it('should authenticate with valid credentials', async () => {
    // Configure Cloudinary with environment variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Test by fetching account usage (lightweight API call)
    const result = await cloudinary.api.ping();
    
    expect(result.status).toBe('ok');
  });
});
