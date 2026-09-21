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
      desc: 'Aktualne oferty pracy: produkcja słodyczy, paczkomaty, butle gazowe. Legalne zatrudnienie, umowa zlecenie z ZUS, zakwaterowanie. Aplikuj przez WhatsApp lub Telegram!',
    },
    ua: {
      title: 'Вакансії — JobMe | Робота Виробництво, Логістика Вроцлав та Нижня Сілезія',
      desc: 'Актуальні вакансії: виробництво солодощів, поштомати, газові балони. Легальне працевлаштування, договір злеценя з ZUS, проживання.',
    },
    en: {
      title: 'Job Openings — JobMe | Production, Logistics Jobs Wrocław & Lower Silesia',
      desc: 'Current job openings: confectionery, parcel lockers, gas cylinders. Legal employment, mandate contract with ZUS, accommodation.',
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
  blog: {
    pl: {
      title: 'Centrum Wiedzy — JobMe | Poradniki: Legalizacja, Zarobki, Upskilling',
      desc: 'Centrum Wiedzy JobMe — praktyczne poradniki dla kandydatów i pracodawców. Karta Pobytu, status studenta, upskilling, rotacja pracowników.',
    },
    ua: {
      title: 'Центр Знань — JobMe | Посібники: Легалізація, Доходи, Навчання',
      desc: 'Центр Знань JobMe — практичні посібники для кандидатів та роботодавців. Карта побиту, статус студента, підвищення кваліфікації.',
    },
    en: {
      title: 'Knowledge Center — JobMe | Guides: Legalization, Earnings, Upskilling',
      desc: 'JobMe Knowledge Center — practical guides for candidates and employers. Residence Card, student tax benefits, employee upskilling, turnover reduction.',
    },
  },
  notFound: {
    pl: { title: '404 — Strona nie znaleziona | JobMe', desc: 'Nie znaleziono żądanej strony w JobMe.' },
    ua: { title: '404 — Сторінку не знайдено | JobMe', desc: 'Сторінку не знайдено.' },
    en: { title: '404 — Page Not Found | JobMe', desc: 'Page not found.' },
  },
};

const BREADCRUMB_LABELS = {
  pl: { home: 'Strona główna', jobs: 'Oferty Pracy', privacy: 'Polityka Prywatności', blog: 'Centrum Wiedzy' },
  ua: { home: 'Головна', jobs: 'Вакансії', privacy: 'Політика Конфіденційності', blog: 'Центр Знань' },
  en: { home: 'Home', jobs: 'Job Openings', privacy: 'Privacy Policy', blog: 'Knowledge Center' },
};

function cleanupHead() {
  document.querySelectorAll(
    'link[rel="alternate"][hreflang], link[rel="canonical"], meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]'
  ).forEach((el) => el.remove());
}

function setMetaTag(attrName, attrValue, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setBreadcrumbsForVacancy(vacancy, lang) {
  const scriptId = 'ld-breadcrumb';
  const old = document.getElementById(scriptId);
  if (old) old.remove();

  const labels = BREADCRUMB_LABELS[lang] || BREADCRUMB_LABELS.pl;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: labels.home, item: BASE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: labels.jobs, item: BASE_URL + '/oferty' },
      { '@type': 'ListItem', position: 3, name: vacancy.jobTitle, item: `${BASE_URL}/oferty/${vacancy.slug}` },
    ],
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = scriptId;
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
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
      { '@type': 'ListItem', position: 2, name: labels[page] || page, item: `${BASE_URL}/${page === 'jobs' ? 'oferty' : page}` },
    ],
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = scriptId;
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

export default function SEOHead({ page = 'home', vacancy = null }) {
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    cleanupHead();

    let pageTitle = '';
    let pageDesc = '';
    let canonicalUrl = `${BASE_URL}/`;

    if (vacancy) {
      pageTitle = `${vacancy.jobTitle} | JobMe Praca w Polsce`;
      pageDesc = `${vacancy.jobTitle} — ${vacancy.locationSummary || vacancy.location}. Wynagrodzenie: ${vacancy.salary}. Zakwaterowanie: ${vacancy.housingPrice === 0 ? 'Darmowe' : vacancy.housingPrice ? vacancy.housingPrice + ' zł/mc' : 'Zgodnie z ofertą'}. Legalna umowa z ZUS. Aplikuj w 1 minutę!`;
      canonicalUrl = `${BASE_URL}/oferty/${vacancy.slug}`;

      setBreadcrumbsForVacancy(vacancy, currentLanguage);
    } else {
      const meta = PAGE_META[page]?.[currentLanguage] || PAGE_META[page]?.pl || PAGE_META.home.pl;
      pageTitle = meta.title;
      pageDesc = meta.desc;
      canonicalUrl = page === 'home' ? `${BASE_URL}/` : `${BASE_URL}/${page === 'jobs' ? 'oferty' : page}`;
      setBreadcrumb(page, currentLanguage);
    }

    // Set Document Title
    if (pageTitle) document.title = pageTitle;

    // Standard Meta Description
    setMetaTag('name', 'description', pageDesc);

    // Open Graph
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDesc);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', vacancy ? 'article' : 'website');
    setMetaTag('property', 'og:site_name', 'JobMe — Agencja Pracy');
    setMetaTag('property', 'og:locale', currentLanguage === 'ua' ? 'uk_UA' : currentLanguage === 'en' ? 'en_US' : 'pl_PL');

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDesc);

    // Canonical link
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = canonicalUrl;
    document.head.appendChild(canonicalLink);

    return () => cleanupHead();
  }, [page, vacancy, currentLanguage]);

  return null;
}
