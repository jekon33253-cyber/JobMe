import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import PortalLayout from './PortalLayout';

const STATUS_CONFIG = {
  pending: { color: 'bg-zinc-700', ring: '', dot: 'bg-zinc-500', text: 'text-zinc-500' },
  in_progress: { color: 'bg-[#8CC63F]/20', ring: 'border-2 border-[#8CC63F]', dot: 'bg-[#8CC63F] animate-pulse', text: 'text-[#8CC63F]' },
  completed: { color: 'bg-[#8CC63F]', ring: '', dot: '', text: 'text-zinc-400' },
};

export default function LegalizationTracker() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadSteps();
  }, [user]);

  async function loadSteps() {
    const { data } = await supabase
      .from('legalization_steps')
      .select('*')
      .eq('user_id', user.id)
      .order('step_order', { ascending: true });
    setSteps(data || []);
    setLoading(false);
  }

  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <PortalLayout activePage="legalization">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">{t('portal.legalization.title')}</h1>
        <p className="text-zinc-500 text-sm mt-1">{t('portal.legalization.subtitle')}</p>
      </div>

      {/* Progress overview */}
      <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-bold">{t('portal.legalization.overallProgress')}</h2>
            <p className="text-zinc-500 text-sm">{completedCount} / {steps.length} {t('portal.legalization.stepsCompleted')}</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#8CC63F]/10 flex items-center justify-center">
            <span className="text-[#8CC63F] text-xl font-black">{progress}%</span>
          </div>
        </div>
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8CC63F] to-[#00B4B4] rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-3 border-[#8CC63F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : steps.length > 0 ? (
        <div className="space-y-0">
          {steps.map((step, i) => {
            const sc = STATUS_CONFIG[step.status] || STATUS_CONFIG.pending;
            const isLast = i === steps.length - 1;

            return (
              <div key={step.id} className="relative flex gap-5">
                {/* Vertical line + dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${sc.color} ${sc.ring}`}>
                    {step.status === 'completed' ? (
                      <span className="material-symbols-outlined text-white text-lg">check</span>
                    ) : step.status === 'in_progress' ? (
                      <div className={`w-2.5 h-2.5 rounded-full ${sc.dot}`} />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
                    )}
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 flex-1 min-h-[40px] ${
                      step.status === 'completed' ? 'bg-[#8CC63F]' : 'bg-zinc-800'
                    }`} />
                  )}
                </div>

                {/* Content card */}
                <div className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}>
                  <div className={`bg-[#141414] border rounded-2xl p-5 transition-all ${
                    step.status === 'in_progress'
                      ? 'border-[#8CC63F]/30 shadow-lg shadow-[#8CC63F]/5'
                      : 'border-zinc-800/60'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-bold text-base ${
                        step.status === 'completed' ? 'text-zinc-400' :
                        step.status === 'in_progress' ? 'text-white' : 'text-zinc-600'
                      }`}>
                        {step.step_name}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        step.status === 'completed' ? 'bg-[#8CC63F]/10 text-[#8CC63F] border border-[#8CC63F]/20' :
                        step.status === 'in_progress' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}>
                        {step.status === 'completed' && <span className="material-symbols-outlined text-xs">check_circle</span>}
                        {step.status === 'in_progress' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />}
                        {t(`portal.legalization.status.${step.status}`)}
                      </span>
                    </div>

                    {step.notes && (
                      <p className="text-zinc-500 text-sm leading-relaxed mt-1">{step.notes}</p>
                    )}

                    {step.completed_at && (
                      <p className="text-zinc-600 text-xs mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">calendar_today</span>
                        {new Date(step.completed_at).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#141414] border border-zinc-800/60 rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-zinc-700 mb-3">gavel</span>
          <p className="text-zinc-500 text-sm">{t('portal.legalization.noSteps')}</p>
          <p className="text-zinc-600 text-xs mt-1">{t('portal.legalization.noStepsHint')}</p>
        </div>
      )}
    </PortalLayout>
  );
}
