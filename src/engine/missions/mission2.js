export const mission2 = {
  id: 'mission2',
  name: 'Crack the Door',
  level: 2,
  estimatedTime: 8,
  unlockedCommands: ['ls', 'cd', 'cat', 'crack', 'decode', 'help', 'clear', 'pwd', 'hint', 'status'],

  briefing: `[SECURE MESSAGE FROM HANDLER]

Agent, we've hit a wall. Literally.

The security division recovered an encrypted password from the breach investigation. It's an MD5 hash — old-school but effective against brute force.

Fortunately, we have a dictionary of common passwords. Use the 'crack' command to run a dictionary attack against the hash.

Read the hash file first, then use 'crack' with the dictionary.

The clock is ticking.

— Handler Alpha`,

  objective: 'Crack the MD5 hash to reveal the password',

  story: {
    intro: "Your handler encrypted a password to the next facility. Figure out the hash.",
    completion: "Password cracked! 'password123' — amateurs. But this gives us access to the encrypted communications. Intel is incoming..."
  },

  filesystem: {
    'security': {
      'password_hash.txt': `═══════════════════════════════
  RECOVERED HASH
═══════════════════════════════
  
  Hash:  482c811da5d5b4bc6d497ffa98491e38
  Type:  MD5
  Note:  Recovered from breach evidence
  
  Use 'crack <hash> <dictionary_file>'
  to attempt a dictionary attack.
═══════════════════════════════`,

      'dictionary.txt': `=== COMMON PASSWORD DICTIONARY ===
admin
letmein
welcome
monkey
dragon
master
qwerty
login
abc123
starwars
trustno1
iloveyou
sunshine
princess
football
shadow
superman
michael
ninja
mustang
password123
baseball
access
hello
charlie
donald
root
toor
pass
12345678`,

      'README.txt': `SECURITY DIVISION — INSTRUCTIONS

1. Read password_hash.txt to find the hash
2. The hash is: 482c811da5d5b4bc6d497ffa98491e38
3. Use the dictionary.txt file with the crack command
4. Syntax: crack <hash> dictionary.txt

Good luck, Agent.`
    }
  },

  initialPath: '/security',

  // The hash 482c811da5d5b4bc6d497ffa98491e38 is MD5 of "password123"
  crackDatabase: {
    '482c811da5d5b4bc6d497ffa98491e38': 'password123',
    '5f4dcc3b5aa765d61d8327deb882cf99': 'password'
  },

  hints: [
    "Start by reading the hash file: 'cat password_hash.txt'. Then look at the dictionary.",
    "The crack command syntax is: 'crack <md5_hash> dictionary.txt'. Copy the hash from the file.",
    "Try: 'crack 482c811da5d5b4bc6d497ffa98491e38 dictionary.txt'"
  ],

  progressKeys: ['crackedPassword'],

  successCondition: (progress) => {
    return progress.crackedPassword === true;
  },

  triggers: [
    {
      command: 'crack',
      action: null, // Handled by crack command logic in CommandParser
      narrative: null
    }
  ]
};
