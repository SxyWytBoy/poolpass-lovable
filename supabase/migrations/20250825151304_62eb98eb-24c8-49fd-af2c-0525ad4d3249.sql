-- Fix profiles table security: Clean up overlapping policies and strengthen protection

-- Drop existing overlapping policies to avoid confusion
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view and update own profile" ON public.profiles;  
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create explicit, secure policies for each operation

-- SELECT: Users can only view their own profile data
CREATE POLICY "Users can view only their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- INSERT: Users can only create their own profile (typically handled by trigger)
CREATE POLICY "Users can create only their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- UPDATE: Users can only update their own profile data
CREATE POLICY "Users can update only their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- DELETE: Users can delete only their own profile
CREATE POLICY "Users can delete only their own profile" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = id);

-- Ensure no anonymous access is possible by not creating any policies for anonymous role
-- This ensures that unauthenticated users cannot access any profile data