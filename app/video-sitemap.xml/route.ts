import { buildVideoSitemap, xmlResponse } from "../../lib/seo/xml";
import { getLocalTutorials } from "../../shared/localStudio";

export const dynamic = "force-static";

function toYouTubeEmbedUrl(url: string) {
  const match = url.match(/[?&]v=([^&]+)/);
  if (match?.[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  return url;
}

export function GET() {
  const entries = getLocalTutorials()
    .filter((tutorial) => tutorial.video_url && tutorial.cover_image)
    .map((tutorial) => ({
      pathname: `/studio/tutorials/${tutorial.slug}`,
      title: tutorial.title,
      description: tutorial.description || tutorial.overview || tutorial.seo_description || tutorial.title,
      thumbnailUrl: String(tutorial.cover_image),
      playerUrl: toYouTubeEmbedUrl(String(tutorial.video_url)),
      publishedAt: tutorial.updated_at || tutorial.created_at,
    }));

  return xmlResponse(buildVideoSitemap(entries));
}
