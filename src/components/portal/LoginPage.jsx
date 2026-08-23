import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const { signIn, signUp, resetPassword, updateUserPassword, fetchProfile, isRecovery } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'update_password'
  const [selectedRole, setSelectedRole] = useState('candidate'); // 'candidate' | 'recruiter'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    if (isRecovery || (hash && hash.includes('type=recovery')) || params.get('mode') === 'update_password') {
      setMode('update_password');
    }
  }, [isRecovery]);

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
        const { data: signUpData, error: signUpError } = await signUp(email, password, fullName, selectedRole);
        if (signUpError) {
          setError(signUpError.message);
        } else {
          // If session is immediately created (email confirmation disabled), ensure role is updated in profiles table
          if (signUpData?.user) {
            await supabase.from('profiles').update({ role: selectedRole }).eq('id', signUpData.user.id);
            if (selectedRole === 'recruiter') {
              window.location.href = '/recruiter/dashboard';
              return;
            }
          }
          setSuccess(t('auth.checkEmail'));
        }
      } else if (mode === 'login') {
        const { data: signInData, error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(t('auth.invalidCredentials'));
        } else {
          const user = signInData?.user;
          if (user) {
            const userProfile = await fetchProfile(user.id);
            if (userProfile?.role === 'admin') {
              window.location.href = '/admin';
              return;
            }
            if (userProfile?.role === 'recruiter') {
              window.location.href = '/recruiter/dashboard';
              return;
            }
          }
          window.location.href = '/portal/dashboard';
        }
      } else if (mode === 'forgot') {
        const { error: resetError } = await resetPassword(email);
        if (resetError) {
          console.error('Reset password error:', resetError);
          const msg = resetError.message || resetError.error_description || (typeof resetError === 'string' ? resetError : 'Nie udało się wysłać linku resetującego.');
          setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } else {
          setSuccess(t('auth.resetSent'));
        }
      } else if (mode === 'update_password') {
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
        const { error: updateErr } = await updateUserPassword(password);
        if (updateErr) {
          console.error('Update password error:', updateErr);
          setError(updateErr.message);
        } else {
          setSuccess(t('auth.passwordUpdated'));
          setTimeout(() => {
            window.location.href = '/portal/dashboard';
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      const msg = err.message || 'Wystąpił nieoczekiwany błąd.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
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
          {mode !== 'forgot' && mode !== 'update_password' && (
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
            {mode === 'update_password' && t('auth.updatePasswordTitle')}
          </h1>
          <p className="text-zinc-500 text-sm mb-6">
            {mode === 'login' && t('auth.loginSubtitle')}
            {mode === 'register' && t('auth.registerSubtitle')}
            {mode === 'forgot' && t('auth.resetSubtitle')}
            {mode === 'update_password' && t('auth.updatePasswordSubtitle')}
          </p>

          {/* Role selection (only for register) */}
          {mode === 'register' && (
            <div className="mb-6">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">
                {t('auth.selectRole')}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('candidate')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                    selectedRole === 'candidate'
                      ? 'border-[#8CC63F] bg-[#8CC63F]/10'
                      : 'border-zinc-800 bg-[#1a1a1a] hover:border-zinc-600'
                  }`}
                >
                  <span className={`material-symbols-outlined text-3xl ${selectedRole === 'candidate' ? 'text-[#8CC63F]' : 'text-zinc-500'}`}>
                    person_search
                  </span>
                  <div className="text-center">
                    <p className={`text-sm font-bold ${selectedRole === 'candidate' ? 'text-white' : 'text-zinc-400'}`}>
                      {t('auth.roleCandidate')}
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">{t('auth.roleCandidateDesc')}</p>
                  </div>
                  {selectedRole === 'candidate' && (
                    <span className="material-symbols-outlined text-[#8CC63F] text-lg">check_circle</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('recruiter')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                    selectedRole === 'recruiter'
                      ? 'border-[#00B4B4] bg-[#00B4B4]/10'
                      : 'border-zinc-800 bg-[#1a1a1a] hover:border-zinc-600'
                  }`}
                >
                  <span className={`material-symbols-outlined text-3xl ${selectedRole === 'recruiter' ? 'text-[#00B4B4]' : 'text-zinc-500'}`}>
                    handshake
                  </span>
                  <div className="text-center">
                    <p className={`text-sm font-bold ${selectedRole === 'recruiter' ? 'text-white' : 'text-zinc-400'}`}>
                      {t('auth.roleRecruiter')}
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">{t('auth.roleRecruiterDesc')}</p>
                  </div>
                  {selectedRole === 'recruiter' && (
                    <span className="material-symbols-outlined text-[#00B4B4] text-lg">check_circle</span>
                  )}
                </button>
              </div>
            </div>
          )}

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

            {mode !== 'update_password' && (
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
            )}

            {mode !== 'forgot' && (
              <div>
                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                  {mode === 'update_password' ? (t('portal.profile.newPassword') || t('auth.password')) : t('auth.password')}
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

            {(mode === 'register' || mode === 'update_password') && (
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
              className={`w-full py-3.5 rounded-xl text-white font-bold text-sm
                         shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                         ${selectedRole === 'recruiter' && mode === 'register'
                           ? 'bg-gradient-to-r from-[#00B4B4] to-[#007A7A] shadow-[#00B4B4]/25 hover:shadow-[#00B4B4]/30'
                           : 'bg-gradient-to-r from-[#8CC63F] to-[#6BA32E] shadow-[#8CC63F]/25 hover:shadow-[#8CC63F]/30'
                         }`}
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
                  {mode === 'update_password' && t('auth.saveNewPassword')}
                </>
              )}
            </button>
          </form>

          {(mode === 'forgot' || mode === 'update_password') && (
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
          <Link to="/privacy" className="text-[#8CC63F] hover:underline">{t('auth.privacyLink')}</Link>
        </p>
      </div>
    </div>
  );
}
