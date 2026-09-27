import { useState } from 'react';
import { usePostureSensor } from './usePostureSensor.js';
import { PostureInterventionModal } from './PostureInterventionModal.jsx';
import { BreakStretchingRoutineModal } from './BreakStretchingRoutineModal.jsx';

export const ErgoSyncDashboardWithModals = () => {
  const [isSoftDark, setIsSoftDark] = useState(false);
  const [activeNav, setActiveNav] = useState('live-assistant');
  const [sensitivity, setSensitivity] = useState('Balanced');
  // eslint-disable-next-line no-unused-vars
  const [autoPauseMedia, setAutoPauseMedia] = useState(true);

  const {
    metrics,
    sessionStats,
    interventionState,
    recalibrate,
    dismissAlert,
    triggerBreakModal,
  } = usePostureSensor({
    sensitivity,
    isTracking: true,
    autoPauseMedia,
  });

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${isSoftDark ? 'dark bg-[#0b131f] text-slate-100' : 'bg-[#f8f9ff] text-[#0b1c30]'}`}>
      
      {/* Top Header */}
      <header className="fixed top-0 inset-x-0 h-16 z-50 bg-white/90 dark:bg-[#15202e]/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="w-full h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">ErgoSync<span className="text-teal-600 dark:text-teal-400 ml-1">AI</span></span>
            </div>
            <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Aligned • {sessionStats.goodPosturePercentage}%
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-full border border-slate-200/40 dark:border-slate-700">
            {[
              { id: 'live-assistant', label: 'Live Assistant' },
              { id: 'biomechanical-analytics', label: 'Biomechanical Analytics' },
              { id: 'ergonomic-break-timer', label: 'Break Cycles' },
              { id: 'sensitivity-and-settings', label: 'Sensitivity & Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveNav(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${activeNav === tab.id ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSoftDark(!isSoftDark)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              type="button"
            >
              <span>{isSoftDark ? '☀️ Light Mode' : '🌙 Soft Dark Mode'}</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              U
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-[#15202e] border-r border-slate-200/60 dark:border-slate-800 flex flex-col justify-between py-6 px-4 z-40 hidden md:flex">
        <div className="flex flex-col gap-2">
          <div className="px-2 py-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Workspace Telemetry</span>
          </div>
          <nav className="flex flex-col gap-1">
            {[
              { id: 'live-assistant', label: 'Live Stream', icon: '📹' },
              { id: 'biomechanical-analytics', label: 'Postural Angles', icon: '📊' },
              { id: 'ergonomic-break-timer', label: 'Rest Protocols', icon: '⏱️' },
              { id: 'sensitivity-and-settings', label: 'Thresholds & AI', icon: '⚙️' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-colors text-left cursor-pointer ${activeNav === item.id ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                type="button"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Vision Sensor</span>
            <span className="text-teal-600 dark:text-teal-400 font-bold">{metrics.fps} FPS</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div className="bg-teal-600 h-full rounded-full w-11/12"></div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col min-h-screen pt-16">
        <main className="flex-1 w-full p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
          
          {/* Top Utility Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#15202e] p-4 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs font-medium">
              <span className="text-teal-600 font-bold">●</span>
              <span>Workstation Telemetry Live • Calibration Matrix v4.2</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={recalibrate}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm transition-transform active:scale-95 cursor-pointer" 
                type="button"
              >
                <span>Quick Recalibrate</span>
              </button>
            </div>
          </div>

          {/* ================= CONDITIONAL RENDER BY ACTIVE NAV ================= */}

          {/* PAGE 1: Live Assistant / Stream */}
          {activeNav === 'live-assistant' && (
            <div className="space-y-8 animate-fadeIn">
              <section className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Sensor Stream</span>
                    <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">Live Posture Assistant</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
                      Real-time ergonomic guidance to help you sit comfortably throughout your workday without intrusive surveillance.
                    </p>
                  </div>
                  <button 
                    onClick={() => triggerBreakModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-shadow shadow-md cursor-pointer"
                  >
                    <span>Start Break Routine Cycles</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-[#15202e] shadow-sm relative overflow-hidden min-h-[440px] border border-slate-200/60 dark:border-slate-800">
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 backdrop-blur-md shadow-sm text-xs font-semibold">
                        <span className="text-teal-600">📹</span>
                        <span className="text-slate-800 dark:text-slate-200">ErgoSentry Neural Engine</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span className="text-slate-400">{metrics.fps} FPS Local</span>
                      </div>
                      <button onClick={recalibrate} className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer" type="button">
                        <span>Recenter Guide</span>
                      </button>
                    </div>

                    <div className="relative z-10 my-auto flex flex-col items-center justify-center py-6">
                      <div className="relative w-64 h-64 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-teal-500/10 animate-pulse"></div>
                        <svg className="w-56 h-56 relative z-10 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 240 240">
                          <circle cx="120" cy="55" r="28" strokeDasharray="4 4" strokeWidth="2.5"></circle>
                          <circle cx="120" cy="55" fill="currentColor" r="4"></circle>
                          <line strokeDasharray="2 2" strokeWidth="1.5" x1="90" x2="150" y1="52" y2="52"></line>
                          <path d="M120 83 L120 108" strokeLinecap="round" strokeWidth="3"></path>
                          <line strokeLinecap="round" strokeWidth="2.5" x1="50" x2="190" y1="110" y2="110"></line>
                          <circle cx="50" cy="110" fill="currentColor" r="5"></circle>
                          <circle cx="190" cy="110" fill="currentColor" r="5"></circle>
                          <path d="M120 110 L120 195" strokeLinecap="round" strokeWidth="3.5"></path>
                          <line strokeLinecap="round" strokeWidth="2.5" x1="75" x2="165" y1="195" y2="195"></line>
                        </svg>
                        <div className="absolute -bottom-3 px-4 py-1 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center gap-1.5 border border-slate-100 dark:border-slate-700">
                          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{metrics.alignmentLabel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between pt-3 bg-slate-50/80 dark:bg-slate-800/40 px-4 py-3 rounded-2xl">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Keep your shoulders relaxed and level with the horizontal guide.</p>
                      <span className="text-xs text-slate-400 uppercase font-semibold">Conf: {metrics.confidenceScore}%</span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#15202e] shadow-sm flex flex-col justify-between flex-1 border border-slate-200/60 dark:border-slate-800">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${metrics.status === 'Optimal' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'}`}>
                            <span>●</span> {metrics.status} State
                          </span>
                          <span className="text-xs text-slate-400">Live Telemetry</span>
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{metrics.currentAngle}°</span>
                            <span className="text-sm text-teal-600 dark:text-teal-400 font-semibold">
                              {metrics.status === 'Optimal' ? 'Safe Range (<15°)' : 'Deviation Alert'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                            Spine drift is measured continuously. Current axial load distribution is operating within set ergonomic boundaries.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                          <span className="text-xs text-slate-400 uppercase">Streak Time</span>
                          <div className="text-xl font-bold mt-0.5 text-slate-900 dark:text-white">{Math.floor(sessionStats.optimalStreakSeconds / 60)}m</div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                          <span className="text-xs text-slate-400 uppercase">Posture Score</span>
                          <div className="text-xl font-bold text-teal-600 dark:text-teal-400 mt-0.5">{sessionStats.goodPosturePercentage}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold text-lg">💡</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase">Ergonomic Tip</span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">Perform a gentle 20-second backward shoulder roll to relieve trapezius tension.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* PAGE 2: Biomechanical Analytics / Postural Angles */}
          {activeNav === 'biomechanical-analytics' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs uppercase tracking-wider text-teal-600 font-bold">Deep Telemetry</span>
                <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">Biomechanical Postural Angles</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed spinal alignment metrics, cervical flexion curves, and pelvic tilt distribution.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#15202e] border border-slate-200/60 dark:border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 uppercase">Cervical Spine Angle</span>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">12.4°</div>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">Optimal Range (&lt;15°)</p>
                </div>
                <div className="p-6 rounded-3xl bg-white dark:bg-[#15202e] border border-slate-200/60 dark:border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 uppercase">Thoracic Curvature</span>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">28.1°</div>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">Stable Load Support</p>
                </div>
                <div className="p-6 rounded-3xl bg-white dark:bg-[#15202e] border border-slate-200/60 dark:border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 uppercase">Pelvic Tilt Index</span>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">94.8%</div>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">Ergonomic Neutral Basin</p>
                </div>
              </div>

              {/* Analytics History Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#15202e] border border-slate-200/60 dark:border-slate-800 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Posture Time Split Distribution</h3>
                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold"><span className="text-slate-700 dark:text-slate-300">Optimal Neutral</span><span>82%</span></div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden"><div className="bg-teal-600 h-full w-[82%] rounded-full"></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold"><span className="text-slate-700 dark:text-slate-300">Mild Forward Lean</span><span>14%</span></div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden"><div className="bg-teal-400 h-full w-[14%] rounded-full"></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold"><span className="text-slate-700 dark:text-slate-300">Critical Slouch</span><span>4%</span></div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden"><div className="bg-rose-500 h-full w-[4%] rounded-full"></div></div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#15202e] border border-slate-200/60 dark:border-slate-800 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Incident Trends</h3>
                  <p className="text-xs text-slate-500">Peak fatigue detected during high-focus afternoon sprint sessions.</p>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Average Correction Response Time</span>
                    <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400">14 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 3: Break Cycles / Rest Protocols */}
          {activeNav === 'ergonomic-break-timer' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs uppercase tracking-wider text-teal-600 font-bold">Recovery Protocol</span>
                <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">Rest Protocols & Break Cycles</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage automated stretch routines, eye-relief intervals, and micro-break frequency.</p>
              </div>

              <div className="p-8 rounded-3xl bg-white dark:bg-[#15202e] border border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase">Active Timer Status</span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Next Smart Break in 42 Minutes</h2>
                  <p className="text-xs text-slate-500 max-w-lg">Configured to initiate cervical and shoulder stretching cycles after 50 minutes of continuous focus.</p>
                </div>
                <button 
                  onClick={() => triggerBreakModal(true)}
                  className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  Launch Break Routine Now ➔
                </button>
              </div>
            </div>
          )}

          {/* PAGE 4: Sensitivity & Settings / Thresholds & AI */}
          {activeNav === 'sensitivity-and-settings' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs uppercase tracking-wider text-teal-600 font-bold">Calibration Profiles</span>
                <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">Thresholds & AI Settings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fine-tune sensor sensitivity, chime alerts, and media auto-pause behavior.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#15202e] shadow-sm space-y-6 border border-slate-200/60 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Posture Sensitivity Mode</h3>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    {['Gentle', 'Balanced', 'Strict'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setSensitivity(lvl)}
                        className={`py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${sensitivity === lvl ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        type="button"
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Current profile: <strong className="text-teal-600 dark:text-teal-400">{sensitivity}</strong>. Adjusts slouch alarm delay and angle tolerance thresholds.</p>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#15202e] shadow-sm space-y-4 border border-slate-200/60 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">System Actions</h3>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">Quick System Recalibration</span>
                    <button onClick={recalibrate} className="px-4 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 cursor-pointer">Recalibrate</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= END CONDITIONAL RENDER ================= */}

        </main>
      </div>

      {/* Active Modals */}
      <PostureInterventionModal
        isOpen={interventionState.isSlouchAlertActive}
        currentAngle={metrics.currentAngle}
        targetAngle={15}
        mediaPaused={interventionState.mediaPaused}
        onDismiss={dismissAlert}
        onRecalibrate={recalibrate}
      />

      <BreakStretchingRoutineModal
        isOpen={interventionState.isBreakDue}
        onComplete={() => triggerBreakModal(false)}
        onSkip={() => triggerBreakModal(false)}
      />

    </div>
  );
};