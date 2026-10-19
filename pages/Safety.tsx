import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, CheckCircle, ArrowLeft, Lock, Users, PhoneCall } from 'lucide-react';

export const Safety: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-gray-950 font-sans pb-24 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-purple-700 dark:hover:text-purple-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Craigslist</span>
        </Link>

        <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-serif font-black text-3xl text-gray-900 dark:text-gray-100 mb-2">
              Craigslist Safety & Scam Prevention
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Deal locally with folks you can meet in person to avoid 99% of scam attempts.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Core Rules for Safe Transactions</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 space-y-1">
                <span className="font-bold text-gray-900 dark:text-gray-100 block">1. Meet in Public Spaces</span>
                <p className="text-gray-600 dark:text-gray-400">Use well-lit, populated locations such as coffee shops, banks, or official designated police safe-exchange zones.</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 space-y-1">
                <span className="font-bold text-gray-900 dark:text-gray-100 block">2. Cash or Escrow on Hand</span>
                <p className="text-gray-600 dark:text-gray-400">Pay only upon physically examining the merchandise. Never send advance deposits or non-refundable reservation fees.</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 space-y-1">
                <span className="font-bold text-gray-900 dark:text-gray-100 block">3. Beware Remote Inquiries</span>
                <p className="text-gray-600 dark:text-gray-400">Be skeptical of buyers who claim to be out of the country, stationed abroad, or sending movers with cashier checks.</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 space-y-1">
                <span className="font-bold text-gray-900 dark:text-gray-100 block">4. Guard Personal Identifiers</span>
                <p className="text-gray-600 dark:text-gray-400">Never share your two-factor SMS codes, banking PINs, or SSN with any caller or messenger.</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs space-y-2">
            <h3 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Recognizing Common Frauds</span>
            </h3>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
              If someone asks you to pay via Western Union, MoneyGram, Zelle without meeting, cryptocurrency, or gift cards (Apple, eBay), it is almost certainly fraudulent. Craigslist does NOT offer purchase protection programs or escrow payment links.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
