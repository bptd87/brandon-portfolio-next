type PostHogQueryResponse = {
  columns: string[];
  results: Array<Array<string | number | null>>;
};

type QueryCacheEntry = {
  expiresAt: number;
  data: PostHogQueryResponse;
};

const QUERY_CACHE_TTL_MS = 60 * 1000;
const queryCache = new Map<string, QueryCacheEntry>();

function getPostHogApiHost() {
  return (process.env.POSTHOG_API_HOST || "https://us.posthog.com").replace(/\/+$/, "");
}

export function getPostHogProjectId() {
  return process.env.POSTHOG_PROJECT_ID?.trim() || "";
}

export function isPostHogServerConfigured() {
  return Boolean(process.env.POSTHOG_PERSONAL_API_KEY?.trim() && getPostHogProjectId());
}

export async function runPostHogQuery(query: string): Promise<PostHogQueryResponse> {
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY?.trim();
  const projectId = getPostHogProjectId();

  if (!apiKey || !projectId) {
    throw new Error("PostHog is not configured on the server.");
  }

  const cacheKey = `${projectId}:${query}`;
  const cached = queryCache.get(cacheKey);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const response = await fetch(`${getPostHogApiHost()}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {
        kind: "HogQLQuery",
        query,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`PostHog query failed (${response.status}): ${detail}`);
  }

  const data = (await response.json()) as PostHogQueryResponse & { error?: string | null };
  if (data.error) {
    throw new Error(data.error);
  }

  const normalized: PostHogQueryResponse = {
    columns: data.columns || [],
    results: Array.isArray(data.results) ? data.results : [],
  };

  queryCache.set(cacheKey, {
    expiresAt: now + QUERY_CACHE_TTL_MS,
    data: normalized,
  });

  return normalized;
}

export function mapPostHogRows<T extends Record<string, string | number | null>>(
  data: PostHogQueryResponse
) {
  return data.results.map((row) =>
    data.columns.reduce((acc, column, index) => {
      acc[column] = row[index] ?? null;
      return acc;
    }, {} as Record<string, string | number | null>) as T
  );
}
