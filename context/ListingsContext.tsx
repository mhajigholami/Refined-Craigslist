import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing } from '../types';
import { INITIAL_LISTINGS } from '../constants';

interface ListingsContextType {
  listings: Listing[];
  addListing: (newListing: Omit<Listing, 'id' | 'timestamp' | 'status'>) => Listing;
  getListingById: (id: string) => Listing | undefined;
  deleteListing: (id: string) => void;
  resetToDefaults: () => void;
  exportListings: () => void;
  importListings: (imported: Listing[]) => boolean;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export const ListingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const stored = localStorage.getItem('cl_listings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LISTINGS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('cl_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cl_listings', JSON.stringify(listings));
    } catch (e) {
      console.error(e);
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem('cl_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const addListing = (data: Omit<Listing, 'id' | 'timestamp' | 'status'>): Listing => {
    const newListing: Listing = {
      ...data,
      id: `cl-${Date.now()}`,
      timestamp: Date.now(),
      status: 'active',
      coordinates: data.coordinates || {
        type: 'Point',
        coordinates: [data.longitude || -122.4194, data.latitude || 37.7749]
      }
    };

    setListings(prev => [newListing, ...prev]);
    return newListing;
  };

  const getListingById = (id: string) => {
    return listings.find(l => l.id === id);
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const resetToDefaults = () => {
    setListings(INITIAL_LISTINGS);
    localStorage.setItem('cl_listings', JSON.stringify(INITIAL_LISTINGS));
  };

  const exportListings = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(listings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `craigslist-listings-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importListings = (imported: Listing[]): boolean => {
    if (!Array.isArray(imported) || imported.length === 0) return false;
    const validated = imported.filter(item => item && item.id && item.title);
    if (validated.length === 0) return false;
    setListings(validated);
    return true;
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  return (
    <ListingsContext.Provider value={{
      listings,
      addListing,
      getListingById,
      deleteListing,
      resetToDefaults,
      exportListings,
      importListings,
      favorites,
      toggleFavorite
    }}>
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
};
