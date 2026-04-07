export const mission5 = {
  id: 'mission5',
  name: 'The Final Hack',
  level: 5,
  estimatedTime: 15,
  unlockedCommands: ['ls', 'cd', 'cat', 'grep', 'decode', 'crack', 'analyze', 'exploit', 'help', 'clear', 'pwd', 'hint', 'status'],

  briefing: `[CRITICAL ALERT — PRIORITY RED]

Agent, this is it. The Agency is under a sophisticated cyberattack. Our systems are being infiltrated in real-time.

I'm granting you elevated access to the mainframe. Here's your mission:

  1. Navigate to /mainframe/secure/ and find the attack logs
  2. The attack log is encrypted — decode it (Base64)
  3. The decoded log contains an admin hash — crack it
  4. Read the defense protocol for the exploit command syntax
  5. Execute: exploit defense_protocol.txt <password>

The fate of the Agency rests on your shoulders.

One shot. Don't fail.

— Handler Alpha`,

  objective: 'Stop the cyberattack: decode, crack, and execute the defense protocol',

  story: {
    intro: "The agency's core system is under attack. You must navigate, decode, crack, and stop the attacker before it's too late.",
    completion: `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎖️  MISSION ACCOMPLISHED — AGENCY SAVED  🎖️           ║
║                                                           ║
║   The attacker has been locked out.                      ║
║   All systems are secure.                                ║
║                                                           ║
║   By order of the Director:                              ║
║   You are hereby inducted into the                       ║
║   ELITE CYBER DIVISION of the Agency                     ║
║   for Digital Intelligence.                              ║
║                                                           ║
║   Congratulations, Agent.                                ║
║   You are officially a HACKER.                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝`
  },

  filesystem: {
    'mainframe': {
      'README.txt': `MAINFRAME ACCESS — RESTRICTED
═════════════════════════════

This is the Agency's mainframe.

Directories:
  /mainframe/secure/    — Secured operations
  /mainframe/backdoor/  — WARNING: Compromised
  /mainframe/system_core/ — Core systems

Start with /mainframe/secure/ to find
the attack evidence.`,

      'secure': {
        'attack_log_encrypted.txt': `═══════════════════════════════════
  ENCRYPTED ATTACK LOG
  Encoding: Base64
═══════════════════════════════════

QXR0YWNrZXIgSVA6IDE5Mi4xNjguMS4xCkhhc2g6IGJhZGMwZmZlZTBkZWVkCkFkbWluIGhhc2g6IDIxMjMyZjI5N2E1N2E1YTc0Mzg5NGEwZTRhODAxZmMz

═══════════════════════════════════

Use 'decode attack_log_encrypted.txt base64'
to reveal the contents.`,

        'passwords': {
          'admin_hash.txt': `ADMIN CREDENTIAL HASH
═════════════════════

Hash: 21232f297a57a5a743894a0e4a801fc3
Type: MD5

This hash protects the defense protocol.
Crack it to get the admin password.

Use: crack <hash> wordlist.txt`,

          'wordlist.txt': `=== ADMIN PASSWORD WORDLIST ===
root
administrator
superuser
admin
sysadmin
master
control
override
access
system`
        },

        'defense_protocol.txt': `DEFENSE PROTOCOL — CLASSIFIED
═══════════════════════════════

To execute the defense protocol and
lock out the attacker:

  1. You need the admin password
  2. Run: exploit defense_protocol.txt <password>

⚠️ WARNING: The password must be correct.
   Incorrect passwords will alert the attacker.

This will:
  - Terminate all unauthorized sessions
  - Rotate encryption keys
  - Activate the firewall countermeasures
  - Lock the attacker out permanently

═══════════════════════════════`
      },

      'backdoor': {
        'warning.txt': `⚠️ WARNING — COMPROMISED DIRECTORY

This directory was accessed by the attacker.
DO NOT execute any files here.

The real solution is in /mainframe/secure/`,

        'trap.exe': 'TROJAN — If you see this, you\'re in the wrong place. Go to /mainframe/secure/',
        'fake_key.txt': 'DECOY: This is not the admin password.\nThe real path: secure/passwords/admin_hash.txt'
      },

      'system_core': {
        'shutdown_attacker.txt': `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        ATTACKER SHUTDOWN CONFIRMED                       ║
║                                                           ║
║   ✅ Unauthorized sessions terminated                    ║
║   ✅ Encryption keys rotated                             ║
║   ✅ Firewall countermeasures activated                  ║
║   ✅ Attacker locked out permanently                     ║
║                                                           ║
║   The Agency is secure.                                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝`,

        'status.txt': 'SYSTEM STATUS: UNDER ATTACK\nLevel: CRITICAL\nAction Required: Execute defense protocol'
      }
    }
  },

  initialPath: '/mainframe',

  // Decode databases for this mission
  decodeDatabase: {
    'attack_log_encrypted.txt': {
      base64: 'Attacker IP: 192.168.1.1\nHash: badc0ffee0deed\nAdmin hash: 21232f297a57a5a743894a0e4a801fc3'
    }
  },

  // Hash 21232f297a57a5a743894a0e4a801fc3 is MD5 of "admin"
  crackDatabase: {
    '21232f297a57a5a743894a0e4a801fc3': 'admin'
  },

  // Exploit config
  exploitConfig: {
    file: 'defense_protocol.txt',
    password: 'admin'
  },

  hints: [
    "Start by navigating: 'cd secure', then 'ls' to see what's available. Read the attack log first.",
    "Decode the attack log with 'decode attack_log_encrypted.txt base64'. Then crack the admin hash from passwords/admin_hash.txt.",
    "The admin password is 'admin'. Execute: 'exploit defense_protocol.txt admin' to complete the mission."
  ],

  progressKeys: ['decodedAttackLog', 'crackedAdminHash', 'executedExploit'],

  successCondition: (progress) => {
    return progress.executedExploit === true;
  },

  triggers: []
};
