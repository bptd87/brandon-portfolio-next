-- Create analytics_visits table
CREATE TABLE IF NOT EXISTS public.analytics_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    page_path TEXT NOT NULL,
    ip_address TEXT,
    country TEXT,
    region TEXT,
    city TEXT,
    user_agent TEXT,
    session_id TEXT
);

-- Enable RLS
ALTER TABLE public.analytics_visits ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can view all
-- We cast auth.uid() to text to compare with open_id (varchar)
-- We strictly check open_id avoiding any integer comparison with id
CREATE POLICY "Admins can view all analytics" 
ON public.analytics_visits
FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.open_id = auth.uid()::text 
        AND users.role = 'admin'
    )
);

-- Policy: Anyone can insert (for tracking)
CREATE POLICY "Anyone can record a visit" 
ON public.analytics_visits
FOR INSERT 
TO public 
WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS analytics_visits_created_at_idx ON public.analytics_visits(created_at);
CREATE INDEX IF NOT EXISTS analytics_visits_page_path_idx ON public.analytics_visits(page_path);
