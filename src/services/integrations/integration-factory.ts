
import { HotelIntegration, CrmCredentials } from '@/types/crm';
import { MewsIntegration } from './mews-integration';
import { CloudbedsIntegration } from './cloudbeds-integration';

export class IntegrationFactory {
  static createIntegration(
    credentials: CrmCredentials, 
    hostId: string
  ): HotelIntegration {
    // Validate credentials based on provider
    this.validateCredentials(credentials);
    
    switch (credentials.provider) {
      case 'mews':
        return new MewsIntegration(credentials, hostId);
      case 'cloudbeds':
        return new CloudbedsIntegration(credentials, hostId);
      case 'custom':
        // For custom integrations, we'll use a basic webhook approach
        return new CloudbedsIntegration(credentials, hostId); // Fallback for now
      default:
        throw new Error(`Unsupported CRM provider: ${credentials.provider}`);
    }
  }

  static validateCredentials(credentials: CrmCredentials): void {
    if (!credentials.provider) {
      throw new Error('CRM provider is required');
    }

    switch (credentials.provider) {
      case 'mews':
        if (!credentials.api_key) {
          throw new Error('Mews Client Token (API Key) is required');
        }
        if (!credentials.oauth_token) {
          throw new Error('Mews Access Token is required');
        }
        break;
        
      case 'cloudbeds':
        if (!credentials.api_key) {
          throw new Error('Cloudbeds API Key is required');
        }
        break;
        
      case 'custom':
        if (!credentials.base_url) {
          throw new Error('Webhook URL is required for custom integrations');
        }
        break;
        
      default:
        throw new Error(`Validation not implemented for provider: ${credentials.provider}`);
    }
  }

  static getSupportedProviders(): Array<{ 
    id: string; 
    name: string; 
    authType: 'oauth' | 'api_key' | 'webhook';
    fields: Array<{
      key: string;
      label: string;
      type: string;
      required: boolean;
      description?: string;
    }>;
  }> {
    return [
      { 
        id: 'mews', 
        name: 'Mews', 
        authType: 'api_key',
        fields: [
          {
            key: 'api_key',
            label: 'Client Token',
            type: 'password',
            required: true,
            description: 'Your Mews Client Token from the Mews Commander'
          },
          {
            key: 'oauth_token',
            label: 'Access Token',
            type: 'password',
            required: true,
            description: 'Your Mews Access Token'
          }
        ]
      },
      { 
        id: 'cloudbeds', 
        name: 'Cloudbeds', 
        authType: 'api_key',
        fields: [
          {
            key: 'api_key',
            label: 'API Key',
            type: 'password',
            required: true,
            description: 'Your Cloudbeds API Key'
          },
          {
            key: 'base_url',
            label: 'Property ID',
            type: 'text',
            required: true,
            description: 'Your Cloudbeds Property ID'
          }
        ]
      },
      { 
        id: 'custom', 
        name: 'Custom Webhook', 
        authType: 'webhook',
        fields: [
          {
            key: 'base_url',
            label: 'Webhook URL',
            type: 'url',
            required: true,
            description: 'Your custom webhook endpoint URL'
          },
          {
            key: 'api_key',
            label: 'API Key',
            type: 'password',
            required: false,
            description: 'Optional API key for authentication'
          }
        ]
      }
    ];
  }
}
