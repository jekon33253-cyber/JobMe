import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const BASE_URL = 'https://jobme.pl';

const PAGE_META = {
  home: {
    pl: {
      title: 'JobMe — Agencja Pracy Wrocław | Legalne Zatrudnienie Dolny Śląsk',
      desc: 'Nowoczesna agencja pracy we Wrocławiu. Oferty pracy produkcja, logistyka, magazyn. Legalne zatrudnienie, darmowe szkolenia UDT/SEP, zakwaterowanie.',
    },
    ua: {
      title: 'JobMe — Агенція Праці Вроцлав | Легальне Працевлаштування',
      desc: 'Сучасна агенція праці у Вроцлаві. Вакансії: виробництво, логістика, склад. Легальне працевлаштування, безкоштовне навчання, проживання.',
    },
    en: {
      title: 'JobMe — Recruitment Agency Wrocław | Legal Employment Lower Silesia',
      desc: 'Modern recruitment agency in Wrocław. Job offers: production, logistics, warehouse. Legal employment, free UDT/SEP training, accommodation.',
    },
  },
  jobs: {
    pl: {
      title: 'Oferty Pracy — JobMe | Praca Produkcja, Logistyka Wrocław i Dolny Śląsk',
      desc: 'Aktualne oferty pracy: produkcja słodyczy, paczkomaty, butle gazowe. Legalne zatrudnienie, umowa zlecenie z ZUS, darmowe zakwaterowanie. Aplikuj przez WhatsApp lub Telegram!',
    },
    ua: {
      title: 'Вакансії — JobMe | Робота Виробництво, Логістика Вроцлав та Нижня Сілезія',
      desc: 'Актуальні вакансії: виробництво солодощів, поштомати, газові балони. Легальне працевлаштування, договір злеценя з ZUS, безкоштовне проживання.',
    },
    en: {
      title: 'Job Openings — JobMe | Production, Logistics Jobs Wrocław & Lower Silesia',
      desc: 'Current job openings: confectionery, parcel lockers, gas cylinders. Legal employment, mandate contract with ZUS, free accommodation.',
    },
  },
  privacy: {
    pl: {
      title: 'Polityka Prywatności — JobMe',
      desc: 'Polityka prywatności JobMe — jak przetwarzamy dane osobowe. RODO, cookies, prawa użytkownika.',
    },
    ua: {
      title: 'Політика Конфіденційності — JobMe',
      desc: 'Політика конфіденційності JobMe — як обробляються персональні дані. GDPR, cookies, права користувача.',
    },
    en: {
      title: 'Privacy Policy — JobMe',
      desc: 'JobMe privacy policy — how we process personal data. GDPR, cookies, user rights.',
    },
  },
  notFound: {
    pl: { title: '404 — Strona nie znaleziona | JobMe', desc: '' },
    ua: { title: '404 — Сторінку не знайдено | JobMe', desc: '' },
    en: { title: '404 — Page Not Found | JobMe', desc: '' },
  },
};

const BREADCRUMB_LABELS = {
  pl: { home: 'Strona główna', jobs: 'Oferty Pracy', privacy: 'Polityka Prywatności' },
  ua: { home: 'Головна', jobs: 'Вакансії', privacy: 'Політика Конфіденційності' },
  en: { home: 'Home', jobs: 'Job Openings', privacy: 'Privacy Policy' },
};

// ── helpers ────────────────────────────────────────────────────
function cleanupHead() {
  document.querySelectorAll(
    'link[rel="alternate"][hreflang], link[rel="canonical"], meta[name="description"]'
  ).forEach(el => el.remove());
}

function buildUrl(lang) {
  const url = new URL(BASE_URL);
  url.searchParams.set('lang', lang);
  return url.toString();
}

function setMetaDescription(text) {
  if (!text) return;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', text);
}

function setBreadcrumb(page, lang) {
  const scriptId = 'ld-breadcrumb';
  const old = document.getElementById(scriptId);
  if (old) old.remove();
  if (page === 'home') return;

  const labels = BREADCRUMB_LABELS[lang] || BREADCRUMB_LABELS.pl;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: labels.home, item: BASE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: labels[page] || page, item: buildUrl(lang) },
    ],
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = scriptId;
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

// ── component ──────────────────────────────────────────────────
export default function SEOHead({ page = 'home' }) {
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const meta = PAGE_META[page]?.[currentLanguage] || PAGE_META[page]?.pl;

    // Title + description
    if (meta?.title) document.title = meta.title;
    setMetaDescription(meta?.desc || '');

    // BreadcrumbList
    setBreadcrumb(page, currentLanguage);

    // hreflang + canonical
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

    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = buildUrl('pl');
    head.appendChild(xDefault);

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = buildUrl(currentLanguage);
    head.appendChild(canonical);

    return () => cleanupHead();
  }, [page, currentLanguage]);

  return null;
}
