# Enhanced Analytics Setup Guide

## Overview

The portfolio now includes enhanced analytics with:
- **Session Tracking**: Track user journeys through the site
- **Project Views**: Monitor which projects users view and engagement
- **Event Tracking**: Log custom events and interactions
- **Conversion Funnels**: Track user path from homepage → projects → contact
- **Geographic Analytics**: View visitor locations

## Database Migration

The new analytics features require a database schema update. You need to run the migration SQL to create the required tables.

### Running the Migration

#### Option 1: Using Supabase Dashboard (Recommended)

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Create a new query
5. Copy the entire contents of [`supabase/migrations/20260215_enhanced_analytics.sql`](./supabase/migrations/20260215_enhanced_analytics.sql)
6. Click **RUN**

#### Option 2: View Migration Script

Run this command to display the migration SQL:

```bash
npm run migrate:show
```

#### Option 3: Supabase CLI (if installed)

```bash
supabase db push
```

## New Tables Created

### `analytics_sessions`
Tracks individual user sessions across the site.

**Fields:**
- `session_id` (TEXT, UNIQUE) - Unique session identifier
- `ip_address` (TEXT) - User's IP address
- `city` (TEXT) - City from IP geolocation
- `region` (TEXT) - Region from IP geolocation
- `country` (TEXT) - Country from IP geolocation
- `user_agent` (TEXT) - Browser/device information
- `entry_page` (TEXT) - First page visited
- `exit_page` (TEXT) - Last page visited
- `page_count` (INT) - Total pages in session
- `event_count` (INT) - Total events in session
- `started_at` (TIMESTAMP) - Session start time
- `ended_at` (TIMESTAMP) - Session end time
- `updated_at` (TIMESTAMP) - Last update time

### `analytics_project_views`
Tracks when users view specific projects.

**Fields:**
- `session_id` (TEXT, FK) - Reference to session
- `project_id` (INT) - Portfolio project ID
- `project_slug` (TEXT) - Project URL slug
- `project_title` (TEXT) - Project title
- `discipline` (TEXT) - Project discipline (scenic, experiential, rendering)
- `subcategory` (TEXT) - Project subcategory
- `time_on_page` (INT) - Seconds spent viewing
- `scrolled` (BOOLEAN) - Whether user scrolled down
- `viewed_at` (TIMESTAMP) - View timestamp

### `analytics_events`
Generic event tracking for custom interactions.

**Fields:**
- `session_id` (TEXT, FK) - Reference to session
- `event_type` (TEXT) - Type of event (contact_click, download, etc)
- `event_data` (JSONB) - Flexible data payload
- `page_path` (TEXT) - Page where event occurred
- `created_at` (TIMESTAMP) - Event timestamp

## Frontend Integration

The analytics are automatically tracked through:

1. **Page Views**: Automatically tracked when users navigate to different pages
2. **Project Views**: Automatically tracked when users visit a project detail page
3. **Events**: Can be triggered manually via `window.analyticsTracker.trackEvent()`

### Using the Analytics API

Access the global analytics tracker in your components:

```typescript
// Track project view
window.analyticsTracker.trackProjectView(
  projectId,
  projectSlug,
  projectTitle,
  discipline,
  subcategory
);

// Track custom event
window.analyticsTracker.trackEvent('event_type', { data: 'value' });

// Get current session ID
const sessionId = window.analyticsTracker.getSessionId();
```

## Admin Dashboard

View analytics at: `/admin/analytics`

The dashboard shows:
- Total visits
- Unique locations
- Top projects by views
- Conversion funnel (Home → Projects → Contact)
- Geographic breakdown by city
- Device breakdown (Mobile vs Desktop)
- Recent activity log

## API Endpoints

New TRPC procedures are available in `server/routers/analytics.ts`:

### Mutations
- `analytics.trackPageView` - Track page navigation
- `analytics.trackProjectView` - Track project views
- `analytics.trackEvent` - Track custom events
- `analytics.trackScenicDirectoryClick` - Track directory clicks

### Queries
- `analytics.getStats` - Get page view statistics
- `analytics.getProjectViews` - Get project view stats
- `analytics.getConversionFunnel` - Get funnel metrics
- `analytics.getGeographicBreakdown` - Get location breakdown

## Privacy Considerations

- **IP-based geolocation**: No explicit user permission is requested. Cities and regions are derived from IP addresses (standard practice like Wix, Squarespace)
- **Session tracking**: Sessions are identified by random IDs, not personally identifiable
- **No cookies**: Uses localStorage for session persistence
- **Data retention**: No explicit data retention policy (purge old sessions as needed)

## Troubleshooting

### I see "No analytics data"

The schema might not have been installed. Check that the migration ran successfully by:

1. Going to Supabase dashboard → SQL Editor
2. Running: `SELECT * FROM analytics_sessions LIMIT 1;`
3. If no results, run the migration SQL

### Project view tracking not working

Check that `AnalyticsTracker.tsx` is rendered in your app layout and that `ProjectDetail.tsx` includes the tracking call.

### Missing location data

Some IPs may fail geolocation lookup (timeout or rate limit). The system handles this gracefully and still logs visits without location data.

## Future Enhancements

- [ ] Session duration analytics
- [ ] Scroll depth tracking
- [ ] Time-on-page heatmaps
- [ ] Funnel abandonment analysis
- [ ] Returning visitor identification
- [ ] A/B testing integration
- [ ] Custom event triggers for CTA buttons
