import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { supabase } from "../db";
import { adminProcedure } from "./adminProcedure";
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

async function fetchPostHogOverviewData() {
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
    contactEventsRes,
    recentEventsRes,
  ] =
    await Promise.all([
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
          toString(timestamp) as timestamp,
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
    contactEvents: mapPostHogRows<Record<string, string | number | null>>(contactEventsRes).map((row) => ({
      event: String(row.event || ""),
      count: toNumber(row.count),
    })),
    recentEvents: mapPostHogRows<Record<string, string | number | null>>(recentEventsRes).map((row) => ({
      timestamp: String(row.timestamp || ""),
      event: String(row.event || ""),
      path: row.path ? String(row.path) : null,
      projectTitle: row.project_title ? String(row.project_title) : null,
    })),
  };
}

export const analyticsRouter = router({
  trackPageView: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      pagePath: z.string(),
      userAgent: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }: { input: { sessionId: string, pagePath: string, userAgent?: string }, ctx: any }) => {
      const ip = ctx.req.ip || ctx.req.headers['x-forwarded-for'] || ctx.req.headers['x-real-ip'] || 'unknown';
      const ipString = Array.isArray(ip) ? ip[0] : ip;
      const cfCity = ctx.req.headers['cf-ipcity'];
      const cfCountry = ctx.req.headers['cf-ipcountry'];
      const cfRegion = ctx.req.headers['cf-region'];

      // Start with fast edge headers and enrich only when creating a brand new session.
      let geoData: { city: string | null, region: string | null, country: string | null } = {
        city: cfCity ? String(cfCity) : null,
        region: cfRegion ? String(cfRegion) : null,
        country: cfCountry ? String(cfCountry) : null,
      };

      try {
        // Read once to avoid repeated writes to analytics_sessions on every page view.
        const { data: existingSession } = await supabase
          .from('analytics_sessions')
          .select('id, city, region, country')
          .eq('session_id', input.sessionId)
          .maybeSingle();

        if (existingSession) {
          // Keep visit geo consistent even when edge headers are absent.
          geoData = {
            city: geoData.city ?? existingSession.city ?? null,
            region: geoData.region ?? existingSession.region ?? null,
            country: geoData.country ?? existingSession.country ?? null,
          };
        } else {
          // Only do slower IP lookup on first session insert.
          if (!geoData.city && !geoData.country && ipString && ipString !== 'unknown' && ipString !== '127.0.0.1' && ipString !== '::1') {
            try {
              const response = await fetch(`https://ipinfo.io/${ipString}/json?token=${process.env.IPINFO_TOKEN || ''}`, {
                signal: AbortSignal.timeout(2000),
              });
              if (response.ok) {
                const geo = await response.json();
                geoData = {
                  city: geo.city || null,
                  region: geo.region || null,
                  country: geo.country || null,
                };
              }
            } catch {
              // Swallow geolocation errors; analytics should never block page render.
            }
          } else if (ipString === '127.0.0.1' || ipString === '::1') {
            geoData = { city: 'Local Dev', region: 'Development', country: 'Local' };
          }

          await supabase
            .from('analytics_sessions')
            .insert({
              session_id: input.sessionId,
              ip_address: ipString,
              city: geoData.city ?? '',
              region: geoData.region ?? '',
              country: geoData.country ?? '',
              user_agent: input.userAgent,
              entry_page: input.pagePath,
              exit_page: input.pagePath,
            });
        }

        // Keep per-page analytics in analytics_visits (lightweight write path).
        await supabase
          .from('analytics_visits')
          .insert({
            page_path: input.pagePath,
            ip_address: ipString,
            user_agent: input.userAgent,
            country: geoData.country ?? '',
            region: geoData.region,
            city: geoData.city
          });
      } catch (e) {
        console.error('Analytics insert failed', e);
      }

      return { success: true };
    }),

  trackProjectView: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      projectId: z.number().optional(),
      projectSlug: z.string(),
      projectTitle: z.string(),
      discipline: z.string().optional(),
      subcategory: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        await supabase
          .from('analytics_project_views')
          .insert({
            session_id: input.sessionId,
            project_id: input.projectId,
            project_slug: input.projectSlug,
            project_title: input.projectTitle,
            discipline: input.discipline,
            subcategory: input.subcategory
          });
      } catch (e) {
        console.error('Project view tracking failed', e);
      }
      return { success: true };
    }),

  trackEvent: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      eventType: z.string(),
      eventData: z.any().optional(),
      pagePath: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        await supabase
          .from('analytics_events')
          .insert({
            session_id: input.sessionId,
            event_type: input.eventType,
            event_data: input.eventData,
            page_path: input.pagePath
          });
      } catch (e) {
        console.error('Event tracking failed', e);
      }
      return { success: true };
    }),

  getOverview: adminProcedure
    .query(async () => {
      try {
        return await fetchPostHogOverviewData();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to query PostHog analytics.";
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
      }
    }),

  getStats: adminProcedure
    .query(async () => {
      const overview = await fetchPostHogOverviewData();
      return overview.recentEvents || [];
    }),

  getProjectViews: adminProcedure
    .query(async () => {
      const overview = await fetchPostHogOverviewData();
      return overview.topProjects || [];
    }),

  trackScenicDirectoryClick: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const { data: dirItem } = await supabase
          .from('scenic_directory')
          .select('click_count')
          .eq('id', input.id)
          .single();

        if (dirItem) {
          await supabase
            .from('scenic_directory')
            .update({
              click_count: (dirItem.click_count || 0) + 1,
              last_clicked_at: new Date().toISOString()
            })
            .eq('id', input.id);
        }

        return { success: true };
      } catch (e) {
        console.error('Track click failed:', e);
        return { success: false };
      }
    })
});
