"use client";

import React, { type CSSProperties, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { SEO } from "@/components/SEO";
import { formatUtcDate } from "@/lib/date-format";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeDocumentTheme,
  useHomeTheme,
} from "@/lib/homeTheme";
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
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const pageStyle = {
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
    fontFamily: HOME_BODY_FONT,
  } as CSSProperties;
  const displayStyle = {
    color: homeTheme.ink,
    fontFamily: HOME_DISPLAY_FONT,
  } as CSSProperties;
  const mutedStyle = {
    color: homeTheme.muted,
  } as CSSProperties;
  const panelStyle = {
    backgroundColor: homeTheme.accentSoft,
    color: homeTheme.ink,
  } as CSSProperties;
  const controlStyle = {
    backgroundColor: homeTheme.controlBg,
    color: homeTheme.controlInk,
  } as CSSProperties;
  const secondaryControlStyle = {
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
  } as CSSProperties;

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
    <div className="relative min-h-screen transition-colors duration-500" style={pageStyle}>
      <SEO
        title="Article Archive | Brandon PT Davis"
        description="A chronological archive of scenic design articles, Vectorworks tutorials, and studio writing by Brandon PT Davis."
        url="https://www.brandonptdavis.com/articles/archive"
      />
      <Header />
      <PublishingTopBar active="articles" />

      <main className="relative z-10 pb-20 transition-colors duration-500" style={{ backgroundColor: homeTheme.bg }}>
        <section className="px-[clamp(1.5rem,5vw,6rem)] pb-12 pt-28 md:pb-16 md:pt-32">
          <div className="mx-auto max-w-[76rem] text-center">
            <h1
              className="text-[clamp(4.5rem,12vw,9rem)] font-black uppercase leading-[0.82]"
              style={displayStyle}
            >
              ARCHIVE
            </h1>
            <p
              className="mx-auto mt-5 max-w-[38rem] text-[clamp(1rem,1.7vw,1.28rem)] leading-8"
              style={mutedStyle}
            >
              All articles, tutorials, and studio writing by date.
            </p>
            <div
              className="mx-auto mt-8 grid max-w-[58rem] gap-3 rounded-[1.75rem] p-4 shadow-[0_22px_70px_rgba(17,17,17,0.08)] md:grid-cols-[1fr_0.7fr_0.7fr_auto]"
              style={panelStyle}
            >
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="h-12 w-full rounded-full border-0 px-4 text-[0.95rem] font-black outline-none"
                style={secondaryControlStyle}
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
                className="h-12 w-full rounded-full border-0 px-4 text-[0.95rem] font-black outline-none"
                style={secondaryControlStyle}
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
                className="h-12 w-full rounded-full border-0 px-4 text-[0.95rem] font-black outline-none"
                style={secondaryControlStyle}
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
              <button
                type="button"
                onClick={resetFilters}
                className="h-12 rounded-full px-5 text-[0.95rem] font-black transition-transform hover:-translate-y-0.5"
                style={controlStyle}
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        <section className="px-[clamp(1.5rem,5vw,6rem)]">
          <div className="mx-auto max-w-[76rem]">
            {groupedArticles.length > 0 ? (
              <div className="space-y-8">
                {groupedArticles.map(([monthKey, articles]) => (
                  <section key={monthKey} className="rounded-[2rem] p-4 sm:p-6" style={panelStyle}>
                    <h2
                      className="px-2 text-[clamp(2.2rem,5vw,4rem)] font-black uppercase leading-none"
                      style={displayStyle}
                    >
                      {getMonthLabel(monthKey)}
                    </h2>
                    <div className="mt-6 grid gap-5">
                      {articles.map((article) => (
                        <Link
                          key={article.id}
                          href={`/articles/${article.slug}`}
                          className="grid gap-5 rounded-[1.5rem] p-3 transition-transform duration-300 hover:-translate-y-1 md:grid-cols-[minmax(12rem,20rem)_minmax(0,1fr)] md:items-center"
                          style={secondaryControlStyle}
                        >
                          <div
                            className="relative aspect-[3/2] overflow-hidden rounded-[1.25rem]"
                            style={{ backgroundColor: homeTheme.ghost }}
                          >
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
                            <p className="text-[0.95rem] font-black uppercase tracking-[-0.02em]" style={mutedStyle}>
                              {article.categoryName || "Article"}
                            </p>
                            <h3
                              className="mt-3 max-w-[48rem] text-[clamp(1.7rem,3vw,3rem)] font-black uppercase leading-[0.9]"
                              style={displayStyle}
                            >
                              {article.title}
                            </h3>
                            <p className="mt-5 text-[1rem] font-semibold tracking-[-0.02em]" style={mutedStyle}>
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
              <div className="rounded-[1.5rem] p-8" style={panelStyle}>
                <p className="text-[1.2rem] font-semibold tracking-[-0.035em]" style={mutedStyle}>
                  No articles match those filters.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer
        tone="light"
        backgroundColor={homeTheme.footerBg}
        displayTextColor={homeTheme.footerDisplay}
        textColor={homeTheme.footerInk}
      />
    </div>
  );
}
