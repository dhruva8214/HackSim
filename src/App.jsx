import { useEffect } from 'react';
import { useGameStore } from './engine/GameState';
import { audioManager } from './components/AudioManager';
import HomeScreen from './screens/HomeScreen';
import MissionSelectScreen from './screens/MissionSelectScreen';
import GameScreen from './screens/GameScreen';
import MissionCompleteScreen from './screens/MissionCompleteScreen';
import SettingsScreen from './screens/SettingsScreen';

export default function App() {
  const { currentScreen, settings } = useGameStore();

  // Sync audio with settings
  useEffect(() => {
    audioManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Initialize audio on first user interaction
  useEffect(() => {
    const initAudio = () => {
      audioManager.init();
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
    window.addEventListener('click', initAudio);
    window.addEventListener('keydown', initAudio);
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreen />;
      case 'missionSelect': return <MissionSelectScreen />;
      case 'game': return <GameScreen />;
      case 'missionComplete': return <MissionCompleteScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="app-root">
      {renderScreen()}
    </div>
  );
}
