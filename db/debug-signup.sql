-- Debug script to identify signup issues
-- Run this in your Supabase SQL editor

-- 1. Check if the profiles table exists and has the right structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Check if the trigger function exists
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 3. Check if the trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 4. Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- 5. Check if there are any existing users in auth.users
SELECT COUNT(*) as auth_users_count FROM auth.users;

-- 6. Check if there are any existing profiles
SELECT COUNT(*) as profiles_count FROM public.profiles;

-- 7. Test the trigger function manually (this will help identify the issue)
-- First, let's see what happens when we try to insert a test user
-- (This is just for debugging, we'll delete it after)

-- Create a test user in auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"first_name": "Test", "last_name": "User"}'::jsonb
);

-- Check if the trigger created a profile
SELECT * FROM public.profiles WHERE email = 'test@example.com';

-- Clean up the test user
DELETE FROM auth.users WHERE email = 'test@example.com';
DELETE FROM public.profiles WHERE email = 'test@example.com'; 