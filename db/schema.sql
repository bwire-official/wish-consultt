-- =================================================================
--      WISH CONSULT: COMPLETE DATABASE & AUTOMATION SCRIPT
-- =================================================================
-- This script builds the entire database schema from scratch.
-- It is designed to support students, admins, and a separate affiliate program.
--
-- First, it DROPS all old objects to ensure a clean slate.
-- Then, it BUILDS all new tables and automation.
-- =================================================================

-- -----------------------------------------------------------------
-- Part 1: CLEANUP (Drop old objects if they exist)
-- -----------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS
  public.payout_requests,
  public.referrals,
  public.payments,
  public.announcements,
  public.platform_settings,
  public.feedback,
  public.progress,
  public.segments,
  public.courses,
  public.profiles
CASCADE;

-- -----------------------------------------------------------------
-- Part 2: TABLE CREATION
-- -----------------------------------------------------------------

-- PROFILES: The central table for all users (students, admins, affiliates)
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY, -- Links to auth.users.id
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  username text UNIQUE,
  email text UNIQUE,
  full_name text,
  phone_number text,
  role text NOT NULL DEFAULT 'student', -- 'student', 'admin', or 'affiliate'
  status text NOT NULL DEFAULT 'active', -- 'active', 'suspended'
  onboarding_completed boolean NOT NULL DEFAULT false, -- Track if user completed onboarding
  onboarding_data jsonb, -- Flexible space for onboarding info (preferences, etc.)
  referred_by uuid, -- For students referred by an affiliate
  avatar_url text, -- URL for user's profile picture
  is_premium boolean NOT NULL DEFAULT false, -- Track premium subscription status
  specialization text,
  experience_level text,
  education_level text,
  institution text,
  graduation_year integer,
  availability text,
  timezone text DEFAULT 'UTC',
  language text DEFAULT 'en',
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT profiles_referred_by_fkey FOREIGN KEY (referred_by) REFERENCES public.profiles(id) ON DELETE SET NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
COMMENT ON COLUMN public.profiles.onboarding_data IS 'Stores user preferences and other details from the onboarding flow.';

-- COURSES: Stores the course information.
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  description text,
  category text,
  is_free boolean NOT NULL DEFAULT false
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- SEGMENTS: Individual lessons within a course.
CREATE TABLE public.segments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  video_url text,
  pdf_url text,
  segment_order integer NOT NULL
);
ALTER TABLE public.segments ENABLE ROW LEVEL SECURITY;

-- PROGRESS: Tracks a student's completion of each segment.
CREATE TABLE public.progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  segment_id uuid NOT NULL REFERENCES public.segments(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  is_completed boolean NOT NULL DEFAULT false,
  CONSTRAINT user_segment_unique UNIQUE (user_id, segment_id)
);
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- FEEDBACK: Stores student feedback for each segment.
CREATE TABLE public.feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  segment_id uuid NOT NULL REFERENCES public.segments(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  rating smallint,
  text_feedback text,
  video_feedback_url text,
  status text NOT NULL DEFAULT 'new' -- 'new', 'reviewed', 'flagged'
);
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- PAYMENTS: A log of all successful premium upgrade payments.
CREATE TABLE public.payments (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    amount numeric(10, 2) NOT NULL,
    currency text NOT NULL,
    provider_transaction_id text UNIQUE NOT NULL,
    status text NOT NULL -- e.g., 'completed'
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- REFERRALS: The ledger for every successful, paid affiliate conversion.
CREATE TABLE public.referrals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  commission_amount numeric(10, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending_payout' -- 'pending_payout', 'paid'
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- PAYOUT REQUESTS: Tracks when an affiliate requests to withdraw earnings.
CREATE TABLE public.payout_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  requested_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  amount numeric(10, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'rejected'
  admin_notes text
);
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

-- PLATFORM SETTINGS: A key-value store for admin settings (API keys, etc.).
CREATE TABLE public.platform_settings (
  key text NOT NULL PRIMARY KEY,
  value jsonb,
  description text
);
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.platform_settings IS 'Stores global config like API keys and affiliate program rules.';

-- ANNOUNCEMENTS: For platform-wide announcements (planned feature).
CREATE TABLE public.announcements (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_by uuid NOT NULL REFERENCES public.profiles(id),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    title text NOT NULL,
    content text,
    status text NOT NULL DEFAULT 'draft' -- 'draft', 'published', 'archived'
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create certifications table
CREATE TABLE public.certifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  certification_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create interests table
CREATE TABLE public.interests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  interest_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create learning_goals table
CREATE TABLE public.learning_goals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  goal_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_certifications_profile_id ON public.certifications(profile_id);
CREATE INDEX idx_interests_profile_id ON public.interests(profile_id);
CREATE INDEX idx_learning_goals_profile_id ON public.learning_goals(profile_id);

-- Create RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_goals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow trigger function to insert profiles during user creation
CREATE POLICY "Allow trigger function to insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Certifications policies
CREATE POLICY "Users can view their own certifications" ON public.certifications
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can manage their own certifications" ON public.certifications
  FOR ALL USING (auth.uid() = profile_id);

-- Interests policies
CREATE POLICY "Users can view their own interests" ON public.interests
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can manage their own interests" ON public.interests
  FOR ALL USING (auth.uid() = profile_id);

-- Learning goals policies
CREATE POLICY "Users can view their own learning goals" ON public.learning_goals
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can manage their own learning goals" ON public.learning_goals
  FOR ALL USING (auth.uid() = profile_id);

-- -----------------------------------------------------------------
-- Part 3: AUTOMATION (Smart User Profile Creation)
-- -----------------------------------------------------------------

-- This single function handles all sign-ups. It checks for a 'signup_type'
-- flag to differentiate between a normal user and an affiliate.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_role TEXT;
BEGIN
  -- Check for a specific signup type from metadata.
  -- The affiliate signup form should pass 'affiliate' here.
  IF new.raw_user_meta_data->>'signup_type' = 'affiliate' THEN
    new_role := 'affiliate';
  ELSE
    new_role := 'student';
  END IF;

  -- Insert a new row into the public.profiles table
  INSERT INTO public.profiles (id, email, full_name, username, role, referred_by)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'first_name' || ' ' || new.raw_user_meta_data->>'last_name'),
    new.raw_user_meta_data->>'username',
    new_role,
    (new.raw_user_meta_data->>'referred_by')::uuid
  );
  RETURN new;
END;
$$;

-- This trigger calls the function whenever a new user is created.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
--      END OF SCRIPT
-- ================================================================= 