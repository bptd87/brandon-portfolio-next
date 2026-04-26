import { buildImageSitemap, xmlResponse } from "../../lib/seo/xml";
import { absoluteUrl } from "../../lib/metadata";
import { resolveBlobMediaUrl } from "../../shared/mediaBlob";
import {
  getLocalExperientialMediaItems,
  getLocalExperientialProjects,
  getLocalRenderingProjects,
} from "../../shared/localPortfolios";
import { getLocalScenicProjects } from "../../shared/localScenicProjects";

export const dynamic = "force-static";

type ImageEntry = {
  pathname: string;
  imageUrl: string;
  title?: string;
  caption?: string;
};

function uniqueEntries(entries: ImageEntry[]) {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    if (!entry.pathname || !entry.imageUrl) return false;
    const key = `${entry.pathname}::${entry.imageUrl}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function toAbsoluteImageUrl(url: string) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return absoluteUrl(url);
  return url;
}

export function GET() {
  const profileHeadshot =
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";
  const aboutResumeArt = toAbsoluteImageUrl(
    resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-resume-art.png") || "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-resume-art.png"
  );
  const aboutTeachingArt = toAbsoluteImageUrl(
    resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-teaching-art.png") || "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-teaching-art.png"
  );
  const aboutProcessArt = toAbsoluteImageUrl(
    resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-process-art.png") || "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-process-art.png"
  );
  const aboutCollaboratorsArt = toAbsoluteImageUrl(
    resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-collaborators-art.png") ||
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-collaborators-art.png"
  );
  const portfolioHomepageImages = getLocalScenicProjects()
    .filter((project) => project.coverImageUrl)
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 8)
    .map((project) => ({
      pathname: "/",
      imageUrl: toAbsoluteImageUrl(project.coverImageUrl!),
      title: "Brandon PT Davis Scenic Design Portfolio",
      caption: `${project.title} scenic design by Brandon PT Davis.`,
    }));

  const entries = uniqueEntries([
    {
      pathname: "/",
      imageUrl: toAbsoluteImageUrl("/og-default.jpeg"),
      title: "Brandon PT Davis Scenic Designer Portfolio",
      caption: "Selected scenic design, rendering, and experiential design work by Brandon PT Davis.",
    },
    ...portfolioHomepageImages,
    {
      pathname: "/about",
      imageUrl: profileHeadshot,
      title: "About Brandon PT Davis",
      caption: "Profile headshot of Brandon PT Davis.",
    },
    {
      pathname: "/resume",
      imageUrl: aboutResumeArt,
      title: "Resume & Credits",
      caption: "Resume page artwork for Brandon PT Davis.",
    },
    {
      pathname: "/about/teaching",
      imageUrl: aboutTeachingArt,
      title: "Teaching Philosophy",
      caption: "Teaching philosophy page artwork for Brandon PT Davis.",
    },
    {
      pathname: "/creative-statement",
      imageUrl: aboutProcessArt,
      title: "Creative Statement",
      caption: "Creative statement page artwork for Brandon PT Davis.",
    },
    {
      pathname: "/about/collaborators",
      imageUrl: aboutCollaboratorsArt,
      title: "Collaborators",
      caption: "Collaborators page artwork for Brandon PT Davis.",
    },
    ...getLocalScenicProjects().flatMap((project) => [
      ...(project.coverImageUrl
        ? [
            {
              pathname: `/project/${project.slug}`,
              imageUrl: project.coverImageUrl,
              title: project.title,
              caption: [project.client, project.location, project.year].filter(Boolean).join(" · "),
            },
          ]
        : []),
      ...project.media
        .filter((item) => item.type === "image" && item.imageUrl)
        .map((item) => ({
          pathname: `/project/${project.slug}`,
          imageUrl: toAbsoluteImageUrl(item.imageUrl!),
          title: project.title,
          caption: item.caption || item.altText || project.excerpt,
        })),
    ]),
    ...getLocalRenderingProjects()
      .flatMap((project) => [
        ...(project.coverImageUrl
          ? [
              {
                pathname: `/projects/rendering/${project.slug}`,
                imageUrl: toAbsoluteImageUrl(project.coverImageUrl),
                title: project.title,
                caption: project.excerpt || project.seoDescription,
              },
            ]
          : []),
        ...project.images.map((image) => ({
          pathname: `/projects/rendering/${project.slug}`,
          imageUrl: toAbsoluteImageUrl(image.imageUrl),
          title: project.title,
          caption: image.caption || image.altText || project.excerpt || project.seoDescription,
        })),
      ]),
    ...getLocalExperientialProjects().flatMap((project) => [
      ...(project.coverImageUrl
        ? [
            {
              pathname: `/projects/experiential/${project.slug}`,
              imageUrl: toAbsoluteImageUrl(project.coverImageUrl),
              title: project.title,
              caption: project.summary || project.seoDescription,
            },
          ]
        : []),
      ...project.samples.flatMap((sample) =>
        getLocalExperientialMediaItems(sample).map((image) => ({
          pathname: `/projects/experiential/${project.slug}`,
          imageUrl: toAbsoluteImageUrl(image.imageUrl),
          title: project.title,
          caption: image.caption || image.altText || project.summary || project.seoDescription,
        }))
      ),
    ]),
  ]);

  return xmlResponse(buildImageSitemap(entries));
}
