-- Create announcements table with proper foreign key relationships
CREATE TABLE IF NOT EXISTS public.announcements (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'affiliates', 'admins', 'user')),
    target_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ,
    views INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_announcements_status ON public.announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_created_by ON public.announcements(created_by);
CREATE INDEX IF NOT EXISTS idx_announcements_target_audience ON public.announcements(target_audience);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at);

-- Enable Row Level Security
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for announcements
-- Admins can do everything
CREATE POLICY "Admins can manage all announcements" ON public.announcements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Users can view published announcements targeted to them
CREATE POLICY "Users can view their announcements" ON public.announcements
    FOR SELECT USING (
        status = 'published' AND (
            target_audience = 'all' OR
            (target_audience = 'students' AND EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role = 'student'
            )) OR
            (target_audience = 'affiliates' AND EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role = 'affiliate'
            )) OR
            (target_audience = 'user' AND target_user_id = auth.uid())
        )
    );

-- Update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_announcements_updated_at(); 