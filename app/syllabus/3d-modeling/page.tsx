import Syllabus3DModelingPage from "../../../client/src/pages/Syllabus3DModeling";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "3D Modeling and Rendering Syllabus",
  description:
    "Course syllabus for THA 211: Vectorworks for theatrical design, covering 3D modeling, rendering, and drafting documentation.",
  pathname: "/syllabus/3d-modeling",
  type: "article",
});

export default function Syllabus3DModelingRoute() {
  return (
    <NextPathProvider currentPath="/syllabus/3d-modeling">
      <Syllabus3DModelingPage />
    </NextPathProvider>
  );
}
