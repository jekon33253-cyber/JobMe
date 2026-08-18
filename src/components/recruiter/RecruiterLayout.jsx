import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const navItems = [
  { key: 'dashboard', icon: 'dashboard', path: '/recruiter/dashboard' },
  { key: 'jobs', icon: 'work_outline', path: '/recruiter/jobs' },
  { key: 'candidates', icon: 'group', path: '/recruiter/candidates' },
  { key: 'earnings', icon: 'payments', path: '/recruiter/earnings' },
  { key: 'profile', icon: 'manage_accounts', path: '/recruiter/profile' },
];

function NavLink({ item, isActive, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-[#00B4B4]/15 text-[#00B4B4] shadow-sm'
          : 'text-zinc-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className="material-symbols-outlined text-xl">{item.icon}</span>
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

export default function RecruiterLayout({ children, activePage }) {
  const { user, profile, signOut } = useAuth();
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isUA = language === 'ua';

  const labels = {
    menu: isUA ? 'Меню' : 'Menu',
    recruiter: isUA ? 'Рекрутер' : 'Recruiter',
    portal: isUA ? 'Кабінет рекрутера' : 'Panel Rekrutera',
    dashboard: isUA ? 'Дашборд' : 'Dashboard',
    jobs: isUA ? 'Вакансії' : 'Oferty pracy',
    candidates: isUA ? 'Мої кандидати' : 'Moi kandydaci',
    earnings: isUA ? 'Заробіток' : 'Zarobki',
    profile: isUA ? 'Профіль' : 'Profil',
    logout: isUA ? 'Вийти' : 'Wyloguj się',
    newCandidate: isUA ? 'Новий кандидат' : 'Nowy kandydat',
  };

  const navLabels = {
    dashboard: labels.dashboard,
    jobs: labels.jobs,
    candidates: labels.candidates,
    earnings: labels.earnings,
    profile: labels.profile,
  };

  function navigate(path) {
    window.location.href = path;
    setSidebarOpen(false);
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Recruiter';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#111] border-r border-zinc-800/60
        flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 pb-4">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00B4B4] to-[#007A7A] flex items-center justify-center shadow-md shadow-[#00B4B4]/20">
              <span className="text-white font-black text-base">J</span>
            </div>
            <span className="text-white text-xl font-extrabold tracking-tight">
              Job<span className="text-[#00B4B4]">Me</span>
            </span>
            <span className="text-[#00B4B4]/60 text-xs font-medium ml-1 border border-[#00B4B4]/30 rounded-md px-1.5 py-0.5">
              Recruiter
            </span>
          </a>
        </div>

        {/* User card */}
        <div className="mx-4 mb-4 p-3 rounded-xl bg-white/5 border border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00B4B4] to-[#007A7A] flex items-center justify-center text-white font-bold text-sm shadow-md">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-bold truncate">{displayName}</p>
              <p className="text-[#00B4B4] text-xs font-medium">{labels.recruiter}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          <p className="px-4 pt-2 pb-1 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            {labels.menu}
          </p>
          {navItems.map(item => (
            <NavLink
              key={item.key}
              item={item}
              isActive={activePage === item.key}
              onClick={() => navigate(item.path)}
              label={navLabels[item.key]}
            />
          ))}

          {/* Quick add button */}
          <div className="px-3 pt-4">
            <button
              onClick={() => navigate('/recruiter/candidates/new')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                         bg-gradient-to-r from-[#00B4B4] to-[#007A7A] text-white font-bold text-sm
                         shadow-lg shadow-[#00B4B4]/20 hover:shadow-xl hover:shadow-[#00B4B4]/30
                         hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-lg">person_add</span>
              {labels.newCandidate}
            </button>
          </div>
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-zinc-800/50">
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            {labels.logout}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#111]/80 backdrop-blur-xl border-b border-zinc-800/60 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-zinc-400 hover:text-white transition">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="text-white text-lg font-extrabold">
            Job<span className="text-[#00B4B4]">Me</span>
            <span className="text-[#00B4B4] text-xs font-medium ml-1">Recruiter</span>
          </span>
          <button
            onClick={() => navigate('/recruiter/candidates/new')}
            className="p-2 -mr-2 text-[#00B4B4] transition"
          >
            <span className="material-symbols-outlined">person_add</span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
