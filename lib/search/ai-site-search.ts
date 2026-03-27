import {
  type SiteSearchEntry,
} from "@shared/siteSearch";
import {
  assistantScenicDesignEntries,
  ASSISTANT_SCENIC_DESIGN_PATH,
} from "@shared/localAssistantScenic";
import { getLocalScenicProjects } from "@shared/localScenicProjects";
import { voiceProfile } from "@shared/voiceProfile";
import { getSiteSearchEntries, runLocalSiteSearch } from "./site-search-service";

export type AISiteSearchRecommendation = {
  id: string;
  title: string;
  href: string;
  kind: string;
  meta?: string;
  imageUrl?: string;
  reason: string;
};

export type AISiteSearchResponse = {
  summary: string;
  insight: string;
  connections: string[];
  recommendations: AISiteSearchRecommendation[];
  relatedQueries: string[];
};

type SearchCandidate = {
  id: string;
  title: string;
  href: string;
  kind: string;
  meta?: string;
  imageUrl?: string;
  description: string;
  snippet: string;
};

const OPENAI_SEARCH_MODEL = process.env.OPENAI_SEARCH_MODEL || "gpt-4.1-mini";

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeQuery(value: string) {
  return collapseWhitespace(value).toLowerCase();
}

function buildFallbackCandidates(entries: SiteSearchEntry[], query: string): SearchCandidate[] {
  const normalized = normalizeQuery(query);
  const terms = normalized.split(" ").filter(Boolean);

  if (!terms.length) return [];

  return entries
    .map((entry) => {
      const haystack = collapseWhitespace(
        [entry.title, entry.meta, entry.description, entry.bodyText, ...entry.keywords].filter(Boolean).join(" ")
      ).toLowerCase();

      const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, 12)
    .map(({ entry }) => ({
      id: entry.id,
      title: entry.title,
      href: entry.href,
      kind: entry.kind,
      meta: entry.meta,
      imageUrl: entry.imageUrl,
      description: entry.description,
      snippet: entry.bodyText?.slice(0, 320) || entry.description,
    }));
}

function buildCandidates(query: string) {
  const entries = getSiteSearchEntries();
  const indexed = runLocalSiteSearch(query, 12)
    .slice(0, 12)
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      href: entry.href,
      kind: entry.kind,
      meta: entry.meta,
      imageUrl: entry.imageUrl,
      description: entry.description,
      snippet: entry.snippet,
    }));

  if (indexed.length > 0) {
    return { entries, candidates: indexed };
  }

  return { entries, candidates: buildFallbackCandidates(entries, query) };
}

function buildPrompt(query: string, candidates: SearchCandidate[]) {
  return JSON.stringify(
    {
      task: "Help a visitor search Brandon PT Davis's website.",
      rules: [
        "Use only the candidate pages provided here.",
        "Do not invent projects, people, dates, or URLs.",
        "Prefer portfolio pages over directory or index pages when both are relevant.",
        "Treat the query like a real question when possible, not just a keyword lookup.",
        "Sound conversational and insightful, like a knowledgeable guide to the site.",
        "Write a concise answer in 1-2 sentences.",
        "Write one short insight that helps the visitor learn something meaningful from the result set.",
        "Return 2 or 3 short connection points that reveal patterns, context, or relationships across the site.",
        "Choose up to 4 recommendations.",
        "Reasons should be short and concrete.",
        "Return 2 or 3 related queries that would help refine the search.",
      ],
      profile_context: voiceProfile,
      query,
      candidates,
      output_schema: {
        summary: "string",
        insight: "string",
        connections: ["string"],
        recommendations: [
          {
            id: "candidate id",
            reason: "short reason",
          },
        ],
        relatedQueries: ["string"],
      },
    },
    null,
    2
  );
}

