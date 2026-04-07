import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../engine/GameState';
import { getMission } from '../engine/missions';
import { CommandParser } from '../engine/CommandParser';
import { audioManager } from '../components/AudioManager';
import Terminal from '../components/Terminal';
import MissionHUD from '../components/MissionHUD';
import NarrativeBox from '../components/NarrativeBox';

export default function GameScreen() {
  const {
    currentMissionId,
    missionProgress,
    terminalHistory,
    hintsUsed,
    maxHints,
    missionStartTime,
    settings,
    addTerminalLine,
    addTerminalLines,
    clearTerminal,
    updateMissionProgress,
    useHint,
    completeMission,
    navigateTo,
    addToCommandHistory,
  } = useGameStore();

  const mission = getMission(currentMissionId);
  const [narrative, setNarrative] = useState(null);
  const [missionComplete, setMissionComplete] = useState(false);
  const parserRef = useRef(null);
  const initializedRef = useRef(null);

  // Initialize parser
  useEffect(() => {
    if (!mission) return;
    // Guard against re-initialization for the same mission
    if (initializedRef.current === mission.id) return;
    initializedRef.current = mission.id;

    const parser = new CommandParser(
      mission,
      { missionProgress, currentPath: '' },
      (key, value) => updateMissionProgress(key, value),
      () => useHint(),
      (text) => {
        setNarrative(text);
        audioManager.playNarrative();
      }
    );

    parserRef.current = parser;

    // Show briefing
    setNarrative(mission.briefing);
    audioManager.playNarrative();

    // Clear and add welcome terminal lines
    clearTerminal();
    setTimeout(() => {
      addTerminalLines([
        { type: 'system', text: `╔══════════════════════════════════════════╗` },
        { type: 'system', text: `║  HackSim Terminal v2.1                  ║` },
        { type: 'system', text: `║  Mission: ${mission.name.padEnd(29)}║` },
        { type: 'system', text: `╚══════════════════════════════════════════╝` },
        { type: 'output', text: '' },
        { type: 'output', text: `Objective: ${mission.objective}` },
        { type: 'output', text: `Type 'help' for commands, 'hint' for help.` },
        { type: 'output', text: '' },
      ]);
    }, 50);
  }, [mission?.id]);

  // Check mission completion
  useEffect(() => {
    if (!mission || missionComplete) return;

    if (mission.successCondition(missionProgress)) {
      setMissionComplete(true);
      audioManager.playMissionComplete();

      addTerminalLines([
        { type: 'output', text: '' },
        { type: 'success', text: '═══════════════════════════════════════' },
        { type: 'success', text: '  ✅ MISSION COMPLETE!' },
        { type: 'success', text: '═══════════════════════════════════════' },
        { type: 'output', text: '' },
      ]);

      // Delay before transitioning
      setTimeout(() => {
        completeMission();
      }, 3000);
    }
  }, [missionProgress]);

  const handleCommand = useCallback((input) => {
    if (!parserRef.current || missionComplete) return;

    const parser = parserRef.current;
    const prompt = parser.getPrompt();

    // Add command to history display
    addTerminalLine({ type: 'command', text: input, prompt });
    addToCommandHistory(input);

    // Execute
    const result = parser.execute(input);
    if (!result) return;

    // Handle clear command
    if (result.type === 'clear') {
      clearTerminal();
      return;
    }

    // Play sound based on result type
    if (result.type === 'error') audioManager.playError();
    else if (result.type === 'success') audioManager.playSuccess();
    else if (result.type === 'hint') audioManager.playHint();

    // Add output
    if (result.output) {
      const lines = result.output.split('\n');
      for (const line of lines) {
        addTerminalLine({ type: result.type, text: line });
      }
    }

    // Update parser's game state reference
    parser.gameState = {
      ...parser.gameState,
      missionProgress: useGameStore.getState().missionProgress,
      currentPath: parser.getCurrentPath(),
    };
  }, [missionComplete]);

  const handleDismissNarrative = () => {
    setNarrative(null);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Escape for dismissing boxes
      if (e.key === 'Escape') {
        if (narrative) {
          setNarrative(null);
          audioManager.playClick();
        }
      }

      // Ctrl + L: Clear terminal
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        clearTerminal();
        audioManager.playTick();
      }

      // Ctrl + H: Use hint
      if (e.ctrlKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        if (!missionComplete && !narrative) {
          handleCommand('hint');
        }
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [narrative, missionComplete, handleCommand, clearTerminal]);

  if (!mission) {
    return (
      <div className="screen game-screen">
        <p>Mission not found.</p>
        <button className="btn btn-primary" onClick={() => navigateTo('missionSelect')}>
          Back to Missions
        </button>
      </div>
    );
  }

  return (
    <div className="screen game-screen">
      <MissionHUD
        mission={mission}
        startTime={missionStartTime}
        hintsUsed={hintsUsed}
        maxHints={maxHints}
        timerVisible={settings.timerVisible}
      />

      <div className="game-main">
        <Terminal
          history={terminalHistory}
          prompt={parserRef.current?.getPrompt() || '$ '}
          onCommand={handleCommand}
          disabled={missionComplete}
          typingAnimation={settings.typingAnimation}
        />
      </div>

      <div className="game-toolbar">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            if (window.confirm('Leave mission? Progress for this attempt will be lost.')) {
              navigateTo('missionSelect');
            }
          }}
        >
          ← ABORT
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => handleCommand('hint')}
          disabled={hintsUsed >= maxHints}
        >
          💡 HINT ({maxHints - hintsUsed})
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setNarrative(mission.briefing)}
        >
          📋 BRIEFING
        </button>
      </div>

      {narrative && (
        <NarrativeBox text={narrative} onDismiss={handleDismissNarrative} />
      )}

      <div className="crt-overlay" />
    </div>
  );
}
