import SyllabusExperientialPage from "../../../client/src/pages/SyllabusExperiential";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Experiential Design Syllabus",
  description:
    "Course syllabus for experiential design: themed entertainment, immersive environments, and commercial storytelling workflows.",
  pathname: "/syllabus/experiential-design",
  type: "article",
});

export default function ExperientialSyllabusRoute() {
  return (
    <NextPathProvider currentPath="/syllabus/experiential-design">
      <SyllabusExperientialPage />
    </NextPathProvider>
  );
}
