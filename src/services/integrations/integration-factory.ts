
import { HotelIntegration, CrmCredentials } from '@/types/crm';
import { MewsIntegration } from './mews-integration';
import { CloudbedsIntegration } from './cloudbeds-integration';

export class IntegrationFactory {
  static createIntegration(
    credentials: CrmCredentials, 
    hostId: string
  ): HotelIntegration {
    switch (credentials.provider) {
      case 'mews':
        return new MewsIntegration(credentials, hostId);
      case 'cloudbeds':
        return new CloudbedsIntegration(credentials, hostId);
      default:
        throw new Error(`Unsupported CRM provider: ${credentials.provider}`);
    }
  }

  static getSupportedProviders(): Array<{ id: string; name: string; authType: 'oauth' | 'api_key' }> {
    return [
      { id: 'mews', name: 'Mews', authType: 'api_key' },
      { id: 'cloudbeds', name: 'Cloudbeds', authType: 'oauth' },
    ];
  }
}
