import { useGameStore } from '../engine/GameState';

export default function SettingsScreen() {
  const { settings, updateSettings, navigateTo } = useGameStore();

  return (
    <div className="screen settings-screen">
      <div className="settings-content">
        <div className="settings-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigateTo('home')}>
            ← BACK
          </button>
          <h1 className="settings-title">⚙ SETTINGS</h1>
        </div>

        <div className="settings-list">
          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-name">🔊 Sound Effects</div>
              <div className="settings-item-desc">Enable synthetic sound effects</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-name">⏱ Timer</div>
              <div className="settings-item-desc">Show mission timer (time always tracked)</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.timerVisible}
                onChange={(e) => updateSettings({ timerVisible: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-name">✨ Typing Animation</div>
              <div className="settings-item-desc">Animate narrative text with typewriter effect</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.typingAnimation}
                onChange={(e) => updateSettings({ typingAnimation: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        <div className="settings-footer">
          <p className="settings-credits">
            HackSim v2.1 — A cybersecurity puzzle game.<br />
            Built for education & entertainment.
          </p>
        </div>
      </div>

      <div className="crt-overlay" />
    </div>
  );
}
