import React, { useState, useMemo } from 'react';
import { SECTIONS } from '../constants';
import { Section } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MapPin, 
  Sparkles, 
  Users, 
  Home as HomeIcon, 
  Briefcase, 
  ShoppingBag, 
  Wrench, 
  Zap,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
  Globe
} from 'lucide-react';
import { useListings } from '../context/ListingsContext';
import { ListingCard } from '../components/ListingCard';
import { ResultsMap } from '../components/ResultsMap';

const SF_SUBREGIONS = [
  { name: 'san francisco', slug: 'sfc' },
  { name: 'south bay', slug: 'sby' },
  { name: 'east bay', slug: 'eby' },
  { name: 'peninsula', slug: 'pen' },
  { name: 'north bay', slug: 'nby' },
  { name: 'santa cruz', slug: 'scz' },
];

const POPULAR_TAGS = [
  { label: 'Cars & Trucks', query: 'cars-trucks' },
  { label: 'Apartments', query: 'apts-housing' },
  { label: 'Computers', query: 'computers' },
  { label: 'Furniture', query: 'furniture' },
  { label: 'Free Stuff', query: 'free' },
  { label: 'Bikes', query: 'bikes' },
];

const getSectionIcon = (title: string) => {
  switch (title.toLowerCase()) {
    case 'community':
      return <Users className="w-4 h-4 text-purple-700 dark:text-purple-400" />;
    case 'housing':
      return <HomeIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    case 'jobs':
      return <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case 'services':
      return <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    case 'for sale':
      return <ShoppingBag className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    case 'gigs':
      return <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
    default:
      return <Sparkles className="w-4 h-4 text-purple-700 dark:text-purple-400" />;
  }
};

