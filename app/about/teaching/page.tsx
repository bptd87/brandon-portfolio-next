import TeachingPhilosophyPage from "../../../client/src/pages/TeachingPhilosophy";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Teaching Philosophy for Scenic Design",
  description:
    "A teaching philosophy centered on scenic design process, professional practice, collaboration, and preparing students for sustainable creative work.",
  pathname: "/about/teaching",
  type: "article",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/about/teaching">
      <TeachingPhilosophyPage />
    </NextPathProvider>
  );
}
