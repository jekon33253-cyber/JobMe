import React, { useState, useEffect } from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

// ── Article card ──────────────────────────────────────────────
function ArticleCard({ article, onOpen }) {
  const { t } = useLanguage();
  const tagColors = {
    Legalizacja: 'bg-green-50 text-green-700 border-green-200',
    Zarobki: 'bg-amber-50 text-amber-700 border-amber-200',
    HR: 'bg-purple-50 text-purple-700 border-purple-200',
    Доходи: 'bg-amber-50 text-amber-700 border-amber-200',
    Легалізація: 'bg-green-50 text-green-700 border-green-200',
    Earnings: 'bg-amber-50 text-amber-700 border-amber-200',
    Legalization: 'bg-green-50 text-green-700 border-green-200',
  };

  const tagColor = tagColors[article.tag] || 'bg-zinc-50 text-zinc-600 border-zinc-200';

  return (
    <article
      className="bg-white rounded-2xl border border-zinc-200 shadow-md hover:shadow-xl
                 hover:-translate-y-1 transition-all duration-300 overflow-hidden
                 cursor-pointer group"
      onClick={() => onOpen(article)}
    >
      {/* top accent */}
      <div className="h-1 bg-gradient-to-r from-primary to-[#00B4B4] group-hover:h-1.5 transition-all duration-300" />

      <div className="p-6 md:p-8">
        {/* tag + read time */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${tagColor}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
            {article.tag}
          </span>
          <span className="text-zinc-400 text-xs flex items-center gap-1">
            <Icon name="schedule" className="text-sm" />
            {article.readTime} {t('blog.readTime')}
          </span>
        </div>

        {/* title */}
        <h3 className="font-extrabold text-[#2D2D2D] text-base md:text-lg leading-snug mb-3
                       group-hover:text-primary transition-colors duration-200">
          {article.title}
        </h3>

        {/* description */}
        <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {article.desc}
        </p>

        {/* read more */}
        <div className="flex items-center gap-1.5 text-sm font-bold text-primary/80
                        group-hover:text-primary transition-colors">
          <span>{t('jobsWidget.btnDetails')}</span>
          <Icon name="arrow_forward" className="text-base group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </article>
  );
}

// ── Article detail view ───────────────────────────────────────
function ArticleDetail({ article, onBack, onContactClick }) {
  const { t } = useLanguage();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-gutter">
      <div className="max-w-3xl mx-auto">
        {/* back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-primary text-sm font-medium
                     transition-colors mb-8 cursor-pointer"
        >
          <Icon name="arrow_back" className="text-base" />
          {t('blog.backBtn')}
        </button>

        {/* tag + read time */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10
                           text-primary text-xs font-bold border border-primary/20">
            {article.tag}
          </span>
          <span className="text-zinc-400 text-xs flex items-center gap-1">
            <Icon name="schedule" className="text-sm" />
            {article.readTime} {t('blog.readTime')}
          </span>
        </div>

        {/* title */}
        <h1 className="text-2xl md:text-4xl font-extrabold text-[#2D2D2D] leading-tight mb-6">
          {article.title}
        </h1>

        {/* description */}
        <p className="text-zinc-500 text-base md:text-lg leading-relaxed mb-10 border-l-4 border-primary/40 pl-4 italic">
          {article.desc}
        </p>

        {/* body */}
        <div className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed text-sm md:text-base
                        whitespace-pre-line mb-12">
          {article.body}
        </div>

        {/* ── CTA Box ────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#8CC63F]/10 to-[#00B4B4]/10 border
                        border-primary/30 rounded-2xl p-6 md:p-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5 justify-between">
            <div>
              <h3 className="font-extrabold text-[#2D2D2D] text-lg mb-1">
                {t('blog.ctaTitle')}
              </h3>
              <p className="text-zinc-600 text-sm">{t('blog.ctaDesc')}</p>
            </div>
            <button
              onClick={onContactClick}
              className="shrink-0 inline-flex items-center gap-2 bg-[#8CC63F] hover:bg-[#7ab335]
                         text-[#2D2D2D] font-bold text-sm px-6 py-3.5 rounded-xl shadow-md
                         shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5
                         transition-all duration-300 cursor-pointer"
            >
              <Icon name="support_agent" className="text-base" />
              {t('blog.ctaBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Blog component ───────────────────────────────────────
export default function Blog({ onContactClick }) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');       // 'all' | 'kandydat' | 'biznes'
  const [selected, setSelected] = useState(null);     // selected article

  const articles = t('blog.articles') || [];

  const filtered = filter === 'all'
    ? articles
    : articles.filter(a => a.category === filter);

  // Article detail view
  if (selected) {
    return (
      <ArticleDetail
        article={selected}
        onBack={() => setSelected(null)}
        onContactClick={onContactClick}
      />
    );
  }

  // Index view
  return (
    <div className="min-h-screen bg-zinc-50 pt-28 pb-20 px-gutter">
      <div className="max-w-5xl mx-auto">
        {/* header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                           bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide
                           mb-4 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {t('blog.title')}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#2D2D2D] mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-zinc-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* filter tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white p-1.5 rounded-full border border-zinc-200 shadow-sm">
            {[
              { key: 'all', label: t('blog.filterAll') },
              { key: 'kandydat', label: t('blog.filterKandydat') },
              { key: 'biznes', label: t('blog.filterBiznes') },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`relative z-10 px-4 md:px-6 py-2.5 rounded-full font-label-bold text-sm
                            transition-all duration-300 cursor-pointer
                            ${filter === key
                              ? 'text-white bg-[#8CC63F] shadow-md'
                              : 'text-zinc-600 hover:text-zinc-900'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((article, idx) => (
              <FadeIn key={idx} delay={idx * 100}>
                <ArticleCard article={article} onOpen={setSelected} />
              </FadeIn>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <Icon name="article" className="text-zinc-300 text-6xl mb-4" />
              <p className="text-zinc-400 text-lg">Brak artykułów w tej kategorii.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
