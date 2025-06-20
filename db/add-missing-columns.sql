-- Add missing columns to profiles table
-- Run this in your Supabase SQL editor

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add education_level column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'education_level') THEN
        ALTER TABLE public.profiles ADD COLUMN education_level text;
    END IF;

    -- Add experience_level column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'experience_level') THEN
        ALTER TABLE public.profiles ADD COLUMN experience_level text;
    END IF;

    -- Add specialization column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'specialization') THEN
        ALTER TABLE public.profiles ADD COLUMN specialization text;
    END IF;

    -- Add institution column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'institution') THEN
        ALTER TABLE public.profiles ADD COLUMN institution text;
    END IF;

    -- Add graduation_year column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'graduation_year') THEN
        ALTER TABLE public.profiles ADD COLUMN graduation_year integer;
    END IF;

    -- Add availability column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'availability') THEN
        ALTER TABLE public.profiles ADD COLUMN availability text;
    END IF;

    -- Add timezone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'timezone') THEN
        ALTER TABLE public.profiles ADD COLUMN timezone text DEFAULT 'UTC';
    END IF;

    -- Add language column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'language') THEN
        ALTER TABLE public.profiles ADD COLUMN language text DEFAULT 'en';
    END IF;

    -- Add professional_role column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'professional_role') THEN
        ALTER TABLE public.profiles ADD COLUMN professional_role text;
    END IF;

END $$;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position; 