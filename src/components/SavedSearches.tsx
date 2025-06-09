
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, Star, Trash2, Play, Bell } from 'lucide-react';

interface SavedSearch {
  id: string;
  search_name: string;
  search_criteria: any;
  is_active: boolean;
  created_at: string;
}

const SavedSearches = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');

  const { data: savedSearches = [] } = useQuery({
    queryKey: ['saved-searches', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const createSearchMutation = useMutation({
    mutationFn: async ({ name, criteria }: { name: string; criteria: any }) => {
      const { error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: user?.id,
          search_name: name,
          search_criteria: criteria,
          is_active: true
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches', user?.id] });
      toast({
        title: "Search saved",
        description: "Your search has been saved successfully."
      });
      setIsCreateOpen(false);
      setNewSearchName('');
    }
  });

  const deleteSearchMutation = useMutation({
    mutationFn: async (searchId: string) => {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches', user?.id] });
      toast({
        title: "Search deleted",
        description: "Saved search has been removed."
      });
    }
  });

  const toggleAlertsMutation = useMutation({
    mutationFn: async ({ searchId, isActive }: { searchId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('saved_searches')
        .update({ is_active: !isActive })
        .eq('id', searchId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches', user?.id] });
      toast({
        title: "Alert settings updated",
        description: "Search alert preferences have been updated."
      });
    }
  });

  const handleRunSearch = (criteria: any) => {
    // In a real implementation, this would navigate to search results
    // with the saved criteria applied
    console.log('Running search with criteria:', criteria);
    toast({
      title: "Search executed",
      description: "Running your saved search..."
    });
  };

  const handleSaveCurrentSearch = () => {
    // This would typically receive current search criteria as props
    const mockCriteria = {
      searchText: '',
      minPrice: 20,
      maxPrice: 80,
      selectedAmenities: ['heated-pool', 'wifi'],
      location: 'London'
    };

    if (!newSearchName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your search.",
        variant: "destructive"
      });
      return;
    }

    createSearchMutation.mutate({
      name: newSearchName,
      criteria: mockCriteria
    });
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Please sign in to save searches</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Saved Searches
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Save Current Search</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Search</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Search Name
                  </label>
                  <Input
                    placeholder="e.g., Weekend pools in London"
                    value={newSearchName}
                    onChange={(e) => setNewSearchName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveCurrentSearch}
                    disabled={createSearchMutation.isPending}
                    className="flex-1"
                  >
                    Save Search
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {savedSearches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No saved searches yet</p>
            <p className="text-sm">Save your favorite search criteria for quick access</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedSearches.map((search: SavedSearch) => (
              <div
                key={search.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{search.search_name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {search.search_criteria.location && (
                      <Badge variant="outline" className="text-xs">
                        📍 {search.search_criteria.location}
                      </Badge>
                    )}
                    {search.search_criteria.minPrice && search.search_criteria.maxPrice && (
                      <Badge variant="outline" className="text-xs">
                        £{search.search_criteria.minPrice}-{search.search_criteria.maxPrice}
                      </Badge>
                    )}
                    {search.search_criteria.selectedAmenities?.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {search.search_criteria.selectedAmenities.length} amenities
                      </Badge>
                    )}
                    {search.is_active && (
                      <Badge className="text-xs bg-green-100 text-green-800">
                        <Bell className="h-3 w-3 mr-1" />
                        Alerts On
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Saved {new Date(search.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRunSearch(search.search_criteria)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleAlertsMutation.mutate({
                      searchId: search.id,
                      isActive: search.is_active
                    })}
                  >
                    <Bell className={`h-4 w-4 ${search.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteSearchMutation.mutate(search.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedSearches;
