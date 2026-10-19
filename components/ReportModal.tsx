import React, { useState } from 'react';
import { X, Flag, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Listing } from '../types';

interface ReportModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  { id: 'scam', label: 'Suspected Scam or Fraudulent Payment Request' },
  { id: 'overpriced', label: 'Suspiciously Low or Deceptive Price' },
  { id: 'stolen', label: 'Stolen Goods or Prohibited Item' },
  { id: 'duplicate', label: 'Duplicate / Spam Posting' },
  { id: 'wrong_category', label: 'Misclassified or Wrong Category' },
  { id: 'offensive', label: 'Offensive or Inappropriate Content' }
];

export const ReportModal: React.FC<ReportModalProps> = ({ listing, isOpen, onClose }) => {
  const { showToast } = useToast();
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0].id);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Thank you. This listing has been flagged for community safety review.', 'success');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif font-black text-lg text-gray-900 dark:text-gray-100">
                Flag / Report Listing
              </h3>
              <p className="text-[11px] text-gray-400">Post ID: {listing.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
              Why are you reporting this posting?
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {REPORT_REASONS.map(r => (
                <label
                  key={r.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedReason === r.id
                      ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30 text-red-900 dark:text-red-300 font-bold'
                      : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={r.id}
                    checked={selectedReason === r.id}
                    onChange={() => setSelectedReason(r.id)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Additional context or evidence (optional)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Seller asked to transfer money via gift cards or wire transfer..."
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs font-medium dark:text-white outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting Flag...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
