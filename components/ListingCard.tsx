import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../types';
import { MapPin, Bookmark, Clock, ShieldCheck, Scale, Sparkles } from 'lucide-react';
import { useListings } from '../context/ListingsContext';

interface ListingCardProps {
  listing: Listing;
  layout?: 'grid' | 'list';
  distanceInMiles?: number;
  isCompared?: boolean;
  onToggleCompare?: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  layout = 'grid',
  distanceInMiles,
  isCompared = false,
  onToggleCompare
}) => {
  const { favorites, toggleFavorite } = useListings();
  const isFav = favorites.includes(listing.id);

  const timeAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Price Value Meter Algorithm
  const getPriceDealRating = (priceStr: string) => {
    const num = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
    if (num === 0) return { label: 'Free / Trade', color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200' };
    if (num < 650) return { label: 'Great Deal', color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200' };
    if (num < 2500) return { label: 'Fair Price', color: 'text-blue-700 bg-blue-50 dark:bg-blue-950/80 border-blue-200' };
    return { label: 'Market Value', color: 'text-purple-700 bg-purple-50 dark:bg-purple-950/80 border-purple-200' };
  };

  const dealBadge = getPriceDealRating(listing.price);

  if (layout === 'list') {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-2xl p-3 sm:p-4 hover:border-purple-300 dark:hover:border-purple-600 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group shadow-2xs hover:shadow-sm">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <Link to={`/listing/${listing.id}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-100 dark:border-gray-800">
            <img 
              src={listing.imageUrl} 
              alt={listing.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-serif font-black text-lg text-purple-700 dark:text-purple-400">
                {listing.price}
              </span>

              {/* Deal Badge */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${dealBadge.color}`}>
                {dealBadge.label}
              </span>

              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(listing.timestamp)}
              </span>

              {distanceInMiles !== undefined && (
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  {distanceInMiles.toFixed(1)} mi away
                </span>
              )}
            </div>

            <Link 
              to={`/listing/${listing.id}`} 
              className="font-bold text-sm text-gray-900 dark:text-gray-100 hover:text-purple-700 dark:hover:text-purple-400 line-clamp-1 group-hover:underline transition-colors"
            >
              {listing.title}
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{listing.location}</span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto gap-2">
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(listing)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
                isCompared
                  ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Compare listing"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => toggleFavorite(listing.id)}
            className={`p-2 rounded-xl border transition-all ${
              isFav 
                ? 'bg-purple-50 dark:bg-purple-950 border-purple-300 text-purple-700 dark:text-purple-400' 
                : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-purple-700 dark:hover:text-purple-300'
            }`}
            title={isFav ? "Remove from saved" : "Save listing"}
          >
            <Bookmark className={`w-4 h-4 ${isFav ? 'fill-purple-700 dark:fill-purple-400' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-900 border rounded-2xl overflow-hidden transition-all flex flex-col group shadow-2xs hover:shadow-sm ${
      isCompared ? 'border-purple-600 ring-2 ring-purple-600/30' : 'border-gray-200/90 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
    }`}>
      {/* Thumbnail */}
      <Link to={`/listing/${listing.id}`} className="relative h-44 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden block">
        <img 
          src={listing.imageUrl} 
          alt={listing.title} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Price Tag Pill */}
        <div className="absolute bottom-2.5 left-2.5 bg-purple-900/90 backdrop-blur-md text-white font-black text-xs px-2.5 py-1 rounded-lg border border-purple-400/30 shadow-md">
          {listing.price}
        </div>

        {/* Value Deal Pill */}
        <div className={`absolute top-2.5 left-2.5 text-[9px] font-black px-2 py-0.5 rounded-md border shadow-xs backdrop-blur-md ${dealBadge.color}`}>
          {dealBadge.label}
        </div>

        {/* Favorite & Compare Action Icons */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {onToggleCompare && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleCompare(listing);
              }}
              className={`p-1.5 rounded-xl backdrop-blur-md transition-all ${
                isCompared
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-black/40 hover:bg-black/60 text-white'
              }`}
              title={isCompared ? "Compared" : "Add to comparison"}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(listing.id);
            }}
            className={`p-1.5 rounded-xl backdrop-blur-md transition-all ${
              isFav 
                ? 'bg-purple-700 text-white shadow-md' 
                : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
            title={isFav ? "Saved" : "Save listing"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-purple-600 shrink-0" />
              <span className="truncate">{listing.location}</span>
            </span>
            {distanceInMiles !== undefined ? (
              <span className="font-bold text-gray-600 dark:text-gray-300 shrink-0">
                {distanceInMiles.toFixed(1)} mi
              </span>
            ) : (
              <span className="shrink-0">{timeAgo(listing.timestamp)}</span>
            )}
          </div>

          <Link 
            to={`/listing/${listing.id}`} 
            className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 hover:text-purple-700 dark:hover:text-purple-400 line-clamp-2 group-hover:underline transition-colors"
          >
            {listing.title}
          </Link>
        </div>

        {listing.seller?.phoneVerified && (
          <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3" /> Verified Seller
            </span>
            <span className="text-gray-400">{listing.seller.rating} ★</span>
          </div>
        )}
      </div>
    </div>
  );
};
