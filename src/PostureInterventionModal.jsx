import React from 'react';

export const PostureInterventionModal = ({
  isOpen = true,
  currentAngle = 23,
  targetAngle = 12,
  mediaPaused = true,
  onDismiss,
  onRecalibrate,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intervention-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-100 dark:border-rose-950/60 space-y-6 relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-teal-500" />

        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-800/80 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {mediaPaused && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-amber-800 dark:text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Media Auto-Paused
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h3 id="intervention-title" className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Gentle Posture Check
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Your neck has remained tilted forward at <strong className="text-rose-600 dark:text-rose-400 font-semibold">{currentAngle}°</strong> for over 8 seconds. Gently draw your chin back toward your chest.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4 text-center">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Observed Angle</span>
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">{currentAngle}°</span>
          </div>
          <div className="border-l border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Target Baseline</span>
            <span className="text-2xl font-bold text-teal-700 dark:text-teal-400 mt-0.5 block">&lt; {targetAngle}°</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            I'm Realigned (Resume)
          </button>
          <button
            type="button"
            onClick={onRecalibrate}
            className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
          >
            Recalibrate
          </button>
        </div>
      </div>
    </div>
  );
};