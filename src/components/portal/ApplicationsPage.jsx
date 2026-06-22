import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import PortalLayout from './PortalLayout';

const STATUS_CONFIG = {
  applied: { label: 'Złożono', icon: 'send', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  screening: { label: 'Weryfikacja', icon: 'search', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  interview: { label: 'Rozmowa', icon: 'record_voice_over', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  offer: { label: 'Oferta', icon: 'celebration', color: 'text-[#8CC63F]', bg: 'bg-[#8CC63F]/10', border: 'border-[#8CC63F]/20' },
  rejected: { label: 'Odrzucone', icon: 'close', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

function ApplicationCard({ app, t }) {
  const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;

  return (
    <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700/50 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-zinc-800">
            <span className="material-symbols-outlined text-zinc-400 text-xl">work</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-bold text-base truncate">{app.job_title}</h3>
            <p className="text-zinc-500 text-sm">{app.company}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${sc.bg} ${sc.color} border ${sc.border}`}>
          <span className="material-symbols-outlined text-xs">{sc.icon}</span>
          {sc.label}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-zinc-500">
        {app.location && (
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">location_on</span>
            {app.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">calendar_today</span>
          {new Date(app.applied_at).toLocaleDateString('pl-PL')}
        </span>
      </div>

      {/* Status pipeline mini */}
      <div className="mt-4 flex gap-1">
        {Object.keys(STATUS_CONFIG).filter(k => k !== 'rejected').map((status, i) => {
          const stages = ['applied', 'screening', 'interview', 'offer'];
          const currentIdx = stages.indexOf(app.status);
          const thisIdx = stages.indexOf(status);
          const isRejected = app.status === 'rejected';

          return (
            <div
              key={status}
              className={`h-1.5 flex-1 rounded-full ${
                isRejected ? 'bg-red-500/30' :
                thisIdx <= currentIdx ? 'bg-[#8CC63F]' : 'bg-zinc-800'
              }`}
            />
          );
        })}
      </div>

      {app.notes && (
        <p className="text-zinc-600 text-xs mt-3 italic">📝 {app.notes}</p>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) loadApps();
  }, [user]);

  async function loadApps() {
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .order('applied_at', { ascending: false });
    setApps(data || []);
    setLoading(false);
  }

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  const statusCounts = apps.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <PortalLayout activePage="applications">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">{t('portal.applications.title')}</h1>
          <p className="text-zinc-500 text-sm mt-1">{t('portal.applications.subtitle')}</p>
        </div>
        <a
          href="/jobs"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8CC63F] to-[#6BA32E] text-white text-sm font-bold
                     shadow-lg shadow-[#8CC63F]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <span className="material-symbols-outlined text-lg">search</span>
          {t('portal.applications.browseJobs')}
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {Object.entries(STATUS_CONFIG).map(([key, sc]) => (
          <div key={key} className={`${sc.bg} border ${sc.border} rounded-xl p-3 text-center`}>
            <p className={`text-xl font-black ${sc.color}`}>{statusCounts[key] || 0}</p>
            <p className="text-zinc-500 text-xs font-medium">{sc.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {['all', ...Object.keys(STATUS_CONFIG)].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filter === f
                ? 'bg-[#8CC63F]/15 text-[#8CC63F] border border-[#8CC63F]/20'
                : 'bg-[#1a1a1a] text-zinc-500 border border-zinc-800 hover:text-zinc-300'
            }`}
          >
            {f === 'all' ? `${t('portal.applications.all')} (${apps.length})` : `${STATUS_CONFIG[f].label} (${statusCounts[f] || 0})`}
          </button>
        ))}
      </div>

      {/* Applications list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-3 border-[#8CC63F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(app => <ApplicationCard key={app.id} app={app} t={t} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#141414] border border-zinc-800/60 rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-zinc-700 mb-3">work_off</span>
          <p className="text-zinc-500 text-sm">{t('portal.applications.noApps')}</p>
          <a
            href="/jobs"
            className="inline-flex items-center gap-1 mt-4 text-sm text-[#8CC63F] hover:text-[#A1DD22] font-bold transition"
          >
            {t('portal.applications.browseJobs')}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      )}
    </PortalLayout>
  );
}
