import { useEffect } from 'react';

const LOCATION_MAP = {
  'Wrocław': { addressLocality: 'Wrocław', addressRegion: 'Dolny Śląsk' },
  'Warszawa': { addressLocality: 'Warszawa', addressRegion: 'Mazowieckie' },
  'Kraków': { addressLocality: 'Kraków', addressRegion: 'Małopolskie' },
  'Poznań': { addressLocality: 'Poznań', addressRegion: 'Wielkopolskie' },
  'Sosnowiec': { addressLocality: 'Sosnowiec', addressRegion: 'Śląsk' },
  'Świebodzice': { addressLocality: 'Świebodzice', addressRegion: 'Dolny Śląsk' },
  'Nowa Ruda': { addressLocality: 'Nowa Ruda', addressRegion: 'Dolny Śląsk' },
  'Kłodzko': { addressLocality: 'Kłodzko', addressRegion: 'Dolny Śląsk' },
};

function guessLocation(job) {
  const loc = (job.location || '').toLowerCase();
  for (const [key, value] of Object.entries(LOCATION_MAP)) {
    if (loc.includes(key.toLowerCase())) return value;
  }
  return { addressLocality: 'Wrocław', addressRegion: 'Dolny Śląsk' };
}

function extractSalary(job) {
  const s = (job.salary || '').replace(',', '.');
  const match = s.match(/(\d+[.,]?\d*)/);
  if (!match) return null;
  return parseFloat(match[1]);
}

export default function JobPostingSchema({ job }) {
  useEffect(() => {
    if (!job) return;
    const scriptId = 'ld-jobposting';

    // Remove previous
    const old = document.getElementById(scriptId);
    if (old) old.remove();

    const loc = guessLocation(job);
    const salary = extractSalary(job);

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.jobTitle,
      description: Array.isArray(job.tasks)
        ? job.tasks.join('. ') + '. ' + (job.perks || '')
        : job.perks || '',
      datePosted: new Date().toISOString().split('T')[0],
      hiringOrganization: {
        '@type': 'Organization',
        name: 'JobMe',
        sameAs: 'https://jobme.pl',
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: loc.addressLocality,
          addressRegion: loc.addressRegion,
          addressCountry: 'PL',
        },
      },
      employmentType: 'FULL_TIME',
    };

    if (salary) {
      schema.baseSalary = {
        '@type': 'MonetaryAmount',
        currency: 'PLN',
        value: {
          '@type': 'QuantitativeValue',
          value: salary,
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
