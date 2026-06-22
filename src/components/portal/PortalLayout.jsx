import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const navItems = [
  { key: 'dashboard', icon: 'dashboard', path: '/portal/dashboard' },
  { key: 'profile', icon: 'person', path: '/portal/profile' },
  { key: 'documents', icon: 'folder', path: '/portal/documents' },
  { key: 'legalization', icon: 'gavel', path: '/portal/legalization' },
  { key: 'applications', icon: 'work', path: '/portal/applications' },
  { key: 'notifications', icon: 'notifications', path: '/portal/notifications' },
];

function SidebarLink({ item, isActive, onClick, t, notifCount }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-[#8CC63F]/15 text-[#8CC63F] shadow-sm'
          : 'text-zinc-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className="material-symbols-outlined text-xl">{item.icon}</span>
      <span className="flex-1 text-left">{t(`portal.nav.${item.key}`)}</span>
      {item.key === 'notifications' && notifCount > 0 && (
        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
          {notifCount > 9 ? '9+' : notifCount}
        </span>
      )}
    </button>
  );
}

export default function PortalLayout({ children, activePage }) {
  const { user, profile, signOut, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount] = useState(0); // Will be populated from Supabase

  function navigate(path) {
    window.location.href = path;
    setSidebarOpen(false);
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Mobile overlay */}
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
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#8CC63F] to-[#6BA32E] flex items-center justify-center shadow-md shadow-[#8CC63F]/20">
              <span className="text-white font-black text-base">J</span>
            </div>
            <span className="text-white text-xl font-extrabold tracking-tight">
              Job<span className="text-[#8CC63F]">Me</span>
            </span>
            <span className="text-zinc-600 text-xs font-medium ml-1">Portal</span>
          </a>
        </div>

        {/* User card */}
        <div className="mx-4 mb-4 p-3 rounded-xl bg-white/5 border border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8CC63F] to-[#00B4B4] flex items-center justify-center text-white font-bold text-sm shadow-md">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-bold truncate">{displayName}</p>
              <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          <p className="px-4 pt-2 pb-1 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            {t('portal.nav.menu')}
          </p>
          {navItems.map(item => (
            <SidebarLink
              key={item.key}
              item={item}
              isActive={activePage === item.key}
              onClick={() => navigate(item.path)}
              t={t}
              notifCount={item.key === 'notifications' ? unreadCount : 0}
            />
          ))}

          {isAdmin && (
            <>
              <div className="h-px bg-zinc-800 my-3 mx-4" />
              <p className="px-4 pt-2 pb-1 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                Admin
              </p>
              <SidebarLink
                item={{ key: 'adminDashboard', icon: 'admin_panel_settings', path: '/admin' }}
                isActive={activePage === 'adminDashboard'}
                onClick={() => navigate('/admin')}
                t={t}
                notifCount={0}
              />
              <SidebarLink
                item={{ key: 'adminCandidates', icon: 'group', path: '/admin/candidates' }}
                isActive={activePage === 'adminCandidates'}
                onClick={() => navigate('/admin/candidates')}
                t={t}
                notifCount={0}
              />
              <SidebarLink
                item={{ key: 'adminDocs', icon: 'fact_check', path: '/admin/documents' }}
                isActive={activePage === 'adminDocs'}
                onClick={() => navigate('/admin/documents')}
                t={t}
                notifCount={0}
              />
            </>
          )}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-zinc-800/50">
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            {t('portal.nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar (mobile) */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#111]/80 backdrop-blur-xl border-b border-zinc-800/60 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-zinc-400 hover:text-white transition"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <a href="/" className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8CC63F] to-[#6BA32E] flex items-center justify-center">
              <span className="text-white font-black text-xs">J</span>
            </div>
            <span className="text-white text-lg font-extrabold">
              Job<span className="text-[#8CC63F]">Me</span>
            </span>
          </a>
          <button
            onClick={() => navigate('/portal/notifications')}
            className="p-2 -mr-2 text-zinc-400 hover:text-white transition relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Bottom nav (mobile) */}
        <nav className="lg:hidden sticky bottom-0 z-30 bg-[#111]/90 backdrop-blur-xl border-t border-zinc-800/60 px-2 py-1 flex justify-around">
          {navItems.slice(0, 5).map(item => (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg transition-all ${
                activePage === item.key ? 'text-[#8CC63F]' : 'text-zinc-600'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{t(`portal.nav.${item.key}`)}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
