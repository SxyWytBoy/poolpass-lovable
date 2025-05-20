
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { crmApi } from '@/services/crm-api';
import { CrmConnectionStatus } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

const CrmIntegration = () => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<CrmConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load saved credentials on component mount
  useEffect(() => {
    const savedWebhookUrl = localStorage.getItem('crm_webhook_url');
    const savedApiKey = localStorage.getItem('crm_api_key');
    
    if (savedWebhookUrl) setWebhookUrl(savedWebhookUrl);
    if (savedApiKey) setApiKey(savedApiKey);
  }, []);

  const handleTestConnection = async () => {
    if (!webhookUrl) {
      toast({
        title: "Webhook URL required",
        description: "Please enter your CRM webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await crmApi.testConnection(webhookUrl);
      
      if (response.success && response.data) {
        setConnectionStatus(response.data);
        toast({
          title: "Connection successful!",
          description: "Your CRM integration is working properly",
        });
        
        // Save credentials if test was successful
        crmApi.saveCredentials(webhookUrl, apiKey);
      } else {
        toast({
          title: "Connection failed",
          description: response.error || "Could not connect to the webhook URL",
          variant: "destructive",
        });
        setConnectionStatus({ connected: false });
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      toast({
        title: "Connection error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setConnectionStatus({ connected: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>CRM Integration</CardTitle>
        <CardDescription>Connect PoolPass with your CRM system</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="webhook">
          <TabsList className="mb-4">
            <TabsTrigger value="webhook">Webhook Setup</TabsTrigger>
            <TabsTrigger value="data">Data Mapping</TabsTrigger>
            <TabsTrigger value="history">Sync History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="webhook">
            <div className="space-y-4">
              {connectionStatus && (
                <Alert variant={connectionStatus.connected ? "default" : "destructive"}>
                  {connectionStatus.connected ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {connectionStatus.connected ? "Connected" : "Not Connected"}
                  </AlertTitle>
                  <AlertDescription>
                    {connectionStatus.connected
                      ? `Successfully connected to your CRM. Last synced: ${
                          connectionStatus.lastSynced
                            ? new Date(connectionStatus.lastSynced).toLocaleString()
                            : "Never"
                        }`
                      : "Please configure your CRM webhook URL and test the connection."}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="webhook_url">CRM Webhook URL</Label>
                <Input
                  id="webhook_url"
                  placeholder="https://your-crm.com/api/webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter the webhook URL provided by your CRM system
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api_key">API Key (Optional)</Label>
                <Input
                  id="api_key"
                  type="password"
                  placeholder="Your CRM API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  If your CRM requires an API key for authentication
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="data">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Data Mapping</h3>
              <p className="text-sm text-muted-foreground">
                PoolPass sends the following data to your CRM system:
              </p>
              
              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Booking Events</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>Booking ID</li>
                  <li>Customer information</li>
                  <li>Pool details</li>
                  <li>Date and time of booking</li>
                  <li>Status changes</li>
                  <li>Payment information</li>
                </ul>
              </div>
              
              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Customer Events</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>User profile creation</li>
                  <li>Contact information updates</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sync History</h3>
              <p className="text-sm text-muted-foreground mb-4">
                View recent synchronization events between PoolPass and your CRM
              </p>
              
              <div className="text-center py-8 text-muted-foreground">
                <p>No sync history available</p>
                <p className="text-sm">Configure and test your webhook first</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTestConnection} 
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Testing Connection..." : "Test Connection"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CrmIntegration;
