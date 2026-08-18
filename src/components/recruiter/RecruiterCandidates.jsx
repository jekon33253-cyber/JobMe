import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import RecruiterLayout from './RecruiterLayout';

const STATUS_CONFIG = {
  submitted:  { label: 'Zgłoszony',    labelUA: 'Подано',        color: 'text-blue-400   bg-blue-500/10   border-blue-500/20' },
  reviewing:  { label: 'W weryfikacji', labelUA: 'На перевірці',  color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  approved:   { label: 'Zatwierdzony', labelUA: 'Затверджено',   color: 'text-[#8CC63F]  bg-[#8CC63F]/10  border-[#8CC63F]/20' },
  hired:      { label: 'Zatrudniony',  labelUA: 'Найнятий',      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  rejected:   { label: 'Odrzucony',   labelUA: 'Відхилено',     color: 'text-red-400    bg-red-500/10    border-red-500/20' },
};

const FILTERS = ['all', 'submitted', 'reviewing', 'approved', 'hired', 'rejected'];

export default function RecruiterCandidates() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isUA = language === 'ua';
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) loadCandidates();
  }, [user]);

  async function loadCandidates() {
    const { data } = await supabase
      .from('recruiter_candidates')
      .select('*')
      .eq('recruiter_id', user.id)
      .order('created_at', { ascending: false });
    setCandidates(data || []);
    setLoading(false);
  }

  const L = {
    title: isUA ? 'Мої кандидати' : 'Moi kandydaci',
    search: isUA ? 'Пошук за іменем, вакансією...' : 'Szukaj po imieniu, stanowisku...',
    addNew: isUA ? 'Додати кандидата' : 'Dodaj kandydata',
    noResults: isUA ? 'Кандидатів не знайдено' : 'Brak kandydatów',
    addFirst: isUA ? 'Додати першого кандидата' : 'Dodaj pierwszego kandydata',
    all: isUA ? 'Всі' : 'Wszyscy',
    candidate: isUA ? 'Кандидат' : 'Kandydat',
    vacancy: isUA ? 'Вакансія' : 'Oferta pracy',
    status: isUA ? 'Статус' : 'Status',
    date: isUA ? 'Дата подачі' : 'Data zgłoszenia',
    view: isUA ? 'Деталі' : 'Szczegóły',
  };

  const filterLabels = {
    all: L.all,
    submitted: isUA ? 'Подано' : 'Zgłoszeni',
    reviewing: isUA ? 'Перевіряються' : 'W weryfikacji',
    approved: isUA ? 'Затверджені' : 'Zatwierdzeni',
    hired: isUA ? 'Найняті' : 'Zatrudnieni',
    rejected: isUA ? 'Відхилені' : 'Odrzuceni',
  };

  const filtered = candidates.filter(c => {
    const matchSearch = !search ||
      `${c.candidate_first_name} ${c.candidate_last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      (c.job_title || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.candidate_nationality || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  function getStatusCfg(status) { return STATUS_CONFIG[status] || STATUS_CONFIG.submitted; }

  return (
    <RecruiterLayout activePage="candidates">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">{L.title}</h1>
          <p className="text-zinc-500 text-sm mt-1">{candidates.length} {isUA ? 'кандидатів' : 'kandydatów'}</p>
        </div>
        <button
          onClick={() => window.location.href = '/recruiter/candidates/new'}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00B4B4] to-[#007A7A] text-white font-bold text-sm
                     shadow-lg shadow-[#00B4B4]/20 hover:-translate-y-0.5 hover:shadow-xl transition-all"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          {L.addNew}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">search</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={L.search}
          className="w-full pl-10 pr-4 py-3 bg-[#141414] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600
                     focus:outline-none focus:border-[#00B4B4]/50 transition-all"
        />
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map(f => {
          const count = f === 'all' ? candidates.length : candidates.filter(c => c.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                filter === f
                  ? 'bg-[#00B4B4] text-white border-[#00B4B4]'
                  : 'text-zinc-400 border-zinc-800 hover:border-zinc-600 bg-[#141414]'
              }`}
            >
              {filterLabels[f]} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-3 border-[#00B4B4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-[#141414] border border-zinc-800/60 rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-zinc-700 mb-3">search_off</span>
          <p className="text-zinc-500 mb-4">{L.noResults}</p>
          {candidates.length === 0 && (
            <button
              onClick={() => window.location.href = '/recruiter/candidates/new'}
              className="px-4 py-2 rounded-xl bg-[#00B4B4]/10 text-[#00B4B4] text-sm font-bold border border-[#00B4B4]/20 hover:bg-[#00B4B4]/20 transition"
            >
              {L.addFirst}
            </button>
          )}
        </div>
      ) : (
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-zinc-500 text-xs font-bold uppercase tracking-wider">{L.candidate}</th>
                  <th className="text-left px-4 py-3 text-zinc-500 text-xs font-bold uppercase tracking-wider hidden md:table-cell">{L.vacancy}</th>
                  <th className="text-left px-4 py-3 text-zinc-500 text-xs font-bold uppercase tracking-wider">{L.status}</th>
                  <th className="text-left px-4 py-3 text-zinc-500 text-xs font-bold uppercase tracking-wider hidden lg:table-cell">{L.date}</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const cfg = getStatusCfg(c.status);
                  return (
                    <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00B4B4] to-[#007A7A] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {(c.candidate_first_name || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white text-sm font-bold">{c.candidate_first_name} {c.candidate_last_name}</p>
                            {c.candidate_nationality && (
                              <p className="text-zinc-500 text-xs">{c.candidate_nationality}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 text-sm hidden md:table-cell max-w-[180px]">
                        <p className="truncate">{c.job_title}</p>
                        <p className="text-zinc-600 text-xs truncate">{c.job_location}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${cfg.color}`}>
                          {isUA ? cfg.labelUA : cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs hidden lg:table-cell">
                        {c.created_at ? new Date(c.created_at).toLocaleDateString('pl-PL') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => window.location.href = `/recruiter/candidates/${c.id}`}
                          className="p-2 text-zinc-600 hover:text-[#00B4B4] transition rounded-lg hover:bg-[#00B4B4]/10"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </RecruiterLayout>
  );
}
