import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import PortalLayout from './PortalLayout';

const TYPE_CONFIG = {
  info: { icon: 'info', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  success: { icon: 'check_circle', color: 'text-[#8CC63F]', bg: 'bg-[#8CC63F]/10', border: 'border-[#8CC63F]/20' },
  warning: { icon: 'warning', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  action: { icon: 'touch_app', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  async function loadNotifications() {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setNotifications(data || []);
    setLoading(false);
  }

  async function markAsRead(id) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  }

  async function markAllRead() {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  }

  async function deleteNotification(id) {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('portal.notifications.justNow');
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  }

  return (
    <PortalLayout activePage="notifications">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">{t('portal.notifications.title')}</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {unreadCount > 0
              ? `${unreadCount} ${t('portal.notifications.unread')}`
              : t('portal.notifications.allRead')}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition-all hover:border-zinc-700"
          >
            <span className="material-symbols-outlined text-sm">done_all</span>
            {t('portal.notifications.markAllRead')}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-3 border-[#8CC63F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map(n => {
            const tc = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
            return (
              <div
                key={n.id}
                className={`bg-[#141414] border rounded-2xl p-4 transition-all group ${
                  n.is_read ? 'border-zinc-800/40 opacity-70' : 'border-zinc-800/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tc.bg}`}>
                    <span className={`material-symbols-outlined text-xl ${tc.color}`}>{tc.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm font-bold ${n.is_read ? 'text-zinc-500' : 'text-white'}`}>
                        {n.title}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-zinc-600 text-xs">{timeAgo(n.created_at)}</span>
                        {!n.is_read && <div className="w-2 h-2 rounded-full bg-[#8CC63F]" />}
                      </div>
                    </div>
                    <p className={`text-sm mt-0.5 leading-relaxed ${n.is_read ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {n.link && (
                        <a
                          href={n.link}
                          className="text-xs text-[#8CC63F] hover:text-[#A1DD22] font-medium transition flex items-center gap-0.5"
                        >
                          {t('portal.notifications.viewDetails')}
                          <span className="material-symbols-outlined text-xs">chevron_right</span>
                        </a>
                      )}
                      {!n.is_read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="text-xs text-zinc-600 hover:text-zinc-400 font-medium transition opacity-0 group-hover:opacity-100"
                        >
                          {t('portal.notifications.markRead')}
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(n.id)}
                        className="text-xs text-zinc-700 hover:text-red-400 font-medium transition opacity-0 group-hover:opacity-100 ml-auto"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#141414] border border-zinc-800/60 rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-zinc-700 mb-3">notifications_off</span>
          <p className="text-zinc-500 text-sm">{t('portal.notifications.noNotifications')}</p>
        </div>
      )}
    </PortalLayout>
  );
}
