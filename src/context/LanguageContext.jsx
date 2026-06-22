import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

const VALID_LANGS = ['pl', 'ua', 'en'];
const STORAGE_KEY = 'jobme_language';

function getLangFromParams() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  return VALID_LANGS.includes(lang) ? lang : null;
}

function getInitialLang() {
  // 1. URL param wins
  const urlLang = getLangFromParams();
  if (urlLang) return urlLang;
  // 2. localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID_LANGS.includes(saved)) return saved;
  } catch (e) { /* ignore */ }
  // 3. Default
  return 'pl';
}

function syncUrl(lang) {
  const url = new URL(window.location);
  url.searchParams.set('lang', lang);
  // History.replaceState keeps it clean — no redundant history entries
  window.history.replaceState(null, '', url.toString());
}

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(getInitialLang);

  // Set language + persist + update URL
  const changeLanguage = (lang) => {
    if (!VALID_LANGS.includes(lang)) return;
    setCurrentLanguage(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    syncUrl(lang);
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage === 'ua' ? 'uk' : currentLanguage;
    syncUrl(currentLanguage);
  }, []); // only on mount

  const t = (key) => {
    const keys = key.split('.');
    let result = translations[currentLanguage];
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        let fallback = translations['pl'];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return key;
          }
        }
        return fallback;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
