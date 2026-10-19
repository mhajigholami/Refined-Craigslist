import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Search, BookOpen, MessageSquare, ShieldCheck } from 'lucide-react';

export const HelpCenter: React.FC = () => {
  const faqs = [
    {
      q: 'How do I post a classified advertisement?',
      a: 'Click "Post an Ad" in the top bar or homepage sidebar, choose your category, enter title, price, description, and photo, and click Publish. Your ad appears instantly on search and the map.'
    },
    {
      q: 'How does the Classifieds Map Explorer work?',
      a: 'The map plots all community ads by their neighborhood coordinates. You can toggle between the global Continents overview and Local Classifieds, filter by category (Vehicles, Housing, Goods), or click on any price pin to preview details.'
    },
    {
      q: 'Is posting an ad free on Craigslist?',
      a: 'Yes! Standard community, goods for sale, housing, and general listings are 100% free of charge.'
    },
    {
      q: 'How do I edit or delete my listing?',
      a: 'Go to "My Account" from the header or sidebar to manage all your active listings and update their details anytime.'
    }
  ];

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
              <HelpCircle className="w-6 h-6" />
            </div>
            <h1 className="font-serif font-black text-3xl text-gray-900 dark:text-gray-100 mb-2">
              Help Center & FAQ
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Frequently asked questions and guides for using Craigslist Refined.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 space-y-2">
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{faq.q}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-purple-900 dark:text-purple-200 text-sm">Need more help?</h4>
              <p className="text-purple-700 dark:text-purple-300">Join our community discussions in the forums.</p>
            </div>
            <Link
              to="/forum"
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs shrink-0"
            >
              Open Forums
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
