export const tutorial = {
  id: 'tutorial',
  name: 'Welcome to the Agency',
  level: 0,
  estimatedTime: 5,
  unlockedCommands: ['ls', 'cd', 'cat', 'help', 'clear', 'pwd', 'hint', 'status'],

  briefing: `[SECURE CHANNEL — ENCRYPTED]

Welcome, recruit. You've been selected by the Agency for Digital Intelligence.

Before you embark on your first mission, you must complete basic training.

Your task is simple:
1. Use 'ls' to list files in the current directory
2. Use 'cat' to read the README.txt file
3. Navigate into the secret_folder using 'cd'
4. Read the certificate inside to complete training

Type 'help' at any time for a list of available commands.

Good luck, Agent.

— Handler Alpha`,

  objective: 'Complete basic terminal training — find and read the certificate',

  story: {
    intro: "You've been recruited by the Agency for Digital Intelligence. Let's train you on the basics.",
    completion: "Training complete. Welcome to the Agency, Agent. You've proven you have what it takes. Your first real mission awaits..."
  },

  filesystem: {
    'agency': {
      'training': {
        'README.txt': `═══════════════════════════════
  AGENCY TRAINING MANUAL v1.0
═══════════════════════════════

Welcome, recruit.

Step 1: You're here. Good start.
Step 2: Use 'ls' to see what files are available.
Step 3: There's a secret folder in this directory.
         Use 'cd secret_folder' to enter it.
Step 4: Read the certificate file inside.

Commands you know:
  ls       - List files and folders
  cd       - Change directory
  cat      - Read a file
  help     - Get help
  
Remember: Every great hacker started by
reading the manual.

═══════════════════════════════`,

        'file1.txt': `AGENCY NOTE:
Good — you found this file.

Now look for a folder called 'secret_folder'.
Use 'cd secret_folder' to enter it.
Then use 'ls' to see what's inside.`,

        'welcome.txt': `Welcome to the Agency for Digital Intelligence.
Our mission: Protect the digital world.
Your mission: Prove you can navigate a terminal.`,

        'secret_folder': {
          'certificate.txt': `
╔═══════════════════════════════════════╗
║                                       ║
║   CERTIFICATE OF COMPLETION           ║
║                                       ║
║   This certifies that the bearer      ║
║   has completed Agency Basic          ║
║   Terminal Training.                  ║
║                                       ║
║   Code: TRAINING_COMPLETE             ║
║                                       ║
║   Status: ACTIVE AGENT                ║
║                                       ║
║   "The journey of a thousand          ║
║    exploits begins with ls."          ║
║                                       ║
╚═══════════════════════════════════════╝`,
          'notes.txt': `Handler's private notes:
This recruit shows promise. Keep an eye on them.
- Handler Alpha`
        }
      }
    }
  },

  initialPath: '/agency/training',

  hints: [
    "Try typing 'ls' to see what files and folders are in the current directory.",
    "Use 'cat README.txt' to read the training manual. It will tell you what to do next.",
    "Navigate to the secret folder with 'cd secret_folder', then use 'cat certificate.txt' to complete training."
  ],

  progressKeys: ['readCertificate'],

  successCondition: (progress) => {
    return progress.readCertificate === true;
  },

  triggers: [
    {
      command: 'cat',
      args: ['certificate.txt'],
      check: (gameState) => {
        const path = gameState.currentPath || '';
        return path.includes('secret_folder');
      },
      progressUpdate: { readCertificate: true },
      narrative: '✅ TRAINING COMPLETE! You have proven yourself, Agent. Welcome to the Agency.'
    }
  ]
};
