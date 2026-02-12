/**
 * Proxy external images through our server to avoid CORS issues
 * Handles images from Manus S3, CloudFront, and other external sources
 */
export function proxyImageUrl(url: string, width?: number): string {
  if (!url) return url;
  
  // Skip if already a local/proxied URL
  if (url.startsWith('/') || url.startsWith('/api/img')) {
    return url;
  }
  
  // Check if this is an external image that needs proxying
  const needsProxy = 
    url.includes('manus-user-assets.s3') ||
    url.includes('cloudfront.net') ||
    url.includes('manuscdn.com') ||
    url.includes('s3.amazonaws.com');
  
  if (!needsProxy) {
    return url; // Return as-is for Cloudinary and other CDNs with CORS
  }
  
  // Build proxy URL
  const params = new URLSearchParams();
  params.set('url', url);
  if (width) {
    params.set('w', width.toString());
  }
  
  return `/api/img?${params.toString()}`;
}
