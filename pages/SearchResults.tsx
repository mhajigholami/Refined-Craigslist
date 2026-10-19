import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { useToast } from '../context/ToastContext';
import { ListingCard } from '../components/ListingCard';
import { ResultsMap } from '../components/ResultsMap';
import { CompareModal } from '../components/CompareModal';
import { 
  Grid, 
  List, 
  Map as MapIcon, 
  Columns,
  Filter, 
  Search, 
  ChevronRight,
  ArrowUpDown,
  Bell,
  SlidersHorizontal,
  DollarSign,
  Check,
  Scale,
  Navigation,
  Compass,
  X
} from 'lucide-react';
import { Listing } from '../types';

// Haversine geodesic distance in miles
function calculateDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  
  const { listings } = useListings();
  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'split' | 'map'>('split');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'distance'>('newest');
  const [hasImageOnly, setHasImageOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [maxDistanceRadius, setMaxDistanceRadius] = useState<number>(0); // 0 = Any
  
  // Center location (SF Bay Area default: 37.7749, -122.4194)
  const [userCenterCoords, setUserCenterCoords] = useState<{ lat: number; lng: number }>({
    lat: 37.7749,
    lng: -122.4194
  });

  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [isAlertSaved, setIsAlertSaved] = useState(false);

  // Side-by-side comparison state
  const [comparedListings, setComparedListings] = useState<Listing[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const toggleCompare = (item: Listing) => {
    if (comparedListings.some(l => l.id === item.id)) {
      setComparedListings(prev => prev.filter(l => l.id !== item.id));
    } else {
      if (comparedListings.length >= 3) {
        showToast('You can compare a maximum of 3 items at once', 'error');
        return;
      }
      setComparedListings(prev => [...prev, item]);
      showToast(`Added "${item.title}" to comparison tray!`, 'success');
    }
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCenterCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        showToast('Distance calculated from your GPS location!', 'success');
      },
      () => {
        showToast('Could not access GPS location. Using SF downtown center.', 'error');
      }
    );
  };

  const filteredListings = useMemo(() => {
    let result = listings.filter(l => l.status === 'active');

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(l => 
        l.title.toLowerCase().includes(q) || 
        l.description.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
      );
    }

    if (categoryParam) {
      result = result.filter(l => l.category.toLowerCase().includes(categoryParam.toLowerCase()));
    }

    if (hasImageOnly) {
      result = result.filter(l => l.imageUrl);
    }

    const minNum = parseInt(minPrice);
    if (!isNaN(minNum) && minNum > 0) {
      result = result.filter(l => {
        const p = parseInt(l.price.replace(/[^0-9]/g, '')) || 0;
        return p >= minNum;
      });
    }

    const maxNum = parseInt(maxPrice);
    if (!isNaN(maxNum) && maxNum > 0) {
      result = result.filter(l => {
        const p = parseInt(l.price.replace(/[^0-9]/g, '')) || 0;
        return p <= maxNum;
      });
    }

    // Distance Radius Filter
    if (maxDistanceRadius > 0) {
      result = result.filter(l => {
        const lat = l.latitude || 37.7749;
        const lng = l.longitude || -122.4194;
        const dist = calculateDistanceMiles(userCenterCoords.lat, userCenterCoords.lng, lat, lng);
        return dist <= maxDistanceRadius;
      });
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        const pA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
        const pB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
        return pA - pB;
      });
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        const pA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
        const pB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
        return pB - pA;
      });
    } else if (sortBy === 'distance') {
      result.sort((a, b) => {
        const distA = calculateDistanceMiles(userCenterCoords.lat, userCenterCoords.lng, a.latitude || 37.7749, a.longitude || -122.4194);
        const distB = calculateDistanceMiles(userCenterCoords.lat, userCenterCoords.lng, b.latitude || 37.7749, b.longitude || -122.4194);
        return distA - distB;
      });
    }

    return result;
  }, [listings, query, categoryParam, hasImageOnly, minPrice, maxPrice, maxDistanceRadius, sortBy, userCenterCoords]);

  const handleSaveSearchAlert = () => {
    setIsAlertSaved(true);
    showToast(`Search alert saved! You'll receive instant notification when matching classifieds arrive.`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-gray-950 font-sans pb-24 transition-colors">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 py-6">
        
        {/* Breadcrumbs & Title */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-purple-700 dark:hover:text-purple-400 font-medium">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>SF Bay Area</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {query ? `Search: "${query}"` : categoryParam ? `Category: ${categoryParam}` : 'All Classifieds'}
            </span>
          </div>

          {/* Instant Search Alert Button */}
          <button
            onClick={handleSaveSearchAlert}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isAlertSaved
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-purple-500 hover:text-purple-600'
            }`}
          >
            {isAlertSaved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bell className="w-3.5 h-3.5 text-purple-600" />}
            <span>{isAlertSaved ? 'Alert Active' : 'Save Search & Notify Me'}</span>
          </button>
        </div>

        {/* Toolbar Header */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-2xl p-4 mb-6 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <h1 className="font-serif font-black text-xl text-gray-900 dark:text-gray-100">
              {filteredListings.length} Results
            </h1>
            <span className="text-xs text-gray-400">
              in SF Bay Area
            </span>
          </div>

          {/* Filters: Distance slider, Price bounds, Sorting, View Switcher */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
            
            {/* Distance Radius Selector */}
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1 text-xs">
              <button
                type="button"
                onClick={handleLocateUser}
                title="Use My Current GPS Location"
                className="text-purple-600 hover:text-purple-700"
              >
                <Navigation className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-gray-600 dark:text-gray-300">Distance:</span>
              <select
                value={maxDistanceRadius}
                onChange={(e) => setMaxDistanceRadius(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-purple-700 dark:text-purple-400 outline-none cursor-pointer"
              >
                <option value={0}>Any Distance</option>
                <option value={5}>Within 5 miles</option>
                <option value={10}>Within 10 miles</option>
                <option value={25}>Within 25 miles</option>
                <option value={50}>Within 50 miles</option>
              </select>
            </div>

            {/* Price Range inputs */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-gray-400 font-bold">$</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-14 bg-transparent text-xs font-medium dark:text-white outline-none"
              />
              <span className="text-gray-300 dark:text-gray-600">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-14 bg-transparent text-xs font-medium dark:text-white outline-none"
              />
            </div>

            {/* Image filter */}
            <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasImageOnly}
                onChange={(e) => setHasImageOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-purple-700 focus:ring-purple-600 border-gray-300 dark:border-gray-700"
              />
              <span>Has Image</span>
            </label>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold rounded-xl px-3 py-1.5 outline-none text-gray-700 dark:text-gray-300"
            >
              <option value="newest">Sort: Newest</option>
              <option value="distance">Sort: Nearest Distance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {/* View Switcher: Split vs Grid vs List vs Map */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'split' ? 'bg-white dark:bg-gray-900 text-purple-700 dark:text-purple-400 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-800'}`}
                title="Split screen (Map + Cards)"
                aria-label="Split view"
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-900 text-purple-700 dark:text-purple-400 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-800'}`}
                title="Grid view"
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-900 text-purple-700 dark:text-purple-400 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-800'}`}
                title="List view"
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'map' ? 'bg-white dark:bg-gray-900 text-purple-700 dark:text-purple-400 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-800'}`}
                title="Map Only view"
                aria-label="Map view"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Content Render based on ViewMode */}
        {filteredListings.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center max-w-lg mx-auto my-12">
            <Search className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">
              No matching listings found
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Try increasing your distance radius or clearing price filters.
            </p>
            <button
              onClick={() => {
                setMinPrice('');
                setMaxPrice('');
                setMaxDistanceRadius(0);
                setHasImageOnly(false);
                setSearchParams({});
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'split' ? (
          /* Split View: Left Cards (60%), Right Sticky Map (40%) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Listings Cards */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredListings.map(listing => {
                  const dist = calculateDistanceMiles(
                    userCenterCoords.lat,
                    userCenterCoords.lng,
                    listing.latitude || 37.7749,
                    listing.longitude || -122.4194
                  );
                  const isCompared = comparedListings.some(l => l.id === listing.id);

                  return (
                    <div
                      key={listing.id}
                      onMouseEnter={() => setHoveredListingId(listing.id)}
                      onMouseLeave={() => setHoveredListingId(null)}
                      className={`transition-transform duration-200 ${
                        hoveredListingId === listing.id ? 'scale-[1.01] ring-2 ring-purple-600 rounded-2xl' : ''
                      }`}
                    >
                      <ListingCard 
                        listing={listing} 
                        layout="grid" 
                        distanceInMiles={dist}
                        isCompared={isCompared}
                        onToggleCompare={toggleCompare}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Sticky Interactive Map */}
            <div className="lg:col-span-5 sticky top-20 h-[calc(100vh-6.5rem)] rounded-3xl overflow-hidden border border-gray-200/90 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
              <ResultsMap 
                listings={filteredListings} 
                citySlug="sfbay" 
                autoZoomIn={true} 
              />
            </div>

          </div>
        ) : viewMode === 'map' ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xs h-[720px] relative">
            <ResultsMap listings={filteredListings} citySlug="sfbay" autoZoomIn={true} />
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-3 max-w-4xl mx-auto">
            {filteredListings.map(listing => {
              const dist = calculateDistanceMiles(
                userCenterCoords.lat,
                userCenterCoords.lng,
                listing.latitude || 37.7749,
                listing.longitude || -122.4194
              );
              return (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  layout="list" 
                  distanceInMiles={dist}
                  isCompared={comparedListings.some(l => l.id === listing.id)}
                  onToggleCompare={toggleCompare}
                />
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredListings.map(listing => {
              const dist = calculateDistanceMiles(
                userCenterCoords.lat,
                userCenterCoords.lng,
                listing.latitude || 37.7749,
                listing.longitude || -122.4194
              );
              return (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  layout="grid" 
                  distanceInMiles={dist}
                  isCompared={comparedListings.some(l => l.id === listing.id)}
                  onToggleCompare={toggleCompare}
                />
              );
            })}
          </div>
        )}

      </div>

      {/* Floating Comparison Tray */}
      {comparedListings.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[800] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-2xl p-2.5 sm:px-4 sm:py-3 flex items-center gap-3 animate-slide-up backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
              <Scale className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              Comparing ({comparedListings.length}/3):
            </span>
          </div>

          <div className="flex items-center gap-2">
            {comparedListings.map(item => (
              <div key={item.id} className="relative group w-8 h-8 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => toggleCompare(item)}
                  className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            Compare Now
          </button>

          <button
            onClick={() => setComparedListings([])}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
            title="Clear all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      <CompareModal
        listings={comparedListings}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onRemove={(id) => setComparedListings(prev => prev.filter(l => l.id !== id))}
      />

    </div>
  );
};
