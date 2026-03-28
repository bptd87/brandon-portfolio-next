import { notFound, permanentRedirect } from "next/navigation";

import { getLocalRenderingProjectBySlug } from "../../../shared/localPortfolios";
import { resolveLegacyProjectPath } from "../../../shared/legacyRedirects";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const parts = slug || [];

  if (parts.length === 1 && parts[0] === "rendering-visualization") {
    permanentRedirect("/projects/rendering");
  }

  if (parts.length === 1 && parts[0] === "assistant-scenic-design") {
    permanentRedirect("/assistant-scenic-design");
  }

  if (parts.length === 1 && parts[0] === "scenic-models") {
    permanentRedirect("/projects/rendering");
  }

  if (parts.length === 2 && parts[0] === "assistant-scenic-design" && parts[1] === "bottle-shock") {
    permanentRedirect("/assistant-scenic-design#bottle-shock-the-musical");
  }

  if (parts.length >= 2 && parts[0] === "assistant-scenic-design") {
    permanentRedirect("/assistant-scenic-design");
  }

  if (parts.length === 2 && parts[0] === "rendering-visualization") {
    const destination = resolveLegacyProjectPath(parts[1]);
    if (!destination) notFound();
    permanentRedirect(destination);
  }

  if (parts.length === 2 && parts[0] === "scenic-models") {
    if (getLocalRenderingProjectBySlug(parts[1])) {
      permanentRedirect(`/projects/rendering/${parts[1]}`);
    }

    const destination = resolveLegacyProjectPath(parts[1]);
    if (!destination) notFound();
    permanentRedirect(destination);
  }

  if (parts.length === 2 && parts[0] === "scenic-design") {
    const destination = resolveLegacyProjectPath(parts[1]);
    if (!destination) notFound();
    permanentRedirect(destination);
  }

  notFound();
}
