import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { useToast } from '../context/ToastContext';
import { MiniMap } from '../components/MiniMap';
import { ShareModal } from '../components/ShareModal';
import { ReportModal } from '../components/ReportModal';
import { ChatOfferModal } from '../components/ChatOfferModal';
import { 
  MapPin, 
  Clock, 
  Bookmark, 
  Share2, 
  Flag, 
  Printer, 
  ShieldCheck, 
  ChevronRight, 
  MessageSquare,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Shield,
  Zap
} from 'lucide-react';

export const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getListingById, favorites, toggleFavorite } = useListings();
  const { showToast } = useToast();

  const listing = getListingById(id || '');

  const [activeImage, setActiveImage] = useState<string>(listing?.imageUrl || '');
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] dark:bg-gray-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl">
          <h2 className="font-serif font-black text-2xl text-gray-900 dark:text-gray-100 mb-2">
            Listing Not Found
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            This ad may have expired or been removed by its author.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 text-white rounded-xl text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Craigslist</span>
          </Link>
        </div>
      </div>
    );
  }

  const isFav = favorites.includes(listing.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this listing on Craigslist: ${listing.title} - ${listing.price}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-gray-950 font-sans pb-20 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 overflow-x-auto no-scrollbar">
          <Link to="/" className="hover:text-purple-700 dark:hover:text-purple-400 font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/sfbay/search?category=${listing.category}`} className="hover:text-purple-700 capitalize font-medium">
            {listing.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-gray-900 dark:text-gray-100 truncate max-w-xs">
            {listing.title}
          </span>
        </div>

        {/* Main Grid: Left Gallery & Content, Right Sidebar Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 leading-tight">
                  {listing.title}
                </h1>
                <span className="font-serif font-black text-2xl sm:text-3xl text-purple-700 dark:text-purple-400 shrink-0">
                  {listing.price}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  <span>{listing.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Posted recently</span>
                </span>
                <span>Post ID: {listing.id}</span>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xs">
              <div className="relative h-[380px] sm:h-[480px] w-full bg-black/90 flex items-center justify-center">
                <img 
                  src={activeImage || listing.imageUrl} 
                  alt={listing.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnails strip if multiple photos exist */}
              {listing.gallery && listing.gallery.length > 1 && (
                <div className="p-3 bg-gray-50 dark:bg-gray-850 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {listing.gallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        (activeImage || listing.imageUrl) === imgUrl
                          ? 'border-purple-600 ring-2 ring-purple-600/30 scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Attributes Grid */}
            {listing.attributes && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-xs">
                <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">
                  Specifications & Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(listing.attributes).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-800/80 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700/80">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">{key}</span>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-base text-gray-900 dark:text-gray-100">
                Description
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Location & MiniMap */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span>General Location</span>
                </h3>
                <span className="text-xs text-gray-400 font-medium">{listing.location}</span>
              </div>
              <div className="h-60 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <MiniMap locationName={listing.location} latitude={listing.latitude} longitude={listing.longitude} />
              </div>
              <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Privacy Guard: To protect seller safety, an approximate neighborhood circle is shown rather than exact home address.</span>
              </p>
            </div>

          </div>

          {/* Right Sidebar: Seller info, Safety & Actions */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
              <button
                onClick={() => setIsChatModalOpen(true)}
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message & Negotiate with Seller</span>
              </button>

              <button
                onClick={() => setIsChatModalOpen(true)}
                className="w-full py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-purple-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Make a Direct Offer</span>
              </button>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => toggleFavorite(listing.id)}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    isFav 
                      ? 'bg-purple-50 dark:bg-purple-950 border-purple-300 text-purple-700 dark:text-purple-400' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isFav ? 'fill-purple-700' : ''}`} />
                  <span className="text-[10px]">{isFav ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="py-2 px-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-[10px]">Share</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="py-2 px-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span className="text-[10px]">Print</span>
                </button>

                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="py-2 px-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Report suspicious ad"
                >
                  <Flag className="w-4 h-4" />
                  <span className="text-[10px]">Flag</span>
                </button>
              </div>
            </div>

            {/* Seller Reputation Card */}
            {listing.seller && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-gray-400">
                    Seller Trust Profile
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded-md">
                    <Zap className="w-3 h-3 text-purple-600 fill-current" />
                    <span>Replies in 15 min</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-gray-900 dark:text-gray-100">{listing.seller.name}</h5>
                    <span className="text-xs text-gray-400">Member since {listing.seller.joinedDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-amber-500">{listing.seller.rating} ★★★★★</span>
                    <span className="text-[10px] text-gray-400 block">100% Positive Feedback</span>
                  </div>
                </div>

                {listing.seller.phoneVerified && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Identity & Phone Verified Community Poster</span>
                  </div>
                )}
              </div>
            )}

            {/* Safe Buying Advice */}
            <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 rounded-2xl p-4 text-xs space-y-2">
              <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Craigslist Community Shield</span>
              </h4>
              <ul className="space-y-1.5 text-amber-800 dark:text-amber-300/90 text-[11px] list-disc list-inside">
                <li>Meet in a public, well-lit location (e.g. coffee shop or police station lobby).</li>
                <li>Never wire funds, pay with gift cards, or send advance deposits.</li>
                <li>Inspect item condition thoroughly before paying cash.</li>
              </ul>
              <Link to="/safety" className="text-purple-700 dark:text-purple-400 font-bold hover:underline block pt-1 text-[11px]">
                Read full anti-scam guide →
              </Link>
            </div>

          </div>
        </div>

        {/* Real-time In-App Chat & Offer Modal */}
        <ChatOfferModal
          listing={listing}
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
        />

        {/* Viral Social Share Modal */}
        <ShareModal
          listing={listing}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />

        {/* Community Flag / Report Scam Modal */}
        <ReportModal
          listing={listing}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />

      </div>
    </div>
  );
};
