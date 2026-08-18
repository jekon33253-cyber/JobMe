import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import RecruiterLayout from './RecruiterLayout';

const STATUS_CONFIG = {
  submitted:  { label: 'Zgłoszony',   labelUA: 'Подано',       color: 'text-blue-400   bg-blue-500/10   border-blue-500/20' },
  reviewing:  { label: 'W weryfikacji', labelUA: 'На перевірці', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  approved:   { label: 'Zatwierdzony', labelUA: 'Затверджено',  color: 'text-[#8CC63F]  bg-[#8CC63F]/10  border-[#8CC63F]/20' },
  hired:      { label: 'Zatrudniony',  labelUA: 'Найнятий',     color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  rejected:   { label: 'Odrzucony',   labelUA: 'Відхилено',    color: 'text-red-400    bg-red-500/10    border-red-500/20' },
};

export default function RecruiterDashboard() {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isUA = language === 'ua';
  const [candidates, setCandidates] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  async function loadData() {
    const [candRes, earnRes] = await Promise.all([
      supabase.from('recruiter_candidates').select('*').eq('recruiter_id', user.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('recruiter_earnings').select('*').eq('recruiter_id', user.id).order('created_at', { ascending: false }),
    ]);
    setCandidates(candRes.data || []);
    setEarnings(earnRes.data || []);
    setLoading(false);
  }

  const totalCandidates = candidates.length;
  const activeCandidates = candidates.filter(c => ['submitted', 'reviewing', 'approved'].includes(c.status)).length;
  const hiredCandidates = candidates.filter(c => c.status === 'hired').length;
  const totalEarnings = earnings.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const pendingEarnings = earnings.filter(e => e.status === 'pending').reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || '';

  const L = {
    greeting: isUA ? 'Вітаємо' : 'Dzień dobry',
    subtitle: isUA ? 'Ось ваша поточна статистика' : 'Oto Twoja aktualna statystyka',
    totalCandidates: isUA ? 'Всього кандидатів' : 'Wszyscy kandydaci',
    active: isUA ? 'Активних' : 'Aktywnych',
    hired: isUA ? 'Найнятих' : 'Zatrudnionych',
    earnings: isUA ? 'Заробіток всього' : 'Zarobki łącznie',
    pending: isUA ? 'Очікує виплати' : 'Oczekuje wypłaty',
    recentTitle: isUA ? 'Останні кандидати' : 'Ostatni kandydaci',
    viewAll: isUA ? 'Переглянути всіх' : 'Zobacz wszystkich',
    noData: isUA ? 'Ви ще не подали жодного кандидата' : 'Nie masz jeszcze żadnych kandydatów',
    addFirst: isUA ? 'Додати першого кандидата' : 'Dodaj pierwszego kandydata',
    quickActions: isUA ? 'Швидкі дії' : 'Szybkie akcje',
    addCandidate: isUA ? 'Додати кандидата' : 'Dodaj kandydata',
    viewJobs: isUA ? 'Переглянути вакансії' : 'Przeglądaj oferty',
    viewEarnings: isUA ? 'Мій заробіток' : 'Moje zarobki',
  };

  function getStatusLabel(status) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.submitted;
    return isUA ? cfg.labelUA : cfg.label;
  }
  function getStatusColor(status) {
    return (STATUS_CONFIG[status] || STATUS_CONFIG.submitted).color;
  }

  const metrics = [
    { label: L.totalCandidates, value: totalCandidates, icon: 'group', color: 'text-[#00B4B4]', bg: 'bg-[#00B4B4]/10' },
    { label: L.active, value: activeCandidates, icon: 'pending', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: L.hired, value: hiredCandidates, icon: 'check_circle', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: L.earnings, value: `${totalEarnings.toFixed(0)} zł`, icon: 'payments', color: 'text-[#8CC63F]', bg: 'bg-[#8CC63F]/10' },
  ];

  return (
    <RecruiterLayout activePage="dashboard">
      {/* Header */}
      <div className="mb-8">
        <p className="text-zinc-500 text-sm mb-1">{L.greeting},</p>
        <h1 className="text-3xl font-extrabold text-white">{displayName} 👋</h1>
        <p className="text-zinc-500 text-sm mt-1">{L.subtitle}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-3 border-[#00B4B4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((m, i) => (
              <div key={i} className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700/60 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${m.color} text-xl`}>{m.icon}</span>
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-white">{m.value}</p>
                <p className="text-zinc-500 text-xs mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Pending earnings banner */}
          {pendingEarnings > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-900/30 to-zinc-900 border border-amber-500/30 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-amber-400 text-xl">hourglass_empty</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{L.pending}</p>
                <p className="text-amber-400 font-extrabold text-lg">{pendingEarnings.toFixed(2)} zł</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent candidates */}
            <div className="lg:col-span-2 bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">{L.recentTitle}</h2>
                <button
                  onClick={() => window.location.href = '/recruiter/candidates'}
                  className="text-[#00B4B4] text-xs font-bold hover:underline"
                >
                  {L.viewAll} →
                </button>
              </div>

              {candidates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined text-5xl text-zinc-700 mb-3">group_add</span>
                  <p className="text-zinc-500 text-sm mb-4">{L.noData}</p>
                  <button
                    onClick={() => window.location.href = '/recruiter/candidates/new'}
                    className="px-4 py-2 rounded-xl bg-[#00B4B4]/10 text-[#00B4B4] text-sm font-bold border border-[#00B4B4]/20 hover:bg-[#00B4B4]/20 transition"
                  >
                    {L.addFirst}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {candidates.slice(0, 6).map(c => (
                    <div
                      key={c.id}
                      onClick={() => window.location.href = `/recruiter/candidates/${c.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#1a1a1a] border border-zinc-800/40 hover:border-[#00B4B4]/30 hover:bg-[#00B4B4]/5 cursor-pointer transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00B4B4] to-[#007A7A] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {(c.candidate_first_name || 'U')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-bold truncate">
                          {c.candidate_first_name} {c.candidate_last_name}
                        </p>
                        <p className="text-zinc-500 text-xs truncate">{c.job_title}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${getStatusColor(c.status)}`}>
                        {getStatusLabel(c.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-5">{L.quickActions}</h2>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/recruiter/candidates/new'}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#00B4B4]/10 to-transparent border border-[#00B4B4]/20 hover:border-[#00B4B4]/40 hover:bg-[#00B4B4]/15 transition-all text-left"
                >
                  <span className="material-symbols-outlined text-[#00B4B4] text-2xl">person_add</span>
                  <div>
                    <p className="text-white font-bold text-sm">{L.addCandidate}</p>
                  </div>
                  <span className="material-symbols-outlined text-zinc-600 text-lg ml-auto">arrow_forward</span>
                </button>
                <button
                  onClick={() => window.location.href = '/recruiter/jobs'}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-zinc-800/30 border border-zinc-800/40 hover:border-zinc-700/60 hover:bg-zinc-800/50 transition-all text-left"
                >
                  <span className="material-symbols-outlined text-zinc-400 text-2xl">work_outline</span>
                  <div>
                    <p className="text-white font-bold text-sm">{L.viewJobs}</p>
                  </div>
                  <span className="material-symbols-outlined text-zinc-600 text-lg ml-auto">arrow_forward</span>
                </button>
                <button
                  onClick={() => window.location.href = '/recruiter/earnings'}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-zinc-800/30 border border-zinc-800/40 hover:border-zinc-700/60 hover:bg-zinc-800/50 transition-all text-left"
                >
                  <span className="material-symbols-outlined text-[#8CC63F] text-2xl">payments</span>
                  <div>
                    <p className="text-white font-bold text-sm">{L.viewEarnings}</p>
                  </div>
                  <span className="material-symbols-outlined text-zinc-600 text-lg ml-auto">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </RecruiterLayout>
  );
}
