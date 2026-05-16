const fs = require('fs');

// --- Update Hero.jsx ---
let heroContent = fs.readFileSync('src/components/Hero.jsx', 'utf-8');
if (!heroContent.includes('import FadeIn')) {
  heroContent = heroContent.replace("import React from 'react';", "import React from 'react';\nimport FadeIn from './FadeIn';");
}
// Wrap content in FadeIn
heroContent = heroContent.replace(
  '<div className="max-w-7xl mx-auto px-6 md:px-12 w-full">',
  '<FadeIn>\n      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">'
);
heroContent = heroContent.replace(
  '        </div>\n      </div>\n    </section>',
  '        </div>\n      </div>\n      </FadeIn>\n    </section>'
);
// Button scaling
heroContent = heroContent.replace(
  'bg-[#A1DD22] hover:bg-[#8ec71e] text-[#2D2D2D] font-bold text-base rounded-2xl shadow-lg shadow-[#A1DD22]/20 transition-all duration-300 transform hover:-translate-y-0.5',
  'bg-[#A1DD22] hover:bg-[#8ec71e] text-[#2D2D2D] font-bold text-base rounded-2xl shadow-lg shadow-[#A1DD22]/20 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]'
);
heroContent = heroContent.replace(
  'bg-white hover:bg-zinc-50 text-[#00B4B4] font-bold text-base rounded-2xl border-2 border-[#00B4B4]/30 hover:border-[#00B4B4] transition-all duration-300',
  'bg-white hover:bg-zinc-50 text-[#00B4B4] font-bold text-base rounded-2xl border-2 border-[#00B4B4]/30 hover:border-[#00B4B4] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]'
);
fs.writeFileSync('src/components/Hero.jsx', heroContent);
console.log('Hero.jsx updated.');

// --- Update App.jsx ---
let appContent = fs.readFileSync('src/App.jsx', 'utf-8');
if (!appContent.includes('import FadeIn')) {
  appContent = appContent.replace("import Hero from './components/Hero';", "import Hero from './components/Hero';\nimport FadeIn from './components/FadeIn';\nimport HowItWorks from './components/HowItWorks';\nimport FAQSection from './components/FAQSection';");
}

// Nav Button
appContent = appContent.replace(
  'hover:opacity-80 transition-opacity cursor-pointer"',
  'hover:opacity-80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"'
);

// Contact Submit Button
appContent = appContent.replace(
  'hover:bg-[#8ec71e] transition-colors',
  'hover:bg-[#8ec71e] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]'
);

// Add FadeIn to Sections
// 1. About
appContent = appContent.replace(
  '<div className="max-w-4xl mx-auto text-center space-y-6">',
  '<FadeIn>\n<div className="max-w-4xl mx-auto text-center space-y-6">'
);
appContent = appContent.replace(
  '            </p>\n</div>\n</section>',
  '            </p>\n</div>\n</FadeIn>\n</section>'
);

// 2. Services (Usługi)
appContent = appContent.replace(
  '<section className="bg-background-white py-20 md:py-24 px-gutter" id="services">\n<div className="max-w-7xl mx-auto">',
  '<section className="bg-background-white py-20 md:py-24 px-gutter" id="services">\n<FadeIn>\n<div className="max-w-7xl mx-auto">'
);
// Insert HowItWorks after Services section
appContent = appContent.replace(
  '</div>\n</div>\n</section>\n{/* Advantages Section */}',
  '</div>\n</div>\n</FadeIn>\n</section>\n\n{/* Jak to dziala Section */}\n<HowItWorks />\n\n{/* Advantages Section */}'
);

// 3. Advantages (Zalety)
appContent = appContent.replace(
  '<section className="bg-surface-contrast py-20 md:py-24 px-gutter" id="advantages">\n<div className="max-w-7xl mx-auto">',
  '<section className="bg-surface-contrast py-20 md:py-24 px-gutter" id="advantages">\n<FadeIn>\n<div className="max-w-7xl mx-auto">'
);
appContent = appContent.replace(
  '</div>\n</div>\n</div>\n</section>\n{/* Team Section */}',
  '</div>\n</div>\n</div>\n</FadeIn>\n</section>\n{/* Team Section */}'
);

// 4. Team (Zespół)
appContent = appContent.replace(
  '<section className="bg-background-white py-20 md:py-24 px-gutter" id="team">\n<div className="max-w-7xl mx-auto">',
  '<section className="bg-background-white py-20 md:py-24 px-gutter" id="team">\n<FadeIn>\n<div className="max-w-7xl mx-auto">'
);
appContent = appContent.replace(
  '</div>\n</div>\n</section>\n{/* Testimonials Section */}',
  '</div>\n</div>\n</FadeIn>\n</section>\n{/* Testimonials Section */}'
);

// 5. Testimonials (Opinie)
appContent = appContent.replace(
  '<section className="bg-surface-contrast py-20 md:py-24 px-gutter">\n<div className="max-w-7xl mx-auto">',
  '<section className="bg-surface-contrast py-20 md:py-24 px-gutter">\n<FadeIn>\n<div className="max-w-7xl mx-auto">'
);
// Insert FAQ after Testimonials
appContent = appContent.replace(
  '</div>\n</div>\n</section>\n{/* Contact Section */}',
  '</div>\n</div>\n</FadeIn>\n</section>\n\n{/* FAQ Section */}\n<FAQSection />\n\n{/* Contact Section */}'
);

// 6. Contact (Kontakt)
appContent = appContent.replace(
  '<section className="bg-background-white py-20 md:py-24 px-gutter" id="contact">\n<div className="max-w-7xl mx-auto">',
  '<section className="bg-background-white py-20 md:py-24 px-gutter" id="contact">\n<FadeIn>\n<div className="max-w-7xl mx-auto">'
);
appContent = appContent.replace(
  '</div>\n</div>\n</section>\n{/* Footer */}',
  '</div>\n</div>\n</FadeIn>\n</section>\n{/* Footer */}'
);

// Footer (Optional to fade in, let's leave it as is or fade it in too. No, footer usually doesn't need it or could have it.)

fs.writeFileSync('src/App.jsx', appContent);
console.log('App.jsx updated.');
