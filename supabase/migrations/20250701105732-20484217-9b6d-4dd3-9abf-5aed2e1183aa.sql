
-- Add onboarding status and CRM interest fields to host_waitlist
ALTER TABLE public.host_waitlist 
ADD COLUMN crm_provider TEXT,
ADD COLUMN onboarding_status TEXT DEFAULT 'pending' CHECK (onboarding_status IN ('pending', 'approved', 'rejected', 'onboarding', 'completed')),
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN approved_by UUID REFERENCES public.profiles(id),
ADD COLUMN rejection_reason TEXT,
ADD COLUMN onboarding_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN notes TEXT;

-- Create onboarding_steps table to track progress
CREATE TABLE public.onboarding_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_waitlist_id UUID NOT NULL REFERENCES public.host_waitlist(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  step_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(host_waitlist_id, step_name)
);

-- Create host_applications table for approved hosts
CREATE TABLE public.host_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_waitlist_id UUID NOT NULL REFERENCES public.host_waitlist(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')),
  crm_integration_id UUID REFERENCES public.crm_integrations(id),
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(host_waitlist_id)
);

-- Enable RLS on new tables
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for onboarding_steps
CREATE POLICY "Users can view their own onboarding steps" 
  ON public.onboarding_steps 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.host_waitlist hw 
      JOIN public.host_applications ha ON ha.host_waitlist_id = hw.id
      WHERE hw.id = onboarding_steps.host_waitlist_id 
      AND ha.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own onboarding steps" 
  ON public.onboarding_steps 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.host_waitlist hw 
      JOIN public.host_applications ha ON ha.host_waitlist_id = hw.id
      WHERE hw.id = onboarding_steps.host_waitlist_id 
      AND ha.user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage onboarding steps" 
  ON public.onboarding_steps 
  FOR ALL 
  USING (true);

-- RLS Policies for host_applications
CREATE POLICY "Users can view their own applications" 
  ON public.host_applications 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own applications" 
  ON public.host_applications 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "System can manage applications" 
  ON public.host_applications 
  FOR ALL 
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_host_waitlist_status ON public.host_waitlist(onboarding_status);
CREATE INDEX idx_host_waitlist_created ON public.host_waitlist(created_at);
CREATE INDEX idx_onboarding_steps_waitlist ON public.onboarding_steps(host_waitlist_id);
CREATE INDEX idx_onboarding_steps_order ON public.onboarding_steps(step_order);
CREATE INDEX idx_host_applications_user ON public.host_applications(user_id);
CREATE INDEX idx_host_applications_status ON public.host_applications(application_status);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_onboarding_steps_updated_at 
  BEFORE UPDATE ON public.onboarding_steps 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_host_applications_updated_at 
  BEFORE UPDATE ON public.host_applications 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to initialize onboarding steps
CREATE OR REPLACE FUNCTION public.initialize_host_onboarding(waitlist_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert default onboarding steps
  INSERT INTO public.onboarding_steps (host_waitlist_id, step_name, step_order) VALUES
    (waitlist_id, 'profile_setup', 1),
    (waitlist_id, 'identity_verification', 2),
    (waitlist_id, 'crm_integration', 3),
    (waitlist_id, 'pool_listing', 4),
    (waitlist_id, 'payment_setup', 5),
    (waitlist_id, 'final_review', 6);
END;
$$;

-- Create function to get pending host applications for admin
CREATE OR REPLACE FUNCTION public.get_pending_host_applications()
RETURNS TABLE(
  waitlist_id UUID,
  business_name TEXT,
  contact_name TEXT,
  email TEXT,
  location TEXT,
  pool_type TEXT[],
  current_use TEXT[],
  interest_level TEXT[],
  crm_provider TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  onboarding_status TEXT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
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
