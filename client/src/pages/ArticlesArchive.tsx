"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { SEO } from "@/components/SEO";
import { formatUtcDate } from "@/lib/date-format";
import { RETIRED_LEARNING_ARTICLE_REDIRECTS } from "@shared/learningPortal";
import { getTutorialArticles } from "@shared/articleTutorials";
import { getLocalArticles } from "@shared/localArticles";

type ArticleArchiveItem = {
  id: number | string;
  slug: string;
  title: string;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  publishedAt?: string | Date | null;
  createdAt?: string | Date | null;
  readTime?: number | null;
  categoryName?: string | null;
};

const decodeHTMLEntities = (text: string): string => {
  if (typeof document === "undefined") return text;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

const normalizeCategoryParam = (value: string | null) => {
  switch (value) {
    case "Technology & Tutorials":
      return "Tools & Technology";
    case "Design Philosophy":
      return "Scenic Design";
    case "Scenic Design Process":
      return "Design Process";
    case "Musical Theatre & Cinema":
      return "Performance History & Culture";
    case "Editorial Profiles":
      return "Profiles & Interviews";
    default:
      return value || "Article";
  }
};

const getArticleDate = (article: ArticleArchiveItem) => new Date(article.publishedAt || article.createdAt || 0);

const getArticleTime = (article: ArticleArchiveItem) => getArticleDate(article).getTime();

const getMonthKey = (article: ArticleArchiveItem) => {
  const date = getArticleDate(article);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
};

const getMonthLabel = (key: string) => {
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1))
  );
};

