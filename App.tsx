import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ListingsProvider } from './context/ListingsContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingChat } from './components/FloatingChat';

import { Home } from './pages/Home';
import { SearchResults } from './pages/SearchResults';
import { ListingDetail } from './pages/ListingDetail';
import { PostAd } from './pages/PostAd';
import { GlobalSites } from './pages/GlobalSites';
import { Account } from './pages/Account';
import { Safety } from './pages/Safety';
import { HelpCenter } from './pages/HelpCenter';
import { Forum } from './pages/Forum';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ListingsProvider>
          <ToastProvider>
            <Router>
              <div className="flex flex-col min-h-screen relative bg-[#fcfcfc] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                <Header />
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/post" element={<PostAd />} />
                    <Route path="/sites" element={<GlobalSites />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/favorites" element={<Account />} />
                    <Route path="/safety" element={<Safety />} />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/listing/:id" element={<ListingDetail />} />
                    <Route path="/search" element={<SearchResults />} />
                    
                    {/* City routes */}
                    <Route path="/:city" element={<Home />} />
                    <Route path="/:city/search" element={<SearchResults />} />
                    
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
                <Footer />
                <FloatingChat />
              </div>
            </Router>
          </ToastProvider>
        </ListingsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
