// ── App Configuration (Single Source of Truth) ──────────────────
// Centralized configuration for JobMe recruitment platform

const config = {
  // Contact channels
  phone: '+48 574 220 849',
  phoneFormatted: '+48 574 220 849',
  phoneRaw: '48574220849',
  whatsappNumber: '48574220849',
  telegramUsername: 'jobmelead_bot',
  contactEmail: 'rekrutacja@jobme.pl',

  // Working hours SLA
  workingHours: '8:00 – 18:00 (pn. – pt.)',
  callbackSla: 'w ciągu 15 minut w godzinach pracy',

  // Company and legal registration
  companyName: 'GRUPA JOBME S.A.',
  nip: '8971826557',
  regon: '364989820',
  krs: '0000628931',
  kraz: '30456', // Krajowy Rejestr Agencji Zatrudnienia
  krazLabel: 'Certyfikat KRAZ nr 30456',
  location: 'Globis, Powstańców Śląskich 7A, 53-332 Wrocław',
  fullAddress: 'Powstańców Śląskich 7A, 53-332 Wrocław',

  // Analytics
  ga4Id: 'G-GA4_PLACEHOLDER',
  metaPixelId: 'PIXEL_PLACEHOLDER',

  // API
  apiBasePath: '/api',
};

export default config;
