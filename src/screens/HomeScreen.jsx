import { useGameStore } from '../engine/GameState';
import MatrixRain from '../components/MatrixRain';

export default function HomeScreen() {
  const { navigateTo, completedMissions, resetProgress } = useGameStore();
  const hasSave = completedMissions.length > 0;
  const progressPercent = Math.round((completedMissions.length / 6) * 100);

  return (
    <div className="screen home-screen">
      <MatrixRain />

      <div className="home-content">
        {/* Logo ASCII Art */}
        <div className="home-logo-area">
          <pre className="home-ascii-logo">{`
  ██╗  ██╗ █████╗  ██████╗██╗  ██╗
  ██║  ██║██╔══██╗██╔════╝██║ ██╔╝
  ███████║███████║██║     █████╔╝ 
  ██╔══██║██╔══██║██║     ██╔═██╗ 
  ██║  ██║██║  ██║╚██████╗██║  ██╗
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
        ███████╗██╗███╗   ███╗
        ██╔════╝██║████╗ ████║
        ███████╗██║██╔████╔██║
        ╚════██║██║██║╚██╔╝██║
        ███████║██║██║ ╚═╝ ██║
        ╚══════╝╚═╝╚═╝     ╚═╝`}</pre>
          <div className="home-tagline">CYBERSECURITY SIMULATION</div>
          <div className="home-version">v2.1 — TERMINAL EDITION</div>
        </div>

        {/* Progress Bar */}
        {hasSave && (
          <div className="home-progress">
            <div className="progress-label">
              MISSIONS COMPLETED: {completedMissions.length}/6 ({progressPercent}%)
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="home-buttons">
          <button
            className="btn btn-primary btn-glow"
            onClick={() => navigateTo('missionSelect')}
          >
            {hasSave ? '▶ CONTINUE' : '▶ START GAME'}
          </button>

          {hasSave && (
            <button
              className="btn btn-secondary"
              onClick={() => navigateTo('missionSelect')}
            >
              📋 MISSION SELECT
            </button>
          )}

          <button
            className="btn btn-ghost"
            onClick={() => navigateTo('settings')}
          >
            ⚙ SETTINGS
          </button>

          {hasSave && (
            <button
              className="btn btn-danger"
              onClick={() => {
                if (window.confirm('Are you sure? This will erase all progress.')) {
                  resetProgress();
                }
              }}
            >
              🗑 RESET
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <div className="home-disclaimer">
          <p>
            ⚠ HackSim is a fictional game for educational entertainment. It does not
            teach real hacking techniques. Unauthorized access to computer systems
            is illegal. This game simulates hacking for learning purposes only.
          </p>
          <p className="save-warning">
            Your progress is saved locally in your browser.
          </p>
        </div>
      </div>

      {/* Scanline Overlay */}
      <div className="crt-overlay" />
    </div>
  );
}
