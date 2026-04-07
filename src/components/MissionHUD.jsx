import { useState, useEffect } from 'react';

export default function MissionHUD({ mission, startTime, hintsUsed, maxHints, timerVisible }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const hintPips = Array.from({ length: maxHints }, (_, i) => (
    <span key={i} className={`hint-pip ${i < (maxHints - hintsUsed) ? 'active' : 'used'}`}>●</span>
  ));

  return (
    <div className="mission-hud">
      <div className="hud-left">
        <div className="hud-mission-name">
          <span className="hud-level">LVL {mission.level}</span>
          <span className="hud-title">{mission.name}</span>
        </div>
        <div className="hud-objective">{mission.objective}</div>
      </div>

      <div className="hud-right">
        {timerVisible && (
          <div className={`hud-timer ${elapsed > 540 ? 'timer-warning' : ''}`}>
            <span className="timer-icon">⏱</span>
            <span className="timer-value">{formatTime(elapsed)}</span>
          </div>
        )}
        <div className="hud-hints">
          <span className="hints-label">HINTS</span>
          <div className="hints-pips">{hintPips}</div>
        </div>
      </div>
    </div>
  );
}
