
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

const Dashboard = () => {
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

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          pools:pool_id (name, location, images)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (profileLoading || bookingsLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">My Dashboard</h1>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {/* User Profile Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">My Profile</h2>
              <div className="flex items-center gap-4">
                <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center text-gray-500 text-2xl">
                  {profile?.full_name ? profile.full_name[0] : user?.email?.[0]}
                </div>
                <div>
                  <p className="font-medium">{profile?.full_name || 'Guest User'}</p>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Account type: {profile?.user_type}</p>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm">Edit Profile</Button>
              </div>
            </div>
            
            {/* Bookings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
              
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
                        <p className="text-gray-600 text-sm">{booking.pools.location}</p>
                        <div className="flex gap-4 mt-2">
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm">{new Date(booking.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="text-sm">{booking.time_slot}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <p className="text-sm capitalize">{booking.status}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
                  <Link to="/pools">
                    <Button>Find Pools to Book</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
