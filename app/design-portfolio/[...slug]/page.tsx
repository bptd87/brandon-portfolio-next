import { permanentRedirect } from "next/navigation";

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

  if (parts.length === 2 && parts[0] === "assistant-scenic-design" && parts[1] === "bottle-shock") {
    permanentRedirect("/assistant-scenic-design#bottle-shock-the-musical");
  }

  if (parts.length === 2 && parts[0] === "scenic-design") {
    permanentRedirect(resolveLegacyProjectPath(parts[1]));
  }

  permanentRedirect("/projects");
}
