import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "./Footer";
import Header from "./Header";
import { buildPageMetadata } from "../../lib/metadata";
import {
  getLocalExperientialMediaItems,
  getLocalExperientialProjectForSample,
  getLocalExperientialSampleBySlug,
  getLocalExperientialSampleHref,
  getLocalExperientialSamples,
  type LocalExperientialCategory,
} from "../../shared/localPortfolios";

type SampleRouteParams = {
  slug: string;
};

export function getExperientialSampleStaticParams(category: LocalExperientialCategory) {
  return getLocalExperientialSamples(category).map((sample) => ({ slug: sample.slug }));
}

export function getExperientialSampleMetadata(
  category: LocalExperientialCategory,
  slug: string
) {
  const sample = getLocalExperientialSampleBySlug(category, slug);
  if (!sample) return {};

  return buildPageMetadata({
    title: `${sample.displayTitle} | ${sample.categoryLabel}`,
    description: sample.description,
    pathname: getLocalExperientialSampleHref(sample),
    image: sample.imageUrl,
    type: "article",
  });
}

export async function ExperientialSamplePage({
  category,
  params,
}: {
  category: LocalExperientialCategory;
  params: Promise<SampleRouteParams>;
}) {
  const { slug } = await params;
  const sample = getLocalExperientialSampleBySlug(category, slug);
  if (!sample) notFound();

  const project = getLocalExperientialProjectForSample(sample);
  const media = getLocalExperientialMediaItems(sample);
  const related = getLocalExperientialSamples(category)
    .filter((item) => item.slug !== sample.slug)
    .slice(0, 3);
  const heroImage = media[0]?.imageUrl || sample.imageUrl || project?.coverImageUrl || "/og-default.jpeg";
  const heroAlt = media[0]?.altText || sample.altText || sample.displayTitle;
  const summary =
    sample.description ||
    `Selected ${sample.categoryLabel.toLowerCase()} from ${
      project?.title || "the experiential portfolio"
    }.`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="border-b border-border/40 pb-12 pt-24 md:pb-16 md:pt-32">
          <div className="container max-w-[88rem]">
            <Link
              href={project ? `/projects/experiential/${project.slug}` : "/projects/experiential"}
              className="text-sm text-white/48 transition-colors hover:text-white"
            >
              {project ? `Back to ${project.title}` : "Back to Experiential"}
            </Link>
            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-end">
              <div className="space-y-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/42">
                  {sample.categoryLabel}
                </p>
                <h1 className="font-sans text-[clamp(2.4rem,4.4vw,4.6rem)] font-medium leading-[0.94] tracking-[-0.06em] text-white">
                  {sample.displayTitle}
                </h1>
                <p className="max-w-3xl text-[1.02rem] leading-8 text-white/60">{summary}</p>
                <div className="flex flex-wrap gap-3 text-sm text-white/50">
                  {sample.year ? (
                    <span className="rounded-full border border-white/12 px-4 py-2">{sample.year}</span>
                  ) : null}
                  {project ? (
                    <span className="rounded-full border border-white/12 px-4 py-2">{project.title}</span>
                  ) : null}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.8rem] border border-white/10">
                <Image
                  src={heroImage}
                  alt={heroAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 44vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container max-w-[88rem] grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_22rem]">
            <div>
              {media.length ? (
                <div className="grid gap-5 md:grid-cols-2">
                  {media.map((item) => (
                    <figure
                      key={`${item.source}-${item.imageUrl}`}
                      className="overflow-hidden rounded-[1.3rem] border border-white/10 bg-white/[0.03]"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={item.imageUrl}
                          alt={item.altText}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      {item.caption ? (
                        <figcaption className="p-4 text-sm leading-7 text-white/56">{item.caption}</figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-6 text-sm leading-7 text-white/56">
                  Additional media is not attached to this sample yet, but the route is now native
                  Next content backed by the local experiential snapshot.
                </div>
              )}
            </div>

            <aside className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/42">
                More {sample.categoryLabel}
              </p>
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={getLocalExperientialSampleHref(item)}
                  className="block rounded-[1rem] border border-white/10 px-4 py-4 transition-colors hover:border-white/18"
                >
                  <h3 className="text-[1rem] font-medium tracking-[-0.03em] text-white">{item.displayTitle}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/56">{item.description}</p>
                </Link>
              ))}
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
