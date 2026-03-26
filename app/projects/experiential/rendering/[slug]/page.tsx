import {
  getExperientialSampleMetadata,
  getExperientialSampleStaticParams,
} from "../../../../../components/site/ExperientialSamplePage";
import ExperientialSampleDetailPage from "../../../../../client/src/pages/ExperientialSampleDetail";
import { NextPathProvider } from "../../../../../components/routing/NextPathProvider";

type SamplePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getExperientialSampleStaticParams("rendering");
}

export async function generateMetadata({ params }: SamplePageProps) {
  const { slug } = await params;
  return getExperientialSampleMetadata("rendering", slug);
}

export default async function RenderingSamplePage({ params }: SamplePageProps) {
  const { slug } = await params;

  return (
    <NextPathProvider currentPath={`/projects/experiential/rendering/${slug}`}>
      <ExperientialSampleDetailPage category="rendering" slug={slug} />
    </NextPathProvider>
  );
}
