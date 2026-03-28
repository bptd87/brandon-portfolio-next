/**
 * Extracts YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/\s]+)/i,
    /youtube\.com\/shorts\/([^&\?\/\s]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Converts YouTube URL to embed format
 */
export function getYouTubeEmbedUrl(url: string): string {
  const videoId = extractYouTubeId(url);
  if (!videoId) return url; // Return original if not a YouTube URL
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Gets the thumbnail URL for a YouTube video
 * Returns high quality thumbnail (maxresdefault) with fallback to hqdefault
 */
export function getYouTubeThumbnail(url: string): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  // Use the stable HQ thumbnail to avoid repeated 404s on videos that do not expose maxresdefault.
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Gets Vimeo video ID from URL
 */
export function extractVimeoId(url: string): string | null {
  if (!url) return null;
  
  const match = url.match(/vimeo\.com\/(\d+)/i);
  return match ? match[1] : null;
}

/**
 * Converts Vimeo URL to embed format
 */
export function getVimeoEmbedUrl(url: string): string {
  const videoId = extractVimeoId(url);
  if (!videoId) return url;
  return `https://player.vimeo.com/video/${videoId}`;
}

/**
 * Determines if a URL is a video URL and returns the embed URL
 */
export function getVideoEmbedUrl(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return getYouTubeEmbedUrl(url);
  }
  if (url.includes('vimeo.com')) {
    return getVimeoEmbedUrl(url);
  }
  return url; // Return as-is for other video platforms
}

/**
 * Gets thumbnail for various video platforms
 */
export function getVideoThumbnail(url: string): string | null {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return getYouTubeThumbnail(url);
  }
  // Vimeo thumbnails require API call - would need to be fetched server-side
  // For now, return null for non-YouTube videos
  return null;
}
