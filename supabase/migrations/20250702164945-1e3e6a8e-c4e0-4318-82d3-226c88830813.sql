
-- Create enum for CRM providers
CREATE TYPE crm_provider AS ENUM ('mews', 'cloudbeds', 'opera', 'protel', 'custom');

-- Update crm_integrations table to use enum
ALTER TABLE public.crm_integrations ALTER COLUMN provider TYPE crm_provider USING provider::crm_provider;

-- Create crm_credentials table for secure storage
CREATE TABLE public.crm_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crm_integration_id UUID NOT NULL REFERENCES public.crm_integrations(id) ON DELETE CASCADE,
  credential_type TEXT NOT NULL, -- 'api_key', 'oauth_token', 'refresh_token', etc.
  encrypted_value TEXT NOT NULL, -- TODO: Implement proper encryption
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(crm_integration_id, credential_type)
);

-- Create crm_pool_mappings table for room type to pool mapping
CREATE TABLE public.crm_pool_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crm_integration_id UUID NOT NULL REFERENCES public.crm_integrations(id) ON DELETE CASCADE,
  external_pool_id TEXT NOT NULL, -- Room/Pool ID from CRM system
  external_pool_name TEXT,
  poolpass_pool_id UUID REFERENCES public.pools(id) ON DELETE SET NULL,
  mapping_configuration JSONB DEFAULT '{}', -- Store mapping rules and settings
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(crm_integration_id, external_pool_id)
);

-- Create enum for sync types and statuses
CREATE TYPE sync_type AS ENUM ('availability', 'pools', 'bookings', 'pricing');
CREATE TYPE sync_status AS ENUM ('pending', 'in_progress', 'success', 'error');

-- Update availability_sync_logs table
ALTER TABLE public.availability_sync_logs 
ALTER COLUMN sync_type TYPE sync_type USING sync_type::sync_type,
ALTER COLUMN status TYPE sync_status USING status::sync_status;

-- Enable RLS on new tables
ALTER TABLE public.crm_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_pool_mappings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_credentials
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

-- Add webhook_url column to crm_integrations for webhook-based integrations
ALTER TABLE public.crm_integrations ADD COLUMN webhook_url TEXT;

-- Create indexes for performance
CREATE INDEX idx_crm_credentials_integration ON public.crm_credentials(crm_integration_id);
CREATE INDEX idx_crm_pool_mappings_integration ON public.crm_pool_mappings(crm_integration_id);
CREATE INDEX idx_crm_pool_mappings_external ON public.crm_pool_mappings(external_pool_id);
CREATE INDEX idx_crm_pool_mappings_poolpass ON public.crm_pool_mappings(poolpass_pool_id);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_crm_credentials_updated_at 
  BEFORE UPDATE ON public.crm_credentials 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_pool_mappings_updated_at 
  BEFORE UPDATE ON public.crm_pool_mappings 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get host's CRM integrations with credentials
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

-- Create function to update integration last sync time
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

-- Create function to get integrations due for sync
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
