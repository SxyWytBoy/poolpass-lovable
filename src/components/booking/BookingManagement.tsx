
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Edit, MessageSquare } from 'lucide-react';

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  guests: number;
  total_price: number;
  status: string;
  cancellation_policy: string;
  pools: {
    id: string;
    title: string;
    location: string;
    images: string[];
    host_id: string;
  };
}

const BookingManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [modificationType, setModificationType] = useState('');
  const [modificationReason, setModificationReason] = useState('');

  const { data: bookings = [] } = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          pools:pool_id (id, title, location, images, host_id)
        `)
        .eq('user_id', user?.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const requestModificationMutation = useMutation({
    mutationFn: async ({ bookingId, type, reason }: {
      bookingId: string;
      type: string;
      reason: string;
    }) => {
      const { error } = await supabase
        .from('booking_modifications')
        .insert({
          booking_id: bookingId,
          modification_type: type,
          original_value: { reason },
          requested_by: user?.id,
        });

      if (error) throw error;

      // Create notification for the host
      const booking = bookings.find(b => b.id === bookingId);
      if (booking?.pools?.host_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: booking.pools.host_id,
            title: 'Booking Modification Request',
            message: `Guest has requested a ${type} for booking on ${booking.booking_date}`,
            type: 'booking',
          });
      }
    },
    onSuccess: () => {
      toast({
        title: "Modification requested",
        description: "Your request has been sent to the host for review.",
      });
      setSelectedBooking(null);
      setModificationType('');
      setModificationReason('');
    },
    onError: () => {
      toast({
        title: "Request failed",
        description: "Unable to submit modification request.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canModifyBooking = (booking: Booking) => {
    const bookingDate = new Date(booking.booking_date);
    const now = new Date();
    const hoursDifference = (bookingDate.getTime() - now.getTime()) / (1000 * 3600);
    
    // Allow modifications if booking is more than 24 hours away
    return hoursDifference > 24 && booking.status === 'confirmed';
  };

  const getCancellationPolicy = (policy: string) => {
    switch (policy) {
      case 'flexible':
        return 'Full refund up to 24 hours before check-in';
      case 'moderate':
        return 'Full refund up to 5 days before check-in';
      case 'strict':
        return 'Full refund up to 14 days before check-in';
      default:
        return 'See booking terms for details';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No bookings yet. Start exploring pools to make your first booking!
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking: Booking) => (
                <Card key={booking.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">{booking.pools.title}</h3>
                        <p className="text-sm text-gray-600">{booking.pools.location}</p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium">
                          {new Date(booking.booking_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Time</p>
                        <p className="font-medium">
                          {booking.start_time} - {booking.end_time}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Guests</p>
                        <p className="font-medium">{booking.guests}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-medium">£{booking.total_price}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-500 mb-2">
                        Cancellation Policy: {getCancellationPolicy(booking.cancellation_policy)}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Host
                        </Button>
                        
                        {canModifyBooking(booking) && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedBooking(booking.id)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Modify/Cancel
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Modify Booking</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Modification Type
                                  </label>
                                  <Select value={modificationType} onValueChange={setModificationType}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select modification type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="date_change">Change Date</SelectItem>
                                      <SelectItem value="time_change">Change Time</SelectItem>
                                      <SelectItem value="guest_count">Change Guest Count</SelectItem>
                                      <SelectItem value="cancellation">Cancel Booking</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Reason for Modification
                                  </label>
                                  <Textarea
                                    value={modificationReason}
                                    onChange={(e) => setModificationReason(e.target.value)}
                                    placeholder="Please explain your request..."
                                    rows={3}
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedBooking(null);
                                      setModificationType('');
                                      setModificationReason('');
                                    }}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      if (selectedBooking && modificationType && modificationReason) {
                                        requestModificationMutation.mutate({
                                          bookingId: selectedBooking,
                                          type: modificationType,
                                          reason: modificationReason,
                                        });
                                      }
                                    }}
                                    disabled={!modificationType || !modificationReason}
                                    className="flex-1"
                                  >
                                    Submit Request
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingManagement;
