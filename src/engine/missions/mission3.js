export const mission3 = {
  id: 'mission3',
  name: 'Decode the Message',
  level: 3,
  estimatedTime: 10,
  unlockedCommands: ['ls', 'cd', 'cat', 'grep', 'decode', 'crack', 'help', 'clear', 'pwd', 'hint', 'status'],

  briefing: `[PRIORITY INTERCEPT — HANDLER ALPHA]

Agent, our surveillance team has intercepted three encoded messages from an unknown sender. The messages use different encoding methods.

Your mission: Decode all three messages to piece together critical intelligence.

The 'decode' command supports multiple formats:
  decode <file> base64   — Decode Base64 encoding
  decode <file> caesar   — Decode Caesar cipher (shift 3)
  decode <file> hex      — Decode hexadecimal encoding

Read the hints.txt file for clues about which cipher was used for each message.

Time is of the essence.

— Handler Alpha`,

  objective: 'Decode all three intercepted messages using different ciphers',

  story: {
    intro: "Intelligence is coming in encoded. Decrypt it before the window closes.",
    completion: "All three messages decoded! The intel reveals: the vault is in Seattle, the password is 'phreaks', and there's a secret code. We're getting closer to the attacker..."
  },

  filesystem: {
    'intel': {
      'message1.txt': `═══════════════════════════════════
  INTERCEPTED MESSAGE #1
  Encoding: UNKNOWN
═══════════════════════════════════

VGhlIHZhdWx0IGlzIGluIFNlYXR0bGU=

═══════════════════════════════════`,

      'message2.txt': `═══════════════════════════════════
  INTERCEPTED MESSAGE #2
  Encoding: UNKNOWN
═══════════════════════════════════

Wkh sdvvzrug lv skuhdnv

═══════════════════════════════════`,

      'message3.txt': `═══════════════════════════════════
  INTERCEPTED MESSAGE #3
  Encoding: UNKNOWN
═══════════════════════════════════

50617373776f72643a53656372657433

═══════════════════════════════════`,

      'hints.txt': `INTELLIGENCE ANALYSIS NOTES
══════════════════════════

Message #1: Appears to be Base64 encoded.
  (Hint: Characters A-Z, a-z, 0-9, +, /, =)

Message #2: Appears to be a Caesar cipher.
  (Hint: Each letter shifted by 3 positions)

Message #3: Appears to be Hexadecimal encoded.
  (Hint: Only contains 0-9 and a-f characters)

Use the 'decode' command with the appropriate
cipher type to reveal each message.

Syntax: decode <filename> <cipher_type>
Types: base64, caesar, hex`,

      'decoded_log.txt': `DECODED INTELLIGENCE LOG
════════════════════════

Paste decoded messages here:
(Use decode command to fill this in)

Message 1: [PENDING]
Message 2: [PENDING]  
Message 3: [PENDING]`
    }
  },

  initialPath: '/intel',

  // Decode databases
  decodeDatabase: {
    'message1.txt': {
      base64: 'The vault is in Seattle'
    },
    'message2.txt': {
      caesar: 'The password is phreaks'
    },
    'message3.txt': {
      hex: 'Password:Secret3'
    }
  },

  hints: [
    "Read hints.txt first — it tells you which cipher was used for each message.",
    "Try 'decode message1.txt base64' for the first message. Then use caesar and hex for the others.",
    "The three decoded messages are: 'The vault is in Seattle', 'The password is phreaks', and 'Password:Secret3'"
  ],

  progressKeys: ['decoded1', 'decoded2', 'decoded3'],

  successCondition: (progress) => {
    return progress.decoded1 === true &&
           progress.decoded2 === true &&
           progress.decoded3 === true;
  },

  triggers: []  // Decode triggers handled by command parser
};
