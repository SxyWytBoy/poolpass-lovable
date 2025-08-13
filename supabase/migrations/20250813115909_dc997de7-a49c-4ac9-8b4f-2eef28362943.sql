-- Fix security vulnerability: Add RLS policies to document_uploads table

-- Enable RLS on the document_uploads table
ALTER TABLE public.document_uploads ENABLE ROW LEVEL SECURITY;

-- Policy for viewing document uploads: users can view their own uploads, admins can view all
CREATE POLICY "Users and admins can view document uploads" 
ON public.document_uploads 
FOR SELECT 
USING (
  -- Users can view their own document uploads (via verification_id link)
  EXISTS (
    SELECT 1 FROM public.identity_verifications iv
    WHERE iv.id = document_uploads.verification_id 
    AND iv.user_id = auth.uid()
  )
  OR
  -- Admins can view all document uploads for review purposes
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin'
  )
);

-- Policy for creating document uploads: users can only upload for their own verifications
CREATE POLICY "Users can upload documents for their verifications" 
ON public.document_uploads 
FOR INSERT 
WITH CHECK (
  -- Users can only create uploads for their own verifications
  EXISTS (
    SELECT 1 FROM public.identity_verifications iv
    WHERE iv.id = document_uploads.verification_id 
    AND iv.user_id = auth.uid()
  )
);

-- Policy for updating document uploads: only admins can update
CREATE POLICY "Only admins can update document uploads" 
ON public.document_uploads 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin'
  )
);

-- Policy for deleting document uploads: owners and admins can delete
CREATE POLICY "Owners and admins can delete document uploads" 
ON public.document_uploads 
FOR DELETE 
USING (
  -- Users can delete their own document uploads
  EXISTS (
    SELECT 1 FROM public.identity_verifications iv
    WHERE iv.id = document_uploads.verification_id 
    AND iv.user_id = auth.uid()
  )
  OR
  -- Admins can delete any document upload
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin'
  )
);