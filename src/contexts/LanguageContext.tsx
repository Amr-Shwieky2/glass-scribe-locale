import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

interface LanguageContextType {
  currentLanguage: string;
  switchLanguage: (lang: string) => void;
  isRTL: boolean;
  supportedLanguages: Array<{ code: string; name: string; nativeName: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'EN' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const isRTL = currentLanguage === 'he' || currentLanguage === 'ar';

  useEffect(() => {
    // Set document direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, isRTL]);

  const switchLanguage = (lang: string) => {
    if (!supportedLanguages.find(l => l.code === lang)) return;
    
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    
    // Update URL to include language
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const isCurrentlyLanguagePath = supportedLanguages.some(l => l.code === pathSegments[0]);
    
    let newPath;
    if (isCurrentlyLanguagePath) {
      // Replace existing language
      pathSegments[0] = lang;
      newPath = '/' + pathSegments.join('/');
    } else {
      // Add language to path
      newPath = '/' + lang + location.pathname;
    }
    
    navigate(newPath);
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      switchLanguage,
      isRTL,
      supportedLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};