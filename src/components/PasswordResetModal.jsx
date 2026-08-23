import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function PasswordResetModal() {
  const { isRecovery, setIsRecovery, updateUserPassword } = useAuth();
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (isRecovery || (hash && hash.includes('type=recovery'))) {
      setOpen(true);
    }
  }, [isRecovery]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch') || 'Паролі не співпадають');
      return;
    }
    if (password.length < 6) {
      setError(t('auth.passwordTooShort') || 'Пароль має бути мін. 6 символів');
      return;
    }

    setLoading(true);
    const { error: updateErr } = await updateUserPassword(password);
    setLoading(false);

    if (updateErr) {
      setError(updateErr.message);
    } else {
      setSuccess(t('auth.passwordUpdated') || 'Пароль успішно оновлено!');
      setTimeout(() => {
        setOpen(false);
        setIsRecovery(false);
        setPassword('');
        setConfirmPassword('');
        setSuccess('');
      }, 1500);
    }
  }

  function handleClose() {
    setOpen(false);
    setIsRecovery(false);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#141414] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition p-1.5 rounded-xl hover:bg-white/5"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <span className="material-symbols-outlined text-2xl">lock_reset</span>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {t('auth.updatePasswordTitle') || 'Встановити новий пароль'}
            </h2>
            <p className="text-zinc-400 text-xs mt-0.5">
              {t('auth.updatePasswordSubtitle') || 'Введіть новий пароль для вашого акаунту'}
            </p>
          </div>
        </div>

        <p className="text-zinc-500 text-xs mb-6 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
          Ви увійшли за посиланням скидання пароля. Будь ласка, введіть ваш новий пароль нижче.
        </p>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-[#8CC63F]/10 border border-[#8CC63F]/20 text-[#8CC63F] text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              {t('portal.profile.newPassword') || 'Новий пароль'}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-lg">lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/25 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition"
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              {t('auth.confirmPassword') || 'Підтвердіть пароль'}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-lg">lock</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/25 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm
                         shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0
                         transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('auth.loading') || 'Завантаження...'}
                </span>
              ) : (
                t('auth.saveNewPassword') || 'Зберегти новий пароль'
              )}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-bold text-sm transition-all"
            >
              Пізніше
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