export default function ArticlesArchive() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const allArticles = useMemo<ArticleArchiveItem[]>(
    () =>
      [...getLocalArticles(), ...getTutorialArticles()]
        .filter((article) => {
          const retiredRedirect = RETIRED_LEARNING_ARTICLE_REDIRECTS[article.slug];
          return !retiredRedirect || retiredRedirect === `/articles/${article.slug}`;
        })
        .map((article) => ({
          id: article.id,
          slug: article.slug,
          title: decodeHTMLEntities(article.title),
          coverImageUrl: article.coverImageUrl,
          coverImageAlt: article.coverImageAlt,
          publishedAt: article.publishedAt,
          createdAt: article.createdAt,
          readTime: article.readTime,
          categoryName: normalizeCategoryParam(article.categoryName || null),
        }))
        .sort((a, b) => getArticleTime(b) - getArticleTime(a)),
    []
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(allArticles.map((article) => article.categoryName).filter((value): value is string => Boolean(value)))
      ).sort(),
    [allArticles]
  );

  const years = useMemo(
    () =>
      Array.from(new Set(allArticles.map((article) => getArticleDate(article).getUTCFullYear())))
        .filter(Boolean)
        .sort((a, b) => b - a),
    [allArticles]
  );

  const months = useMemo(() => {
    const source =
      selectedYear === "all"
        ? allArticles
        : allArticles.filter((article) => String(getArticleDate(article).getUTCFullYear()) === selectedYear);
    return Array.from(new Set(source.map((article) => getArticleDate(article).getUTCMonth() + 1))).sort((a, b) => b - a);
  }, [allArticles, selectedYear]);

  const filteredArticles = useMemo(
    () =>
      allArticles.filter((article) => {
        const date = getArticleDate(article);
        if (selectedCategory !== "all" && article.categoryName !== selectedCategory) return false;
        if (selectedYear !== "all" && String(date.getUTCFullYear()) !== selectedYear) return false;
        if (selectedMonth !== "all" && String(date.getUTCMonth() + 1) !== selectedMonth) return false;
        return true;
      }),
    [allArticles, selectedCategory, selectedMonth, selectedYear]
  );

  const groupedArticles = useMemo(() => {
    const groups = new Map<string, ArticleArchiveItem[]>();
    for (const article of filteredArticles) {
      const key = getMonthKey(article);
      const group = groups.get(key) || [];
      group.push(article);
      groups.set(key, group);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredArticles]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedYear("all");
    setSelectedMonth("all");
  };

  return (
    <div className="min-h-screen bg-[#f1f0ec] text-[#111111]">
      <SEO
        title="Article Archive | Brandon PT Davis"
        description="A chronological archive of scenic design articles, Vectorworks tutorials, and studio writing by Brandon PT Davis."
        url="https://www.brandonptdavis.com/articles/archive"
      />
      <Header />
      <PublishingTopBar active="articles" />

      <main>
        <section className="bg-[#e5e1d8] px-[clamp(1.5rem,5vw,6rem)] py-10 md:py-12">
          <div className="mx-auto flex max-w-[86rem] flex-col gap-4 lg:flex-row lg:items-center">
            <span className="text-[1.05rem] font-semibold tracking-[-0.025em] text-[#7a7770]">Filter</span>
            <div className="grid flex-1 gap-4 md:grid-cols-3">
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="h-14 w-full border-0 bg-[#fbfaf7] px-4 text-[1.08rem] font-semibold tracking-[-0.035em] text-[#111111] shadow-sm outline-none ring-1 ring-black/[0.04]"
              >
                <option value="all">All Articles</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(event) => {
                  setSelectedYear(event.target.value);
                  setSelectedMonth("all");
                }}
                className="h-14 w-full border-0 bg-[#fbfaf7] px-4 text-[1.08rem] font-semibold tracking-[-0.035em] text-[#111111] shadow-sm outline-none ring-1 ring-black/[0.04]"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="h-14 w-full border-0 bg-[#fbfaf7] px-4 text-[1.08rem] font-semibold tracking-[-0.035em] text-[#111111] shadow-sm outline-none ring-1 ring-black/[0.04]"
              >
                <option value="all">All Months</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" }).format(
                      new Date(Date.UTC(2026, month - 1, 1))
                    )}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="h-14 px-1 text-left text-[1.05rem] font-semibold tracking-[-0.025em] text-[#8a8780] transition-colors hover:text-[#111111]"
            >
              Reset
            </button>
          </div>
        </section>

        <section className="px-[clamp(1.5rem,5vw,6rem)] py-20 md:py-24">
          <div className="mx-auto max-w-[86rem]">
            {groupedArticles.length > 0 ? (
              <div className="space-y-20">
                {groupedArticles.map(([monthKey, articles]) => (
                  <section key={monthKey}>
                    <h1 className="text-[clamp(2.55rem,5vw,4.2rem)] font-semibold leading-none tracking-[-0.075em]">
                      {getMonthLabel(monthKey)}
                    </h1>
                    <div className="mt-7 divide-y divide-black/[0.12] border-t border-black/[0.12]">
                      {articles.map((article) => (
                        <Link
                          key={article.id}
                          href={`/articles/${article.slug}`}
                          className="grid gap-8 py-9 transition-opacity hover:opacity-80 md:grid-cols-[minmax(15rem,24rem)_minmax(0,1fr)] md:items-center"
                        >
                          <div className="relative aspect-[16/9] overflow-hidden rounded-none bg-black/[0.06]">
                            {article.coverImageUrl ? (
                              <Image
                                src={article.coverImageUrl}
                                alt={article.coverImageAlt || `Cover image for article: ${article.title}`}
                                fill
                                className="object-cover"
                                sizes="(min-width: 1024px) 24rem, 92vw"
                              />
                            ) : null}
                          </div>
                          <div>
                            <p className="text-[1.05rem] font-semibold tracking-[-0.025em] text-[#848078]">
                              {article.categoryName || "Article"}
                            </p>
                            <h2 className="mt-4 max-w-[52rem] text-[clamp(2rem,3.5vw,3.4rem)] font-semibold leading-[0.95] tracking-[-0.075em]">
                              {article.title}
                            </h2>
                            <p className="mt-6 text-[1.1rem] font-semibold tracking-[-0.025em] text-[#77736c]">
                              {formatUtcDate(article.publishedAt || article.createdAt || "", "short")}
                              {article.readTime ? ` · ${article.readTime} min read` : ""}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="border-t border-black/[0.12] pt-10">
                <p className="text-[1.2rem] font-semibold tracking-[-0.035em] text-[#77736c]">
                  No articles match those filters.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer tone="light" />
    </div>
  );
}
