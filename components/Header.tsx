import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  Bookmark, 
  User as UserIcon, 
  Globe, 
  Sun, 
  Moon,
  Menu,
  X,
  MapPin,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { useLanguage } from '../context/LanguageContext';
import { DataManagementModal } from './DataManagementModal';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { favorites } = useListings();
  const { language, setLanguage, t } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/sfbay/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Location */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 group">
            <span className="font-serif font-black text-2xl tracking-tighter text-purple-700 dark:text-purple-400 group-hover:opacity-90 transition-opacity">
              craigslist
            </span>
            <span className="hidden sm:inline-block text-[10px] font-sans font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
              Refined
            </span>
          </Link>

          <Link 
            to="/sites" 
            className="hidden md:flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors"
            title="Switch city or view world map"
          >
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>SF Bay Area</span>
          </Link>
        </div>

        {/* Center: Search input */}
        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder={t('common.search') + '...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2 text-xs font-medium dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          
          {/* Post Ad Button */}
          <Link
            to="/post"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline capitalize">{t('common.post')}</span>
          </Link>

          {/* Favorites */}
          <Link
            to="/favorites"
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors relative"
            title="Saved listings"
          >
            <Bookmark className="w-4 h-4" />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-purple-700 text-white text-[9px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            to="/account"
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            title="Account profile"
          >
            <UserIcon className="w-4 h-4" />
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Data Manager & GitHub Zero-Config Demo */}
          <button
            onClick={() => setIsDataModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/70 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors"
            title="GitHub Zero-Config & Demo Data Manager"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Data</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'fa' : language === 'fa' ? 'es' : 'en')}
            className="px-2.5 py-1 text-xs font-bold uppercase rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Switch Language"
          >
            {language}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Data Management Modal */}
      <DataManagementModal 
        isOpen={isDataModalOpen} 
        onClose={() => setIsDataModalOpen(false)} 
      />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-3 animate-slide-down">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder={t('common.search') + '...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2 text-xs font-medium dark:text-white outline-none"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              to="/sites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200"
            >
              <Globe className="w-4 h-4 text-purple-600" />
              <span>Worldwide Sites & Map</span>
            </Link>
            <Link
              to="/safety"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200"
            >
              <UserIcon className="w-4 h-4 text-green-600" />
              <span>Safety & Avoid Scams</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
