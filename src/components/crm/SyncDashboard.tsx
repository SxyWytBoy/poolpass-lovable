
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw, Calendar, Database, Users } from "lucide-react";
import { CrmSyncLog } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';

interface SyncDashboardProps {
  hostId: string;
}

const SyncDashboard: React.FC<SyncDashboardProps> = ({ hostId }) => {
  const { toast } = useToast();
  const [syncLogs, setSyncLogs] = useState<CrmSyncLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Mock data - in real implementation, fetch from Supabase
  useEffect(() => {
    const mockLogs: CrmSyncLog[] = [
      {
        id: '1',
        host_id: hostId,
        provider: 'mews',
        sync_type: 'availability',
        status: 'success',
        message: 'Synced 30 days of availability',
        synced_at: new Date().toISOString(),
      },
      {
        id: '2',
        host_id: hostId,
        provider: 'mews',
        sync_type: 'pools',
        status: 'success',
        message: 'Updated pool details',
        synced_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
    setSyncLogs(mockLogs);
  }, [hostId]);

  const triggerSync = async (syncType: 'availability' | 'pools' | 'bookings') => {
    setIsSyncing(true);
    
    try {
      // This would call the actual sync API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
      
      toast({
        title: "Sync completed",
        description: `Successfully synced ${syncType} data.`,
      });
      
      // Refresh sync logs
      // In real implementation, refresh from API
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
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Sync History
          </CardTitle>
          <CardDescription>
            Recent synchronization activities with your CRM system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {syncLogs.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No sync activity yet. Connect your CRM system to start syncing data.
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
                    {new Date(log.synced_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SyncDashboard;
