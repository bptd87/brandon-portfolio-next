-- Analytics Tables Migration
-- Run this in Supabase SQL Editor to enable analytics tracking

-- Table: analytics_sessions (Tracks user sessions)
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id SERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  city TEXT,
  region TEXT,
  country TEXT,
  user_agent TEXT,
  entry_page TEXT,
  exit_page TEXT,
  page_count INTEGER DEFAULT 1,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: analytics_visits - Individual page views (legacy compat)
CREATE TABLE IF NOT EXISTS analytics_visits (
  id SERIAL PRIMARY KEY,
  page_path TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: analytics_project_views - Track which projects are viewed
CREATE TABLE IF NOT EXISTS analytics_project_views (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  project_id INTEGER,
  project_slug TEXT NOT NULL,
  project_title TEXT,
  discipline TEXT,
  subcategory TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: analytics_events - Custom event tracking
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  page_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_started_at ON analytics_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_visits_created_at ON analytics_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_project_views_slug ON analytics_project_views(project_slug);
CREATE INDEX IF NOT EXISTS idx_analytics_project_views_viewed_at ON analytics_project_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- Enable Row Level Security (optional - these are server-side only)
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_project_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role has full access to analytics_sessions" ON analytics_sessions
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to analytics_visits" ON analytics_visits
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to analytics_project_views" ON analytics_project_views
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to analytics_events" ON analytics_events
  FOR ALL USING (auth.role() = 'service_role');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Analytics tables created successfully!';
END $$;
