import React, { useState } from 'react';
import { X, Copy, Check, Share2, Twitter, MessageCircle, Send, QrCode } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Listing } from '../types';

interface ShareModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ listing, isOpen, onClose }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const shareText = `Check out this classified on Craigslist: ${listing.title} (${listing.price}) in ${listing.location}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400">
              <Share2 className="w-4 h-4" />
            </span>
            <h3 className="font-serif font-black text-lg text-gray-900 dark:text-gray-100">
              Share this Listing
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listing preview banner */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-2xl border border-gray-100 dark:border-gray-700/60">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-14 h-14 rounded-xl object-cover shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100 truncate">
              {listing.title}
            </h4>
            <span className="text-xs font-black text-purple-700 dark:text-purple-400 block mt-0.5">
              {listing.price}
            </span>
            <span className="text-[10px] text-gray-400 block truncate">
              {listing.location}
            </span>
          </div>
        </div>

        {/* Social channels */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <button
            onClick={shareToTwitter}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-sky-600 border border-gray-200 dark:border-gray-700 transition-all text-xs font-medium cursor-pointer"
          >
            <Twitter className="w-5 h-5 text-sky-500" />
            <span className="text-[10px] font-bold">Twitter</span>
          </button>

          <button
            onClick={shareToWhatsApp}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 border border-gray-200 dark:border-gray-700 transition-all text-xs font-medium cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 text-emerald-500" />
            <span className="text-[10px] font-bold">WhatsApp</span>
          </button>

          <button
            onClick={shareToTelegram}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 border border-gray-200 dark:border-gray-700 transition-all text-xs font-medium cursor-pointer"
          >
            <Send className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] font-bold">Telegram</span>
          </button>

          <button
            onClick={() => setShowQr(!showQr)}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 border border-gray-200 dark:border-gray-700 transition-all text-xs font-medium cursor-pointer"
          >
            <QrCode className="w-5 h-5 text-purple-600" />
            <span className="text-[10px] font-bold">QR Code</span>
          </button>
        </div>

        {/* QR Code view */}
        {showQr && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center animate-fadeIn">
            <div className="bg-white p-3 rounded-xl shadow-xs">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}`}
                alt="QR Code"
                className="w-32 h-32"
              />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
              Scan with phone camera to open listing instantly.
            </p>
          </div>
        )}

        {/* Direct link input with copy button */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Direct Shareable URL:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-600 dark:text-gray-300 font-mono outline-none"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-700 hover:bg-purple-800 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
