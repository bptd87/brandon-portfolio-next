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
  return getExperientialSampleStaticParams("technical-drawing");
}

export async function generateMetadata({ params }: SamplePageProps) {
  const { slug } = await params;
  return getExperientialSampleMetadata("technical-drawing", slug);
}

export default async function TechnicalDrawingSamplePage({ params }: SamplePageProps) {
  return <ExperientialSamplePage category="technical-drawing" params={params} />;
}
