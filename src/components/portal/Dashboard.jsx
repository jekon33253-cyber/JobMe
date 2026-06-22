import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import PortalLayout from './PortalLayout';

function StatCard({ icon, value, label, color, bgColor }) {
  return (
    <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700/60 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
          <span className={`material-symbols-outlined text-xl ${color}`}>{icon}</span>
        </div>
        <span className="material-symbols-outlined text-zinc-700 text-sm group-hover:text-zinc-500 transition">
          arrow_forward
        </span>
      </div>
      <p className="text-2xl font-black text-white mb-0.5">{value}</p>
      <p className="text-zinc-500 text-xs font-medium">{label}</p>
    </div>
  );
}

function MiniPipeline({ steps }) {
  return (
    <div className="space-y-3">
      {steps.map((s, i) => (
        <div key={i} className="relative">
          {i < steps.length - 1 && (
            <div className={`absolute left-3 top-9 bottom-0 w-0.5 ${
              s.status === 'completed' ? 'bg-[#8CC63F]' : 'bg-zinc-800'
            }`} />
          )}
          <div className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              s.status === 'completed' ? 'bg-[#8CC63F]' :
              s.status === 'in_progress' ? 'bg-[#8CC63F]/20 border-2 border-[#8CC63F]' :
              'bg-zinc-800'
            }`}>
              {s.status === 'completed' ? (
                <span className="material-symbols-outlined text-white text-sm">check</span>
              ) : s.status === 'in_progress' ? (
                <div className="w-2 h-2 rounded-full bg-[#8CC63F] animate-pulse" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-zinc-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-bold ${
                s.status === 'completed' ? 'text-zinc-400' :
                s.status === 'in_progress' ? 'text-white' : 'text-zinc-600'
              }`}>{s.step_name}</p>
              {s.completed_at && (
                <p className="text-xs text-zinc-600 mt-0.5">
                  {new Date(s.completed_at).toLocaleDateString('pl-PL')}
                </p>
              )}
              {s.status === 'in_progress' && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-[#8CC63F]/10 text-[#8CC63F] text-xs font-bold border border-[#8CC63F]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F] animate-pulse" />
                  W trakcie
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentApplication({ app }) {
  const statusColors = {
    applied: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    screening: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
    interview: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    offer: { bg: 'bg-[#8CC63F]/10', text: 'text-[#8CC63F]', border: 'border-[#8CC63F]/20' },
    rejected: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  };
  const sc = statusColors[app.status] || statusColors.applied;

  return (
    <div className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-zinc-800/40 hover:border-zinc-700/50 transition-all group">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-zinc-400 text-xl">work</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-white text-sm font-bold truncate">{app.job_title}</p>
        <p className="text-zinc-500 text-xs truncate">{app.company} · {app.location}</p>
      </div>
      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${sc.bg} ${sc.text} border ${sc.border} shrink-0`}>
        {app.status}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    docsTotal: 0, docsApproved: 0,
    applications: 0,
    legalStep: 0, legalTotal: 0,
    unreadNotifs: 0,
  });
  const [legalSteps, setLegalSteps] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadDashboard();
  }, [user]);

  async function loadDashboard() {
    try {
      const [docsRes, appsRes, legalRes, notifRes] = await Promise.all([
        supabase.from('documents').select('status').eq('user_id', user.id),
        supabase.from('applications').select('*').eq('user_id', user.id).order('applied_at', { ascending: false }).limit(3),
        supabase.from('legalization_steps').select('*').eq('user_id', user.id).order('step_order', { ascending: true }),
        supabase.from('notifications').select('id').eq('user_id', user.id).eq('is_read', false),
      ]);

      const docs = docsRes.data || [];
      const apps = appsRes.data || [];
      const legal = legalRes.data || [];
      const notifs = notifRes.data || [];

      setStats({
        docsTotal: docs.length,
        docsApproved: docs.filter(d => d.status === 'approved').length,
        applications: apps.length,
        legalStep: legal.filter(s => s.status === 'completed').length,
        legalTotal: legal.length,
        unreadNotifs: notifs.length,
      });
      setLegalSteps(legal);
      setRecentApps(apps);
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
    setLoadingData(false);
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return t('portal.dashboard.goodMorning');
    if (h < 18) return t('portal.dashboard.goodAfternoon');
    return t('portal.dashboard.goodEvening');
  })();

  return (
    <PortalLayout activePage="dashboard">
      {/* Header */}
      <div className="mb-8">
        <p className="text-zinc-500 text-sm mb-1">{greeting}</p>
        <h1 className="text-3xl font-extrabold text-white">
          {displayName} <span className="text-2xl">👋</span>
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatCard
          icon="folder"
          value={`${stats.docsApproved}/${stats.docsTotal}`}
          label={t('portal.dashboard.docsReady')}
          color="text-[#00B4B4]"
          bgColor="bg-[#00B4B4]/10"
        />
        <StatCard
          icon="work"
          value={stats.applications}
          label={t('portal.dashboard.activeApps')}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
        />
        <StatCard
          icon="gavel"
          value={`${stats.legalStep}/${stats.legalTotal}`}
          label={t('portal.dashboard.legalProgress')}
          color="text-[#8CC63F]"
          bgColor="bg-[#8CC63F]/10"
        />
        <StatCard
          icon="notifications"
          value={stats.unreadNotifs}
          label={t('portal.dashboard.newAlerts')}
          color="text-amber-400"
          bgColor="bg-amber-500/10"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Legalization tracker */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8CC63F]">gavel</span>
              {t('portal.dashboard.legalizationTitle')}
            </h2>
            <a
              href="/portal/legalization"
              className="text-xs text-[#8CC63F] hover:text-[#A1DD22] font-medium transition flex items-center gap-0.5"
            >
              {t('portal.dashboard.viewAll')}
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </a>
          </div>
          {legalSteps.length > 0 ? (
            <MiniPipeline steps={legalSteps} />
          ) : (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-zinc-700 mb-2">gavel</span>
              <p className="text-zinc-600 text-sm">{t('portal.dashboard.noLegalSteps')}</p>
            </div>
          )}
        </div>

        {/* Recent applications */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">work</span>
              {t('portal.dashboard.recentApps')}
            </h2>
            <a
              href="/portal/applications"
              className="text-xs text-[#8CC63F] hover:text-[#A1DD22] font-medium transition flex items-center gap-0.5"
            >
              {t('portal.dashboard.viewAll')}
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </a>
          </div>
          {recentApps.length > 0 ? (
            <div className="space-y-2">
              {recentApps.map(app => <RecentApplication key={app.id} app={app} />)}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-zinc-700 mb-2">work</span>
              <p className="text-zinc-600 text-sm">{t('portal.dashboard.noApps')}</p>
              <a href="/jobs" className="inline-flex items-center gap-1 mt-3 text-sm text-[#8CC63F] hover:text-[#A1DD22] font-medium transition">
                {t('portal.dashboard.browseJobs')}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          )}
        </div>

        {/* Document progress */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00B4B4]">folder</span>
              {t('portal.dashboard.documentsTitle')}
            </h2>
            <a
              href="/portal/documents"
              className="text-xs text-[#8CC63F] hover:text-[#A1DD22] font-medium transition flex items-center gap-0.5"
            >
              {t('portal.dashboard.uploadDocs')}
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8CC63F] to-[#00B4B4] rounded-full transition-all duration-700"
                style={{ width: stats.docsTotal > 0 ? `${(stats.docsApproved / stats.docsTotal) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-white text-sm font-bold shrink-0">
              {stats.docsTotal > 0 ? Math.round((stats.docsApproved / stats.docsTotal) * 100) : 0}%
            </span>
          </div>
          <p className="text-zinc-500 text-xs mt-2">
            {stats.docsApproved} / {stats.docsTotal} {t('portal.dashboard.docsApproved')}
          </p>
        </div>
      </div>
    </PortalLayout>
  );
}
