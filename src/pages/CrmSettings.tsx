
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CrmIntegration from '@/components/crm/CrmIntegration';
import CrmConnectionForm from '@/components/crm/CrmConnectionForm';
import SyncDashboard from '@/components/crm/SyncDashboard';
import { CrmCredentials } from '@/types/crm';

const CrmSettings = () => {
  const [connectedCrm, setConnectedCrm] = useState<CrmCredentials | null>(null);
  const hostId = "current-host-id"; // This would come from auth context

  const handleConnectionSuccess = (credentials: CrmCredentials) => {
    setConnectedCrm(credentials);
    // Save to database here
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
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="connection">Connection</TabsTrigger>
              <TabsTrigger value="sync">Sync Dashboard</TabsTrigger>
              <TabsTrigger value="webhook">Webhook</TabsTrigger>
            </TabsList>

            <TabsContent value="connection" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CrmConnectionForm onConnectionSuccess={handleConnectionSuccess} />
                
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
            </TabsContent>

            <TabsContent value="sync" className="space-y-6">
              {connectedCrm ? (
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
