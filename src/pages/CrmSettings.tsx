
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CrmIntegration from '@/components/crm/CrmIntegration';
import CrmConnectionForm from '@/components/crm/CrmConnectionForm';
import SyncDashboard from '@/components/crm/SyncDashboard';
import PoolImportManager from '@/components/crm/PoolImportManager';
import { useCrmIntegrations } from '@/hooks/use-crm-integrations';

const CrmSettings = () => {
  const { user } = useAuth();
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const hostId = user?.id || 'current-host-id';
  
  const { integrations, activeIntegrations, refetch } = useCrmIntegrations(hostId);

  const handleConnectionSuccess = (integration: any) => {
    setSelectedIntegration(integration.id);
    refetch();
  };

  const handlePoolCreated = (pool: any) => {
    console.log('Pool created:', pool);
    // Could trigger a notification or navigation here
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-pool-dark mb-2">CRM Integration Settings</h1>
            <p className="text-gray-600">
              Connect your hotel management system to automatically sync pool availability and bookings
            </p>
          </div>

          <Tabs defaultValue="connection" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-lg">
              <TabsTrigger value="connection">Connection</TabsTrigger>
              <TabsTrigger value="import">Import Pools</TabsTrigger>
              <TabsTrigger value="sync">Sync Dashboard</TabsTrigger>
              <TabsTrigger value="webhook">Webhook</TabsTrigger>
            </TabsList>

            <TabsContent value="connection" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CrmConnectionForm 
                  onConnectionSuccess={handleConnectionSuccess}
                  hostId={hostId}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Supported CRM Systems</CardTitle>
                    <CardDescription>
                      We currently support the following hotel management systems
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">M</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Mews</h3>
                        <p className="text-sm text-gray-600">Cloud-based hotel management system</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">C</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Cloudbeds</h3>
                        <p className="text-sm text-gray-600">All-in-one hospitality management suite</p>
                      </div>
                    </div>
                    
                    <div className="p-3 border-2 border-dashed rounded-lg text-center">
                      <p className="text-sm text-gray-500">More integrations coming soon!</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Integrations */}
              {activeIntegrations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Active Integrations</CardTitle>
                    <CardDescription>
                      Your connected CRM systems
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activeIntegrations.map((integration: any) => (
                        <div 
                          key={integration.id} 
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedIntegration === integration.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedIntegration(integration.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{integration.integration_name}</h3>
                              <p className="text-sm text-gray-600 capitalize">
                                {integration.provider} Integration
                              </p>
                            </div>
                            <div className="text-sm text-gray-500">
                              Last sync: {integration.last_sync_at 
                                ? new Date(integration.last_sync_at).toLocaleDateString()
                                : 'Never'
                              }
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="import" className="space-y-6">
              {selectedIntegration ? (
                <PoolImportManager 
                  integrationId={selectedIntegration}
                  hostId={hostId}
                  onPoolCreated={handlePoolCreated}
                />
              ) : activeIntegrations.length > 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Integration</h3>
                    <p className="text-gray-600 mb-4">Choose a CRM integration to import pools from</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No CRM Connected</h3>
                    <p className="text-gray-600 mb-4">Connect your CRM system first to import pools</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="sync" className="space-y-6">
              {activeIntegrations.length > 0 ? (
                <SyncDashboard hostId={hostId} />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No CRM Connected</h3>
                    <p className="text-gray-600 mb-4">Connect your CRM system first to access sync features</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="webhook" className="space-y-6">
              <CrmIntegration />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CrmSettings;
