import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Check localStorage first
    const savedLang = localStorage.getItem('jobme_language');
    if (savedLang && ['pl', 'ua', 'en'].includes(savedLang)) {
      return savedLang;
    }
    return 'pl';
  });

  useEffect(() => {
    localStorage.setItem('jobme_language', currentLanguage);
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const t = (key) => {
    const keys = key.split('.');
    let result = translations[currentLanguage];
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        // Fallback to Polish if translation is missing
        let fallback = translations['pl'];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return key; // return key itself if totally missing
          }
        }
        return fallback;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
