-- Fix webhook_events table security vulnerability
-- The current "System can manage webhook events" policy with expression "true" 
-- allows anyone to create, update, and delete webhook events

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "System can manage webhook events" ON public.webhook_events;

-- Create secure policies for webhook events

-- Only service role (edge functions) can create webhook events
CREATE POLICY "Service role can create webhook events" 
ON public.webhook_events 
FOR INSERT 
WITH CHECK (
  -- Only allow inserts from service role (edge functions)
  auth.role() = 'service_role'
);

-- Only service role can update webhook events (e.g., marking as processed)
CREATE POLICY "Service role can update webhook events" 
ON public.webhook_events 
FOR UPDATE 
USING (
  auth.role() = 'service_role'
);

-- Only service role can delete webhook events (for cleanup)
CREATE POLICY "Service role can delete webhook events" 
ON public.webhook_events 
FOR DELETE 
USING (
  auth.role() = 'service_role'
);

-- The existing SELECT policy for hosts remains unchanged:
-- "Hosts can view webhook events for their integrations"