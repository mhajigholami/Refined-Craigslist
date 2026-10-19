import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 px-4 sm:px-6 transition-colors">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
        
        {/* Left: Copyright */}
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-gray-800 dark:text-gray-200">craigslist refined</span>
          <span>© {new Date().getFullYear()}</span>
          <span>·</span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Deal locally, stay safe
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link to="/help" className="hover:text-purple-700 dark:hover:text-purple-400 hover:underline">help & faq</Link>
          <Link to="/safety" className="hover:text-purple-700 dark:hover:text-purple-400 hover:underline">avoid scams & safety</Link>
          <Link to="/privacy" className="hover:text-purple-700 dark:hover:text-purple-400 hover:underline">privacy policy</Link>
          <Link to="/terms" className="hover:text-purple-700 dark:hover:text-purple-400 hover:underline">terms of use</Link>
          <Link to="/sites" className="hover:text-purple-700 dark:hover:text-purple-400 hover:underline">all cities & map</Link>
          <Link to="/forum" className="hover:text-purple-700 dark:hover:text-purple-400 hover:underline">forums</Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          <span>for Craigslist community</span>
        </div>
      </div>
    </footer>
  );
};
