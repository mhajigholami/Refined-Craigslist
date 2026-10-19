import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroMap } from '../components/HeroMap';
import { GLOBAL_SITES } from '../constants/globalData';
import { Search, MapPin, ChevronRight, Globe } from 'lucide-react';

export const GlobalSites: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const filteredRegions = GLOBAL_SITES.map(region => {
    if (!searchQuery.trim()) return region;
    const q = searchQuery.toLowerCase();
    const matchingSubregions = region.subregions.map(sub => ({
      ...sub,
      cities: sub.cities.filter(c => c.name.toLowerCase().includes(q))
    })).filter(sub => sub.cities.length > 0);

    return {
      ...region,
      subregions: matchingSubregions
    };
  }).filter(region => region.subregions.length > 0);

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-gray-950 font-sans pb-24 transition-colors">
      
      {/* Worldwide Hero Map */}
      <HeroMap onRegionSelect={(slug) => setSelectedRegion(slug)} />

      {/* Main Directory Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        
        {/* Search Worldwide Sites */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter cities or regions worldwide (e.g. London, Tokyo, New York, Paris)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl pl-11 pr-4 py-3 text-xs font-semibold dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 outline-none shadow-sm transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Regions Grid */}
        <div className="space-y-10">
          {filteredRegions.map(region => (
            <div 
              key={region.slug} 
              id={region.slug}
              className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xs"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 flex items-center justify-center font-serif font-black text-lg">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif font-black text-xl text-gray-900 dark:text-gray-100">
                      {region.name}
                    </h2>
                    <span className="text-xs text-gray-400">
                      {region.subregions.reduce((acc, s) => acc + s.cities.length, 0)} Craigslist locations
                    </span>
                  </div>
                </div>

                <Link
                  to={`/${region.defaultCitySlug}/search`}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-purple-700 dark:text-purple-400 hover:underline"
                >
                  <span>Explore Primary Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Subregions and Cities Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {region.subregions.map((sub, sIdx) => (
                  <div key={sIdx} className="space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-purple-700 dark:text-purple-400">
                      {sub.name}
                    </h3>
                    <ul className="space-y-1">
                      {sub.cities.map(city => (
                        <li key={city.slug}>
                          <Link
                            to={`/${city.slug}`}
                            className="text-xs text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-400 hover:underline transition-colors block py-0.5 truncate font-medium"
                          >
                            {city.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
