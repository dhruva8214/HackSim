import { useState, useEffect } from 'react';
import { useGameStore } from '../engine/GameState';
import { getMission, getNextMission } from '../engine/missions';
import ParticleEffect from '../components/ParticleEffect';

export default function MissionCompleteScreen() {
  const { currentMissionId, missionScores, hintsUsed, navigateTo, startMission } = useGameStore();
  const mission = getMission(currentMissionId);
  const score = missionScores[currentMissionId];
  const nextMission = getNextMission(currentMissionId);
  const [showParticles, setShowParticles] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    // Stop particles after a while
    const timer = setTimeout(() => setShowParticles(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!mission) return null;

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getGrade = (time, hints) => {
    const baseTime = mission.estimatedTime * 60;
    if (time <= baseTime * 0.5 && hints === 0) return { grade: 'S', label: 'ELITE HACKER', color: '#ffcc00' };
    if (time <= baseTime * 0.75 && hints <= 1) return { grade: 'A', label: 'EXPERT', color: '#00ff41' };
    if (time <= baseTime && hints <= 2) return { grade: 'B', label: 'COMPETENT', color: '#00ffff' };
    if (time <= baseTime * 1.5) return { grade: 'C', label: 'ADEQUATE', color: '#aa00ff' };
    return { grade: 'D', label: 'COMPLETE', color: '#888888' };
  };

  const gradeInfo = score ? getGrade(score.time, score.hintsUsed) : { grade: '?', label: '', color: '#fff' };

  // Achievements
  const achievements = [];
  if (score) {
    if (score.hintsUsed === 0) achievements.push({ icon: '🧠', label: 'NO HINTS' });
    if (score.time < mission.estimatedTime * 30) achievements.push({ icon: '⚡', label: 'SPEED RUN' });
    if (mission.level === 5) achievements.push({ icon: '🎖️', label: 'ELITE AGENT' });
  }

  return (
    <div className={`screen mission-complete-screen ${visible ? 'visible' : ''}`}>
      <ParticleEffect active={showParticles} />

      <div className="mc-content">
        <div className="mc-header">
          <div className="mc-check">✅</div>
          <h1 className="mc-title">MISSION COMPLETE</h1>
          <h2 className="mc-mission-name">{mission.name}</h2>
        </div>

        <div className="mc-grade" style={{ color: gradeInfo.color, borderColor: gradeInfo.color }}>
          <div className="mc-grade-letter">{gradeInfo.grade}</div>
          <div className="mc-grade-label">{gradeInfo.label}</div>
        </div>

        <div className="mc-stats">
          <div className="mc-stat">
            <span className="mc-stat-icon">⏱</span>
            <span className="mc-stat-label">Time</span>
            <span className="mc-stat-value">{score ? formatTime(score.time) : '--'}</span>
          </div>
          <div className="mc-stat">
            <span className="mc-stat-icon">💡</span>
            <span className="mc-stat-label">Hints Used</span>
            <span className="mc-stat-value">{score ? score.hintsUsed : 0}/3</span>
          </div>
          <div className="mc-stat">
            <span className="mc-stat-icon">📊</span>
            <span className="mc-stat-label">Level</span>
            <span className="mc-stat-value">{mission.level}</span>
          </div>
        </div>

        {achievements.length > 0 && (
          <div className="mc-achievements">
            <h3>ACHIEVEMENTS UNLOCKED</h3>
            <div className="mc-achievement-list">
              {achievements.map((a, i) => (
                <div key={i} className="mc-achievement">
                  <span className="mc-achievement-icon">{a.icon}</span>
                  <span className="mc-achievement-label">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mc-story">
          <p>{mission.story.completion}</p>
        </div>

        <div className="mc-actions">
          {nextMission && (
            <button
              className="btn btn-primary btn-glow"
              onClick={() => startMission(nextMission.id)}
            >
              ▶ NEXT MISSION: {nextMission.name}
            </button>
          )}

          {!nextMission && (
            <div className="mc-finale">
              <p className="mc-finale-text">🎮 You've completed all missions! You are a certified HackSim Agent.</p>
            </div>
          )}

          <button
            className="btn btn-secondary"
            onClick={() => startMission(currentMissionId)}
          >
            🔄 REPLAY
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => navigateTo('missionSelect')}
          >
            📋 MISSION SELECT
          </button>
        </div>
      </div>

      <div className="crt-overlay" />
    </div>
  );
}
