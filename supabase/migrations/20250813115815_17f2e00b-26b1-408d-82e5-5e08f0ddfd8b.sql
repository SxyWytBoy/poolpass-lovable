-- Fix security vulnerability: Add RLS policies to incidents table

-- First enable RLS on the incidents table
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Policy for viewing incidents: reporters, pool hosts, and admins can view
CREATE POLICY "Users can view relevant incidents" 
ON public.incidents 
FOR SELECT 
USING (
  -- Incident reporters can view their own reports
  reporter_id = auth.uid()
  OR
  -- Pool hosts can view incidents for bookings at their pools
  EXISTS (
    SELECT 1 FROM public.bookings b 
    JOIN public.pools p ON b.pool_id = p.id 
    WHERE b.id = incidents.booking_id 
    AND p.host_id = auth.uid()
  )
  OR
  -- Admins can view all incidents
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin'
  )
);

-- Policy for creating incidents: authenticated users can create incidents
CREATE POLICY "Users can create incidents" 
ON public.incidents 
FOR INSERT 
WITH CHECK (
  -- Users can only create incidents where they are the reporter
  reporter_id = auth.uid()
);

-- Policy for updating incidents: only admins can update incident status and resolution
CREATE POLICY "Admins can update incidents" 
ON public.incidents 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin'
  )
);

-- Policy for deleting incidents: only admins can delete incidents
CREATE POLICY "Admins can delete incidents" 
ON public.incidents 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin'
  )
);