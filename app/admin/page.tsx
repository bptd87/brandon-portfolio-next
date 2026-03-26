import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Clock3, FileText } from "lucide-react";

import { AssetManager } from "../../components/admin/AssetManager";
import { AdminShell } from "../../components/admin/AdminShell";
import { getDeploymentReadinessChecks } from "../../lib/env/deployment-readiness";
import { buildPageMetadata } from "../../lib/metadata";
import { getLocalArticles } from "../../shared/localArticles";
import {
  getLocalExperientialProjects,
  getLocalExperientialSamples,
  getLocalRenderingProjects,
} from "../../shared/localPortfolios";
import { getLocalScenicProjects } from "../../shared/localScenicProjects";
import {
  getLocalCollaborators,
  getLocalStudioDirectory,
  getLocalTutorials,
} from "../../shared/localStudio";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Admin Workbench",
  description: "Analytics, assets, snippets, and static page workflow for the Next.js site.",
  pathname: "/admin",
  noindex: true,
});

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-border/25 bg-card/20 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/40">
        {label}
      </p>
      <div className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-foreground">{value}</div>
      <p className="mt-2 text-sm leading-6 text-foreground/58">{detail}</p>
    </div>
  );
}

export default function AdminHomePage() {
  const scenicProjects = getLocalScenicProjects();
  const renderingProjects = getLocalRenderingProjects();
  const experientialProjects = getLocalExperientialProjects();
  const experientialSamples = getLocalExperientialSamples();
  const articles = getLocalArticles();
  const tutorials = getLocalTutorials();
  const directory = getLocalStudioDirectory();
  const collaborators = getLocalCollaborators();
  const deploymentChecks = getDeploymentReadinessChecks();

  const statusMeta = {
    ready: {
      label: "Ready",
      icon: CheckCircle2,
      className: "text-emerald-400",
    },
    attention: {
      label: "Needs setup",
      icon: AlertCircle,
      className: "text-amber-300",
    },
    optional: {
      label: "Optional",
      icon: Clock3,
      className: "text-foreground/48",
    },
  } as const;

  return (
    <AdminShell
      currentPath="/admin"
      eyebrow="Admin Workbench"
      title="See media, copy URLs, and build static pages faster."
      description="The public site is static and file-first, so the main job here is to inspect assets, copy stable URLs or snippets, and use analytics to decide what to build next."
    >
      <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
          <div className="rounded-[1.5rem] border border-border/25 bg-card/20 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/40">
              Analytics
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em] text-foreground">
              Watch demand before building the next page.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/58">
              Use the analytics dashboard to see traffic, project interest, and contact behavior,
              then come back here to gather media and build the next static page.
            </p>
            <div className="mt-5">
              <Link
                href="/admin/analytics"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border/35 px-5 text-sm font-medium transition-colors hover:bg-foreground/[0.04]"
              >
                Open Analytics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border/25 bg-card/20 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/40">
              Static Content Status
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <StatCard
                label="Scenic"
                value={scenicProjects.length}
                detail="Scenic project pages in local content."
              />
              <StatCard
                label="Rendering"
                value={renderingProjects.length}
                detail="Rendering pages in local content."
              />
              <StatCard
                label="Experiential"
                value={experientialProjects.length + experientialSamples.length}
                detail="Experiential projects and samples."
              />
              <StatCard
                label="Writing"
                value={articles.length + tutorials.length + directory.length + collaborators.length}
                detail="Articles, tutorials, directory, and collaborators."
              />
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[1.5rem] border border-border/25 bg-card/20 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/40">
                Deployment Readiness
              </p>
              <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em] text-foreground">
                What Vercel still needs before ship.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground/58">
                This keeps the production contract visible inside the admin: core auth and contact
                envs, the analytics transition path, and the city-level geo signal you want to keep.
              </p>
            </div>
            <Link
              href="/admin/analytics"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border/35 px-5 text-sm font-medium transition-colors hover:bg-foreground/[0.04]"
            >
              Review Analytics
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {deploymentChecks.map((item) => {
              const meta = statusMeta[item.status];
              const Icon = meta.icon;

              return (
                <div key={item.label} className="rounded-2xl border border-border/25 bg-background/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium tracking-[-0.02em] text-foreground">{item.label}</p>
                    <span className={`inline-flex items-center gap-2 text-xs font-medium ${meta.className}`}>
                      <Icon className="h-4 w-4" />
                      {meta.label}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-foreground/58">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <AssetManager
            title="Media Workbench"
            description="Preview images and files, upload new media, copy public URLs, and generate snippets for static page work."
            standalone={false}
            mode="workbench"
            initialPrefix="portfolio/shared/"
            initialUploadPath="portfolio/shared/"
          />
        </section>

        <section className="mt-10 rounded-[1.5rem] border border-border/25 bg-card/20 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/40">
            Workflow
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "1. Check analytics",
                text: "See what people are actually viewing before deciding which page or portfolio area to expand.",
              },
              {
                title: "2. Collect assets",
                text: "Preview the media, copy the public URL or asset ref, and upload anything missing.",
              },
              {
                title: "3. Build the page",
                text: "Use the copied snippet or URL to create a new static route or refine existing local content files.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/25 bg-background/40 p-4">
                <h3 className="text-base font-medium tracking-[-0.02em] text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/58">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin/assets"
              className="inline-flex h-10 items-center justify-center rounded-full border border-border/35 px-4 text-sm font-medium transition-colors hover:bg-foreground/[0.04]"
            >
              Full Asset Browser
            </Link>
            <Link
              href="/admin/uploads"
              className="inline-flex h-10 items-center justify-center rounded-full border border-border/35 px-4 text-sm font-medium transition-colors hover:bg-foreground/[0.04]"
            >
              Uploads
            </Link>
            <Link
              href="/admin/snippets"
              className="inline-flex h-10 items-center justify-center rounded-full border border-border/35 px-4 text-sm font-medium transition-colors hover:bg-foreground/[0.04]"
            >
              Snippets
            </Link>
          </div>
        </section>
    </AdminShell>
  );
}
