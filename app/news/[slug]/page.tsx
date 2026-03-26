import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { buildPageMetadata } from "../../../lib/metadata";
import { getLegacyCanonicalDestination } from "../../../shared/publicContent";
import Header from "../../../components/site/Header";
import Footer from "../../../components/site/Footer";

type NewsDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const destination = getLegacyCanonicalDestination(slug);

  return buildPageMetadata({
    title: "Legacy News Entry",
    description:
      "Legacy news entries are being consolidated into articles and assistant scenic design content.",
    pathname: `/news/${slug}`,
    noindex: true,
    type: "article",
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const destination = getLegacyCanonicalDestination(slug);

  if (destination) {
    redirect(destination.displayPath);
  }

  if (!slug) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card/20 p-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Legacy Entry
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">This news entry is no longer published here.</h1>
          <p className="mt-4 text-muted-foreground">
            The new site is deprecating database-backed news pages in favor of durable,
            file-managed portfolio and article content.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/news" className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-white/5">
              Back to News Archive
            </Link>
            <Link href="/articles" className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-white/5">
              Browse Articles
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
