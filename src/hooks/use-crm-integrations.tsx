
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { crmApi } from '@/services/crm-api';
import { useToast } from '@/hooks/use-toast';

interface CrmIntegration {
  id: string;
  provider: string;
  integration_name: string;
  is_active: boolean;
  last_sync_at: string | null;
  created_at: string;
  configuration: any;
}

export const useCrmIntegrations = (hostId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch host's CRM integrations
  const { data: integrations = [], isLoading, error, refetch } = useQuery({
    queryKey: ['crm-integrations', hostId],
    queryFn: async () => {
      const response = await crmApi.getHostIntegrations(hostId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch integrations');
      }
      return response.data;
    },
    enabled: !!hostId
  });

  // Create new integration mutation
  const createIntegrationMutation = useMutation({
    mutationFn: async ({
      provider,
      integrationName,
      credentials,
      configuration
    }: {
      provider: string;
      integrationName: string;
      credentials: { [key: string]: string };
      configuration: any;
    }) => {
      const response = await crmApi.createIntegration(
        hostId,
        provider as any,
        integrationName,
        credentials,
        configuration
      );
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create integration');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-integrations', hostId] });
      toast({
        title: "Integration created",
        description: "Your CRM integration has been set up successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Integration failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Toggle integration active status
  const toggleIntegrationMutation = useMutation({
    mutationFn: async ({ integrationId, isActive }: { integrationId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('crm_integrations')
        .update({ is_active: isActive })
        .eq('id', integrationId)
        .eq('host_id', hostId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-integrations', hostId] });
      toast({
        title: "Integration updated",
        description: "Integration status has been changed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete integration
  const deleteIntegrationMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      const { error } = await supabase
        .from('crm_integrations')
        .delete()
        .eq('id', integrationId)
        .eq('host_id', hostId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-integrations', hostId] });
      toast({
        title: "Integration deleted",
        description: "The integration has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Trigger sync
  const triggerSyncMutation = useMutation({
    mutationFn: async ({ 
      integrationId, 
      syncType 
    }: { 
      integrationId: string; 
      syncType: 'availability' | 'pools' | 'bookings' | 'pricing' 
    }) => {
      const response = await crmApi.triggerSync(integrationId, syncType);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to trigger sync');
      }
      
      return response.data;
    },
    onSuccess: (_, { syncType }) => {
      toast({
        title: "Sync started",
        description: `${syncType.charAt(0).toUpperCase() + syncType.slice(1)} sync has been triggered.`,
      });
      // Refresh integrations to show updated sync status
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['crm-integrations', hostId] });
      }, 1000);
    },
    onError: (error: Error) => {
      toast({
        title: "Sync failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const activeIntegrations = integrations.filter((integration: CrmIntegration) => integration.is_active);

  return {
    // Data
    integrations,
    activeIntegrations,
    isLoading,
    error,
    
    // Actions
    createIntegration: createIntegrationMutation.mutate,
    toggleIntegration: toggleIntegrationMutation.mutate,
    deleteIntegration: deleteIntegrationMutation.mutate,
    triggerSync: triggerSyncMutation.mutate,
    refetch,
    
    // Loading states
    isCreating: createIntegrationMutation.isPending,
    isToggling: toggleIntegrationMutation.isPending,
    isDeleting: deleteIntegrationMutation.isPending,
    isSyncing: triggerSyncMutation.isPending
  };
};
