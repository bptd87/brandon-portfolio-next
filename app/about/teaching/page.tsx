import TeachingPhilosophyPage from "../../../client/src/pages/TeachingPhilosophy";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Teaching Philosophy",
  description:
    "Teaching philosophy centered on scenic design process, professional practice, and student growth.",
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
