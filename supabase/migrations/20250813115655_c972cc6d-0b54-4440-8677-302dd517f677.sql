-- Fix security vulnerability: Restrict waitlist table access to admin users only

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view guest waitlist" ON public.guest_waitlist;
DROP POLICY IF EXISTS "Authenticated users can view host waitlist" ON public.host_waitlist;

-- Create new restrictive policies that only allow admin users to view waitlist data
CREATE POLICY "Only admin users can view guest waitlist" 
ON public.guest_waitlist 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin'
  )
);

CREATE POLICY "Only admin users can view host waitlist" 
ON public.host_waitlist 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin'
  )
);

-- Keep the existing INSERT policies unchanged to allow public signups
-- These policies already exist and are secure:
-- - "Anyone can sign up for guest waitlist" on guest_waitlist
-- - "Anyone can sign up for host waitlist" on host_waitlist