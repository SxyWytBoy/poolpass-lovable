
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdvancedSearchPanel from '@/components/search/AdvancedSearchPanel';
import SearchResultsMap from '@/components/search/SearchResultsMap';
import PoolComparisonModal from '@/components/search/PoolComparisonModal';
import PoolGrid from '@/components/pools/PoolGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdvancedSearch } from '@/hooks/use-advanced-search';
import { useToast } from '@/hooks/use-toast';
import { Map, Grid, GitCompare, X } from 'lucide-react';

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedPoolId, setSelectedPoolId] = useState<string | undefined>();
  const [comparisonPools, setComparisonPools] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  
  const {
    filters,
    updateFilter,
    resetFilters,
    pools,
    amenities,
    isLoading
  } = useAdvancedSearch();

  const handlePoolSelect = (poolId: string) => {
    setSelectedPoolId(poolId);
    if (viewMode === 'map') {
      // In a real implementation, center map on selected pool
    }
  };

  const addToComparison = (pool: any) => {
    if (comparisonPools.length >= 3) {
      toast({
        title: "Comparison limit reached",
        description: "You can compare up to 3 pools at once.",
        variant: "destructive"
      });
      return;
    }
    
    if (comparisonPools.find(p => p.id === pool.id)) {
      toast({
        title: "Pool already added",
        description: "This pool is already in your comparison.",
        variant: "destructive"
      });
      return;
    }
    
    setComparisonPools(prev => [...prev, pool]);
    toast({
      title: "Pool added to comparison",
      description: `${pool.title} has been added to your comparison.`
    });
  };

  const removeFromComparison = (poolId: string) => {
    setComparisonPools(prev => prev.filter(p => p.id !== poolId));
  };

  const handleViewPool = (poolId: string) => {
    navigate(`/pool/${poolId}`);
  };

  // Convert pools to PoolGrid format, handling missing pool_type gracefully
  const formattedPools = pools.map(pool => ({
    id: pool.id,
    name: pool.title,
    location: pool.location,
    price: pool.price_per_hour,
    rating: pool.rating || 0,
    reviews: pool.reviews_count || 0,
    image: pool.images?.[0] || '',
    indoorOutdoor: 'outdoor' as 'indoor' | 'outdoor' | 'both', // Default value since pool_type doesn't exist
    amenities: pool.pool_amenities?.map((pa: any) => pa.amenities?.name).filter(Boolean) || []
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Panel */}
            <aside className="lg:w-1/4">
              <AdvancedSearchPanel
                filters={filters}
                updateFilter={updateFilter}
                resetFilters={resetFilters}
                amenities={amenities}
              />
            </aside>
            
            {/* Results */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Search Results</h1>
                  <p className="text-gray-600">
                    {isLoading ? 'Searching...' : `${pools.length} pools found`}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  {/* View Toggle */}
                  <div className="flex rounded-lg border">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4 mr-1" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === 'map' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('map')}
                    >
                      <Map className="h-4 w-4 mr-1" />
                      Map
                    </Button>
                  </div>
                  
                  {/* Comparison Toggle */}
                  {comparisonPools.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowComparison(true)}
                    >
                      <GitCompare className="h-4 w-4 mr-1" />
                      Compare ({comparisonPools.length})
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Active Filters */}
              {(filters.selectedAmenities.length > 0 || filters.poolTypes.length > 0 || filters.minPrice || filters.maxPrice) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.selectedAmenities.map(amenityId => {
                    const amenity = amenities.find(a => a.id === amenityId);
                    return amenity ? (
                      <Badge key={amenityId} variant="secondary">
                        {amenity.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => {
                            const newAmenities = filters.selectedAmenities.filter(id => id !== amenityId);
                            updateFilter('selectedAmenities', newAmenities);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ) : null;
                  })}
                  
                  {filters.poolTypes.map(type => (
                    <Badge key={type} variant="secondary">
                      {type}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => {
                          const newTypes = filters.poolTypes.filter(t => t !== type);
                          updateFilter('poolTypes', newTypes);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  
                  {(filters.minPrice || filters.maxPrice) && (
                    <Badge variant="secondary">
                      £{filters.minPrice || 0} - £{filters.maxPrice || 200}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => {
                          updateFilter('minPrice', null);
                          updateFilter('maxPrice', null);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              )}
              
              {/* Results Content */}
              {viewMode === 'grid' ? (
                <PoolGrid
                  pools={formattedPools}
                  resetFilters={resetFilters}
                />
              ) : (
                <SearchResultsMap
                  pools={pools}
                  onPoolSelect={handlePoolSelect}
                  selectedPoolId={selectedPoolId}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Comparison Modal */}
      <PoolComparisonModal
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        pools={comparisonPools}
        onRemovePool={removeFromComparison}
        onViewPool={handleViewPool}
      />
      
      <Footer />
    </div>
  );
};

export default AdvancedSearch;
