
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CreatePoolForm from '@/components/host/CreatePoolForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Home, Calendar, DollarSign, Settings, TrendingUp } from 'lucide-react';

const HostDashboard = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch host's pools
  const { data: pools, refetch: refetchPools } = useQuery({
    queryKey: ['host-pools', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('pools')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch bookings for host's pools
  const { data: bookings } = useQuery({
    queryKey: ['host-bookings', user?.id],
    queryFn: async () => {
      if (!user?.id || !pools?.length) return [];
      
      const poolIds = pools.map(pool => pool.id);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles:user_id(full_name, email),
          pools(title)
        `)
        .in('pool_id', poolIds)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && !!pools?.length,
  });

  // Temporary mock earnings data until the database schema is updated
  const { data: earnings } = useQuery({
    queryKey: ['host-earnings', user?.id],
    queryFn: async () => {
      // This will be replaced once the host_payouts table is properly typed
      return { total: 0, thisMonth: 0, pending: 0 };
    },
    enabled: !!user?.id,
  });

  const handlePoolCreated = () => {
    setShowCreateForm(false);
    refetchPools();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
            <p className="text-gray-600">You need to be logged in as a host to view this page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 px-4">
          <div className="container mx-auto py-8">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
                className="mb-4"
              >
                ← Back to Dashboard
              </Button>
            </div>
            <CreatePoolForm onSuccess={handlePoolCreated} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Host Dashboard</h1>
            <p className="text-gray-600">Manage your pools, bookings, and earnings</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pools</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pools?.length || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookings?.length || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£{earnings?.thisMonth?.toFixed(2) || '0.00'}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£{earnings?.pending?.toFixed(2) || '0.00'}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pools" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pools">My Pools</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="pools" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Pool Listings</h2>
                <Button onClick={() => setShowCreateForm(true)}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add New Pool
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pools?.map((pool) => (
                  <Card key={pool.id}>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{pool.title}</CardTitle>
                      <div className="flex items-center justify-between">
                        <Badge variant={pool.is_active ? "default" : "secondary"}>
                          {pool.is_active ? "Active" : "Pending Approval"}
                        </Badge>
                        <span className="text-sm font-medium">£{pool.price_per_hour}/hour</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2">{pool.description}</p>
                      <p className="text-sm text-gray-500 mt-2">{pool.location}</p>
                    </CardContent>
                  </Card>
                ))}
                
                {(!pools || pools.length === 0) && (
                  <Card className="col-span-full">
                    <CardContent className="text-center py-8">
                      <Home className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No pools yet</h3>
                      <p className="text-gray-600 mb-4">Get started by adding your first pool listing</p>
                      <Button onClick={() => setShowCreateForm(true)}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Your First Pool
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <h2 className="text-xl font-semibold">Recent Bookings</h2>
              
              <div className="space-y-4">
                {bookings?.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{booking.pools?.title}</h3>
                          <p className="text-sm text-gray-600">
                            {booking.profiles?.full_name} ({booking.profiles?.email})
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.booking_date).toLocaleDateString()} • 
                            {booking.start_time} - {booking.end_time}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={
                              booking.status === 'confirmed' ? 'default' :
                              booking.status === 'pending' ? 'secondary' :
                              booking.status === 'cancelled' ? 'destructive' : 'default'
                            }
                          >
                            {booking.status}
                          </Badge>
                          <p className="text-lg font-bold mt-1">£{booking.total_price}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {(!bookings || bookings.length === 0) && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                      <p className="text-gray-600">Bookings will appear here once guests start booking your pools</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-6">
              <h2 className="text-xl font-semibold">Earnings Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">£{earnings?.total?.toFixed(2) || '0.00'}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">£{earnings?.thisMonth?.toFixed(2) || '0.00'}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Payouts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">£{earnings?.pending?.toFixed(2) || '0.00'}</div>
                    <p className="text-sm text-gray-600 mt-2">Will be processed within 7 days</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-xl font-semibold">Account Settings</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>CRM Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Connect your property management system to automatically sync availability and bookings.
                  </p>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Integrations
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HostDashboard;
