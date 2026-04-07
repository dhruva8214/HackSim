import { useState, useMemo } from 'react';
import { useGameStore } from '../engine/GameState';
import { MISSIONS, CHAPTERS } from '../engine/missions';
import MissionCard from '../components/MissionCard';

export default function MissionSelectScreen() {
  const { navigateTo, startMission, completedMissions, missionScores } = useGameStore();
  const [selected, setSelected] = useState(null);
  
  // Find the first chapter that isn't fully completed to set as default
  const initialChapter = useMemo(() => {
    const firstIncomplete = CHAPTERS.find(ch => 
      ch.missions.some(m => !completedMissions.includes(m.id))
    );
    return firstIncomplete || CHAPTERS[0];
  }, [completedMissions]);

  const [activeChapter, setActiveChapter] = useState(initialChapter);

  const handleSelect = (mission) => {
    setSelected(mission);
  };

  const handlePlay = () => {
    if (selected) {
      startMission(selected.id);
    }
  };

  const getChapterProgress = (chapter) => {
    const completedCount = chapter.missions.filter(m => completedMissions.includes(m.id)).length;
    return (completedCount / chapter.missions.length) * 100;
  };

  const isChapterLocked = (chapterIndex) => {
    if (chapterIndex === 0) return false;
    const prevChapter = CHAPTERS[chapterIndex - 1];
    return !prevChapter.missions.every(m => completedMissions.includes(m.id));
  };

  return (
    <div className="screen mission-select-screen">
      <div className="ms-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigateTo('home')}>
          ← BACK
        </button>
        <h1 className="ms-title">HACKSIM OPERATIONS</h1>
        <div className="ms-count">{completedMissions.length}/{MISSIONS.length} TOTAL COMPLETE</div>
      </div>

      <div className="ms-container">
        {/* Sidebar: Chapters */}
        <aside className="ms-sidebar">
          <div className="ms-sidebar-label">CHAPTERS</div>
          <div className="ms-chapter-list">
            {CHAPTERS.map((chapter, idx) => {
              const locked = isChapterLocked(idx);
              const progress = getChapterProgress(chapter);
              const completed = progress === 100;

              return (
                <button
                  key={chapter.id}
                  className={`ms-chapter-item ${activeChapter.id === chapter.id ? 'active' : ''} ${locked ? 'locked' : ''} ${completed ? 'completed' : ''}`}
                  onClick={() => !locked && setActiveChapter(chapter)}
                  disabled={locked}
                >
                  <div className="ms-chapter-info">
                    <span className="ms-chapter-name">{chapter.name}</span>
                    <span className="ms-chapter-desc">{chapter.description}</span>
                  </div>
                  <div className="ms-chapter-status">
                    {locked ? '🔒' : completed ? '✓' : `${Math.floor(progress)}%`}
                  </div>
                  {progress > 0 && progress < 100 && (
                    <div className="ms-chapter-progress-bar">
                      <div className="ms-chapter-progress-inner" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main: Mission Grid */}
        <main className="ms-main">
          <div className="ms-chapter-header">
            <h2 className="ms-chapter-title">{activeChapter.name} missions</h2>
            <p className="ms-chapter-subtitle">{activeChapter.description}</p>
          </div>

          <div className="ms-grid">
            {activeChapter.missions.map((mission) => {
              const globalIndex = MISSIONS.indexOf(mission);
              return (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  index={globalIndex}
                  completedMissions={completedMissions}
                  score={missionScores[mission.id]}
                  onSelect={handleSelect}
                  isActive={selected?.id === mission.id}
                />
              );
            })}
          </div>
        </main>
      </div>

      {/* Footer: Preview */}
      {selected && (
        <div className="ms-preview glassmorphism animate-slide-up">
          <div className="ms-preview-content">
            <div className="ms-preview-header">
              <div className="ms-preview-label">OBJECTIVE {selected.id.replace('mission', '')}</div>
              <h2 className="ms-preview-title">{selected.name}</h2>
            </div>
            <p className="ms-preview-story">{selected.story.intro}</p>
            <div className="ms-preview-meta">
              <div className="meta-item">
                <span className="label">Complexity:</span>
                <span className="value">LEVEL {selected.level}</span>
              </div>
              <div className="meta-item">
                <span className="label">Est. Time:</span>
                <span className="value">~{selected.estimatedTime} min</span>
              </div>
              <div className="meta-item">
                <span className="label">Hints:</span>
                <span className="value">Available</span>
              </div>
              {missionScores[selected.id] && (
                <div className="meta-item high-score">
                  <span className="label">Best Time:</span>
                  <span className="value">
                    {Math.floor(missionScores[selected.id].time / 60)}:{(missionScores[selected.id].time % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="ms-preview-actions">
            <button className="btn btn-primary btn-lg btn-glow" onClick={handlePlay}>
              {completedMissions.includes(selected.id) ? 'EXECUTE AGAIN' : 'START OPERATION'}
            </button>
          </div>
        </div>
      )}

      <div className="crt-overlay" />
    </div>
  );
}
