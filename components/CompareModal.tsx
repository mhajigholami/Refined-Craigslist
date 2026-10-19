import React from 'react';
import { X, Check, Star, MapPin, DollarSign, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { Listing } from '../types';
import { Link } from 'react-router-dom';

interface CompareModalProps {
  listings: Listing[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ listings, isOpen, onClose, onRemove }) => {
  if (!isOpen || listings.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/80 dark:bg-gray-850">
          <div>
            <h3 className="font-serif font-black text-lg sm:text-xl text-gray-900 dark:text-gray-100">
              Side-by-Side Classified Comparison ({listings.length}/3)
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Evaluate specifications, price value, seller reputation, and location to make the smartest trade.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className={`grid grid-cols-1 sm:grid-cols-${listings.length} gap-4 sm:gap-6`}>
            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50/70 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col justify-between space-y-4 relative"
              >
                {/* Remove button */}
                <button
                  onClick={() => onRemove(item.id)}
                  className="absolute top-2 right-2 p-1 bg-white/80 dark:bg-gray-800/80 rounded-lg text-gray-400 hover:text-red-600 shadow-2xs transition-colors z-10"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Photo & Price */}
                <div>
                  <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-black/10">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-purple-900/90 text-white font-black text-sm px-2.5 py-1 rounded-lg">
                      {item.price}
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-purple-600 shrink-0" />
                    <span>{item.location}</span>
                  </span>
                </div>

                {/* Specs comparison rows */}
                <div className="space-y-2 text-xs border-t border-gray-200/80 dark:border-gray-800 pt-3">
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-400 font-medium">Category:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200 uppercase text-[10px]">{item.category}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-400 font-medium">Seller:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{item.seller?.name || 'Community Poster'}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-400 font-medium">Seller Rating:</span>
                    <span className="font-black text-amber-500">{item.seller?.rating || 5.0} ★</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-400 font-medium">Identity Status:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{item.seller?.phoneVerified ? 'Verified' : 'Member'}</span>
                    </span>
                  </div>

                  <div className="pt-1">
                    <span className="text-gray-400 font-medium block text-[10px] mb-1">Description:</span>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* View Listing CTA */}
                <Link
                  to={`/listing/${item.id}`}
                  onClick={onClose}
                  className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <span>Open Full Ad</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
