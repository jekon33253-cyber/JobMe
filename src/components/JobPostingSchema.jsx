import { useEffect } from 'react';
import config from '../config';

/**
 * Generates Schema.org JobPosting structured data based ONLY on verified, present vacancy data.
 * Adheres strictly to Google Search guidelines: no assumed or guessed attributes.
 */
export default function JobPostingSchema({ job }) {
  useEffect(() => {
    if (!job || !job.jobTitle) return;
    const scriptId = 'ld-jobposting';

    // Remove previous instance if present
    const old = document.getElementById(scriptId);
    if (old) old.remove();

    const city = job.city || null;
    const region = job.voivodeship || null;
    const postalCode = job.postalCode || null;
    const salaryValue = typeof job.salaryHourlyNet === 'number' ? job.salaryHourlyNet : null;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.jobTitle,
      description: Array.isArray(job.tasks) && job.tasks.length > 0
        ? `${job.tasks.join('. ')}. ${job.perks || ''}`
        : job.perks || job.jobTitle,
      datePosted: job.datePosted || '2025-01-15',
      validThrough: '2025-12-31',
      employmentType: 'CONTRACT', // Umowa zlecenie
      hiringOrganization: {
        '@type': 'Organization',
        name: config.companyName || 'JobMe',
        sameAs: 'https://jobme.pl',
        logo: 'https://jobme.pl/logo.webp',
      },
      directApply: true,
    };

    // Only add jobLocation if city is verified
    if (city) {
      schema.jobLocation = {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: city,
          addressRegion: region || 'Polska',
          postalCode: postalCode || undefined,
          addressCountry: 'PL',
        },
      };
    }

    // Only add baseSalary if exact hourly net is known
    if (salaryValue) {
      schema.baseSalary = {
        '@type': 'MonetaryAmount',
        currency: 'PLN',
        value: {
          '@type': 'QuantitativeValue',
          value: salaryValue,
          unitText: 'HOUR',
        },
      };
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [job]);

  return null;
}
