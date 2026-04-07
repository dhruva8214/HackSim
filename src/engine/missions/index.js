import { tutorial } from './tutorial';
import { mission1 } from './mission1';
import { mission2 } from './mission2';
import { mission3 } from './mission3';
import { mission4 } from './mission4';
import { mission5 } from './mission5';
import { chapter1Missions } from './chapter1_forensics';
import { chapter2Missions } from './chapter2_network';
import { chapter3Missions } from './chapter3_crypto';
import { chapter4Missions } from './chapter4_social';
import { chapter5Missions } from './chapter5_malware';
import { chapter6Missions } from './chapter6_incident';
import { chapter7Missions } from './chapter7_pentest';
import { chapter8Missions } from './chapter8_cloud';
import { chapter9Missions } from './chapter9_iot';
import { chapter10Missions } from './chapter10_boss';

export const MISSIONS = [
  tutorial, mission1, mission2, mission3, mission4, mission5,
  ...chapter1Missions,
  ...chapter2Missions,
  ...chapter3Missions,
  ...chapter4Missions,
  ...chapter5Missions,
  ...chapter6Missions,
  ...chapter7Missions,
  ...chapter8Missions,
  ...chapter9Missions,
  ...chapter10Missions
];

export const CHAPTERS = [
  { id: 'ch0', name: 'Basics', description: 'Terminal fundamentals', missions: [tutorial, mission1, mission2, mission3, mission4, mission5] },
  { id: 'ch1', name: 'Forensics', description: 'Digital trace analysis', missions: chapter1Missions },
  { id: 'ch2', name: 'Network', description: 'Intelligence gathering', missions: chapter2Missions },
  { id: 'ch3', name: 'Crypto', description: 'Ciphers and decoding', missions: chapter3Missions },
  { id: 'ch4', name: 'Social', description: 'Phishing & manipulation', missions: chapter4Missions },
  { id: 'ch5', name: 'Malware', description: 'Analysis & reverse engineering', missions: chapter5Missions },
  { id: 'ch6', name: 'Incident', description: 'Response & containment', missions: chapter6Missions },
  { id: 'ch7', name: 'PenTest', description: 'Advanced exploitation', missions: chapter7Missions },
  { id: 'ch8', name: 'Cloud', description: 'Infrastructure security', missions: chapter8Missions },
  { id: 'ch9', name: 'Hardware', description: 'IoT & physical hacking', missions: chapter9Missions },
  { id: 'ch10', name: 'Syndicate', description: 'Final confrontation', missions: chapter10Missions }
];

export function getMission(id) {
  return MISSIONS.find(m => m.id === id) || null;
}

export function getMissionByIndex(index) {
  return MISSIONS[index] || null;
}

export function isMissionUnlocked(index, completedMissions) {
  if (index === 0) return true; // Tutorial always unlocked
  // Mission N requires mission N-1 to be completed
  const prevMission = MISSIONS[index - 1];
  return prevMission && completedMissions.includes(prevMission.id);
}

export function getNextMission(currentId) {
  const currentIndex = MISSIONS.findIndex(m => m.id === currentId);
  if (currentIndex < 0 || currentIndex >= MISSIONS.length - 1) return null;
  return MISSIONS[currentIndex + 1];
}

export { tutorial, mission1, mission2, mission3, mission4, mission5 };
