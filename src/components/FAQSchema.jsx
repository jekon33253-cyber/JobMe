import { useEffect } from 'react';

export default function FAQSchema({ faqs }) {
  useEffect(() => {
    if (!faqs || !faqs.length) return;
    const scriptId = 'ld-faq';

    const old = document.getElementById(scriptId);
    if (old) old.remove();

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [faqs]);

  return null;
}
