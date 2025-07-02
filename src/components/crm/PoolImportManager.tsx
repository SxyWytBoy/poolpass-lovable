
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Download, ExternalLink, Check, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { CrmIntegrationService, ImportedPool, CrmPoolMapping } from '@/services/crm-integration-service';

interface PoolImportManagerProps {
  integrationId: string;
  hostId: string;
  onPoolCreated?: (pool: any) => void;
}

const PoolImportManager: React.FC<PoolImportManagerProps> = ({ 
  integrationId, 
  hostId,
  onPoolCreated 
}) => {
  const { toast } = useToast();
  const [importedPools, setImportedPools] = useState<ImportedPool[]>([]);
  const [poolMappings, setPoolMappings] = useState<CrmPoolMapping[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isCreating, setIsCreating] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPoolMappings();
  }, [integrationId]);

  const loadPoolMappings = async () => {
    try {
      const mappings = await CrmIntegrationService.getPoolMappings(integrationId);
      setPoolMappings(mappings);
    } catch (error) {
      console.error('Error loading pool mappings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportPools = async () => {
    setIsImporting(true);
    
    try {
      const pools = await CrmIntegrationService.importPools(integrationId);
      setImportedPools(pools);
      
      // Reload mappings to show the new imports
      await loadPoolMappings();
      
      toast({
        title: "Pools imported successfully!",
        description: `Found ${pools.length} pool(s) from your CRM system.`,
      });
    } catch (error) {
      console.error('Error importing pools:', error);
      toast({
        title: "Import failed",
        description: "Failed to import pools from your CRM system.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreatePool = async (mappingId: string, importedPool: ImportedPool) => {
    setIsCreating(mappingId);
    
    try {
      const pool = await CrmIntegrationService.createPoolFromImport(
        hostId,
        importedPool,
        mappingId
      );
      
      // Reload mappings to show the updated status
      await loadPoolMappings();
      
      toast({
        title: "Pool created successfully!",
        description: `${importedPool.title} has been added to your PoolPass listings.`,
      });

      if (onPoolCreated) {
        onPoolCreated(pool);
      }
    } catch (error) {
      console.error('Error creating pool:', error);
      toast({
        title: "Pool creation failed",
        description: "Failed to create pool in PoolPass.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Import Pools from CRM
          </CardTitle>
          <CardDescription>
            Import pool and room data from your connected CRM system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleImportPools}
              disabled={isImporting}
              className="flex items-center gap-2"
            >
              {isImporting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isImporting ? "Importing..." : "Import Pools"}
            </Button>
            
            <div className="text-sm text-muted-foreground">
              This will fetch available pools/rooms from your CRM system
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pool Mappings */}
      {poolMappings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Imported Pools</CardTitle>
            <CardDescription>
              Pools imported from your CRM system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {poolMappings.map((mapping) => (
                <div 
                  key={mapping.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{mapping.external_pool_name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {mapping.external_pool_id}
                      </Badge>
                      {mapping.poolpass_pool_id && (
                        <Badge variant="default" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Created
                        </Badge>
                      )}
                    </div>
                    
                    {mapping.mapping_configuration?.original_data && (
                      <div className="text-sm text-muted-foreground">
                        <p>Max guests: {mapping.mapping_configuration.original_data.max_guests}</p>
                        <p>Location: {mapping.mapping_configuration.original_data.location}</p>
                        {mapping.mapping_configuration.original_data.amenities?.length > 0 && (
                          <p>Amenities: {mapping.mapping_configuration.original_data.amenities.join(', ')}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {mapping.poolpass_pool_id ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Navigate to pool edit page
                          window.open(`/pools/${mapping.poolpass_pool_id}`, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Pool
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => {
                          const poolData = mapping.mapping_configuration?.original_data;
                          if (poolData) {
                            handleCreatePool(mapping.id, poolData);
                          }
                        }}
                        disabled={isCreating === mapping.id}
                        size="sm"
                      >
                        {isCreating === mapping.id && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                        Create Pool
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No pools message */}
      {poolMappings.length === 0 && (
        <Alert>
          <AlertDescription>
            No pools have been imported yet. Click "Import Pools" to fetch data from your CRM system.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PoolImportManager;
