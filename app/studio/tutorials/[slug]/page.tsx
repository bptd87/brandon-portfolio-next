import { permanentRedirect } from "next/navigation";

type TutorialPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export default async function Page({ params }: TutorialPageProps) {
  await params;
  permanentRedirect("/articles");
}
