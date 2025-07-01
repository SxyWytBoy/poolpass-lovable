
import { supabase } from '@/integrations/supabase/client';

export interface OnboardingStep {
  id: string;
  host_waitlist_id: string;
  step_name: string;
  step_order: number;
  is_completed: boolean;
  completed_at?: string;
  step_data: any;
}

export interface HostApplication {
  id: string;
  host_waitlist_id: string;
  user_id?: string;
  application_status: 'pending' | 'approved' | 'rejected';
  crm_integration_id?: string;
  onboarding_completed: boolean;
}

export class OnboardingService {
  static async approveHostApplication(waitlistId: string, userId: string) {
    try {
      // Update the waitlist status
      const { error: waitlistError } = await supabase
        .from('host_waitlist')
        .update({
          onboarding_status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', waitlistId);

      if (waitlistError) throw waitlistError;

      // Create host application record
      const { data: application, error: appError } = await supabase
        .from('host_applications')
        .insert({
          host_waitlist_id: waitlistId,
          user_id: userId,
          application_status: 'approved'
        })
        .select()
        .single();

      if (appError) throw appError;

      // Initialize onboarding steps
      const { error: initError } = await supabase.rpc('initialize_host_onboarding', {
        waitlist_id: waitlistId
      });

      if (initError) throw initError;

      return application;
    } catch (error) {
      console.error('Error approving host application:', error);
      throw error;
    }
  }

  static async getOnboardingProgress(waitlistId: string) {
    try {
      const { data, error } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('host_waitlist_id', waitlistId)
        .order('step_order');

      if (error) throw error;
      return data as OnboardingStep[];
    } catch (error) {
      console.error('Error getting onboarding progress:', error);
      throw error;
    }
  }

  static async completeOnboardingStep(stepId: string, stepData?: any) {
    try {
      const { error } = await supabase
        .from('onboarding_steps')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          step_data: stepData || {}
        })
        .eq('id', stepId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error completing onboarding step:', error);
      throw error;
    }
  }

  static async getPendingApplications() {
    try {
      const { data, error } = await supabase.rpc('get_pending_host_applications');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting pending applications:', error);
      throw error;
    }
  }

  static async rejectHostApplication(waitlistId: string, reason: string) {
    try {
      const { error } = await supabase
        .from('host_waitlist')
        .update({
          onboarding_status: 'rejected',
          rejection_reason: reason,
          approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', waitlistId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error rejecting host application:', error);
      throw error;
    }
  }
}
