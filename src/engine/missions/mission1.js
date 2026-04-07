export const mission1 = {
  id: 'mission1',
  name: 'The Drop-Off',
  level: 1,
  estimatedTime: 7,
  unlockedCommands: ['ls', 'cd', 'cat', 'help', 'clear', 'pwd', 'hint', 'status'],

  briefing: `[SECURE MESSAGE FROM HANDLER]

Agent, welcome to the Agency for Digital Intelligence. You've been identified as someone with exceptional problem-solving skills.

Your first assignment: Retrieve a secure message I've left in the field. It's hidden in one of our systems. You have the tools — terminal commands — and access to the network.

Find the message without raising any alarms. Look carefully — not everything is visible at first glance.

Time limit: 10 minutes.

— Handler Alpha`,

  objective: 'Navigate the file system and find the hidden message',

  story: {
    intro: "A courier left a message in the dead drop. Retrieve it without being detected.",
    completion: "Excellent work, Agent. The message reveals coordinates to a secure facility. But it's password-protected. We'll need to crack that next..."
  },

  filesystem: {
    'drop_off': {
      'decoys': {
        'fake_intel.txt': 'DECOY: This is not the message you are looking for.',
        'report_q4.txt': 'Q4 Performance Report: [REDACTED]\nAll metrics within acceptable range.\nNo anomalies detected.',
        'memo.txt': 'INTERNAL MEMO\nSubject: Office supplies\nPlease stop taking the red staplers.',
        'backup.log': 'BACKUP LOG:\n2024-04-15 01:00 — Backup started\n2024-04-15 01:45 — Backup completed\nNo errors found.'
      },
      'logs': {
        'access.log': 'ACCESS LOG\n2024-04-15 09:00 — Agent_01 logged in\n2024-04-15 09:15 — Agent_02 logged in\n2024-04-15 10:00 — All agents active\nNothing unusual here.',
        'system.log': 'SYSTEM LOG\nAll systems nominal.\nFirewall: ACTIVE\nEncryption: AES-256\nStatus: GREEN'
      },
      '.hidden': {
        'message.txt': `
╔═══════════════════════════════════════╗
║       CLASSIFIED — EYES ONLY         ║
╠═══════════════════════════════════════╣
║                                       ║
║  Code: SHADOW_OPERATIVE              ║
║                                       ║
║  The facility is located at           ║
║  coordinates 47.6062° N, 122.3321° W ║
║  (Seattle, WA — underground)         ║
║                                       ║
║  Entry requires password:            ║
║  [ENCRYPTED — See Mission 2]        ║
║                                       ║
║  Handler Alpha confirms: PROCEED     ║
║                                       ║
╚═══════════════════════════════════════╝`,
        '.access_key': 'KEY-7291-ALPHA\nDo not share this key with anyone.'
      },
      'other_stuff': {
        'todo.txt': 'TODO:\n- Finish training\n- Complete first mission\n- Not get caught\n- Remember to eat lunch',
        'readme.txt': 'This directory contains various operational files.\nNot everything is as it seems.\nLook deeper, Agent.'
      }
    }
  },

  initialPath: '/drop_off',

  hints: [
    "Not all files and folders are immediately visible. Look for hidden folders — they start with a dot (.).",
    "Try using 'ls' in the current directory. See the .hidden folder? Use 'cd .hidden' to enter it.",
    "The message is at: /drop_off/.hidden/message.txt — Use 'cat message.txt' after navigating there."
  ],

  progressKeys: ['foundMessage'],

  successCondition: (progress) => {
    return progress.foundMessage === true;
  },

  triggers: [
    {
      command: 'cat',
      args: ['message.txt'],
      check: (gameState) => {
        const path = gameState.currentPath || '';
        return path.includes('.hidden');
      },
      progressUpdate: { foundMessage: true },
      narrative: '📨 Message retrieved! Handler Alpha will be pleased. The coordinates point to Seattle...'
    }
  ]
};
