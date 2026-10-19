import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'fa' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  en: {
    'common.post': 'post an ad',
    'common.account': 'my account',
    'common.search': 'search craigslist',
    'common.allCities': 'all cities & map',
    'map.continents': 'Continents View',
    'map.cityAds': 'City Classifieds',
    'map.searchArea': 'Search this area'
  },
  fa: {
    'common.post': 'ثبت رایگان آگهی',
    'common.account': 'حساب کاربری',
    'common.search': 'جستجو در کریگزلیست',
    'common.allCities': 'نقشه و شهرها',
    'map.continents': 'نمای قاره‌ها',
    'map.cityAds': 'آگهی‌های شهری',
    'map.searchArea': 'جستجو در این منطقه'
  },
  es: {
    'common.post': 'publicar anuncio',
    'common.account': 'mi cuenta',
    'common.search': 'buscar en craigslist',
    'common.allCities': 'todas las ciudades',
    'map.continents': 'Vista Continentes',
    'map.cityAds': 'Anuncios Locales',
    'map.searchArea': 'Buscar en esta área'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return DICTIONARY[language]?.[key] || DICTIONARY['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
