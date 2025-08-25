-- Phase 1: Critical Credential Security Fixes

-- Create encryption functions for CRM credentials
CREATE OR REPLACE FUNCTION public.encrypt_credential(credential_text TEXT, encryption_key TEXT DEFAULT 'poolpass_secret_key_2024')
RETURNS TEXT AS $$
BEGIN
  -- Use pgcrypto for AES encryption
  RETURN encode(encrypt(credential_text::bytea, encryption_key, 'aes'), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.decrypt_credential(encrypted_text TEXT, encryption_key TEXT DEFAULT 'poolpass_secret_key_2024')
RETURNS TEXT AS $$
BEGIN
  -- Use pgcrypto for AES decryption
  RETURN convert_from(decrypt(decode(encrypted_text, 'base64'), encryption_key, 'aes'), 'UTF8');
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL; -- Return NULL for invalid/corrupted data
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update existing database functions to use proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_type, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'guest'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_host_crm_integrations(host_uuid uuid)
RETURNS TABLE(integration_id uuid, provider crm_provider, integration_name text, is_active boolean, last_sync_at timestamp with time zone, sync_frequency_hours integer)
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.get_integrations_due_for_sync()
RETURNS TABLE(integration_id uuid, host_id uuid, provider crm_provider, integration_name text, last_sync_at timestamp with time zone, sync_frequency_hours integer)
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.get_pending_host_applications()
RETURNS TABLE(waitlist_id uuid, business_name text, contact_name text, email text, location text, pool_type text[], current_use text[], interest_level text[], crm_provider text, created_at timestamp with time zone, onboarding_status text)
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    hw.id,
    hw.business_name,
    hw.contact_name,
    hw.email,
    hw.location,
    hw.pool_type,
    hw.current_use,
    hw.interest_level,
    hw.crm_provider,
    hw.created_at,
    hw.onboarding_status
  FROM public.host_waitlist hw
  WHERE hw.onboarding_status = 'pending'
  ORDER BY hw.created_at ASC;
$$;

CREATE OR REPLACE FUNCTION public.update_integration_last_sync(integration_uuid uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.crm_integrations 
  SET 
    last_sync_at = now(),
    updated_at = now()
  WHERE id = integration_uuid;
$$;

-- Phase 4: Tighten public data access - restrict amenities to authenticated users
DROP POLICY IF EXISTS "Anyone can view amenities" ON public.amenities;

CREATE POLICY "Authenticated users can view amenities" 
ON public.amenities 
FOR SELECT 
TO authenticated
USING (true);

-- Require authentication for analytics events
DROP POLICY IF EXISTS "Anyone can create analytics events" ON public.analytics_events;

CREATE POLICY "Authenticated users can create analytics events" 
ON public.analytics_events 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Add audit trail table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  event_type text NOT NULL,
  resource_type text,
  resource_id text,
  details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs"
ON public.security_audit_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

CREATE POLICY "System can create audit logs"
ON public.security_audit_logs
FOR INSERT
WITH CHECK (true);