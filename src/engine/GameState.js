// GameState.js — Zustand store with localStorage persistence
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MISSIONS } from './missions';

const SAVE_KEY = 'hacksim_v1';

export const useGameStore = create(
  persist(
    (set, get) => ({
      // Screen navigation
      currentScreen: 'home', // 'home' | 'missionSelect' | 'game' | 'missionComplete'

      // Player progress
      completedMissions: [],
      missionScores: {},
      
      // Current game session
      currentMissionId: null,
      missionProgress: {},
      terminalHistory: [],
      hintsUsed: 0,
      maxHints: 3,
      missionStartTime: null,
      commandHistory: [],
      commandHistoryIndex: -1,

      // Settings
      settings: {
        soundEnabled: false,
        timerVisible: true,
        typingAnimation: true,
      },

      // ─── Screen Navigation ───────────────────────────
      setScreen: (screen) => set({ currentScreen: screen }),

      navigateTo: (screen) => set({ currentScreen: screen }),

      // ─── Mission Management ──────────────────────────
      startMission: (missionId) => {
        const mission = MISSIONS.find(m => m.id === missionId);
        if (!mission) return;

        set({
          currentScreen: 'game',
          currentMissionId: missionId,
          missionProgress: {},
          terminalHistory: [],
          hintsUsed: 0,
          maxHints: 3,
          missionStartTime: Date.now(),
          commandHistory: [],
          commandHistoryIndex: -1,
        });
      },

      completeMission: () => {
        const state = get();
        const missionId = state.currentMissionId;
        if (!missionId) return;

        const timeTaken = Math.floor((Date.now() - state.missionStartTime) / 1000);
        const newCompleted = state.completedMissions.includes(missionId)
          ? state.completedMissions
          : [...state.completedMissions, missionId];

        const existingScore = state.missionScores[missionId];
        const isBetter = !existingScore || timeTaken < existingScore.time;

        const newScores = {
          ...state.missionScores,
          [missionId]: {
            time: isBetter ? timeTaken : existingScore.time,
            hintsUsed: isBetter ? state.hintsUsed : existingScore.hintsUsed,
            status: 'completed',
            completedAt: new Date().toISOString(),
          }
        };

        set({
          currentScreen: 'missionComplete',
          completedMissions: newCompleted,
          missionScores: newScores,
        });
      },

      // ─── Terminal History ────────────────────────────
      addTerminalLine: (line) => {
        set(state => ({
          terminalHistory: [...state.terminalHistory, line].slice(-200)
        }));
      },

      addTerminalLines: (lines) => {
        set(state => ({
          terminalHistory: [...state.terminalHistory, ...lines].slice(-200)
        }));
      },

      clearTerminal: () => {
        set({ terminalHistory: [] });
      },

      // ─── Command History (up/down arrows) ───────────
      addToCommandHistory: (cmd) => {
        set(state => ({
          commandHistory: [...state.commandHistory, cmd].slice(-50),
          commandHistoryIndex: -1,
        }));
      },

      // ─── Mission Progress ───────────────────────────
      updateMissionProgress: (key, value) => {
        set(state => ({
          missionProgress: { ...state.missionProgress, [key]: value }
        }));
      },

      // ─── Hint System ────────────────────────────────
      useHint: () => {
        const state = get();
        if (state.hintsUsed >= state.maxHints) return null;

        const mission = MISSIONS.find(m => m.id === state.currentMissionId);
        if (!mission || !mission.hints) return null;

        const hintIndex = state.hintsUsed;
        if (hintIndex >= mission.hints.length) return null;

        const hint = mission.hints[hintIndex];
        set({ hintsUsed: state.hintsUsed + 1 });
        return hint;
      },

      // ─── Settings ───────────────────────────────────
      updateSettings: (updates) => {
        set(state => ({
          settings: { ...state.settings, ...updates }
        }));
      },

      // ─── Reset ──────────────────────────────────────
      resetProgress: () => {
        set({
          completedMissions: [],
          missionScores: {},
          currentMissionId: null,
          missionProgress: {},
          terminalHistory: [],
          hintsUsed: 0,
          missionStartTime: null,
          commandHistory: [],
          commandHistoryIndex: -1,
          currentScreen: 'home',
        });
      },

      // ─── Utility ────────────────────────────────────
      getTimeSinceStart: () => {
        const state = get();
        if (!state.missionStartTime) return 0;
        return Math.floor((Date.now() - state.missionStartTime) / 1000);
      },

      isMissionCompleted: (missionId) => {
        return get().completedMissions.includes(missionId);
      },

      getTotalPlayTime: () => {
        const scores = get().missionScores;
        return Object.values(scores).reduce((sum, s) => sum + (s.time || 0), 0);
      },
    }),
    {
      name: SAVE_KEY,
      partialize: (state) => ({
        completedMissions: state.completedMissions,
        missionScores: state.missionScores,
        settings: state.settings,
      }),
    }
  )
);
