import {
  getPostHogProjectId,
  isPostHogServerConfigured,
  mapPostHogRows,
  runPostHogQuery,
} from "../posthog";

function toNumber(value: string | number | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return 0;
}

export async function fetchAnalyticsOverviewData() {
  if (!isPostHogServerConfigured()) {
    return {
      configured: false,
      periodDays: 30,
      projectId: getPostHogProjectId() || null,
      pageViews30d: 0,
      pageViewsDeltaPct: 0,
      visitors30d: 0,
      projectViews30d: 0,
      contactSubmits30d: 0,
      contactConversionPct: 0,
      dailyViews14d: [] as Array<{ date: string; views: number }>,
      topPages: [] as Array<{ path: string; views: number; visitors: number }>,
      topProjects: [] as Array<{ slug: string; title: string; views: number }>,
      topReferrers: [] as Array<{ source: string; views: number; visitors: number }>,
      deviceBreakdown: [] as Array<{ device: string; views: number }>,
      browserBreakdown: [] as Array<{ browser: string; views: number }>,
      countryBreakdown: [] as Array<{ country: string; views: number }>,
      recentCities: [] as Array<{
        timestamp: string;
        city: string;
        region: string;
        country: string;
        path: string;
      }>,
      contactEvents: [] as Array<{ event: string; count: number }>,
      recentEvents: [] as Array<{
        timestamp: string;
        event: string;
        path: string | null;
        projectTitle: string | null;
      }>,
    };
  }

  const [
    summaryRes,
    dailyViewsRes,
    topPagesRes,
    topProjectsRes,
    topReferrersRes,
    deviceBreakdownRes,
    browserBreakdownRes,
    countryBreakdownRes,
    recentCitiesRes,
    contactEventsRes,
    recentEventsRes,
  ] = await Promise.all([
    runPostHogQuery(`
      select
        (select count() from events where event = '$pageview' and timestamp > now() - interval 30 day) as pageviews_30d,
        (select uniq(distinct_id) from events where event = '$pageview' and timestamp > now() - interval 30 day) as visitors_30d,
        (select count() from events where event = 'project_viewed' and timestamp > now() - interval 30 day) as project_views_30d,
        (select count() from events where event = 'contact_form_submit_succeeded' and timestamp > now() - interval 30 day) as contact_submits_30d,
        (select count() from events where event = '$pageview' and timestamp <= now() - interval 30 day and timestamp > now() - interval 60 day) as pageviews_prev_30d
    `),
    runPostHogQuery(`
      select
        toString(toDate(timestamp)) as date,
        count() as views
      from events
      where event = '$pageview' and timestamp > now() - interval 14 day
      group by date
      order by date asc
    `),
    runPostHogQuery(`
      select
        coalesce(nullIf(properties.pathname, ''), '/') as path,
        count() as views,
        uniq(distinct_id) as visitors
      from events
      where event = '$pageview' and timestamp > now() - interval 30 day
      group by path
      order by views desc
      limit 12
    `),
    runPostHogQuery(`
      select
        coalesce(nullIf(properties.project_slug, ''), 'unknown') as slug,
        coalesce(nullIf(properties.project_title, ''), 'Untitled project') as title,
        count() as views
      from events
      where event = 'project_viewed' and timestamp > now() - interval 30 day
      group by slug, title
      order by views desc
      limit 10
    `),
    runPostHogQuery(`
      select
        coalesce(nullIf(properties.$referring_domain, ''), 'Direct / Unknown') as source,
        count() as views,
        uniq(distinct_id) as visitors
      from events
      where event = '$pageview' and timestamp > now() - interval 30 day
      group by source
      order by views desc
      limit 10
    `),
    runPostHogQuery(`
      select
        coalesce(nullIf(properties.$device_type, ''), 'Unknown device') as device,
        count() as views
      from events
      where event = '$pageview' and timestamp > now() - interval 30 day
      group by device
      order by views desc
      limit 10
    `),
    runPostHogQuery(`
      select
        coalesce(nullIf(properties.$browser, ''), 'Unknown browser') as browser,
        count() as views
      from events
      where event = '$pageview' and timestamp > now() - interval 30 day
      group by browser
      order by views desc
      limit 10
    `),
    runPostHogQuery(`
      select
        coalesce(nullIf(properties.$geoip_country_name, ''), 'Unknown country') as country,
        count() as views
      from events
      where event = '$pageview' and timestamp > now() - interval 30 day
      group by country
      order by views desc
      limit 10
    `),
    runPostHogQuery(`
      select
        toString(timestamp) as event_timestamp,
        coalesce(nullIf(properties.$geoip_city_name, ''), 'Unknown city') as city,
        coalesce(nullIf(properties.$geoip_subdivision_1_name, ''), 'Unknown region') as region,
        coalesce(nullIf(properties.$geoip_country_name, ''), 'Unknown country') as country,
        coalesce(nullIf(properties.pathname, ''), '/') as path
      from events
      where event = '$pageview' and timestamp > now() - interval 14 day
      order by timestamp desc
      limit 20
    `),
    runPostHogQuery(`
      select
        event,
        count() as count
      from events
      where
        event in (
          'contact_form_submitted',
          'contact_form_submit_succeeded',
          'contact_form_submit_failed'
        )
        and timestamp > now() - interval 30 day
      group by event
      order by count desc
    `),
    runPostHogQuery(`
      select
        toString(timestamp) as event_timestamp,
        event,
        properties.pathname as path,
        properties.project_title as project_title
      from events
      where
        event in (
          '$pageview',
          'project_viewed',
          'contact_form_submitted',
          'contact_form_submit_succeeded',
          'contact_form_submit_failed'
        )
      order by timestamp desc
      limit 50
    `),
  ]);

  const summaryRow = mapPostHogRows<Record<string, string | number | null>>(summaryRes)[0] || {};
  const pageViews30d = toNumber(summaryRow.pageviews_30d);
  const pageViewsPrev30d = toNumber(summaryRow.pageviews_prev_30d);
  const visitors30d = toNumber(summaryRow.visitors_30d);
  const projectViews30d = toNumber(summaryRow.project_views_30d);
  const contactSubmits30d = toNumber(summaryRow.contact_submits_30d);
  const pageViewsDeltaPct =
    pageViewsPrev30d > 0
      ? Math.round(((pageViews30d - pageViewsPrev30d) / pageViewsPrev30d) * 100)
      : pageViews30d > 0
        ? 100
        : 0;

  return {
    configured: true,
    periodDays: 30,
    projectId: getPostHogProjectId(),
    pageViews30d,
    pageViewsDeltaPct,
    visitors30d,
    projectViews30d,
    contactSubmits30d,
    contactConversionPct: visitors30d > 0 ? Math.round((contactSubmits30d / visitors30d) * 100) : 0,
    dailyViews14d: mapPostHogRows<Record<string, string | number | null>>(dailyViewsRes).map((row) => ({
      date: String(row.date || ""),
      views: toNumber(row.views),
    })),
    topPages: mapPostHogRows<Record<string, string | number | null>>(topPagesRes).map((row) => ({
      path: String(row.path || "/"),
      views: toNumber(row.views),
      visitors: toNumber(row.visitors),
    })),
    topProjects: mapPostHogRows<Record<string, string | number | null>>(topProjectsRes).map((row) => ({
      slug: String(row.slug || ""),
      title: String(row.title || "Untitled project"),
      views: toNumber(row.views),
    })),
    topReferrers: mapPostHogRows<Record<string, string | number | null>>(topReferrersRes).map((row) => ({
      source: String(row.source || "Direct / Unknown"),
      views: toNumber(row.views),
      visitors: toNumber(row.visitors),
    })),
    deviceBreakdown: mapPostHogRows<Record<string, string | number | null>>(deviceBreakdownRes).map((row) => ({
      device: String(row.device || "Unknown device"),
      views: toNumber(row.views),
    })),
    browserBreakdown: mapPostHogRows<Record<string, string | number | null>>(browserBreakdownRes).map((row) => ({
      browser: String(row.browser || "Unknown browser"),
      views: toNumber(row.views),
    })),
    countryBreakdown: mapPostHogRows<Record<string, string | number | null>>(countryBreakdownRes).map((row) => ({
      country: String(row.country || "Unknown country"),
      views: toNumber(row.views),
    })),
    recentCities: mapPostHogRows<Record<string, string | number | null>>(recentCitiesRes).map((row) => ({
      timestamp: String(row.event_timestamp || ""),
      city: String(row.city || "Unknown city"),
      region: String(row.region || "Unknown region"),
      country: String(row.country || "Unknown country"),
      path: String(row.path || "/"),
    })),
    contactEvents: mapPostHogRows<Record<string, string | number | null>>(contactEventsRes).map((row) => ({
      event: String(row.event || ""),
      count: toNumber(row.count),
    })),
    recentEvents: mapPostHogRows<Record<string, string | number | null>>(recentEventsRes).map((row) => ({
      timestamp: String(row.event_timestamp || ""),
      event: String(row.event || ""),
      path: row.path ? String(row.path) : null,
      projectTitle: row.project_title ? String(row.project_title) : null,
    })),
  };
}
