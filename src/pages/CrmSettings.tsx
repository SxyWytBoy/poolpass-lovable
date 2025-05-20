
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CrmIntegration from '@/components/crm/CrmIntegration';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const CrmSettings = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/host-dashboard">
            <Button variant="ghost" size="sm" className="mb-2">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">CRM Integration Settings</h1>
          <p className="text-muted-foreground">
            Connect PoolPass with your CRM system to manage bookings, customers, and analytics.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">CRM Integration</h2>
            <div className="prose max-w-none mb-6">
              <p>
                PoolPass can integrate with your existing CRM solution to track bookings, 
                manage customer relationships, and coordinate pool availability.
              </p>
              <h3>How it works:</h3>
              <ol>
                <li>Enter your CRM's webhook URL in the configuration panel</li>
                <li>Test the connection to ensure data flows properly</li>
                <li>PoolPass will automatically send booking and customer data to your CRM</li>
              </ol>
              <p>
                <strong>Note:</strong> This integration works with any CRM system that supports webhook integrations,
                including Salesforce, HubSpot, Zoho CRM, and custom solutions.
              </p>
            </div>

            <CrmIntegration />
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
            <p className="mb-4">
              For custom integrations, refer to our API documentation to understand the data structure and webhook payloads.
            </p>
            <div className="bg-gray-100 p-4 rounded-md overflow-auto">
              <pre className="text-sm">
{`// Sample Webhook Payload
{
  "eventType": "booking_created",
  "timestamp": "2023-10-15T12:34:56Z",
  "data": {
    "booking": {
      "id": "booking-123",
      "date": "2023-11-01",
      "time_slot": "10:00 - 11:00",
      "total_price": 45,
      "status": "confirmed"
    },
    "pool": {
      "id": "pool-456",
      "name": "Luxury Indoor Pool",
      "location": "London"
    },
    "customer_id": "user-789"
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CrmSettings;
