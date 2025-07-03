
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Clock, CheckCircle, X, Eye } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SyncConflict {
  id: string;
  type: 'booking_overlap' | 'availability_mismatch' | 'price_difference';
  pool_id: string;
  external_pool_id: string;
  conflict_data: any;
  status: 'pending' | 'resolved' | 'ignored';
  created_at: string;
}

interface ConflictResolutionProps {
  hostId: string;
}

const ConflictResolution: React.FC<ConflictResolutionProps> = ({ hostId }) => {
  const { toast } = useToast();
  const [conflicts, setConflicts] = useState<SyncConflict[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConflicts();
  }, [hostId]);

  const loadConflicts = async () => {
    setIsLoading(true);
    try {
      // Get conflicts for pools owned by this host
      const { data: poolIds } = await supabase
        .from('pools')
        .select('id')
        .eq('host_id', hostId);

      if (!poolIds || poolIds.length === 0) {
        setConflicts([]);
        return;
      }

      // Use type assertion for the new table
      const { data, error } = await (supabase as any)
        .from('sync_conflicts')
        .select('*')
        .in('pool_id', poolIds.map(p => p.id))
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConflicts(data || []);
    } catch (error) {
      console.error('Error loading conflicts:', error);
      toast({
        title: "Error loading conflicts",
        description: "Failed to load sync conflicts.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resolveConflict = async (conflictId: string, resolution: 'resolved' | 'ignored') => {
    try {
      const { error } = await (supabase as any)
        .from('sync_conflicts')
        .update({ 
          status: resolution,
          resolved_at: new Date().toISOString()
        })
        .eq('id', conflictId);

      if (error) throw error;

      setConflicts(prev => 
        prev.map(c => 
          c.id === conflictId 
            ? { ...c, status: resolution }
            : c
        )
      );

      toast({
        title: "Conflict resolved",
        description: `Conflict has been marked as ${resolution}.`,
      });
    } catch (error) {
      console.error('Error resolving conflict:', error);
      toast({
        title: "Error resolving conflict",
        description: "Failed to update conflict status.",
        variant: "destructive",
      });
    }
  };

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'booking_overlap':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'availability_mismatch':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'price_difference':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive">Pending</Badge>;
      case 'resolved':
        return <Badge variant="default">Resolved</Badge>;
      case 'ignored':
        return <Badge variant="secondary">Ignored</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatConflictType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const pendingConflicts = conflicts.filter(c => c.status === 'pending');
  const resolvedConflicts = conflicts.filter(c => c.status !== 'pending');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Conflicts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{pendingConflicts.length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {resolvedConflicts.filter(c => 
                new Date(c.created_at).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Today's resolutions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conflicts</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conflicts.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Conflicts List */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingConflicts.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({resolvedConflicts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingConflicts.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>No pending conflicts</AlertTitle>
              <AlertDescription>
                All sync conflicts have been resolved. Great job!
              </AlertDescription>
            </Alert>
          ) : (
            pendingConflicts.map((conflict) => (
              <Card key={conflict.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getConflictIcon(conflict.type)}
                      <CardTitle className="text-lg">
                        {formatConflictType(conflict.type)}
                      </CardTitle>
                      {getStatusBadge(conflict.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(conflict.created_at).toLocaleString()}
                    </div>
                  </div>
                  <CardDescription>
                    External Pool: {conflict.external_pool_id}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Conflict Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Conflict Details</h4>
                      <pre className="text-sm overflow-auto">
                        {JSON.stringify(conflict.conflict_data, null, 2)}
                      </pre>
                    </div>

                    {/* Resolution Actions */}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => resolveConflict(conflict.id, 'ignored')}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Ignore
                      </Button>
                      <Button
                        onClick={() => resolveConflict(conflict.id, 'resolved')}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Resolved
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {resolvedConflicts.length === 0 ? (
            <Alert>
              <AlertDescription>
                No resolved conflicts yet.
              </AlertDescription>
            </Alert>
          ) : (
            resolvedConflicts.map((conflict) => (
              <Card key={conflict.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getConflictIcon(conflict.type)}
                      <CardTitle className="text-lg">
                        {formatConflictType(conflict.type)}
                      </CardTitle>
                      {getStatusBadge(conflict.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(conflict.created_at).toLocaleString()}
                    </div>
                  </div>
                  <CardDescription>
                    External Pool: {conflict.external_pool_id}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConflictResolution;
