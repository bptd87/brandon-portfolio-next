-- Create users table for application user data
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "openId" TEXT UNIQUE NOT NULL,
    name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    login_method TEXT,
    last_signed_in TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on openId for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_open_id ON public.users("openId");

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow service role to do anything
CREATE POLICY "Service role can do anything" ON public.users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT
    TO authenticated
    USING (auth.uid()::text = "openId");

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = "openId")
    WITH CHECK (auth.uid()::text = "openId");
