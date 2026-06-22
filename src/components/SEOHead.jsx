import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const BASE_URL = 'https://jobme.pl';

const PAGE_META = {
  home: {
    pl: { title: 'JobMe — Agencja Pracy Wrocław | Legalne Zatrudnienie Dolny Śląsk' },
    ua: { title: 'JobMe — Агенція Праці Вроцлав | Легальне Працевлаштування' },
    en: { title: 'JobMe — Recruitment Agency Wrocław | Legal Employment Lower Silesia' },
  },
  jobs: {
    pl: { title: 'Oferty Pracy — JobMe | Praca Wrocław i Dolny Śląsk' },
    ua: { title: 'Вакансії — JobMe | Робота Вроцлав та Нижня Сілезія' },
    en: { title: 'Job Openings — JobMe | Jobs in Wrocław & Lower Silesia' },
  },
  privacy: {
    pl: { title: 'Polityka Prywatności — JobMe' },
    ua: { title: 'Політика Конфіденційності — JobMe' },
    en: { title: 'Privacy Policy — JobMe' },
  },
  notFound: {
    pl: { title: '404 — Strona nie znaleziona | JobMe' },
    ua: { title: '404 — Сторінку не знайдено | JobMe' },
    en: { title: '404 — Page Not Found | JobMe' },
  },
};

// Remove existing hreflang/canonical links
function cleanupHead() {
  document.querySelectorAll('link[rel="alternate"][hreflang], link[rel="canonical"]').forEach(el => el.remove());
}

// Build canonical URL
function buildUrl(lang) {
  const url = new URL(BASE_URL);
  url.searchParams.set('lang', lang);
  return url.toString();
}

export default function SEOHead({ page = 'home' }) {
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    // 1. Title
    const meta = PAGE_META[page]?.[currentLanguage] || PAGE_META[page]?.pl;
    if (meta?.title) document.title = meta.title;

    // 2. hreflang + canonical
    cleanupHead();
    const head = document.head;
    const langMap = { pl: 'pl', ua: 'uk', en: 'en' };

    Object.entries(langMap).forEach(([code, hreflangCode]) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hreflangCode;
      link.href = buildUrl(code);
      head.appendChild(link);
    });

    // x-default
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = buildUrl('pl');
    head.appendChild(xDefault);

    // Canonical
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = buildUrl(currentLanguage);
    head.appendChild(canonical);

    return () => cleanupHead();
  }, [page, currentLanguage]);

  return null; // This component renders nothing — it only manipulates <head>
}
