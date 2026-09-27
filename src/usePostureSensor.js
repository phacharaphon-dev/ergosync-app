import { useState, useEffect, useRef, useCallback } from 'react';

export const usePostureSensor = ({
  sensitivity = 'Balanced',
  isTracking = true,
  autoPauseMedia = true,
} = {}) => {
  const [metrics, setMetrics] = useState({
    currentAngle: 12.4,
    spineDrift: 2.1,
    shoulderTilt: 0.8,
    status: 'Optimal',
    alignmentLabel: 'Healthy Alignment',
    confidenceScore: 99.2,
    fps: 60,
  });

  const [sessionStats, setSessionStats] = useState({
    goodPosturePercentage: 94,
    optimalStreakSeconds: 840,
    slouchIncidentsCount: 3,
    activeSecondsMonitored: 15420,
  });

  const [interventionState, setInterventionState] = useState({
    isBreakDue: false,
    isSlouchAlertActive: false,
    mediaPaused: false,
    lastAlertTimestamp: null,
  });

  const thresholds = {
    Gentle: { mild: 18, critical: 24, delayMs: 12000 },
    Balanced: { mild: 15, critical: 20, delayMs: 8000 },
    Strict: { mild: 11, critical: 16, delayMs: 4000 },
  }[sensitivity] || { mild: 15, critical: 20, delayMs: 8000 };

  const slouchTimerRef = useRef(null);
  const baselineRef = useRef({ targetNeck: 10, targetShoulder: 0 });

  const recalibrate = useCallback(() => {
    baselineRef.current = {
      targetNeck: 10 + (Math.random() * 2 - 1),
      targetShoulder: 0,
    };
    setMetrics((prev) => ({
      ...prev,
      currentAngle: baselineRef.current.targetNeck,
      status: 'Optimal',
      alignmentLabel: 'Healthy Alignment',
      confidenceScore: 99.8,
    }));
    setInterventionState((prev) => ({
      ...prev,
      isSlouchAlertActive: false,
      mediaPaused: false,
    }));
    if (slouchTimerRef.current) clearTimeout(slouchTimerRef.current);
  }, []);

  const dismissAlert = useCallback(() => {
    setInterventionState((prev) => ({
      ...prev,
      isSlouchAlertActive: false,
      mediaPaused: false,
    }));
  }, []);

  const triggerBreakModal = useCallback((force = true) => {
    setInterventionState((prev) => ({ ...prev, isBreakDue: force }));
  }, []);

  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setMetrics((prev) => {
        const jitter = (Math.random() - 0.49) * 0.7;
        const newAngle = Math.max(6, Math.min(32, Number((prev.currentAngle + jitter).toFixed(1))));

        let status = 'Optimal';
        let alignmentLabel = 'Healthy Alignment';

        if (newAngle >= thresholds.critical) {
          status = 'Critical';
          alignmentLabel = 'Severe Neck Flexion';
        } else if (newAngle >= thresholds.mild) {
          status = 'Mild Slouch';
          alignmentLabel = 'Forward Head Tilt';
        }

        return {
          ...prev,
          currentAngle: newAngle,
          spineDrift: Number(((newAngle - 10) * 0.35).toFixed(1)),
          shoulderTilt: Number(((Math.random() - 0.5) * 1.5).toFixed(1)),
          status,
          alignmentLabel,
          confidenceScore: Number((98.5 + Math.random() * 1.3).toFixed(1)),
        };
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isTracking, thresholds]);

  useEffect(() => {
    if (metrics.status === 'Critical') {
      if (!slouchTimerRef.current && !interventionState.isSlouchAlertActive) {
        slouchTimerRef.current = setTimeout(() => {
          setInterventionState((prev) => ({
            ...prev,
            isSlouchAlertActive: true,
            mediaPaused: autoPauseMedia ? true : prev.mediaPaused,
            lastAlertTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));

          setSessionStats((prev) => ({
            ...prev,
            slouchIncidentsCount: prev.slouchIncidentsCount + 1,
            optimalStreakSeconds: 0,
          }));
        }, thresholds.delayMs);
      }
    } else {
      if (slouchTimerRef.current) {
        clearTimeout(slouchTimerRef.current);
        slouchTimerRef.current = null;
      }
      if (metrics.status === 'Optimal' && interventionState.isSlouchAlertActive) {
        setInterventionState((prev) => ({
          ...prev,
          isSlouchAlertActive: false,
          mediaPaused: false,
        }));
      }
    }
  }, [metrics.status, thresholds.delayMs, autoPauseMedia, interventionState.isSlouchAlertActive]);

  useEffect(() => {
    if (!isTracking) return;
    const ticker = setInterval(() => {
      setSessionStats((prev) => {
        const isOpt = metrics.status === 'Optimal';
        return {
          ...prev,
          activeSecondsMonitored: prev.activeSecondsMonitored + 1,
          optimalStreakSeconds: isOpt ? prev.optimalStreakSeconds + 1 : 0,
        };
      });
    }, 1000);
    return () => clearInterval(ticker);
  }, [isTracking, metrics.status]);

  return {
    metrics,
    sessionStats,
    interventionState,
    recalibrate,
    dismissAlert,
    triggerBreakModal,
  };
};