-- ============================================================================
-- CRITICAL FIX: Enable RLS Policies for calls table
-- Run this IMMEDIATELY in Supabase SQL Editor
-- ============================================================================

-- First, check if calls table has RLS enabled
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view all calls (they can see all calls)
DROP POLICY IF EXISTS "Users can view all calls" ON calls;
CREATE POLICY "Users can view all calls" 
ON calls FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to insert calls (for webhooks)
DROP POLICY IF EXISTS "Users can create calls" ON calls;
CREATE POLICY "Users can create calls" 
ON calls FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users to update calls
DROP POLICY IF EXISTS "Users can update calls" ON calls;
CREATE POLICY "Users can update calls" 
ON calls FOR UPDATE 
TO authenticated 
USING (true);

-- Same for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles" 
ON profiles FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Same for integrations table
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all integrations" ON integrations;
CREATE POLICY "Users can view all integrations" 
ON integrations FOR SELECT 
TO authenticated 
USING (true);

-- ============================================================================
-- This will allow your logged-in users to access the data
-- ============================================================================
