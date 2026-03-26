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
  return getExperientialSampleStaticParams("technical-drawing");
}

export async function generateMetadata({ params }: SamplePageProps) {
  const { slug } = await params;
  return getExperientialSampleMetadata("technical-drawing", slug);
}

export default async function TechnicalDrawingSamplePage({ params }: SamplePageProps) {
  const { slug } = await params;

  return (
    <NextPathProvider currentPath={`/projects/experiential/technical-drawing/${slug}`}>
      <ExperientialSampleDetailPage category="technical-drawing" slug={slug} />
    </NextPathProvider>
  );
}
