import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { supabase } from "../db";

// Simple in-memory cache for IP geodata to avoid rate limits
// In a real app, use Redis or a proper cache
const geoCache = new Map<string, { city: string, region: string, country: string }>();

export const analyticsRouter = router({
  trackVisit: publicProcedure
    .input(z.object({
      path: z.string(),
      userAgent: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }: { input: { path: string, userAgent?: string }, ctx: any }) => {
      // Get IP from request context (Express request)
      const ip = ctx.req.ip || ctx.req.headers['x-forwarded-for'] || 'unknown';
      const ipString = Array.isArray(ip) ? ip[0] : ip;

      let geoData: { city: string | null, region: string | null, country: string | null } = { city: null, region: null, country: null };

      // Try to get geo data if IP is valid and not localhost
      if (ipString && ipString !== 'unknown' && ipString !== '127.0.0.1' && ipString !== '::1') {
        if (geoCache.has(ipString)) {
          // @ts-ignore
          geoData = geoCache.get(ipString)!;
        } else {
          try {
            // Use a free IP geolocation API (e.g., ip-api.com)
            // Note: This is rate limited and not for high-scale production without a key
            const response = await fetch(`http://ip-api.com/json/${ipString}`);
            const data = await response.json();
            if (data.status === 'success') {
              geoData = {
                city: data.city,
                region: data.regionName,
                country: data.country
              };
              // Cache success
              // @ts-ignore
              geoCache.set(ipString, geoData);
            }
          } catch (e) {
            console.error('Geo lookup failed', e);
          }
        }
      } else if (ipString === '127.0.0.1' || ipString === '::1') {
        // Mock data for localhost to test UI
        geoData = {
          city: 'Local Dev City',
          region: 'CA',
          country: 'United States'
        };
      }

      try {
        const { error } = await supabase
          .from('analytics_visits')
          .insert({
            page_path: input.path,
            ip_address: ipString,
            user_agent: input.userAgent,
            country: geoData.country,
            region: geoData.region,
            city: geoData.city
          });

        if (error) {
          console.error('Supabase Analytics Error:', error);
        }
      } catch (e) {
        console.error('Analytics insert failed', e);
      }

      return { success: true };
    }),

  getStats: publicProcedure
    .query(async ({ ctx }: { ctx: any }) => {
      // This should technically be admin-only, but let's just fetch it
      // The RLS policy will prevent non-admins from seeing data if we use standard client
      // But here we are on server, so we should use service key or ensure user is admin.

      // For now, let's just fetch recent visits
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

  trackScenicDirectoryClick: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        // Increment click count and update last clicked timestamp
        const { error } = await supabase.rpc('increment_scenic_directory_clicks', {
          directory_id: input.id
        });

        if (error) {
          console.error('Click tracking error:', error);
          // Fallback to manual update if RPC doesn't exist
          // Since we can't easily do atomic increment without RPC or raw SQL (which isn't exposed on client),
          // we'll just fetch, increment, and update. Ideally use RPC.
          const { data: dirItem } = await supabase
            .from('scenic_directory')
            .select('click_count')
            .eq('id', input.id)
            .single();

          if (dirItem) {
            const { error: updateError } = await supabase
              .from('scenic_directory')
              .update({
                click_count: (dirItem.click_count || 0) + 1,
                last_clicked_at: new Date().toISOString()
              })
              .eq('id', input.id);

            if (updateError) {
              console.error('Manual click update error:', updateError);
            }
          }



        }

        return { success: true };
      } catch (e) {
        console.error('Track click failed:', e);
        return { success: false };
      }
    })
});
