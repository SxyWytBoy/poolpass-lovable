
import { supabase } from '@/integrations/supabase/client';

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  type: 'host_signup' | 'host_approved' | 'host_rejected' | 'onboarding_reminder';
}

export class NotificationService {
  static async sendHostSignupNotification(hostData: {
    business_name: string;
    contact_name: string;
    email: string;
    location: string;
  }) {
    try {
      // Create notification record
      await supabase
        .from('notifications')
        .insert({
          title: 'New Host Application',
          message: `${hostData.business_name} has signed up to become a host`,
          type: 'host_signup',
          user_id: null, // Admin notification
        });

      // In a real implementation, you would trigger an email here
      console.log('Host signup notification sent for:', hostData.business_name);
      
      return true;
    } catch (error) {
      console.error('Error sending host signup notification:', error);
      throw error;
    }
  }

  static async sendHostApprovalNotification(hostData: {
    business_name: string;
    contact_name: string;
    email: string;
  }) {
    try {
      // In a real implementation, you would send an email to the host
      console.log('Host approval notification sent to:', hostData.email);
      
      return true;
    } catch (error) {
      console.error('Error sending host approval notification:', error);
      throw error;
    }
  }

  static async sendHostRejectionNotification(hostData: {
    business_name: string;
    contact_name: string;
    email: string;
    rejection_reason: string;
  }) {
    try {
      // In a real implementation, you would send an email to the host
      console.log('Host rejection notification sent to:', hostData.email);
      
      return true;
    } catch (error) {
      console.error('Error sending host rejection notification:', error);
      throw error;
    }
  }

  static async sendOnboardingReminderNotification(hostData: {
    business_name: string;
    contact_name: string;
    email: string;
    current_step: string;
  }) {
    try {
      // In a real implementation, you would send a reminder email
      console.log('Onboarding reminder sent to:', hostData.email);
      
      return true;
    } catch (error) {
      console.error('Error sending onboarding reminder:', error);
      throw error;
    }
  }
}
