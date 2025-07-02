
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { CrmIntegrationService } from '@/services/crm-integration-service';
import { CrmCredentials } from '@/types/crm';

interface CrmConnectionFormProps {
  onConnectionSuccess: (integration: any) => void;
  hostId: string;
}

const CrmConnectionForm: React.FC<CrmConnectionFormProps> = ({ onConnectionSuccess, hostId }) => {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [integrationName, setIntegrationName] = useState<string>('');
  const [credentials, setCredentials] = useState<{ [key: string]: string }>({});
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const providerConfigs = {
    mews: {
      name: 'Mews',
      fields: [
        { key: 'api_key', label: 'Client Token', type: 'password', required: true },
        { key: 'oauth_token', label: 'Access Token', type: 'password', required: true },
        { key: 'base_url', label: 'API Base URL', type: 'url', required: false, default: 'https://api.mews.com' }
      ]
    },
    cloudbeds: {
      name: 'Cloudbeds',
      fields: [
        { key: 'api_key', label: 'API Key', type: 'password', required: true },
        { key: 'base_url', label: 'Property ID', type: 'text', required: true }
      ]
    },
    custom: {
      name: 'Custom Integration',
      fields: [
        { key: 'base_url', label: 'Webhook URL', type: 'url', required: true },
        { key: 'api_key', label: 'API Key (Optional)', type: 'password', required: false }
      ]
    }
  };

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    setCredentials({});
    setConnectionStatus('idle');
    
    const config = providerConfigs[provider as keyof typeof providerConfigs];
    if (config) {
      setIntegrationName(`${config.name} Integration`);
      
      // Set default values
      const defaultCredentials: { [key: string]: string } = {};
      config.fields.forEach(field => {
        if (field.default) {
          defaultCredentials[field.key] = field.default;
        }
      });
      setCredentials(defaultCredentials);
    }
  };

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }));
  };

  const testConnection = async () => {
    if (!selectedProvider) return;

    setConnectionStatus('testing');
    
    try {
      const crmCredentials: CrmCredentials = {
        provider: selectedProvider as any,
        api_key: credentials.api_key,
        oauth_token: credentials.oauth_token,
        base_url: credentials.base_url
      };

      const response = await CrmIntegrationService.testConnection(
        selectedProvider as any, 
        crmCredentials
      );
      
      if (response.success) {
        setConnectionStatus('success');
        toast({
          title: "Connection successful!",
          description: "Your CRM system is responding correctly.",
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Connection failed",
          description: response.error || "Could not connect to the CRM system",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Connection error",
        description: "An unexpected error occurred while testing the connection",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProvider || !integrationName.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a provider and enter an integration name",
        variant: "destructive",
      });
      return;
    }

    const config = providerConfigs[selectedProvider as keyof typeof providerConfigs];
    const requiredFields = config.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !credentials[field.key]?.trim());

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      const crmCredentials: CrmCredentials = {
        provider: selectedProvider as any,
        api_key: credentials.api_key,
        oauth_token: credentials.oauth_token,
        base_url: credentials.base_url
      };

      const integration = await CrmIntegrationService.createIntegration(
        hostId,
        selectedProvider as any,
        integrationName,
        crmCredentials,
        { provider: selectedProvider }
      );

      toast({
        title: "Integration created!",
        description: "Your CRM integration has been set up successfully.",
      });

      // Call success callback
      onConnectionSuccess(integration);

      // Reset form
      setSelectedProvider('');
      setIntegrationName('');
      setCredentials({});
      setConnectionStatus('idle');
    } catch (error) {
      toast({
        title: "Integration failed",
        description: error instanceof Error ? error.message : "Failed to create CRM integration",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const selectedConfig = selectedProvider ? providerConfigs[selectedProvider as keyof typeof providerConfigs] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect CRM System</CardTitle>
        <CardDescription>
          Set up integration with your hotel management system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="provider">CRM Provider</Label>
            <Select value={selectedProvider} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select your CRM system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mews">Mews</SelectItem>
                <SelectItem value="cloudbeds">Cloudbeds</SelectItem>
                <SelectItem value="custom">Custom Webhook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Integration Name */}
          {selectedProvider && (
            <div className="space-y-2">
              <Label htmlFor="integration_name">Integration Name</Label>
              <Input
                id="integration_name"
                value={integrationName}
                onChange={(e) => setIntegrationName(e.target.value)}
                placeholder="e.g., Main Hotel Integration"
              />
            </div>
          )}

          {/* Dynamic credential fields */}
          {selectedConfig && selectedConfig.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id={field.key}
                type={field.type}
                value={credentials[field.key] || ''}
                onChange={(e) => handleCredentialChange(field.key, e.target.value)}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
              />
            </div>
          ))}

          {/* Connection Status */}
          {selectedProvider && Object.keys(credentials).length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={testConnection}
                  disabled={connectionStatus === 'testing'}
                >
                  {connectionStatus === 'testing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Test Connection
                </Button>
                
                {connectionStatus === 'success' && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Connected</span>
                  </div>
                )}
                
                {connectionStatus === 'error' && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Failed</span>
                  </div>
                )}
              </div>

              {connectionStatus === 'success' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Connection test successful! You can now save this integration.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isConnecting || !selectedProvider || connectionStatus !== 'success'}
            className="w-full"
          >
            {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isConnecting ? "Creating Integration..." : "Create Integration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CrmConnectionForm;
