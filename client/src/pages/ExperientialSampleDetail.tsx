import { useEffect } from "react";
import { Link, useLocation, useParams } from "wouter";

import Header from "@/components/Header";
import {
  getLocalExperientialProjectForSample,
  getLocalExperientialProjectHref,
  getLocalExperientialSampleBySlug,
  type LocalExperientialCategory,
} from "@shared/localPortfolios";

export default function ExperientialSampleDetail() {
  const params = useParams<{ category: LocalExperientialCategory; slug: string }>();
  const [, setLocation] = useLocation();
  const category = params.category as LocalExperientialCategory;
  const slug = String(params.slug || "").trim().toLowerCase();
  const sample = getLocalExperientialSampleBySlug(category, slug);
  const project = sample ? getLocalExperientialProjectForSample(sample) : null;

  useEffect(() => {
    if (!project) return;
    setLocation(getLocalExperientialProjectHref(project), { replace: true });
  }, [project, setLocation]);

  if (project) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container flex min-h-[60vh] max-w-4xl items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-sans text-4xl tracking-[-0.05em]">Project Not Found</h1>
          <Link
            href="/projects/experiential"
            className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-sm text-white/72 transition-colors hover:border-white/22 hover:text-white"
          >
            Back to Experiential
          </Link>
        </div>
      </div>
    </div>
  );
}
