
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { IntegrationFactory } from '@/services/integrations/integration-factory';
import { CrmCredentials } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';

interface CrmConnectionFormProps {
  onConnectionSuccess?: (credentials: CrmCredentials) => void;
}

const CrmConnectionForm: React.FC<CrmConnectionFormProps> = ({ onConnectionSuccess }) => {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [credentials, setCredentials] = useState<Partial<CrmCredentials>>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const supportedProviders = IntegrationFactory.getSupportedProviders();

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    setCredentials({ provider: provider as any });
    setConnectionStatus('idle');
  };

  const handleCredentialChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const testConnection = async () => {
    if (!selectedProvider || !credentials.provider) {
      toast({
        title: "Missing provider",
        description: "Please select a CRM provider first.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('idle');

    try {
      const integration = IntegrationFactory.createIntegration(
        credentials as CrmCredentials,
        'test-host-id' // This would be the actual host ID
      );

      const isConnected = await integration.testConnection();
      
      if (isConnected) {
        setConnectionStatus('success');
        toast({
          title: "Connection successful!",
          description: "Your CRM integration is working properly.",
        });
        
        if (onConnectionSuccess) {
          onConnectionSuccess(credentials as CrmCredentials);
        }
      } else {
        setConnectionStatus('error');
        toast({
          title: "Connection failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('error');
      toast({
        title: "Connection error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const renderCredentialFields = () => {
    const provider = supportedProviders.find(p => p.id === selectedProvider);
    if (!provider) return null;

    if (provider.authType === 'api_key') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="api_key">API Key</Label>
            <Input
              id="api_key"
              type="password"
              placeholder="Enter your API key"
              value={credentials.api_key || ''}
              onChange={(e) => handleCredentialChange('api_key', e.target.value)}
            />
          </div>
          {provider.id === 'mews' && (
            <div>
              <Label htmlFor="oauth_token">Access Token</Label>
              <Input
                id="oauth_token"
                type="password"
                placeholder="Enter your access token"
                value={credentials.oauth_token || ''}
                onChange={(e) => handleCredentialChange('oauth_token', e.target.value)}
              />
            </div>
          )}
        </div>
      );
    }

    if (provider.authType === 'oauth') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="oauth_token">OAuth Token</Label>
            <Input
              id="oauth_token"
              type="password"
              placeholder="Enter your OAuth token"
              value={credentials.oauth_token || ''}
              onChange={(e) => handleCredentialChange('oauth_token', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="refresh_token">Refresh Token (Optional)</Label>
            <Input
              id="refresh_token"
              type="password"
              placeholder="Enter your refresh token"
              value={credentials.refresh_token || ''}
              onChange={(e) => handleCredentialChange('refresh_token', e.target.value)}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Connect Your CRM System</CardTitle>
        <CardDescription>
          Integrate your hotel management system to sync pool availability and bookings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="provider">CRM Provider</Label>
          <Select value={selectedProvider} onValueChange={handleProviderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select your CRM provider" />
            </SelectTrigger>
            <SelectContent>
              {supportedProviders.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProvider && renderCredentialFields()}

        {connectionStatus !== 'idle' && (
          <Alert variant={connectionStatus === 'success' ? 'default' : 'destructive'}>
            {connectionStatus === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {connectionStatus === 'success'
                ? 'Successfully connected to your CRM system!'
                : 'Failed to connect. Please check your credentials.'}
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={testConnection}
          disabled={!selectedProvider || isConnecting}
          className="w-full"
        >
          {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isConnecting ? 'Testing Connection...' : 'Test Connection'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CrmConnectionForm;
