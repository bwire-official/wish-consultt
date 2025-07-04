-- =====================================================
-- Complete Announcements Table Recreation Script
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. Drop existing table and related objects if they exist
DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
DROP FUNCTION IF EXISTS update_announcements_updated_at();
DROP POLICY IF EXISTS "Admins can manage all announcements" ON public.announcements;
DROP POLICY IF EXISTS "Users can view their announcements" ON public.announcements;
DROP TABLE IF EXISTS public.announcements CASCADE;

-- 2. Create announcements table with proper foreign key relationships
CREATE TABLE public.announcements (
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

-- 3. Add indexes for performance
CREATE INDEX idx_announcements_status ON public.announcements(status);
CREATE INDEX idx_announcements_priority ON public.announcements(priority);
CREATE INDEX idx_announcements_target_audience ON public.announcements(target_audience);
CREATE INDEX idx_announcements_created_by ON public.announcements(created_by);
CREATE INDEX idx_announcements_target_user_id ON public.announcements(target_user_id);
CREATE INDEX idx_announcements_created_at ON public.announcements(created_at DESC);
CREATE INDEX idx_announcements_published_at ON public.announcements(published_at DESC);

-- 4. Enable Row Level Security
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies

-- Policy 1: Admins can manage all announcements
CREATE POLICY "Admins can manage all announcements" ON public.announcements
    FOR ALL 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policy 2: Users can view published announcements targeted to them
CREATE POLICY "Users can view their announcements" ON public.announcements
    FOR SELECT 
    TO authenticated
    USING (
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
            (target_audience = 'admins' AND EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role = 'admin'
            )) OR
            (target_audience = 'user' AND target_user_id = auth.uid())
        )
    );

-- 6. Create function and trigger for automatic updated_at
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

-- 7. Insert some sample data for testing (optional)
-- You can comment this section out if you don't want sample data

INSERT INTO public.announcements (title, content, status, priority, target_audience, created_by) 
VALUES 
    (
        'Welcome to Wish Consult Platform!', 
        'We are excited to announce the launch of our new healthcare e-learning platform. Start your journey today!',
        'published',
        'high',
        'all',
        (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1)
    ),
    (
        'New Course: Advanced Healthcare Analytics', 
        'Our latest course on healthcare analytics is now available. Learn cutting-edge techniques for medical data analysis.',
        'published',
        'medium',
        'students',
        (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1)
    ),
    (
        'Affiliate Program Updates', 
        'Important updates to our affiliate program terms and commission structure. Please review the changes.',
        'draft',
        'medium',
        'affiliates',
        (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1)
    );

-- 8. Grant necessary permissions
GRANT ALL ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
GRANT USAGE, SELECT ON SEQUENCE announcements_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE announcements_id_seq TO service_role;

-- =====================================================
-- Script Complete!
-- Your announcements table is now ready with:
-- ✅ Proper foreign key relationships
-- ✅ Row Level Security policies
-- ✅ Performance indexes
-- ✅ Automatic updated_at timestamps
-- ✅ Sample data for testing
-- ===================================================== 