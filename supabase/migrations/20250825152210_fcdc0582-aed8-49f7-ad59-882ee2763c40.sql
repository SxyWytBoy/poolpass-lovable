-- Phase 1: Critical Credential Security Fixes (Essential Only)

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