const CategorySection: React.FC<{ section: Section }> = ({ section }) => {
  const sectionSlug = section.title.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/90 dark:border-gray-800 overflow-hidden shadow-xs hover:border-purple-300 dark:hover:border-purple-600 transition-all flex flex-col h-full group">
      {/* Section Header */}
      <div className="px-4 py-3 bg-gray-50/90 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <Link 
          to={`/sfbay/search?category=${sectionSlug}`} 
          className="font-serif font-bold text-base text-gray-900 dark:text-gray-100 hover:text-purple-700 dark:hover:text-purple-400 transition-colors tracking-tight flex items-center gap-2"
        >
          {getSectionIcon(section.title)}
          <span className="capitalize">{section.title}</span>
          <span className="text-[11px] font-sans font-normal text-gray-400 dark:text-gray-500">
            ({section.categories.length})
          </span>
        </Link>
        <Link 
          to={`/sfbay/search?category=${sectionSlug}`}
          className="text-[11px] font-bold text-purple-700 dark:text-purple-400 hover:text-purple-900 uppercase tracking-wider flex items-center gap-0.5 hover:underline"
        >
          All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Categories Links Grid */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
          {section.categories.map(cat => (
            <li key={cat.id}>
              <Link 
                to={`/sfbay/search?category=${cat.slug}`} 
                className="block text-[13px] text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-400 hover:underline py-0.5 truncate font-medium transition-colors"
                title={cat.name}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [freshFilter, setFreshFilter] = useState<'all' | 'vehicles' | 'housing' | 'tech'>('all');
  const [mapCategoryFilter, setMapCategoryFilter] = useState<'all' | 'vehicles' | 'housing' | 'goods'>('all');
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(true);
  const { listings } = useListings(); 

  const handleSearch = () => {
    if (searchQuery.trim()) {
       navigate(`/sfbay/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Filtered Fresh Listings
  const freshListings = useMemo(() => {
    const active = listings.filter(l => l.status === 'active');
    let filtered = active;
    if (freshFilter === 'vehicles') {
      filtered = active.filter(l => l.category.includes('car') || l.category.includes('bike') || l.category.includes('auto'));
    } else if (freshFilter === 'housing') {
      filtered = active.filter(l => l.category.includes('housing') || l.category.includes('apts') || l.category.includes('room'));
    } else if (freshFilter === 'tech') {
      filtered = active.filter(l => l.category.includes('computer') || l.category.includes('phone') || l.category.includes('electronics'));
    }
    return filtered.sort((a, b) => b.timestamp - a.timestamp).slice(0, 4);
  }, [listings, freshFilter]);

  // Listings for the Interactive Map
  const mapListings = useMemo(() => {
    const active = listings.filter(l => l.status === 'active');
    if (mapCategoryFilter === 'vehicles') {
      return active.filter(l => l.category.includes('car') || l.category.includes('bike') || l.category.includes('auto'));
    }
    if (mapCategoryFilter === 'housing') {
      return active.filter(l => l.category.includes('housing') || l.category.includes('apts') || l.category.includes('room'));
    }
    if (mapCategoryFilter === 'goods') {
      return active.filter(l => l.category.includes('computer') || l.category.includes('furniture') || l.category.includes('free'));
    }
    return active;
  }, [listings, mapCategoryFilter]);

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonthName = currentDate.toLocaleString('default', { month: 'short' });

  return (
    <div className="bg-[#fcfcfc] dark:bg-gray-950 min-h-screen font-sans text-sm pb-12 transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-3 space-y-5 hidden lg:block">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-xs text-center sticky top-24">
               
               {/* Wordmark */}
               <Link to="/" className="font-serif font-black text-2xl text-purple-700 dark:text-purple-400 tracking-tight block mb-3">
                 craigslist
               </Link>
               
               {/* Location Indicator */}
               <div className="flex items-center justify-center gap-1.5 font-bold text-xs text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 py-2 rounded-xl mb-4 border border-gray-100 dark:border-gray-700">
                 <MapPin className="w-3.5 h-3.5 text-purple-600" />
                 <span>SF Bay Area</span>
               </div>

               {/* Action Buttons */}
               <div className="space-y-2">
                 <Link to="/post" className="block w-full text-center bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-xs hover:shadow-md">
                   Post an Ad
                 </Link>
                 <Link to="/account" className="block w-full text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs py-2.5 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-all">
                   My Account
                 </Link>
                 <Link to="/sites" className="block w-full text-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5">
                   <Globe className="w-3.5 h-3.5 text-purple-600" />
                   All Cities & World Map
                 </Link>
               </div>

               {/* Quick Calendar */}
               <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                   <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center justify-center gap-1.5">
                       <CalendarIcon className="w-3 h-3 text-purple-700 dark:text-purple-400" /> {currentMonthName} Events
                   </h4>
                   <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                        {['S','M','T','W','T','F','S'].map((d, i) => <span key={`${d}-${i}`} className="text-gray-400 dark:text-gray-500 font-bold">{d}</span>)}
                        {Array.from({length: 28}, (_, i) => i + 1).map(d => (
                            <Link 
                                key={d} 
                                to={`/sfbay/search?q=event`}
                                className={`rounded py-1 transition-colors ${d === currentDay ? 'bg-purple-700 text-white font-bold shadow-xs' : 'text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-700'}`}
                            >
                                {d}
                            </Link>
                        ))}
                   </div>
               </div>

               {/* Trust Note */}
               <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Always deal locally</span>
               </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-9 space-y-6">
             
             {/* Search Hero Bar */}
             <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                   <div className="relative flex-1 w-full">
                      <input 
                        type="text"
                        placeholder="Search classifieds in SF Bay Area (cars, housing, jobs, furniture)..." 
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   </div>
                   <button 
                     onClick={handleSearch}
                     className="w-full sm:w-auto px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 shrink-0"
                   >
                     <span>Search</span>
                     <ArrowRight className="w-3.5 h-3.5" />
                   </button>
                </div>

                {/* Popular Tags */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar text-xs">
                   <span className="text-gray-400 dark:text-gray-500 text-[11px] font-bold uppercase shrink-0 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-purple-600" /> Trending:
                   </span>
                   {POPULAR_TAGS.map(tag => (
                      <Link 
                        key={tag.query}
                        to={`/sfbay/search?category=${tag.query}`}
                        className="text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 hover:underline shrink-0 text-xs font-medium"
                      >
                         {tag.label}
                      </Link>
                   ))}
                </div>
             </div>

             {/* Subregions Quick Bar */}
             <div className="flex items-center justify-center flex-wrap gap-2 text-xs">
                 <span className="text-gray-400 dark:text-gray-500 text-[11px] font-bold uppercase tracking-wider">Subregions:</span>
                 {SF_SUBREGIONS.map((sub, idx) => (
                     <React.Fragment key={sub.slug}>
                       <Link 
                          to={`/sfbay/search?q=${sub.name}`} 
                          className="text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 hover:underline font-semibold capitalize transition-colors"
                       >
                           {sub.name}
                       </Link>
                       {idx < SF_SUBREGIONS.length - 1 && (
                         <span className="text-gray-300 dark:text-gray-700" aria-hidden="true">·</span>
                       )}
                     </React.Fragment>
                 ))}
             </div>

             {/* INTERACTIVE COMMUNITY MAP & LIVE PLOTTED ADS */}
             <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
                {/* Header bar */}
                <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/70 dark:bg-gray-800/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200/60 dark:border-purple-800/60 shadow-2xs">
                      <MapIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-serif font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">
                          Classifieds Map Explorer
                        </h2>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live Ads Plotted
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {mapListings.length} submitted advertisements plotted across SF Bay Area
                      </p>
                    </div>
                  </div>

                  {/* Filter Pills and Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 bg-white dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setMapCategoryFilter('all')}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${mapCategoryFilter === 'all' ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => setMapCategoryFilter('vehicles')}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${mapCategoryFilter === 'vehicles' ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
                      >
                        Vehicles
                      </button>
                      <button
                        type="button"
                        onClick={() => setMapCategoryFilter('housing')}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${mapCategoryFilter === 'housing' ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
                      >
                        Housing
                      </button>
                      <button
                        type="button"
                        onClick={() => setMapCategoryFilter('goods')}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${mapCategoryFilter === 'goods' ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
                      >
                        Goods
                      </button>
                    </div>

                    <Link
                      to="/post"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                      title="Post a new ad to appear on the map"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Post on Map</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setIsMapExpanded(!isMapExpanded)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title={isMapExpanded ? "Collapse map" : "Expand map"}
                    >
                      {isMapExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* The Interactive Map View */}
                {isMapExpanded && (
                  <>
                    <div className="h-[440px] w-full relative bg-gray-100 dark:bg-gray-800">
                      <ResultsMap listings={mapListings} citySlug="sfbay" autoZoomIn={true} />
                    </div>

                    <div className="p-3 bg-gray-50/70 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="text-gray-500 dark:text-gray-400 text-[11px] font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        Click any price pin on the map to preview details, or use the top-left toggle to view Continents
                      </span>
                      <Link 
                        to="/sfbay/search"
                        className="text-purple-700 dark:text-purple-400 hover:underline font-bold text-[11px] flex items-center gap-0.5 shrink-0"
                      >
                        Browse all in Search <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </>
                )}
             </div>

             {/* FRESH FINDS SECTION */}
             {freshListings.length > 0 && (
                 <div>
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
                         <div className="flex items-center gap-2">
                             <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                                 <Sparkles className="w-4 h-4 text-purple-700 dark:text-purple-400" /> Fresh Finds
                             </h3>
                             <span className="text-xs text-gray-400 dark:text-gray-500">
                               Latest local additions
                             </span>
                         </div>
                         
                         {/* Segmented Filter Controls */}
                         <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200/80 dark:border-gray-700 self-start sm:self-auto text-xs">
                             <button
                               onClick={() => setFreshFilter('all')}
                               className={`px-2.5 py-1 rounded-lg font-bold transition-all ${freshFilter === 'all' ? 'bg-white dark:bg-gray-900 text-purple-700 dark:text-purple-400 shadow-2xs' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
                             >
                               All
                             </button>
                             <button
                               onClick={() => setFreshFilter('vehicles')}
                               className={`px-2.5 py-1 rounded-lg font-bold transition-all ${freshFilter === 'vehicles' ? 'bg-white dark:bg-gray-900 text-purple-700 dark:text-purple-400 shadow-2xs' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
                             >
                               Vehicles
                             </button>
                             <button
                               onClick={() => setFreshFilter('housing')}
                               className={`px-2.5 py-1 rounded-lg font-bold transition-all ${freshFilter === 'housing' ? 'bg-white dark:bg-gray-900 text-purple-700 dark:text-purple-400 shadow-2xs' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
                             >
                               Housing
                             </button>
                             <button
                               onClick={() => setFreshFilter('tech')}
                               className={`px-2.5 py-1 rounded-lg font-bold transition-all ${freshFilter === 'tech' ? 'bg-white dark:bg-gray-900 text-purple-700 dark:text-purple-400 shadow-2xs' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
                             >
                               Tech
                             </button>
                         </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                         {freshListings.map(listing => (
                             <ListingCard key={listing.id} listing={listing} layout="grid" />
                         ))}
                     </div>
                 </div>
             )}

             {/* MAIN HIGH-DENSITY DIRECTORY OF CATEGORIES */}
             <div className="pt-2">
                 <div className="flex items-center justify-between mb-4 px-1">
                     <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-gray-100">
                         Browse Classifieds by Section
                     </h3>
                     <span className="text-xs text-gray-400">
                         6 major sections · 100+ categories
                     </span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                     {SECTIONS.map(section => (
                         <CategorySection key={section.id} section={section} />
                     ))}
                 </div>
             </div>

          </main>
        </div>
      </div>
    </div>
  );
};
