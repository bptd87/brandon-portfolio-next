import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { supabase } from "../db";

const DAYS_30_MS = 30 * 24 * 60 * 60 * 1000;
const DAYS_14_MS = 14 * 24 * 60 * 60 * 1000;
const DAYS_60_MS = 60 * 24 * 60 * 60 * 1000;

function isMobileUserAgent(userAgent?: string | null) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return ua.includes("mobile") || ua.includes("android") || ua.includes("iphone");
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

      console.log('📡 Analytics IP debug:', {
        ip: ipString,
        hasIpinfoToken: !!process.env.IPINFO_TOKEN,
        cfCity: ctx.req.headers['cf-ipcity'],
        cfRegion: ctx.req.headers['cf-region'],
        cfCountry: ctx.req.headers['cf-ipcountry'],
      });

      let geoData: { city: string | null, region: string | null, country: string | null } = { city: null, region: null, country: null };

      // PRIORITY 1: Use CloudFlare headers if site is behind CloudFlare
      const cfCity = ctx.req.headers['cf-ipcity'];
      const cfCountry = ctx.req.headers['cf-ipcountry'];
      const cfRegion = ctx.req.headers['cf-region'];
      
      if (cfCity && cfCountry) {
        // CloudFlare has full geo data
        geoData = {
          city: String(cfCity),
          region: cfRegion ? String(cfRegion) : null,
          country: cfCountry ? String(cfCountry) : null
        };
        console.log('✅ Using CloudFlare geo headers:', geoData);
      } else {
        // PRIORITY 2: Use ipinfo.io for accurate city-level geolocation
        // Free tier has generous limits (50K requests/month = ~1,700/day, enough for most sites)
        if (ipString && ipString !== 'unknown' && ipString !== '127.0.0.1' && ipString !== '::1') {
          try {
            const response = await fetch(`https://ipinfo.io/${ipString}/json?token=${process.env.IPINFO_TOKEN || ''}`, {
              signal: AbortSignal.timeout(2000)
            });
            if (response.ok) {
              const geo = await response.json();
              geoData = {
                city: geo.city || null,
                region: geo.region || null,
                country: geo.country || null
              };
              console.log('✅ Fetched geo data from ipinfo.io:', { ip: ipString, geo: geoData });
            } else {
              console.log('⚠️ ipinfo.io response not ok:', {
                status: response.status,
                statusText: response.statusText,
              });
            }
          } catch (error) {
            // If ipinfo.io fails, just use basic country data from CloudFlare header or fallback
            console.log('⚠️ ipinfo.io lookup failed:', error instanceof Error ? error.message : String(error));
          }
        } else if (ipString === '127.0.0.1' || ipString === '::1') {
          // Local development
          geoData = {
            city: 'Local Dev',
            region: 'Development',
            country: 'Local'
          };
        }
      }

      try {
        // Upsert session
        const { data: existingSession } = await supabase
          .from('analytics_sessions')
          .select('id')
          .eq('session_id', input.sessionId)
          .single();

        if (existingSession) {
          // Update session
          await supabase
            .from('analytics_sessions')
            .update({
              exit_page: input.pagePath,
              page_count: 0, // Will be incremented by trigger or manual update
              updated_at: new Date().toISOString()
            })
            .eq('session_id', input.sessionId);
        } else {
          // Create new session
          await supabase
            .from('analytics_sessions')
            .insert({
              session_id: input.sessionId,
              ip_address: ipString,
              city: geoData.city ?? '',
              region: geoData.region ?? '',
              country: geoData.country ?? '',
              user_agent: input.userAgent,
              entry_page: input.pagePath
            });
        }

        // Track old analytics_visits for backward compat
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

  getOverview: publicProcedure
    .query(async () => {
      const now = Date.now();
      const since30d = new Date(now - DAYS_30_MS).toISOString();
      const since14d = new Date(now - DAYS_14_MS).toISOString();
      const since60d = new Date(now - DAYS_60_MS).toISOString();

      const [
        pageViews30dRes,
        pageViewsPrev30dRes,
        sessions30dRes,
        projectViews30dRes,
        contactEvents30dRes,
        sessionsContactExit30dRes,
        visitsForBreakdownRes,
        sessionsForGeoRes
      ] = await Promise.all([
        supabase.from("analytics_visits").select("*", { count: "exact", head: true }).gte("created_at", since30d),
        supabase.from("analytics_visits").select("*", { count: "exact", head: true }).gte("created_at", since60d).lt("created_at", since30d),
        supabase.from("analytics_sessions").select("*", { count: "exact", head: true }).gte("started_at", since30d),
        supabase.from("analytics_project_views").select("*", { count: "exact", head: true }).gte("viewed_at", since30d),
        supabase.from("analytics_events").select("*", { count: "exact", head: true }).gte("created_at", since30d).ilike("event_type", "%contact%"),
        supabase.from("analytics_sessions").select("*", { count: "exact", head: true }).gte("started_at", since30d).ilike("exit_page", "%contact%"),
        supabase
          .from("analytics_visits")
          .select("page_path, created_at, user_agent")
          .gte("created_at", since30d)
          .order("created_at", { ascending: false })
          .limit(5000),
        supabase
          .from("analytics_sessions")
          .select("city, region, country")
          .gte("started_at", since30d)
          .order("started_at", { ascending: false })
          .limit(3000)
      ]);

      if (visitsForBreakdownRes.error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: visitsForBreakdownRes.error.message });
      }
      if (sessionsForGeoRes.error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: sessionsForGeoRes.error.message });
      }

      const pageViews30d = pageViews30dRes.count || 0;
      const pageViewsPrev30d = pageViewsPrev30dRes.count || 0;
      const sessions30d = sessions30dRes.count || 0;
      const projectViews30d = projectViews30dRes.count || 0;
      const contactIntent30d = (contactEvents30dRes.count || 0) + (sessionsContactExit30dRes.count || 0);

      const pageViewsDeltaPct = pageViewsPrev30d > 0
        ? Math.round(((pageViews30d - pageViewsPrev30d) / pageViewsPrev30d) * 100)
        : pageViews30d > 0
          ? 100
          : 0;

      const visits = visitsForBreakdownRes.data || [];
      const sessionsGeo = sessionsForGeoRes.data || [];

      const dayMap = new Map<string, number>();
      for (let i = 13; i >= 0; i--) {
        const key = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        dayMap.set(key, 0);
      }

      const pageMap = new Map<string, number>();
      const deviceMap = new Map<string, number>();
      deviceMap.set("Desktop", 0);
      deviceMap.set("Mobile", 0);

      visits.forEach((visit: any) => {
        if (visit.created_at && visit.created_at >= since14d) {
          const dayKey = String(visit.created_at).slice(0, 10);
          dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + 1);
        }

        const path = visit.page_path || "/";
        pageMap.set(path, (pageMap.get(path) || 0) + 1);

        const device = isMobileUserAgent(visit.user_agent) ? "Mobile" : "Desktop";
        deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
      });

      const geoMap = new Map<string, number>();
      const cityMap = new Map<string, number>();
      const regionMap = new Map<string, number>();
      const countryMap = new Map<string, number>();
      sessionsGeo.forEach((session: any) => {
        const label = session.city || session.country || "Unknown";
        geoMap.set(label, (geoMap.get(label) || 0) + 1);
        if (session.city) {
          cityMap.set(session.city, (cityMap.get(session.city) || 0) + 1);
        }
        if (session.region) {
          regionMap.set(session.region, (regionMap.get(session.region) || 0) + 1);
        }
        if (session.country) {
          countryMap.set(session.country, (countryMap.get(session.country) || 0) + 1);
        }
      });

      return {
        periodDays: 30,
        pageViews30d,
        pageViewsDeltaPct,
        sessions30d,
        projectViews30d,
        contactIntent30d,
        contactRatePct: sessions30d > 0 ? Math.round((contactIntent30d / sessions30d) * 100) : 0,
        topPages: Array.from(pageMap.entries())
          .map(([path, views]) => ({ path, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 8),
        dailyViews14d: Array.from(dayMap.entries()).map(([date, views]) => ({ date, views })),
        deviceBreakdown: Array.from(deviceMap.entries())
          .map(([name, value]) => ({ name, value }))
          .filter((item) => item.value > 0),
        topLocations: Array.from(geoMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8),
        topCities: Array.from(cityMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 12),
        topRegions: Array.from(regionMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 12),
        topCountries: Array.from(countryMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 12)
      };
    }),

  getStats: publicProcedure
    .query(async ({ ctx }: { ctx: any }) => {
      const { data, error } = await supabase
        .from('analytics_visits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching stats:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      }

      return data || [];
    }),

  getProjectViews: publicProcedure
    .query(async () => {
      const { data, error } = await supabase
        .from('analytics_project_views')
        .select('project_slug, project_title, discipline, subcategory')
        .order('viewed_at', { ascending: false });

      if (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      }

      // Group by project and count
      const projectStats = new Map<string, { title: string, discipline?: string, subcategory?: string, views: number }>();
      
      (data || []).forEach((view: any) => {
        const key = view.project_slug;
        if (projectStats.has(key)) {
          const stat = projectStats.get(key)!;
          stat.views += 1;
        } else {
          projectStats.set(key, {
            title: view.project_title,
            discipline: view.discipline,
            subcategory: view.subcategory,
            views: 1
          });
        }
      });

      return Array.from(projectStats.entries())
        .map(([slug, stat]) => ({ slug, ...stat }))
        .sort((a, b) => b.views - a.views);
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
