import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { ListingCard } from '../components/ListingCard';
import { Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  Bookmark, 
  PlusCircle, 
  ShieldCheck, 
  LogOut, 
  Layers,
  ArrowRight
} from 'lucide-react';

export const Account: React.FC = () => {
  const { user, logout } = useAuth();
  const { listings, favorites } = useListings();

  const [activeTab, setActiveTab] = useState<'my-postings' | 'saved' | 'settings'>('my-postings');

  const savedListings = listings.filter(l => favorites.includes(l.id));

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-gray-950 font-sans pb-24 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        
        {/* User Profile Header Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-serif font-black text-2xl shadow-md">
              {user?.name?.[0]?.toUpperCase() || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-black text-2xl text-gray-900 dark:text-gray-100">
                  {user?.name || 'Craigslist Member'}
                </h1>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{user?.email || 'user@example.com'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/post"
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Ad</span>
            </Link>
            <button
              onClick={logout}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 hover:text-rose-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 mb-6">
          <button
            onClick={() => setActiveTab('my-postings')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'my-postings'
                ? 'border-purple-700 text-purple-700 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Community Postings ({listings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'border-purple-700 text-purple-700 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Listings ({savedListings.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'saved' ? (
          savedListings.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center max-w-md mx-auto">
              <Bookmark className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">
                No saved classifieds yet
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Click the bookmark icon on any classified ad to save it here for quick access.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold"
              >
                <span>Browse Ads</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {savedListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} layout="grid" />
              ))}
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} layout="grid" />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
