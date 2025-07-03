
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, Calendar, Database, Users, AlertTriangle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { crmApi } from '@/services/crm-api';
import SyncMonitoring from './SyncMonitoring';
import ConflictResolution from './ConflictResolution';

interface SyncLog {
  id: string;
  sync_type: 'availability' | 'pools' | 'bookings' | 'pricing';
  status: 'success' | 'error' | 'in_progress' | 'pending';
  message: string | null;
  sync_started_at: string;
  sync_completed_at: string | null;
  crm_integration_id: string;
}

interface CrmIntegration {
  id: string;
  provider: string;
  integration_name: string;
  is_active: boolean;
  last_sync_at: string | null;
  availability_sync_logs: SyncLog[];
}

interface SyncDashboardProps {
  hostId: string;
}

const SyncDashboard: React.FC<SyncDashboardProps> = ({ hostId }) => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<CrmIntegration[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [conflictCount, setConflictCount] = useState(0);

  // Load integrations and sync logs
  useEffect(() => {
    loadData();
    loadConflictCount();
  }, [hostId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await crmApi.getHostIntegrations(hostId);
      if (response.success && response.data) {
        setIntegrations(response.data);
        
        // Flatten all sync logs from all integrations
        const allLogs = response.data.flatMap((integration: CrmIntegration) => 
          integration.availability_sync_logs || []
        );
        
        // Sort by most recent first
        allLogs.sort((a, b) => 
          new Date(b.sync_started_at).getTime() - new Date(a.sync_started_at).getTime()
        );
        
        setSyncLogs(allLogs.slice(0, 10)); // Show last 10 logs
      }
    } catch (error) {
      console.error('Failed to load sync data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load CRM integration data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadConflictCount = async () => {
    try {
      const { data: poolIds } = await supabase
        .from('pools')
        .select('id')
        .eq('host_id', hostId);

      if (poolIds && poolIds.length > 0) {
        const { data: conflicts } = await (supabase as any)
          .from('sync_conflicts')
          .select('id')
          .in('pool_id', poolIds.map(p => p.id))
          .eq('status', 'pending');

        setConflictCount(conflicts?.length || 0);
      }
    } catch (error) {
      console.error('Error loading conflict count:', error);
    }
  };

  const triggerSync = async (syncType: 'availability' | 'pools' | 'bookings') => {
    setIsSyncing(true);
    
    try {
      // Get the first active integration (in a real app, user might select which one)
      const activeIntegration = integrations.find(int => int.is_active);
      
      if (!activeIntegration) {
        toast({
          title: "No active integrations",
          description: "Please set up a CRM integration first.",
          variant: "destructive",
        });
        return;
      }

      const response = await crmApi.triggerSync(activeIntegration.id, syncType);
      
      if (response.success) {
        toast({
          title: "Sync started",
          description: `${syncType.charAt(0).toUpperCase() + syncType.slice(1)} sync has been triggered.`,
        });
        
        // Reload data to show the new sync log
        setTimeout(() => {
          loadData();
        }, 1000);
      } else {
        toast({
          title: "Sync failed",
          description: response.error || "Please try again or contact support.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      case 'in_progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (integrations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No CRM Integrations</h3>
          <p className="text-gray-600 mb-4">Set up your first CRM integration to start syncing data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Integration Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.filter(i => i.is_active).length}</div>
            <p className="text-xs text-muted-foreground">
              of {integrations.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Availability</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => triggerSync('availability')}
              disabled={isSyncing}
              size="sm"
              className="w-full"
            >
              {isSyncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sync Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Pool Details</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => triggerSync('pools')}
              disabled={isSyncing}
              size="sm"
              variant="outline"
              className="w-full"
            >
              {isSyncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sync Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => triggerSync('bookings')}
              disabled={isSyncing}
              size="sm"
              variant="outline"
              className="w-full"
            >
              {isSyncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sync Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Conflicts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{conflictCount}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Active Integrations List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Integrations</CardTitle>
              <CardDescription>
                Your connected CRM systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.filter(i => i.is_active).map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{integration.integration_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {integration.provider}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last sync: {integration.last_sync_at 
                          ? new Date(integration.last_sync_at).toLocaleString()
                          : 'Never'
                        }
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadData()}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <SyncMonitoring hostId={hostId} />
        </TabsContent>

        <TabsContent value="conflicts">
          <ConflictResolution hostId={hostId} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Sync History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Recent Sync Activity
              </CardTitle>
              <CardDescription>
                Recent synchronization activities with your CRM systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncLogs.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No sync activity yet. Use the sync buttons above to start syncing data.
                    </AlertDescription>
                  </Alert>
                ) : (
                  syncLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium capitalize">{log.sync_type}</span>
                          <Badge variant={getStatusBadgeVariant(log.status)}>
                            {log.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.message}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(log.sync_started_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SyncDashboard;
