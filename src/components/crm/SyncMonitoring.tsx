
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Settings,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SyncScheduler } from '@/services/sync-scheduler';
import { WebhookHandler } from '@/services/webhook-handler';

interface SyncStatus {
  integration_id: string;
  integration_name: string;
  provider: string;
  schedules: any[];
  recent_logs: any[];
  webhook_events: any[];
  error_count: number;
  last_successful_sync: string | null;
}

interface SyncMonitoringProps {
  hostId: string;
}

const SyncMonitoring: React.FC<SyncMonitoringProps> = ({ hostId }) => {
  const { toast } = useToast();
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  useEffect(() => {
    loadSyncData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadSyncData, 30000);
    return () => clearInterval(interval);
  }, [hostId]);

  const loadSyncData = async () => {
    setIsLoading(true);
    try {
      // Get all integrations for this host
      const { data: integrations, error: integrationsError } = await supabase
        .from('crm_integrations')
        .select('*')
        .eq('host_id', hostId);

      if (integrationsError) throw integrationsError;

      const statuses: SyncStatus[] = [];

      for (const integration of integrations || []) {
        // Get sync schedules
        const { data: schedules } = await supabase
          .from('sync_schedules')
          .select('*')
          .eq('integration_id', integration.id);

        // Get recent sync logs
        const { data: logs } = await supabase
          .from('availability_sync_logs')
          .select('*')
          .eq('crm_integration_id', integration.id)
          .order('sync_started_at', { ascending: false })
          .limit(10);

        // Get webhook events
        const webhookEvents = await WebhookHandler.getWebhookEvents(integration.id, 10);

        // Calculate error count and last successful sync
        const errorCount = logs?.filter(log => log.status === 'error').length || 0;
        const lastSuccessfulSync = logs?.find(log => log.status === 'success')?.sync_started_at || null;

        statuses.push({
          integration_id: integration.id,
          integration_name: integration.integration_name,
          provider: integration.provider,
          schedules: schedules || [],
          recent_logs: logs || [],
          webhook_events: webhookEvents,
          error_count: errorCount,
          last_successful_sync: lastSuccessfulSync
        });
      }

      setSyncStatuses(statuses);
    } catch (error) {
      console.error('Error loading sync data:', error);
      toast({
        title: "Error loading sync data",
        description: "Failed to load synchronization data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleSync = async (integrationId: string, syncType: string, frequency: string) => {
    try {
      const scheduler = SyncScheduler.getInstance();
      await scheduler.scheduleSync(integrationId, syncType as any, frequency as any);
      
      toast({
        title: "Sync scheduled",
        description: `${syncType} sync has been scheduled to run ${frequency}.`,
      });
      
      await loadSyncData();
    } catch (error) {
      console.error('Error scheduling sync:', error);
      toast({
        title: "Error scheduling sync",
        description: "Failed to schedule the sync.",
        variant: "destructive",
      });
    }
  };

  const unscheduleSync = async (integrationId: string, syncType: string) => {
    try {
      const scheduler = SyncScheduler.getInstance();
      await scheduler.unscheduleSync(integrationId, syncType);
      
      toast({
        title: "Sync unscheduled",
        description: `${syncType} sync has been disabled.`,
      });
      
      await loadSyncData();
    } catch (error) {
      console.error('Error unscheduling sync:', error);
      toast({
        title: "Error unscheduling sync",
        description: "Failed to disable the sync.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getHealthStatus = (status: SyncStatus) => {
    if (status.error_count > 5) return 'critical';
    if (status.error_count > 2) return 'warning';
    if (status.last_successful_sync) {
      const lastSync = new Date(status.last_successful_sync);
      const hoursAgo = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);
      if (hoursAgo > 48) return 'warning';
    }
    return 'healthy';
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-500">Healthy</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-500">Warning</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStatuses.length}</div>
            <p className="text-xs text-muted-foreground">Total integrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Syncs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {syncStatuses.reduce((total, status) => total + status.schedules.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Active schedules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {syncStatuses.reduce((total, status) => total + status.error_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Last 10 syncs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhook Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {syncStatuses.reduce((total, status) => total + status.webhook_events.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Recent events</p>
          </CardContent>
        </Card>
      </div>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Integration Status</CardTitle>
            <Button onClick={loadSyncData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          <CardDescription>Monitor the health and performance of your CRM integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {syncStatuses.map((status) => {
              const health = getHealthStatus(status);
              return (
                <div key={status.integration_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{status.integration_name}</h3>
                      <Badge variant="outline">{status.provider}</Badge>
                      {getHealthBadge(health)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIntegration(
                          selectedIntegration === status.integration_id ? null : status.integration_id
                        )}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {selectedIntegration === status.integration_id ? 'Hide' : 'Configure'}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Schedules</p>
                      <p className="font-medium">{status.schedules.filter(s => s.is_active).length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Successful Sync</p>
                      <p className="font-medium">
                        {status.last_successful_sync 
                          ? new Date(status.last_successful_sync).toLocaleString()
                          : 'Never'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recent Errors</p>
                      <p className="font-medium text-red-600">{status.error_count}</p>
                    </div>
                  </div>

                  {/* Configuration Panel */}
                  {selectedIntegration === status.integration_id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-3">Sync Configuration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['availability', 'pools', 'bookings'].map((syncType) => {
                          const existingSchedule = status.schedules.find(
                            s => s.sync_type === syncType && s.is_active
                          );
                          
                          return (
                            <div key={syncType} className="border rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium capitalize">{syncType}</span>
                                {existingSchedule ? (
                                  <Badge variant="default">
                                    {existingSchedule.frequency}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Disabled</Badge>
                                )}
                              </div>
                              
                              {existingSchedule ? (
                                <div className="space-y-2">
                                  <p className="text-xs text-muted-foreground">
                                    Next run: {new Date(existingSchedule.next_run).toLocaleString()}
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => unscheduleSync(status.integration_id, syncType)}
                                  >
                                    Disable
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => scheduleSync(status.integration_id, syncType, 'hourly')}
                                  >
                                    Hourly
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => scheduleSync(status.integration_id, syncType, 'daily')}
                                  >
                                    Daily
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recent Activity */}
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Recent Activity</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {status.recent_logs.slice(0, 5).map((log, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span className="capitalize">{log.sync_type}</span>
                            {getStatusBadge(log.status)}
                          </div>
                          <span className="text-muted-foreground">
                            {new Date(log.sync_started_at).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      
                      {status.recent_logs.length === 0 && (
                        <p className="text-sm text-muted-foreground">No recent activity</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {syncStatuses.length === 0 && (
              <Alert>
                <AlertDescription>
                  No CRM integrations found. Set up an integration to start monitoring sync activity.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SyncMonitoring;
