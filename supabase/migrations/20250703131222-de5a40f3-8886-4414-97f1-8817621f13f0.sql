
-- Create sync_schedules table for managing scheduled syncs
CREATE TABLE public.sync_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID NOT NULL REFERENCES public.crm_integrations(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('availability', 'pools', 'bookings')),
  frequency TEXT NOT NULL CHECK (frequency IN ('hourly', 'daily', 'weekly')),
  next_run TIMESTAMP WITH TIME ZONE NOT NULL,
  last_run TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  error_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(integration_id, sync_type)
);

-- Create sync_conflicts table for tracking booking conflicts
CREATE TABLE public.sync_conflicts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('booking_overlap', 'availability_mismatch', 'price_difference')),
  pool_id UUID NOT NULL REFERENCES public.pools(id) ON DELETE CASCADE,
  external_pool_id TEXT NOT NULL,
  conflict_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'ignored')),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create webhook_events table for logging webhook events
CREATE TABLE public.webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('mews', 'cloudbeds', 'opera', 'protel', 'custom')),
  event_type TEXT NOT NULL CHECK (event_type IN ('booking_created', 'booking_updated', 'booking_cancelled', 'availability_changed', 'pool_updated')),
  integration_id UUID NOT NULL REFERENCES public.crm_integrations(id) ON DELETE CASCADE,
  external_pool_id TEXT,
  event_data JSONB NOT NULL DEFAULT '{}',
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for sync_schedules
ALTER TABLE public.sync_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hosts can manage their sync schedules" 
  ON public.sync_schedules 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.crm_integrations ci 
    WHERE ci.id = sync_schedules.integration_id AND ci.host_id = auth.uid()
  ));

-- Add RLS policies for sync_conflicts
ALTER TABLE public.sync_conflicts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pool hosts can view conflicts for their pools" 
  ON public.sync_conflicts 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.pools p 
    WHERE p.id = sync_conflicts.pool_id AND p.host_id = auth.uid()
  ));

CREATE POLICY "Pool hosts can update conflicts for their pools" 
  ON public.sync_conflicts 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.pools p 
    WHERE p.id = sync_conflicts.pool_id AND p.host_id = auth.uid()
  ));

CREATE POLICY "System can create conflicts" 
  ON public.sync_conflicts 
  FOR INSERT 
  WITH CHECK (true);

-- Add RLS policies for webhook_events
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hosts can view webhook events for their integrations" 
  ON public.webhook_events 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.crm_integrations ci 
    WHERE ci.id = webhook_events.integration_id AND ci.host_id = auth.uid()
  ));

CREATE POLICY "System can manage webhook events" 
  ON public.webhook_events 
  FOR ALL 
  USING (true);

-- Add updated_at trigger for sync_schedules
CREATE TRIGGER update_sync_schedules_updated_at 
  BEFORE UPDATE ON public.sync_schedules 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();
