import Link from "next/link";

import { buildPageMetadata } from "../../lib/metadata";
import { ASSISTANT_SCENIC_DESIGN_PATH } from "../../shared/localAssistantScenic";
import { VOYAGELA_ARTICLE_PATH } from "../../shared/publicContent";
import Header from "../../components/site/Header";
import Footer from "../../components/site/Footer";

export const metadata = buildPageMetadata({
  title: "News Archive",
  description:
    "Legacy news archive for older production updates, now consolidated into more durable sections of the site.",
  pathname: "/news",
  noindex: true,
});

export default function NewsArchivePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b border-border py-20 md:py-24">
        <div className="container max-w-5xl">
          <div className="space-y-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-muted-foreground">
              Archive
            </p>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">News Archive</h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Legacy news URLs remain live where possible, but assistant scenic design and
              editorial profile content now live in more durable sections of the site.
            </p>

            <div className="grid gap-4 pt-4 md:grid-cols-2">
              <Link href={ASSISTANT_SCENIC_DESIGN_PATH}>
                <div className="cursor-pointer rounded-2xl border border-border/60 bg-card/20 p-6 text-left transition-colors hover:border-[#FFB000]/60">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#FFB000]">
                    Portfolio
                  </p>
                  <h2 className="mb-2 text-2xl font-bold">Assistant Scenic Design</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Portfolio-style one-page home for assistant scenic design credits and season work.
                  </p>
                </div>
              </Link>

              <Link href={VOYAGELA_ARTICLE_PATH}>
                <div className="cursor-pointer rounded-2xl border border-border/60 bg-card/20 p-6 text-left transition-colors hover:border-[#FF9800]/60">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#FF9800]">
                    Articles
                  </p>
                  <h2 className="mb-2 text-2xl font-bold">VoyageLA Interview</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Editorial/profile content has moved into Articles rather than staying in News.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container max-w-4xl">
          <div className="rounded-2xl border border-border/60 bg-card/20 p-8 text-center">
            <h2 className="text-2xl font-bold">Legacy news is being consolidated.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              The new site is moving away from database-backed news pages. Durable content is being
              folded into articles, assistant scenic design, and portfolio pages so the archive can
              stay stable without remaining part of the publishing workflow.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
