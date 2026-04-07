import { isMissionUnlocked } from '../engine/missions';

export default function MissionCard({ mission, index, completedMissions, score, onSelect, isActive }) {
  const unlocked = isMissionUnlocked(index, completedMissions);
  const completed = completedMissions.includes(mission.id);

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`mission-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''} ${isActive ? 'active' : ''}`}
      onClick={() => unlocked && onSelect(mission)}
      onKeyDown={(e) => e.key === 'Enter' && unlocked && onSelect(mission)}
      role="button"
      tabIndex={unlocked ? 0 : -1}
      aria-label={`${mission.name} — ${unlocked ? (completed ? 'Completed' : 'Available') : 'Locked'}`}
    >
      <div className="card-status">
        {completed ? '✅' : unlocked ? '🔓' : '🔒'}
      </div>
      <div className="card-level">
        {mission.level === 0 ? 'TUT' : `M${mission.level}`}
      </div>
      <div className="card-info">
        <div className="card-name">{unlocked ? mission.name : '???'}</div>
        <div className="card-meta">
          {unlocked ? (
            <>
              <span className="card-time-est">~{mission.estimatedTime} min</span>
              {score && (
                <span className="card-best-time">Best: {formatTime(score.time)}</span>
              )}
            </>
          ) : (
            <span className="card-lock-text">Complete previous mission</span>
          )}
        </div>
      </div>
    </div>
  );
}
