// Analytics abstraction layer for JobMe recruitment platform
// Safely integrates Google Analytics 4 (gtag) and Meta Pixel (fbq)

export const trackEvent = (eventName, params = {}) => {
  try {
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      }

      // Meta Pixel
      if (typeof window.fbq === 'function') {
        // Map standard events when applicable
        if (eventName === 'lead_complete') {
          window.fbq('track', 'Lead', params);
        } else if (eventName === 'job_view') {
          window.fbq('track', 'ViewContent', { content_name: params.job_title });
        } else if (eventName === 'apply_start') {
          window.fbq('track', 'Contact', params);
        } else {
          window.fbq('trackCustom', eventName, params);
        }
      }
    }
  } catch (err) {
    // Silent fail in production
    if (import.meta.env?.DEV) {
      console.warn('[Analytics Error]', err);
    }
  }
};

// Standard Funnel Actions
export const trackPageView = (pageName) => {
  trackEvent('page_view', { page: pageName });
};

export const trackJobSearch = (query, filters = {}) => {
  trackEvent('job_search', { search_term: query, ...filters });
};

export const trackJobView = (jobTitle, index = null) => {
  trackEvent('job_view', { job_title: jobTitle, job_index: index });
};

export const trackApplyStart = (jobTitle, channel = 'unknown') => {
  trackEvent('apply_start', { job_title: jobTitle, channel });
};

export const trackLeadStart = (leadType) => {
  trackEvent('lead_start', { lead_type: leadType });
};

export const trackLeadComplete = (leadType, channel, details = {}) => {
  trackEvent('lead_complete', { lead_type: leadType, channel, ...details });
};

export const trackChannelClick = (channel, context = '') => {
  trackEvent('channel_click', { channel, context });
};

export const trackSmartMatchStart = () => {
  trackEvent('smart_match_start');
};

export const trackSmartMatchComplete = (matchCount, preferences = {}) => {
  trackEvent('smart_match_complete', { match_count: matchCount, ...preferences });
};

export const trackAiQuery = (query) => {
  trackEvent('ai_query', { query });
};

export const trackAiJobResult = (matchCount) => {
  trackEvent('ai_job_result', { match_count: matchCount });
};

export const trackAiApply = (jobTitle) => {
  trackEvent('ai_apply', { job_title: jobTitle });
};
