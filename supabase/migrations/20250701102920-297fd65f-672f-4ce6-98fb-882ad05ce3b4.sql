
-- Create enum for CRM providers
CREATE TYPE public.crm_provider AS ENUM ('mews', 'cloudbeds', 'opera', 'protel', 'custom');

-- Create enum for sync status
CREATE TYPE public.sync_status AS ENUM ('success', 'error', 'in_progress', 'pending');

-- Create enum for sync types
CREATE TYPE public.sync_type AS ENUM ('availability', 'pools', 'bookings', 'pricing');

-- Create CRM integrations table
CREATE TABLE public.crm_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider crm_provider NOT NULL,
  integration_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_frequency_hours INTEGER DEFAULT 24,
  webhook_url TEXT,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(host_id, provider, integration_name)
);

-- Create CRM credentials table for secure storage
CREATE TABLE public.crm_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crm_integration_id UUID NOT NULL REFERENCES public.crm_integrations(id) ON DELETE CASCADE,
  credential_type TEXT NOT NULL, -- 'api_key', 'oauth_token', 'basic_auth', etc.
  encrypted_value TEXT NOT NULL, -- PGP encrypted credential data
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(crm_integration_id, credential_type)
);

-- Create availability sync logs table
CREATE TABLE public.availability_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID REFERENCES public.pools(id) ON DELETE CASCADE,
  crm_integration_id UUID NOT NULL REFERENCES public.crm_integrations(id) ON DELETE CASCADE,
  sync_type sync_type NOT NULL,
  status sync_status NOT NULL,
  message TEXT,
  synced_data JSONB,
  sync_started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sync_completed_at TIMESTAMP WITH TIME ZONE,
  error_details JSONB
);

-- Create CRM pool mappings table
CREATE TABLE public.crm_pool_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crm_integration_id UUID NOT NULL REFERENCES public.crm_integrations(id) ON DELETE CASCADE,
  poolpass_pool_id UUID NOT NULL REFERENCES public.pools(id) ON DELETE CASCADE,
  external_pool_id TEXT NOT NULL,
  external_pool_name TEXT,
  mapping_configuration JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(crm_integration_id, external_pool_id),
  UNIQUE(poolpass_pool_id, crm_integration_id)
);

-- Enable Row Level Security
ALTER TABLE public.crm_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_pool_mappings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_integrations
CREATE POLICY "Hosts can manage their own CRM integrations" 
  ON public.crm_integrations 
  FOR ALL 
  USING (host_id = auth.uid());

CREATE POLICY "Hosts can view their own CRM integrations" 
  ON public.crm_integrations 
  FOR SELECT 
  USING (host_id = auth.uid());

-- RLS Policies for crm_credentials (very restrictive)
CREATE POLICY "Hosts can manage credentials for their integrations" 
  ON public.crm_credentials 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.crm_integrations ci 
      WHERE ci.id = crm_credentials.crm_integration_id 
      AND ci.host_id = auth.uid()
    )
  );

-- RLS Policies for availability_sync_logs
CREATE POLICY "Hosts can view sync logs for their integrations" 
  ON public.availability_sync_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.crm_integrations ci 
      WHERE ci.id = availability_sync_logs.crm_integration_id 
      AND ci.host_id = auth.uid()
    )
  );

CREATE POLICY "System can create sync logs" 
  ON public.availability_sync_logs 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update sync logs" 
  ON public.availability_sync_logs 
  FOR UPDATE 
  USING (true);

-- RLS Policies for crm_pool_mappings
CREATE POLICY "Hosts can manage mappings for their integrations" 
  ON public.crm_pool_mappings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.crm_integrations ci 
      WHERE ci.id = crm_pool_mappings.crm_integration_id 
      AND ci.host_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_crm_integrations_host_id ON public.crm_integrations(host_id);
CREATE INDEX idx_crm_integrations_provider ON public.crm_integrations(provider);
CREATE INDEX idx_crm_integrations_active ON public.crm_integrations(is_active) WHERE is_active = true;
CREATE INDEX idx_crm_integrations_sync_due ON public.crm_integrations(last_sync_at, sync_frequency_hours) WHERE is_active = true;

CREATE INDEX idx_crm_credentials_integration ON public.crm_credentials(crm_integration_id);
CREATE INDEX idx_crm_credentials_expires ON public.crm_credentials(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX idx_sync_logs_integration ON public.availability_sync_logs(crm_integration_id);
CREATE INDEX idx_sync_logs_pool ON public.availability_sync_logs(pool_id);
CREATE INDEX idx_sync_logs_status ON public.availability_sync_logs(status);
CREATE INDEX idx_sync_logs_created ON public.availability_sync_logs(sync_started_at);

CREATE INDEX idx_pool_mappings_integration ON public.crm_pool_mappings(crm_integration_id);
CREATE INDEX idx_pool_mappings_pool ON public.crm_pool_mappings(poolpass_pool_id);
CREATE INDEX idx_pool_mappings_external ON public.crm_pool_mappings(external_pool_id);
CREATE INDEX idx_pool_mappings_active ON public.crm_pool_mappings(is_active) WHERE is_active = true;

-- Create helper functions
CREATE OR REPLACE FUNCTION public.get_host_crm_integrations(host_uuid UUID)
RETURNS TABLE(
  integration_id UUID,
  provider crm_provider,
  integration_name TEXT,
  is_active BOOLEAN,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_frequency_hours INTEGER
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    id,
    provider,
    integration_name,
    is_active,
    last_sync_at,
    sync_frequency_hours
  FROM public.crm_integrations 
  WHERE host_id = host_uuid AND is_active = true;
$$;

CREATE OR REPLACE FUNCTION public.update_integration_last_sync(integration_uuid UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.crm_integrations 
  SET 
    last_sync_at = now(),
    updated_at = now()
  WHERE id = integration_uuid;
$$;

CREATE OR REPLACE FUNCTION public.get_integrations_due_for_sync()
RETURNS TABLE(
  integration_id UUID,
  host_id UUID,
  provider crm_provider,
  integration_name TEXT,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_frequency_hours INTEGER
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    id,
    host_id,
    provider,
    integration_name,
    last_sync_at,
    sync_frequency_hours
  FROM public.crm_integrations 
  WHERE is_active = true
  AND (
    last_sync_at IS NULL 
    OR last_sync_at < (now() - INTERVAL '1 hour' * sync_frequency_hours)
  );
$$;

-- Create automatic timestamp update trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_crm_integrations_updated_at 
  BEFORE UPDATE ON public.crm_integrations 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_credentials_updated_at 
  BEFORE UPDATE ON public.crm_credentials 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_pool_mappings_updated_at 
  BEFORE UPDATE ON public.crm_pool_mappings 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
