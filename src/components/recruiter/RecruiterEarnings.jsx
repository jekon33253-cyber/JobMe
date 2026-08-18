import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import RecruiterLayout from './RecruiterLayout';

export default function RecruiterEarnings() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isUA = language === 'ua';
  const [earnings, setEarnings] = useState([]);
  const [candidates, setCandidates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  async function loadData() {
    const { data: earnData } = await supabase
      .from('recruiter_earnings')
      .select('*, recruiter_candidates(candidate_first_name, candidate_last_name, job_title)')
      .eq('recruiter_id', user.id)
      .order('created_at', { ascending: false });
    setEarnings(earnData || []);
    setLoading(false);
  }

  const L = {
    title: isUA ? 'Мій заробіток' : 'Moje zarobki',
    subtitle: isUA ? 'Ваша фінансова статистика та виплати' : 'Twoje statystyki finansowe i wypłaty',
    total: isUA ? 'Всього зароблено' : 'Zarobki łącznie',
    pending: isUA ? 'Очікує виплати' : 'Oczekuje wypłaty',
    paid: isUA ? 'Виплачено' : 'Wypłacono',
    count: isUA ? 'Трудоустроєних' : 'Zatrudnionych',
    history: isUA ? 'Історія виплат' : 'Historia wypłat',
    noEarnings: isUA ? 'Виплат ще немає' : 'Brak wypłat',
    noEarningsHint: isUA ? 'Заробіток з\'явиться після першого трудоустройства кандидата' : 'Zarobki pojawią się po pierwszym zatrudnieniu kandydata',
    candidate: isUA ? 'Кандидат' : 'Kandydat',
    vacancy: isUA ? 'Вакансія' : 'Oferta',
    amount: isUA ? 'Сума' : 'Kwota',
    status: isUA ? 'Статус' : 'Status',
    date: isUA ? 'Дата' : 'Data',
    statusPending: isUA ? 'Очікує' : 'Oczekuje',
    statusPaid: isUA ? 'Виплачено' : 'Wypłacono',
  };

  const totalEarned = earnings.reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalPending = earnings.filter(e => e.status === 'pending').reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalPaid = earnings.filter(e => e.status === 'paid').reduce((s, e) => s + Number(e.amount || 0), 0);
  const hiredCount = earnings.length;

  return (
    <RecruiterLayout activePage="earnings">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">{L.title}</h1>
        <p className="text-zinc-500 text-sm mt-1">{L.subtitle}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-3 border-[#00B4B4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              label={L.total}
              value={`${totalEarned.toFixed(2)} zł`}
              icon="payments"
              color="text-[#8CC63F]"
              bg="bg-[#8CC63F]/10"
            />
            <MetricCard
              label={L.pending}
              value={`${totalPending.toFixed(2)} zł`}
              icon="hourglass_empty"
              color="text-amber-400"
              bg="bg-amber-500/10"
            />
            <MetricCard
              label={L.paid}
              value={`${totalPaid.toFixed(2)} zł`}
              icon="check_circle"
              color="text-emerald-400"
              bg="bg-emerald-500/10"
            />
            <MetricCard
              label={L.count}
              value={hiredCount}
              icon="engineering"
              color="text-[#00B4B4]"
              bg="bg-[#00B4B4]/10"
            />
          </div>

          {/* Earnings table */}
          <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-white">{L.history}</h2>
            </div>

            {earnings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="material-symbols-outlined text-5xl text-zinc-700 mb-3">payments</span>
                <p className="text-zinc-500 text-sm font-bold mb-1">{L.noEarnings}</p>
                <p className="text-zinc-600 text-xs max-w-xs">{L.noEarningsHint}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800/50">
                      <th className="text-left px-4 py-3 text-zinc-500 text-xs font-bold uppercase tracking-wider">{L.candidate}</th>
                      <th className="text-left px-4 py-3 text-zinc-500 text-xs font-bold uppercase tracking-wider hidden md:table-cell">{L.vacancy}</th>
                      <th className="text-left px-4 py-3 text-zinc-500 text-xs font-bold uppercase tracking-wider">{L.amount}</th>
                      <th className="text-left px-4 py-3 text-zinc-500 text-xs font-bold uppercase tracking-wider">{L.status}</th>
                      <th className="text-left px-4 py-3 text-zinc-500 text-xs font-bold uppercase tracking-wider hidden lg:table-cell">{L.date}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.map(e => {
                      const cand = e.recruiter_candidates;
                      return (
                        <tr key={e.id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8CC63F] to-[#6BA32E] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {(cand?.candidate_first_name || 'U')[0].toUpperCase()}
                              </div>
                              <span className="text-white text-sm font-bold">
                                {cand?.candidate_first_name} {cand?.candidate_last_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-zinc-400 text-sm hidden md:table-cell">
                            {cand?.job_title || '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[#8CC63F] font-extrabold text-sm">
                              {Number(e.amount).toFixed(2)} {e.currency || 'zł'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${
                              e.status === 'paid'
                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            }`}>
                              {e.status === 'paid' ? L.statusPaid : L.statusPending}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-500 text-xs hidden lg:table-cell">
                            {e.paid_at
                              ? new Date(e.paid_at).toLocaleDateString('pl-PL')
                              : new Date(e.created_at).toLocaleDateString('pl-PL')
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </RecruiterLayout>
  );
}

function MetricCard({ label, value, icon, color, bg }) {
  return (
    <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700/60 transition-colors">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <span className={`material-symbols-outlined ${color} text-xl`}>{icon}</span>
      </div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-zinc-500 text-xs mt-1">{label}</p>
    </div>
  );
}
