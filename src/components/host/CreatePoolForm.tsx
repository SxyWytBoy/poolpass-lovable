
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from '@/components/ImageUpload';
import { MapPin, DollarSign } from 'lucide-react';

const poolSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  price_per_hour: z.number().min(1, 'Price must be greater than 0'),
  pool_size: z.string().min(1, 'Pool size is required'),
  pool_depth: z.string().min(1, 'Pool depth is required'),
  pool_temperature: z.string().min(1, 'Pool temperature is required'),
  max_guests: z.number().min(1, 'Max guests must be at least 1'),
});

type PoolFormData = z.infer<typeof poolSchema>;

interface CreatePoolFormProps {
  onSuccess?: () => void;
}

const CreatePoolForm = ({ onSuccess }: CreatePoolFormProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<PoolFormData>({
    resolver: zodResolver(poolSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      price_per_hour: 25,
      pool_size: '',
      pool_depth: '',
      pool_temperature: '',
      max_guests: 1,
    },
  });

  const onSubmit = async (data: PoolFormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('Not authenticated');
      }

      // Create pool record
      const { data: pool, error } = await supabase
        .from('pools')
        .insert({
          title: data.title,
          description: data.description,
          location: data.location,
          price_per_hour: data.price_per_hour,
          host_id: userData.user.id,
          images: images,
          pool_details: {
            size: data.pool_size,
            depth: data.pool_depth,
            temperature: data.pool_temperature,
            maxGuests: data.max_guests
          },
          amenities: [],
          extras: [],
          is_active: false // Needs approval
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Pool created successfully!",
        description: "Your pool is pending approval and will be listed soon.",
      });

      form.reset();
      setImages([]);
      onSuccess?.();
      
    } catch (error) {
      console.error('Error creating pool:', error);
      toast({
        title: "Error creating pool",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          List Your Pool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pool Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Beautiful Outdoor Pool in Kensington" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your pool, facilities, and what makes it special..."
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Kensington, London" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_per_hour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price per Hour (£)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pool_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pool Size</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 15m x 5m" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pool_depth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pool Depth</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1.4m constant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pool_temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Water Temperature</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 29°C / 84°F" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Guests</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pool Images</label>
              <ImageUpload 
                onImagesUploaded={setImages}
                existingImages={images}
                maxImages={10}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Pool...' : 'Create Pool Listing'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreatePoolForm;
