import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { supabase } from "../db";
import { adminProcedure } from "./adminProcedure";
import { fetchAnalyticsOverviewData } from "../admin/fetchAnalyticsOverview";

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
        return await fetchAnalyticsOverviewData();
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
