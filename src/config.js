// ── App Configuration ──────────────────────────────────────────
// Replace placeholder values with real data before production deploy.

const config = {
  // Contact channels
  whatsappNumber: '48000000000', // replace with real WhatsApp number (digits only, e.g., '48123456789')
  telegramUsername: 'jobme_hr',  // replace with real Telegram username (without @)

  // Analytics (set via env or replace directly)
  ga4Id: 'G-GA4_PLACEHOLDER',   // Google Analytics 4 Measurement ID
  metaPixelId: 'PIXEL_PLACEHOLDER', // Meta Pixel ID

  // Contact email
  contactEmail: 'kontakt@jobme.pl',

  // Company info
  companyName: 'JobMe',
  location: 'Wrocław, Polska',

  // API
  apiBasePath: '/api',
};

export default config;
