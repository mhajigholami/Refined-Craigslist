import React, { useRef, useState } from 'react';
import { useListings } from '../context/ListingsContext';
import { useToast } from '../context/ToastContext';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  X, 
  CheckCircle, 
  Layers, 
  Map, 
  FileCode, 
  Sparkles,
  GitBranch,
  ShieldCheck
} from 'lucide-react';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({ isOpen, onClose }) => {
  const { listings, resetToDefaults, exportListings, importListings, addListing, favorites } = useListings();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isResetting, setIsResetting] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      resetToDefaults();
      setIsResetting(false);
      showToast('Reset successfully to default Craigslist seed data!', 'success');
    }, 300);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const success = importListings(json);
        if (success) {
          showToast(`Successfully imported ${json.length} listings!`, 'success');
          onClose();
        } else {
          showToast('Invalid JSON file format. Expected an array of listings.', 'error');
        }
      } catch (err) {
        showToast('Failed to parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleCreateSampleAd = () => {
    const sampleItems = [
      {
        title: '2022 MacBook Pro 14" M1 Pro (16GB, 512GB Space Gray)',
        price: '$1,150',
        category: 'electronics',
        location: 'SOMA, San Francisco',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        description: 'Mint condition MacBook Pro. Battery health 96%. Includes original MagSafe charger and box. Pickup in SOMA.',
        lat: 37.7785,
        lng: -122.3995
      },
      {
        title: 'Mid-Century Modern Teak Dining Table + 4 Chairs',
        price: '$450',
        category: 'furniture',
        location: 'Mission District, San Francisco',
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        description: 'Authentic vintage Danish-style teak dining table with extendable leaves. Sturdy and freshly oiled.',
        lat: 37.7600,
        lng: -122.4190
      },
      {
        title: '2019 Specialized Allez Road Bike (54cm Frame)',
        price: '$680',
        category: 'bicycles',
        location: 'Berkeley, CA',
        imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
        description: 'Lightweight aluminum frame, Shimano Claris groupset. Recently tuned, brand new Continental tires.',
        lat: 37.8715,
        lng: -122.2730
      }
    ];

    const pick = sampleItems[Math.floor(Math.random() * sampleItems.length)];
    addListing({
      title: pick.title,
      price: pick.price,
      description: pick.description,
      category: pick.category,
      location: pick.location,
      citySlug: 'sfbay',
      imageUrl: pick.imageUrl,
      latitude: pick.lat + (Math.random() - 0.5) * 0.01,
      longitude: pick.lng + (Math.random() - 0.5) * 0.01,
      seller: {
        id: `sel-${Date.now()}`,
        name: 'Demo Poster',
        rating: 4.9,
        phoneVerified: true,
        joinedDate: '2024'
      }
    });

    showToast(`Added sample classified: "${pick.title}"!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400">
              <GitBranch className="w-6 h-6" />
            </span>
            <div>
              <h2 className="font-serif font-black text-xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>GitHub Zero-Config & Data Manager</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                100% self-contained architecture ready to publish directly to GitHub.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Architecture Status Badges */}
        <div className="bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-300">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Plug & Play Verification (No API Keys or Cloud Billing Required)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-gray-900/80 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
              <Map className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span><strong>Maps:</strong> Esri World Street CDN (Clean, no API keys)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-gray-900/80 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
              <Database className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span><strong>Storage:</strong> Reactive LocalStorage ({listings.length} active ads)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-gray-900/80 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
              <Layers className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span><strong>Photos:</strong> In-browser canvas compressor + Base64</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-gray-900/80 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
              <FileCode className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span><strong>Setup:</strong> <code>npm run dev</code> works instantly</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Data Actions:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Export JSON */}
            <button
              type="button"
              onClick={exportListings}
              className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-500 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-600" />
              <span>Export Classifieds (JSON)</span>
            </button>

            {/* Import JSON */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileImport}
                accept=".json"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-500 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-purple-600" />
                <span>Import Classifieds (JSON)</span>
              </button>
            </div>

            {/* Quick Sample Ad */}
            <button
              type="button"
              onClick={handleCreateSampleAd}
              className="flex items-center justify-center gap-2 p-3 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Random Sample Ad</span>
            </button>

            {/* Reset to Seed Data */}
            <button
              type="button"
              onClick={handleReset}
              disabled={isResetting}
              className="flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 hover:bg-red-100 text-red-700 dark:text-red-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
              <span>Reset to Clean Seed Data</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <span>Active Listings: <strong>{listings.length}</strong> | Saved: <strong>{favorites.length}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
