"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "wouter";

import Header from "@/components/Header";
import {
  getLocalExperientialProjectForSample,
  getLocalExperientialProjectHref,
  getLocalExperientialSampleBySlug,
  type LocalExperientialCategory,
} from "@shared/localPortfolios";

type ExperientialSampleDetailProps = {
  category?: LocalExperientialCategory;
  slug?: string;
  params?: {
    category?: LocalExperientialCategory;
    slug?: string;
  };
};

export default function ExperientialSampleDetail({
  category: categoryProp,
  slug: slugProp,
  params,
}: ExperientialSampleDetailProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const category = (categoryProp || params?.category) as LocalExperientialCategory;
  const slug = String(
    slugProp ||
      params?.slug ||
      pathname?.split("/").filter(Boolean).pop() ||
      ""
  )
    .trim()
    .toLowerCase();
  const sample = getLocalExperientialSampleBySlug(category, slug);
  const project = sample ? getLocalExperientialProjectForSample(sample) : null;

  useEffect(() => {
    if (!project) return;
    router.replace(getLocalExperientialProjectHref(project));
  }, [project, router]);

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
