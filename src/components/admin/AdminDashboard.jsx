import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from './AdminLayout';

function StatCard({ icon, value, label, color, bgColor, trend }) {
  return (
    <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700/60 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
          <span className={`material-symbols-outlined text-xl ${color}`}>{icon}</span>
        </div>
        {trend && (
          <span className={`text-xs font-bold ${trend > 0 ? 'text-[#8CC63F]' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="text-zinc-500 text-xs font-medium mt-0.5">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    pendingDocs: 0,
    activeApplications: 0,
    inProgressLegal: 0,
  });
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    try {
      const [profilesRes, docsRes, appsRes, legalRes, recentRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('documents').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('applications').select('id', { count: 'exact', head: true }).neq('status', 'rejected'),
        supabase.from('legalization_steps').select('id', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        totalCandidates: profilesRes.count || 0,
        pendingDocs: docsRes.count || 0,
        activeApplications: appsRes.count || 0,
        inProgressLegal: legalRes.count || 0,
      });
      setRecentCandidates(recentRes.data || []);
    } catch (err) {
      console.error('Admin stats error:', err);
    }
    setLoading(false);
  }

  return (
    <AdminLayout activePage="adminDashboard">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Panel Administracyjny</h1>
        <p className="text-zinc-500 text-sm mt-1">Przegląd systemu i statystyki</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatCard icon="group" value={stats.totalCandidates} label="Kandydaci" color="text-blue-400" bgColor="bg-blue-500/10" />
        <StatCard icon="pending_actions" value={stats.pendingDocs} label="Dokumenty do sprawdzenia" color="text-amber-400" bgColor="bg-amber-500/10" />
        <StatCard icon="work" value={stats.activeApplications} label="Aktywne aplikacje" color="text-[#8CC63F]" bgColor="bg-[#8CC63F]/10" />
        <StatCard icon="gavel" value={stats.inProgressLegal} label="Legalizacje w toku" color="text-purple-400" bgColor="bg-purple-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent candidates */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Nowi kandydaci</h2>
            <a href="/admin/candidates" className="text-xs text-red-400 hover:text-red-300 font-medium transition flex items-center gap-0.5">
              Zobacz wszystkich
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </a>
          </div>
          {recentCandidates.length > 0 ? (
            <div className="space-y-2">
              {recentCandidates.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-zinc-800/40">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#8CC63F] to-[#00B4B4] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(c.full_name || 'U')[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-bold truncate">{c.full_name || 'Brak imienia'}</p>
                    <p className="text-zinc-500 text-xs">{c.city || 'Brak miasta'} · {c.nationality || '—'}</p>
                  </div>
                  <span className="text-zinc-600 text-xs shrink-0">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString('pl-PL') : '—'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 text-sm text-center py-8">Brak kandydatów</p>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-5">Szybkie akcje</h2>
          <div className="space-y-3">
            {[
              { label: 'Sprawdź dokumenty', desc: `${stats.pendingDocs} oczekujących`, icon: 'fact_check', path: '/admin/documents', color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Zarządzaj kandydatami', desc: `${stats.totalCandidates} zarejestrowanych`, icon: 'group', path: '/admin/candidates', color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Strona główna', desc: 'Podgląd serwisu', icon: 'home', path: '/', color: 'text-[#8CC63F]', bg: 'bg-[#8CC63F]/10' },
            ].map(a => (
              <a
                key={a.label}
                href={a.path}
                className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-zinc-800/40 hover:border-zinc-700/50 hover:-translate-y-0.5 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.bg}`}>
                  <span className={`material-symbols-outlined text-xl ${a.color}`}>{a.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-bold">{a.label}</p>
                  <p className="text-zinc-500 text-xs">{a.desc}</p>
                </div>
                <span className="material-symbols-outlined text-zinc-700 group-hover:text-zinc-400 transition">
                  arrow_forward
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
