import fs from "fs";
import path from "path";

const inputPath =
  process.argv[2] ||
  "/Users/brandonptdavis/Downloads/brandonptdavis.com-Performance-on-Search-2026-02-20/Pages.csv";
const outputPath =
  process.argv[3] || path.resolve(process.cwd(), "SEO_TOP20_QUEUE_2026-02-21.md");

const legacyAliasTargets = {
  "navigating-the-scenic-design-process-a-comprehensive-guide": "/articles/scenic-design-process",
  "understanding-computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care":
    "/articles/computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care",
  "scenic-rendering-principles": "/articles/what-makes-a-good-scenic-design-rendering",
  "the-art-of-presenting-theatre-design-a-guide-for-designers":
    "/articles/the-art-of-presenting-theatre-design-a-guide-for-designers",
  "sora-in-the-studio-testing-ais-potential-for-theatrical-design":
    "/articles/sora-in-the-studio-testing-ais-potential-for-theatrical-design",
  "the-lights-were-already-on-maude-adams-legacy-at-stephens-college":
    "/articles/the-lights-were-already-on-maude-adams-legacy-at-stephens-college",
};

function parsePageCsv(line) {
  const m = line.match(/^\"?(https?:\/\/[^,\"]+)\"?,(\d+),(\d+),([0-9.]+%?),([0-9.]+)$/);
  if (!m) return null;
  return {
    url: m[1],
    clicks: Number(m[2]),
    impressions: Number(m[3]),
    ctr: Number(String(m[4]).replace("%", "")),
    position: Number(m[5]),
  };
}

function classify(url) {
  const u = url.toLowerCase();
  if (u.includes("/scenic-insights/")) return "redirect+consolidate";
  if (u.includes("/feed/")) return "redirect+consolidate";
  if (u.includes("/project/")) return "redirect+consolidate";
  if (u.includes("/resources/")) return "redirect+consolidate";
  if (u.includes("/articles/")) return "rewrite+expand";
  if (u.includes("/scale-converter")) return "redirect+intent-page";
  if (u.includes("/sitemap.xml")) return "noindex/robots-tuning";
  return "optimize";
}

function inferTarget(url) {
  const u = new URL(url);
  const parts = u.pathname.split("/").filter(Boolean);
  const slug = parts[parts.length - 1] || "";
  if (legacyAliasTargets[slug]) return legacyAliasTargets[slug];
  if (u.pathname === "/scale-converter") return "/studio/apps/scale-calculator";
  if (u.pathname.startsWith("/project/")) return `/projects/${slug}`;
  if (u.pathname.startsWith("/scenic-insights/")) return "/articles";
  if (u.pathname.startsWith("/feed/")) return "/projects";
  if (u.pathname.startsWith("/resources/")) return "/studio/tutorials";
  return "";
}

const raw = fs.readFileSync(inputPath, "utf8").trim().split("\n");
const items = raw
  .slice(1)
  .map(parsePageCsv)
  .filter(Boolean)
  .map((row) => ({
    ...row,
    score: row.impressions * (1 - row.ctr / 100),
    action: classify(row.url),
    target: inferTarget(row.url),
  }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 20);

const lines = [];
lines.push("# SEO Top 20 Queue (Search Console)");
lines.push("");
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push("");
lines.push("| Priority | URL | Impressions | CTR | Pos | Action | Target |");
lines.push("|---|---|---:|---:|---:|---|---|");
items.forEach((item, idx) => {
  lines.push(
    `| ${idx + 1} | ${item.url} | ${item.impressions} | ${item.ctr.toFixed(2)}% | ${item.position.toFixed(
      2
    )} | ${item.action} | ${item.target || "-"} |`
  );
});

lines.push("");
lines.push("## Notes");
lines.push("- `redirect+consolidate`: legacy URL should 301 to a single canonical page.");
lines.push("- `rewrite+expand`: improve title/meta/H1/opening paragraph and internal links.");
lines.push("- Prioritize pages with high impressions + low CTR first.");

fs.writeFileSync(outputPath, `${lines.join("\n")}\n`);
console.log(`Wrote ${outputPath}`);
