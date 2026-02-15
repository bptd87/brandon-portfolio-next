import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { supabase } from "../db";

// Simple in-memory cache for IP geodata to avoid rate limits
// In a real app, use Redis or a proper cache
const geoCache = new Map<string, { city: string, region: string, country: string }>();

export const analyticsRouter = router({
  trackPageView: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      pagePath: z.string(),
      userAgent: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }: { input: { sessionId: string, pagePath: string, userAgent?: string }, ctx: any }) => {
      const ip = ctx.req.ip || ctx.req.headers['x-forwarded-for'] || 'unknown';
      const ipString = Array.isArray(ip) ? ip[0] : ip;

      let geoData: { city: string | null, region: string | null, country: string | null } = { city: null, region: null, country: null };

      // Silent IP-based geolocation (no user permission needed)
      if (ipString && ipString !== 'unknown' && ipString !== '127.0.0.1' && ipString !== '::1') {
        if (geoCache.has(ipString)) {
          // @ts-ignore
          geoData = geoCache.get(ipString)!;
        } else {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const response = await fetch(`https://ipapi.co/${ipString}/json/`, { signal: controller.signal });
            clearTimeout(timeoutId);
            const data = await response.json();
            if (data.city) {
              geoData = {
                city: data.city,
                region: data.region,
                country: data.country_name
              };
              geoCache.set(ipString, geoData);
            }
          } catch (e) {
            console.error('IP geo lookup failed or timed out', e);
          }
        }
      } else if (ipString === '127.0.0.1' || ipString === '::1') {
        geoData = {
          city: 'Local Dev City',
          region: 'Test',
          country: 'Testing'
        };
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
              city: geoData.city,
              region: geoData.region,
              country: geoData.country,
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
            country: geoData.country,
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

  getConversionFunnel: publicProcedure
    .query(async () => {
      // Get all sessions
      const { data: sessions, error } = await supabase
        .from('analytics_sessions')
        .select('session_id, entry_page, exit_page')
        .order('started_at', { ascending: false });

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });

      // Count pages in funnel
      const hasHome = sessions?.filter((s: any) => s.entry_page === '/' || s.entry_page?.includes('home')).length || 0;
      const hasProjects = sessions?.filter((s: any) => s.exit_page?.includes('/projects')).length || 0;
      const hasContact = sessions?.filter((s: any) => s.exit_page?.includes('contact')).length || 0;

      const total = sessions?.length || 1;

      return [
        { name: 'Homepage', count: hasHome, percentage: Math.round((hasHome / total) * 100) },
        { name: 'Projects View', count: hasProjects, percentage: Math.round((hasProjects / total) * 100) },
        { name: 'Contact Page', count: hasContact, percentage: Math.round((hasContact / total) * 100) }
      ];
    }),

  getGeographicBreakdown: publicProcedure
    .query(async () => {
      const { data } = await supabase
        .from('analytics_sessions')
        .select('city, region, country')
        .order('started_at', { ascending: false });

      if (!data) return [];

      const geoStats = new Map<string, { city?: string, region?: string, country?: string, count: number }>();

      (data as any[]).forEach((session) => {
        const key = session.city || session.country || 'Unknown';
        if (geoStats.has(key)) {
          const stat = geoStats.get(key)!;
          stat.count += 1;
        } else {
          geoStats.set(key, {
            city: session.city,
            region: session.region,
            country: session.country,
            count: 1
          });
        }
      });

      return Array.from(geoStats.entries())
        .map(([label, stat]) => ({ label, ...stat }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
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
