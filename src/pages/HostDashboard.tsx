
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Plus, User } from 'lucide-react';

const HostDashboard = () => {
  const { user, signOut } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: pools, isLoading: poolsLoading } = useQuery({
    queryKey: ['pools', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pools')
        .select('*')
        .eq('host_id', user?.id);
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['host-bookings', user?.id],
    queryFn: async () => {
      // First get the pool IDs of this host
      const { data: hostPools, error: poolsError } = await supabase
        .from('pools')
        .select('id')
        .eq('host_id', user?.id);
        
      if (poolsError) throw poolsError;
      
      // Then get bookings for those pools
      if (hostPools && hostPools.length > 0) {
        const poolIds = hostPools.map(pool => pool.id);
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            pools:pool_id (name, location, images),
            profiles:user_id (full_name)
          `)
          .in('pool_id', poolIds)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data;
      }
      
      return [];
    },
    enabled: !!user,
  });

  if (profileLoading || poolsLoading || bookingsLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Host Dashboard</h1>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
            </div>
          </div>
          
          <Tabs defaultValue="pools" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="pools">My Pools</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            {/* Pools Tab */}
            <TabsContent value="pools" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Pools</h2>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New Pool
                </Button>
              </div>
              
              {pools && pools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pools.map((pool: any) => (
                    <div key={pool.id} className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={pool.images[0]} 
                          alt={pool.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{pool.name}</h3>
                        <div className="flex items-center text-gray-600 my-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{pool.location}</span>
                        </div>
                        <div className="flex items-center my-1">
                          <div className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            £{pool.price}/hour
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">View Bookings</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <h3 className="text-xl font-medium mb-2">No pools listed yet</h3>
                  <p className="text-gray-600 mb-6">Start earning by listing your pool on PoolPass</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Pool
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
                
                {bookings && bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking: any) => (
                      <div key={booking.id} className="border rounded-lg p-4 flex gap-4">
                        <div className="w-24 h-24 rounded-md overflow-hidden">
                          <img 
                            src={booking.pools.images[0]} 
                            alt={booking.pools.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{booking.pools.name}</h3>
                          <div className="flex items-center text-gray-600 text-sm mt-1">
                            <User className="h-3 w-3 mr-1" />
                            <span>{booking.profiles?.full_name || 'Guest User'}</span>
                          </div>
                          <div className="flex gap-4 mt-2">
                            <div>
                              <div className="flex items-center text-gray-600 text-sm">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{new Date(booking.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center text-gray-600 text-sm">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{booking.time_slot}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between items-end">
                          <span className="font-semibold">£{booking.total_price}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 capitalize">
                            {booking.status}
                          </span>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">You don't have any bookings yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Host Profile</h2>
                <div className="flex items-center gap-4">
                  <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center text-gray-500 text-2xl">
                    {profile?.full_name ? profile.full_name[0] : user?.email?.[0]}
                  </div>
                  <div>
                    <p className="font-medium">{profile?.full_name || 'Host User'}</p>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-500 mt-1">Account type: {profile?.user_type}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button>Edit Profile</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HostDashboard;
