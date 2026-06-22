import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function LoginPage() {
  const { signIn, signUp, resetPassword } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError(t('auth.passwordMismatch'));
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError(t('auth.passwordTooShort'));
          setLoading(false);
          return;
        }
        const { error: signUpError } = await signUp(email, password, fullName);
        if (signUpError) {
          setError(signUpError.message);
        } else {
          setSuccess(t('auth.checkEmail'));
        }
      } else if (mode === 'login') {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(t('auth.invalidCredentials'));
        } else {
          window.location.href = '/portal/dashboard';
        }
      } else if (mode === 'forgot') {
        const { error: resetError } = await resetPassword(email);
        if (resetError) {
          setError(resetError.message);
        } else {
          setSuccess(t('auth.resetSent'));
        }
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#8CC63F]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#00B4B4]/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2 mb-10 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8CC63F] to-[#6BA32E] flex items-center justify-center shadow-lg shadow-[#8CC63F]/20">
            <span className="text-white font-black text-lg">J</span>
          </div>
          <span className="text-white text-2xl font-extrabold tracking-tight">
            Job<span className="text-[#8CC63F]">Me</span>
          </span>
        </a>

        {/* Card */}
        <div className="bg-[#141414] border border-zinc-800/80 rounded-3xl p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
          {/* Tabs */}
          {mode !== 'forgot' && (
            <div className="flex gap-1 p-1 bg-[#1a1a1a] rounded-xl mb-8">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                  mode === 'login'
                    ? 'bg-[#8CC63F] text-white shadow-md shadow-[#8CC63F]/25'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t('auth.login')}
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                  mode === 'register'
                    ? 'bg-[#8CC63F] text-white shadow-md shadow-[#8CC63F]/25'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t('auth.register')}
              </button>
            </div>
          )}

          {/* Heading */}
          <h1 className="text-2xl font-extrabold text-white mb-2">
            {mode === 'login' && t('auth.welcomeBack')}
            {mode === 'register' && t('auth.createAccount')}
            {mode === 'forgot' && t('auth.resetPassword')}
          </h1>
          <p className="text-zinc-500 text-sm mb-6">
            {mode === 'login' && t('auth.loginSubtitle')}
            {mode === 'register' && t('auth.registerSubtitle')}
            {mode === 'forgot' && t('auth.resetSubtitle')}
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
            {mode === 'register' && (
              <div>
                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                  {t('auth.fullName')}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-lg">person</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    placeholder={t('auth.fullNamePlaceholder')}
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#8CC63F]/50 focus:ring-1 focus:ring-[#8CC63F]/25 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-lg">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder={t('auth.emailPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#8CC63F]/50 focus:ring-1 focus:ring-[#8CC63F]/25 transition-all"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                  {t('auth.password')}
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
                    className="w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#8CC63F]/50 focus:ring-1 focus:ring-[#8CC63F]/25 transition-all"
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
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                  {t('auth.confirmPassword')}
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
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#8CC63F]/50 focus:ring-1 focus:ring-[#8CC63F]/25 transition-all"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                  className="text-xs text-[#8CC63F] hover:text-[#A1DD22] transition font-medium"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8CC63F] to-[#6BA32E] text-white font-bold text-sm
                         shadow-lg shadow-[#8CC63F]/25 hover:shadow-xl hover:shadow-[#8CC63F]/30
                         hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('auth.loading')}
                </span>
              ) : (
                <>
                  {mode === 'login' && t('auth.loginBtn')}
                  {mode === 'register' && t('auth.registerBtn')}
                  {mode === 'forgot' && t('auth.sendResetLink')}
                </>
              )}
            </button>
          </form>

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className="w-full mt-4 text-sm text-zinc-500 hover:text-zinc-300 transition flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              {t('auth.backToLogin')}
            </button>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-600 text-xs mt-6">
          {t('auth.termsNote')}{' '}
          <a href="/privacy" className="text-[#8CC63F] hover:underline">{t('auth.privacyLink')}</a>
        </p>
      </div>
    </div>
  );
}
