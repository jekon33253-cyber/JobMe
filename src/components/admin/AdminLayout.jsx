import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const adminNavItems = [
  { key: 'adminDashboard', icon: 'admin_panel_settings', path: '/admin', label: 'Dashboard' },
  { key: 'adminCandidates', icon: 'group', path: '/admin/candidates', label: 'Kandydaci' },
  { key: 'adminDocs', icon: 'fact_check', path: '/admin/documents', label: 'Dokumenty' },
];

export default function AdminLayout({ children, activePage }) {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = profile?.full_name || 'Admin';

  function navigate(path) {
    window.location.href = path;
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#111] border-r border-zinc-800/60
        flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pb-4">
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-md shadow-red-500/20">
              <span className="material-symbols-outlined text-white text-lg">shield_person</span>
            </div>
            <span className="text-white text-xl font-extrabold tracking-tight">
              Admin<span className="text-red-400">Panel</span>
            </span>
          </a>
        </div>

        {/* Admin user card */}
        <div className="mx-4 mb-4 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-sm">
              {displayName[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-bold truncate">{displayName}</p>
              <p className="text-red-400 text-xs font-bold">Administrator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          <p className="px-4 pt-2 pb-1 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            Zarządzanie
          </p>
          {adminNavItems.map(item => (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activePage === item.key
                  ? 'bg-red-500/15 text-red-400 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="h-px bg-zinc-800 my-3 mx-4" />
          <p className="px-4 pt-2 pb-1 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            Portal
          </p>
          <button
            onClick={() => navigate('/portal/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <span>Panel kandydata</span>
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-800/50">
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Wyloguj
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 bg-[#111]/80 backdrop-blur-xl border-b border-zinc-800/60 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-zinc-400 hover:text-white transition">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="text-white font-bold">Admin Panel</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
