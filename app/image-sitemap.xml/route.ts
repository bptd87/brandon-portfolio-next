import { buildImageSitemap, xmlResponse } from "../../lib/seo/xml";
import { absoluteUrl } from "../../lib/metadata";
import { getLocalArticles } from "../../shared/localArticles";
import { resolveBlobMediaUrl } from "../../shared/mediaBlob";
import { assistantScenicDesignEntries } from "../../shared/localAssistantScenic";
import {
  getLocalExperientialMediaItems,
  getLocalExperientialProjects,
  getLocalRenderingProjects,
} from "../../shared/localPortfolios";
import { getLocalScenicProjects } from "../../shared/localScenicProjects";
import { getLocalTutorials } from "../../shared/localStudio";

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

function articleBodyImages(article: ReturnType<typeof getLocalArticles>[number]): ImageEntry[] {
  if (!Array.isArray(article.content)) return [];

  const images: ImageEntry[] = [];

  for (const block of article.content) {
    if (!block || typeof block !== "object") continue;

    if (typeof block.url === "string" && block.url) {
      images.push({
        pathname: `/articles/${article.slug}`,
        imageUrl: toAbsoluteImageUrl(block.url),
        title: article.title,
        caption: block.caption || block.alt || article.excerpt,
      });
    }

    if (Array.isArray(block.images)) {
      for (const image of block.images) {
        if (!image || typeof image !== "object" || typeof image.url !== "string" || !image.url) continue;
        images.push({
          pathname: `/articles/${article.slug}`,
          imageUrl: toAbsoluteImageUrl(image.url),
          title: article.title,
          caption: image.caption || image.alt || article.excerpt,
        });
      }
    }
  }

  return images;
}

export function GET() {
  const profileHeadshot =
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";
  const aboutResumeArt = toAbsoluteImageUrl(
    resolveBlobMediaUrl("/assets/about/about-resume-art.png") || "/assets/about/about-resume-art.png"
  );
  const aboutTeachingArt = toAbsoluteImageUrl(
    resolveBlobMediaUrl("/assets/about/about-teaching-art.png") || "/assets/about/about-teaching-art.png"
  );
  const aboutProcessArt = toAbsoluteImageUrl(
    resolveBlobMediaUrl("/assets/about/about-process-art.png") || "/assets/about/about-process-art.png"
  );
  const aboutCollaboratorsArt = toAbsoluteImageUrl(
    resolveBlobMediaUrl("/assets/about/about-collaborators-art.png") ||
      "/assets/about/about-collaborators-art.png"
  );

  const entries = uniqueEntries([
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
    ...getLocalArticles()
      .flatMap((article) => [
        ...(article.coverImageUrl
          ? [
              {
                pathname: `/articles/${article.slug}`,
                imageUrl: toAbsoluteImageUrl(article.coverImageUrl),
                title: article.title,
                caption: article.coverImageAlt || article.excerpt,
              },
            ]
          : []),
        ...articleBodyImages(article),
      ]),
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
    ...assistantScenicDesignEntries
      .filter((entry) => entry.coverImageUrl)
      .map((entry) => ({
        pathname: "/assistant-scenic-design",
        imageUrl: toAbsoluteImageUrl(entry.coverImageUrl),
        title: entry.title,
        caption: [entry.organization, entry.collaborator, entry.date.slice(0, 4)].filter(Boolean).join(" · "),
      })),
    ...getLocalTutorials()
      .filter((tutorial) => tutorial.cover_image)
      .map((tutorial) => ({
        pathname: `/studio/tutorials/${tutorial.slug}`,
        imageUrl: toAbsoluteImageUrl(String(tutorial.cover_image)),
        title: tutorial.title,
        caption: tutorial.description || tutorial.overview || tutorial.seo_description || tutorial.title,
      })),
  ]);

  return xmlResponse(buildImageSitemap(entries));
}
