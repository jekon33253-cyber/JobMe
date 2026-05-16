const fs = require('fs');

// --- Refactor Hero.jsx ---
let heroContent = fs.readFileSync('src/components/Hero.jsx', 'utf-8');
// Fix subtitle
heroContent = heroContent.replace(/text-zinc-500/g, 'text-zinc-700');
// Fix active offers label
heroContent = heroContent.replace(/text-zinc-400/g, 'text-zinc-600');
fs.writeFileSync('src/components/Hero.jsx', heroContent);
console.log('Hero.jsx refactored.');


// --- Refactor App.jsx ---
let appContent = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Text Readability: Replace text-on-surface-variant with text-zinc-700 + size boosts
appContent = appContent.replace(/text-on-surface-variant leading-relaxed/g, 'text-zinc-700 text-base md:text-lg leading-relaxed');
appContent = appContent.replace(/<p className="font-body-md text-body-md text-on-surface-variant">/g, '<p className="text-zinc-700 text-base leading-relaxed">');
appContent = appContent.replace(/<p className="font-body-sm text-body-sm text-on-surface-variant">/g, '<p className="text-zinc-700 text-base leading-relaxed">');
appContent = appContent.replace(/<p className="font-body-md text-body-md text-on-surface-variant mb-16 max-w-2xl mx-auto">/g, '<p className="text-zinc-700 text-base md:text-lg mb-16 max-w-2xl mx-auto">');
appContent = appContent.replace(/<p className="font-body-sm text-body-sm text-on-surface-variant italic">/g, '<p className="text-zinc-700 text-base italic leading-relaxed">');
appContent = appContent.replace(/<p className="font-body-sm text-body-sm text-on-surface-variant mb-8">/g, '<p className="text-zinc-700 text-base mb-8">');
appContent = appContent.replace(/<p className="font-body-sm text-body-sm text-on-surface-variant/g, '<p className="text-zinc-600 text-base');
appContent = appContent.replace(/<a className="font-body-sm text-body-sm text-on-surface-variant/g, '<a className="text-zinc-600 text-base');

// 2. Form Labels Readability
appContent = appContent.replace(/<label className="block font-label-bold text-label-bold mb-2">/g, '<label className="block font-bold text-zinc-800 text-base mb-2">');

// 3. Review Stars
const filledStar = `<span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>`;
const emptyStar = `<span className="material-symbols-outlined text-zinc-300" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>`;

const serhiiStars = `
<div className="flex gap-1 mb-4">
${filledStar}${filledStar}${filledStar}${filledStar}${filledStar}
</div>`;

const kamilStars = `
<div className="flex gap-1 mb-4">
${filledStar}${filledStar}${filledStar}${filledStar}${emptyStar}
</div>`;

const oksanaStars = `
<div className="flex gap-1 mb-4">
${filledStar}${filledStar}${filledStar}${filledStar}${filledStar}
</div>`;

// Replace Serhii stars
appContent = appContent.replace(
  /<div className="flex gap-1 mb-4 text-primary">\s*<span className="material-symbols-outlined fill">star<\/span>\s*<span className="material-symbols-outlined fill">star<\/span>\s*<span className="material-symbols-outlined fill">star<\/span>\s*<span className="material-symbols-outlined fill">star<\/span>\s*<span className="material-symbols-outlined fill">star<\/span>\s*<\/div>/,
  serhiiStars
);

// Replace Kamil stars
appContent = appContent.replace(
  /<div className="flex gap-1 mb-4 text-secondary">\s*<span className="material-symbols-outlined fill">star<\/span>\s*<span className="material-symbols-outlined fill">star<\/span>\s*<span className="material-symbols-outlined fill">star<\/span>\s*<span className="material-symbols-outlined fill">star<\/span>\s*<span className="material-symbols-outlined fill">star<\/span>\s*<\/div>/,
  kamilStars
);

// Replace Oksana stars
appContent = appContent.replace(
  /<div className="flex gap-1 mb-4 text-primary">\s*<span className="material-symbols-outlined fill">star<\/span>\s*<span className="material-symbols-outlined fill">star<\/span>\s*<span className="material-symbols-outlined fill">star<\/span>\s*<span className="material-symbols-outlined fill">star<\/span>\s*<span className="material-symbols-outlined fill">star<\/span>\s*<\/div>/,
  oksanaStars
);

fs.writeFileSync('src/App.jsx', appContent);
console.log('App.jsx refactored.');
