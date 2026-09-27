import { useState, useEffect } from 'react';

const STRETCHES = [
  {
    title: 'Chin Tucks (Cervical Retraction)',
    duration: 20,
    target: 'Deep Cervical Flexors',
    instruction: 'Keep head level and pull your chin straight back as if making a gentle double chin. Hold for 3s, release, and repeat.',
  },
  {
    title: 'Doorway Pec & Chest Opener',
    duration: 25,
    target: 'Pectoralis Major & Anterior Deltoid',
    instruction: 'Place forearms on a doorframe or push elbows backward with open palms. Step one foot forward until a stretch is felt.',
  },
  {
    title: 'Trapezius Lateral Stretch',
    duration: 20,
    target: 'Upper Trapezius & Levator Scapulae',
    instruction: 'Lower your right ear toward your right shoulder without lifting your left shoulder. Gently switch sides midway.',
  },
];

export const BreakStretchingRoutineModal = ({
  isOpen = true,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(STRETCHES[0].duration);
  const [isRunning, setIsRunning] = useState(true);

  const currentStretch = STRETCHES[currentStep];
  const totalSteps = STRETCHES.length;

  useEffect(() => {
    if (!isOpen || !isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) {
          return prevTime - 1;
        }

        // เมื่อเวลาหมดในสเตต์นี้ ให้เปลี่ยนสเตต์ถัดไป
        setCurrentStep((prevStep) => {
          const nextStep = prevStep + 1;
          if (nextStep < STRETCHES.length) {
            setTimeLeft(STRETCHES[nextStep].duration);
            return nextStep;
          } else {
            setIsRunning(false);
            if (onComplete) onComplete();
            return prevStep;
          }
        });

        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isRunning, onComplete]);

  if (!isOpen) return null;

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = timeLeft / currentStretch.duration;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="break-routine-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-teal-700 dark:text-teal-300 text-xs font-semibold uppercase tracking-wider">
              Smart Break Cycle
            </span>
            <span className="text-xs text-slate-400">Step {currentStep + 1} of {totalSteps}</span>
          </div>
          <button type="button" onClick={onSkip} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
            Skip Routine
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-teal-50/50 dark:bg-slate-700/40 border border-teal-100/80 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-5">
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r={radius} className="stroke-slate-200 dark:stroke-slate-600" strokeWidth="4" fill="transparent" />
              <circle cx="32" cy="32" r={radius} className="stroke-teal-600 dark:stroke-teal-400 transition-all duration-1000 ease-linear" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">{timeLeft}</span>
              <span className="text-[9px] text-slate-400 uppercase mt-0.5">sec</span>
            </div>
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">Target: {currentStretch.target}</span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">{currentStretch.title}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{currentStretch.instruction}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={() => setIsRunning(!isRunning)} className="text-xs font-medium text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            {isRunning ? '⏸ Pause' : '▶ Resume'}
          </button>
          {currentStep + 1 < totalSteps ? (
            <button 
              type="button" 
              onClick={() => { 
                const next = currentStep + 1;
                setCurrentStep(next); 
                setTimeLeft(STRETCHES[next].duration); 
              }} 
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
            >
              Next Stretch →
            </button>
          ) : (
            <button type="button" onClick={onComplete} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">
              Finish Routine ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};