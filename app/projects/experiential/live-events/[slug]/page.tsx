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
  return getExperientialSampleStaticParams("live-events");
}

export async function generateMetadata({ params }: SamplePageProps) {
  const { slug } = await params;
  return getExperientialSampleMetadata("live-events", slug);
}

export default async function LiveEventSamplePage({ params }: SamplePageProps) {
  const { slug } = await params;

  return (
    <NextPathProvider currentPath={`/projects/experiential/live-events/${slug}`}>
      <ExperientialSampleDetailPage category="live-events" slug={slug} />
    </NextPathProvider>
  );
}
