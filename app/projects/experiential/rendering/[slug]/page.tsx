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
  return getExperientialSampleStaticParams("rendering");
}

export async function generateMetadata({ params }: SamplePageProps) {
  const { slug } = await params;
  return getExperientialSampleMetadata("rendering", slug);
}

export default async function RenderingSamplePage({ params }: SamplePageProps) {
  return <ExperientialSamplePage category="rendering" params={params} />;
}
