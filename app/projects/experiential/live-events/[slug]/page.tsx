import {
  ExperientialSamplePage,
  getExperientialSampleMetadata,
  getExperientialSampleStaticParams,
} from "../../../../../components/site/ExperientialSamplePage";

type SamplePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return getExperientialSampleStaticParams("live-events");
}

export async function generateMetadata({ params }: SamplePageProps) {
  const { slug } = await params;
  return getExperientialSampleMetadata("live-events", slug);
}

export default async function LiveEventSamplePage({ params }: SamplePageProps) {
  return <ExperientialSamplePage category="live-events" params={params} />;
}
