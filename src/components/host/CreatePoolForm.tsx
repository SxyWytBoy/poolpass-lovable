
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';

interface CreatePoolFormProps {
  onSuccess: () => void;
}

const CreatePoolForm: React.FC<CreatePoolFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price_per_hour: '',
    maxGuests: '',
    size: '',
    depth: '',
    temperature: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('pools')
        .insert({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          price_per_hour: parseFloat(formData.price_per_hour),
          host_id: user.id,
          pool_details: {
            maxGuests: parseInt(formData.maxGuests),
            size: formData.size,
            depth: formData.depth,
            temperature: formData.temperature
          },
          amenities: [],
          extras: [],
          images: [],
          is_active: false // Requires approval
        });

      if (error) throw error;

      toast({
        title: "Pool created successfully!",
        description: "Your pool listing has been submitted for approval.",
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating pool:', error);
      toast({
        title: "Error creating pool",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Pool Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Pool Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Luxury Indoor Pool & Spa"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your pool, amenities, and what makes it special..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Kensington, London"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_per_hour">Price per Hour (£)</Label>
                <Input
                  id="price_per_hour"
                  name="price_per_hour"
                  type="number"
                  step="0.01"
                  value={formData.price_per_hour}
                  onChange={handleInputChange}
                  placeholder="45.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="maxGuests">Max Guests</Label>
                <Input
                  id="maxGuests"
                  name="maxGuests"
                  type="number"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  placeholder="8"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="size">Pool Size</Label>
                <Input
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="15m x 5m"
                  required
                />
              </div>

              <div>
                <Label htmlFor="depth">Depth</Label>
                <Input
                  id="depth"
                  name="depth"
                  value={formData.depth}
                  onChange={handleInputChange}
                  placeholder="1.4m constant"
                  required
                />
              </div>

              <div>
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  placeholder="29°C / 84°F"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Pool Images</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Upload pool images (coming soon)
                </p>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Pool Listing
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePoolForm;
