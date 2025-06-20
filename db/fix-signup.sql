-- Quick fix for signup issues
-- Run this in your Supabase SQL editor

-- Temporarily disable RLS on profiles table
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable the trigger function with proper permissions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

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

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Test: Try to sign up a user now
-- If this works, we know the issue was RLS
-- If it still fails, there's a deeper database issue 