function parseJSON(content: string | null | undefined) {
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function humanJoin(values: string[]) {
  if (values.length <= 1) return values[0] || "";
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}

function normalizePersonName(value: string) {
  return normalizeQuery(value).replace(/\b(jr|sr)\b/g, "").trim();
}

function nameMatchesQuery(personName: string, query: string) {
  const normalizedName = normalizePersonName(personName);
  const normalizedQuery = normalizePersonName(query);
  if (!normalizedName || !normalizedQuery) return false;
  if (normalizedQuery.includes(normalizedName)) return true;

  const nameTokens = normalizedName.split(" ").filter(Boolean);
  if (nameTokens.length > 1 && nameTokens.every((token) => normalizedQuery.includes(token))) {
    return true;
  }

  const surname = nameTokens[nameTokens.length - 1];
  return surname.length >= 4 && normalizedQuery.includes(surname);
}

function findCollaboratorMatches(query: string) {
  const scenicProjects = getLocalScenicProjects();
  const knownPeople = new Set<string>();

  for (const project of scenicProjects) {
    for (const member of project.creativeTeam) {
      knownPeople.add(member.name);
    }
  }

  for (const entry of assistantScenicDesignEntries) {
    knownPeople.add(entry.collaborator);
  }

  const matchedPeople = Array.from(knownPeople).filter((person) => nameMatchesQuery(person, query));
  if (!matchedPeople.length) return null;

  const bestMatch = matchedPeople.sort((a, b) => b.length - a.length)[0];

  const scenicMatches = scenicProjects
    .filter((project) => project.creativeTeam.some((member) => nameMatchesQuery(member.name, bestMatch)))
    .map((project) => ({
      id: `scenic:${project.slug}`,
      title: project.title,
      href: `/project/${project.slug}`,
      kind: "Scenic Project",
      meta: [project.client, project.year].filter(Boolean).join(" • "),
      imageUrl: project.coverImageUrl || undefined,
      reason: `Worked with ${bestMatch} on this production.`,
    }));

  const assistantMatches = assistantScenicDesignEntries
    .filter((entry) => nameMatchesQuery(entry.collaborator, bestMatch))
    .map((entry) => ({
      id: `assistant:${entry.anchorId}`,
      title: entry.title,
      href: `${ASSISTANT_SCENIC_DESIGN_PATH}#${entry.anchorId}`,
      kind: "Assistant Scenic Credit",
      meta: [entry.organization, entry.date.slice(0, 4)].filter(Boolean).join(" • "),
      imageUrl: entry.coverImageUrl || undefined,
      reason: `Assistant scenic collaboration with ${bestMatch}.`,
    }));

  const recommendations = [...scenicMatches, ...assistantMatches].slice(0, 8);
  if (!recommendations.length) return null;

  return {
    person: bestMatch,
    recommendations,
    scenicCount: scenicMatches.length,
    assistantCount: assistantMatches.length,
  };
}

function buildHeuristicFallback(query: string, candidates: SearchCandidate[]): AISiteSearchResponse {
  const normalized = normalizeQuery(query);
  const profileCandidates = candidates.filter((candidate) => candidate.id.startsWith("profile:"));
  const primaryCandidates = profileCandidates.length > 0 ? profileCandidates : candidates;

  const aboutCandidate =
    primaryCandidates.find((candidate) => candidate.id === "profile:about") ||
    primaryCandidates[0] ||
    candidates[0];

  const resumeCandidate = candidates.find((candidate) => candidate.id === "profile:resume");
  const teachingCandidate = candidates.find((candidate) => candidate.id === "profile:teaching");
  const creativeStatementCandidate = candidates.find((candidate) => candidate.id === "profile:statement");
  const collaboratorMatches = findCollaboratorMatches(normalized);

  if (collaboratorMatches) {
    const total = collaboratorMatches.recommendations.length;
    const projectKinds = [
      collaboratorMatches.scenicCount > 0 ? `${collaboratorMatches.scenicCount} scenic project${collaboratorMatches.scenicCount === 1 ? "" : "s"}` : null,
      collaboratorMatches.assistantCount > 0 ? `${collaboratorMatches.assistantCount} assistant scenic credit${collaboratorMatches.assistantCount === 1 ? "" : "s"}` : null,
    ].filter(Boolean) as string[];

    return {
      summary:
        total === 1
          ? `Brandon appears to have worked with ${collaboratorMatches.person} on 1 project currently indexed on the site.`
          : `Brandon appears to have worked with ${collaboratorMatches.person} on ${total} indexed projects and credits across the site.`,
      insight:
        projectKinds.length > 0
          ? `The current site record connects ${collaboratorMatches.person} to ${humanJoin(projectKinds)}.`
          : `The current site record connects ${collaboratorMatches.person} to multiple projects across the portfolio.`,
      connections: uniqueStrings([
        collaboratorMatches.scenicCount > 0 ? `Published scenic portfolio pages document direct creative-team credits with ${collaboratorMatches.person}.` : "",
        collaboratorMatches.assistantCount > 0 ? `Assistant scenic credits also show sustained collaboration with ${collaboratorMatches.person}.` : "",
      ]),
      recommendations: collaboratorMatches.recommendations.slice(0, 6),
      relatedQueries: [
        `What kind of work has Brandon done with ${collaboratorMatches.person}?`,
        `Which theatre companies connect Brandon and ${collaboratorMatches.person}?`,
        `What does Brandon's collaboration style emphasize?`,
      ],
    };
  }

  if (/where\b.*brandon.*from|where.*from\b/.test(normalized)) {
    return {
      summary:
        "Brandon is from Central Missouri. Scenic design emerged there as the place where his interests in drawing, model building, performance, film, and history all met.",
      insight:
        "That background helps explain why the site connects theatre work, teaching, and experiential projects through storytelling rather than treating them as separate tracks.",
      connections: uniqueStrings([
        "His entry point into scenic design came through technical theatre during summer school, not through a single narrow discipline.",
        "The site frames Brandon as an artist first, with technology serving communication and collaboration.",
      ]),
      recommendations: [aboutCandidate, resumeCandidate, creativeStatementCandidate]
        .filter(Boolean)
        .slice(0, 4)
        .map((candidate) => ({
          id: candidate!.id,
          title: candidate!.title,
          href: candidate!.href,
          kind: candidate!.kind,
          meta: candidate!.meta,
          imageUrl: candidate!.imageUrl,
          reason: candidate === aboutCandidate
            ? "Best starting point for Brandon's background, origin, and creative identity."
            : candidate === resumeCandidate
              ? "Useful if you want the broader production and career record after the biography."
              : "Good next step if you want the philosophy and process behind the work.",
        })),
      relatedQueries: [
        "What kind of designer is Brandon?",
        "How does Brandon describe scenic design?",
        "What shaped Brandon's process?",
      ],
    };
  }

  if (/where\b.*brandon.*(based|located)|where.*(based|located)\b|where does brandon live|where is brandon based|where is brandon located/.test(normalized)) {
    return {
      summary:
        "Brandon is based in Orange County, California, with Irvine as his current home base in Southern California.",
      insight:
        "The site distinguishes between Brandon's roots in Central Missouri and his current base in Irvine, which helps frame both the biography and the present-day work.",
      connections: uniqueStrings([
        "Current profile material ties Brandon's present work to Orange County and Southern California.",
        "That location sits alongside a broader practice spanning theatre, teaching, and experiential projects.",
      ]),
      recommendations: [aboutCandidate, resumeCandidate, creativeStatementCandidate]
        .filter(Boolean)
        .slice(0, 4)
        .map((candidate) => ({
          id: candidate!.id,
          title: candidate!.title,
          href: candidate!.href,
          kind: candidate!.kind,
          meta: candidate!.meta,
          imageUrl: candidate!.imageUrl,
          reason:
            candidate === aboutCandidate
              ? "Best starting point for Brandon's current base, background, and overall practice."
              : candidate === resumeCandidate
                ? "Useful if you want the broader professional context around the current body of work."
                : "Good next step if you want the philosophy and process shaping the work from that base.",
        })),
      relatedQueries: [
        "Where is Brandon from?",
        "What kind of designer is Brandon?",
        "How does Brandon's theatre work connect to experiential work?",
      ],
    };
  }

  if (/what kind of designer|who is brandon|tell me about brandon|about brandon|bio(graphy)?/.test(normalized)) {
    return {
      summary:
        "Brandon PT Davis is a scenic designer and educator whose work centers on storytelling through space, with projects spanning theatre, rendering, teaching, and experiential design.",
      insight:
        "The site consistently presents the work as artist-led and collaborative, with rendering, drafting, and model building treated as communication tools rather than the design itself.",
      connections: uniqueStrings([
        "Drama and comedy appear as recurring creative preferences because they allow nuance and time to inhabit a world.",
        "The portfolio links theatre, teaching, and experiential work through the same concern for audience feeling, clarity, and collaboration.",
      ]),
      recommendations: [aboutCandidate, creativeStatementCandidate, resumeCandidate, teachingCandidate]
        .filter(Boolean)
        .slice(0, 4)
        .map((candidate) => ({
          id: candidate!.id,
          title: candidate!.title,
          href: candidate!.href,
          kind: candidate!.kind,
          meta: candidate!.meta,
          imageUrl: candidate!.imageUrl,
          reason:
            candidate === aboutCandidate
              ? "Best overview of Brandon's background and current creative identity."
              : candidate === creativeStatementCandidate
                ? "Best place to understand the process and values shaping the design work."
                : candidate === teachingCandidate
                  ? "Useful for how Brandon translates design ideas into industry-facing education."
                  : "Broadest record of productions, collaborators, and experience.",
        })),
      relatedQueries: [
        "What does Brandon teach?",
        "How does Brandon start a design?",
        "What connects theatre and experiential work here?",
      ],
    };
  }

  if (/teach|teaching|student|education|classroom/.test(normalized)) {
    return {
      summary:
        "Brandon's teaching emphasizes connecting ideas to real production workflows, especially documentation, communication, and portfolio development.",
      insight:
        "The site treats education as professional preparation, not just concept generation, which is why documentation and follow-through show up so often in the teaching material.",
      connections: uniqueStrings([
        "Students are pushed to communicate clearly and connect creative ideas to the needs of a larger team.",
        "Industry-relevant workflows, communication, and portfolio development are core teaching priorities.",
      ]),
      recommendations: [teachingCandidate, aboutCandidate, resumeCandidate]
        .filter(Boolean)
        .slice(0, 4)
        .map((candidate) => ({
          id: candidate!.id,
          title: candidate!.title,
          href: candidate!.href,
          kind: candidate!.kind,
          meta: candidate!.meta,
          imageUrl: candidate!.imageUrl,
          reason:
            candidate === teachingCandidate
              ? "Most direct page for Brandon's teaching philosophy and classroom priorities."
              : candidate === aboutCandidate
                ? "Adds personal context around mentorship and the broader practice."
                : "Shows the professional frame students are being prepared to enter.",
        })),
      relatedQueries: [
        "What does Brandon think students misunderstand?",
        "What tools does Brandon teach?",
        "How does teaching connect to professional practice?",
      ],
    };
  }

  if (/tool|software|vectorworks|render|draft|model/.test(normalized)) {
    return {
      summary:
        "Brandon's tool philosophy is to master a few tools deeply and use them to communicate clearly with collaborators rather than treating technology as the design itself.",
      insight:
        "Across the site, rendering, drafting, and model building are framed as ways to translate an idea for a team, not as substitutes for design thinking.",
      connections: uniqueStrings([
        "Tool choice is valued for longevity and team readability, not novelty.",
        "Rendering is treated as a communication tool rather than the design itself.",
      ]),
      recommendations: [creativeStatementCandidate, teachingCandidate, aboutCandidate, ...candidates]
        .filter(Boolean)
        .slice(0, 4)
        .map((candidate) => ({
          id: candidate!.id,
          title: candidate!.title,
          href: candidate!.href,
          kind: candidate!.kind,
          meta: candidate!.meta,
          imageUrl: candidate!.imageUrl,
          reason: candidate!.description,
        })),
      relatedQueries: [
        "How does Brandon use rendering?",
        "What tools does Brandon teach students first?",
        "How does technology fit into Brandon's process?",
      ],
    };
  }

  return {
    summary:
      "Here are the strongest pages connected to that question based on Brandon PT Davis's portfolio, writing, and profile material.",
    insight:
      "The site is broad enough that the best answer often comes from reading a few connected pages together rather than relying on a single result.",
    connections: uniqueStrings([
      "Profile pages explain the perspective behind the work, while portfolio pages show how that perspective plays out in practice.",
    ]),
    recommendations: primaryCandidates.slice(0, 4).map((candidate) => ({
      id: candidate.id,
      title: candidate.title,
      href: candidate.href,
      kind: candidate.kind,
      meta: candidate.meta,
      imageUrl: candidate.imageUrl,
      reason: candidate.description,
    })),
    relatedQueries: [
      "What kind of designer is Brandon?",
      "How does Brandon describe the process?",
      "What pages should I start with?",
    ],
  };
}

export async function runAISiteSearch(query: string): Promise<AISiteSearchResponse | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const trimmedQuery = collapseWhitespace(query);
  if (trimmedQuery.length < 3) return null;

  const { candidates } = buildCandidates(trimmedQuery);
  if (!candidates.length) return null;
  const fallback = buildHeuristicFallback(trimmedQuery, candidates);

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_SEARCH_MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a concise site-search assistant for Brandon PT Davis. Ground every answer in the supplied candidate pages only.",
          },
          {
            role: "user",
            content: buildPrompt(trimmedQuery, candidates),
          },
        ],
      }),
    });
  } catch {
    return fallback;
  }

  if (!response.ok) {
    return fallback;
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  const parsed = parseJSON(content);

  if (!parsed || typeof parsed.summary !== "string") {
    return fallback;
  }

  const recommendations = Array.isArray(parsed.recommendations)
    ? parsed.recommendations
        .map((item: any) => {
          const candidate = candidates.find((candidateItem) => candidateItem.id === item?.id);
          if (!candidate) return null;

          return {
            id: candidate.id,
            title: candidate.title,
            href: candidate.href,
            kind: candidate.kind,
            meta: candidate.meta,
            imageUrl: candidate.imageUrl,
            reason:
              typeof item?.reason === "string" && item.reason.trim()
                ? collapseWhitespace(item.reason)
                : candidate.description,
          };
        })
        .filter(Boolean)
        .slice(0, 4) as AISiteSearchRecommendation[]
    : [];

  const relatedQueries = Array.isArray(parsed.relatedQueries)
    ? parsed.relatedQueries
        .filter((value: unknown): value is string => typeof value === "string")
        .map((value) => collapseWhitespace(value))
        .filter(Boolean)
        .slice(0, 3)
    : [];

  const connections = Array.isArray(parsed.connections)
    ? parsed.connections
        .filter((value: unknown): value is string => typeof value === "string")
        .map((value) => collapseWhitespace(value))
        .filter(Boolean)
        .slice(0, 3)
    : [];

  return {
    summary: collapseWhitespace(parsed.summary),
    insight:
      typeof parsed.insight === "string" && parsed.insight.trim()
        ? collapseWhitespace(parsed.insight)
        : "These results connect the query to portfolio pages, writing, and collaborators already on the site.",
    connections,
    recommendations,
    relatedQueries,
  };
}
