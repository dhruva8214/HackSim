// CommandParser.js — Core game engine
// Parses terminal input, validates against mission context, executes commands

import { VirtualFileSystem } from './FileSystem';

const HELP_DATA = {
  ls: {
    usage: 'ls [directory]',
    description: 'List files and folders in the current or specified directory.',
    examples: ['ls', 'ls /home', 'ls -la']
  },
  cd: {
    usage: 'cd <directory>',
    description: 'Change the current working directory.',
    examples: ['cd documents', 'cd ..', 'cd /root']
  },
  cat: {
    usage: 'cat <filename>',
    description: 'Display the contents of a file.',
    examples: ['cat readme.txt', 'cat /logs/access.log']
  },
  grep: {
    usage: 'grep <search_term> <filename>',
    description: 'Search for a text pattern in a file. Returns matching lines.',
    examples: ['grep "password" log.txt', 'grep admin users.txt']
  },
  decode: {
    usage: 'decode <filename> <cipher_type>',
    description: 'Decode an encoded file. Supported ciphers: base64, caesar, hex.',
    examples: ['decode message.txt base64', 'decode secret.txt caesar', 'decode code.txt hex']
  },
  crack: {
    usage: 'crack <md5_hash> <dictionary_file>',
    description: 'Attempt to crack an MD5 hash using a dictionary file.',
    examples: ['crack 5f4dcc3b5aa765d61d8327deb882cf99 dictionary.txt']
  },
  analyze: {
    usage: 'analyze <filename>',
    description: 'Analyze a log or data file for anomalies and suspicious entries.',
    examples: ['analyze access_log.txt', 'analyze system.log']
  },
  exploit: {
    usage: 'exploit <protocol_file> <password>',
    description: 'Execute a defense exploit protocol. Requires the correct password.',
    examples: ['exploit defense_protocol.txt admin']
  },
  help: {
    usage: 'help [command]',
    description: 'Show help for all commands or a specific command.',
    examples: ['help', 'help cat', 'help decode']
  },
  hint: {
    usage: 'hint',
    description: 'Request a contextual hint for the current mission. Limited uses per mission.',
    examples: ['hint']
  },
  clear: {
    usage: 'clear',
    description: 'Clear the terminal screen.',
    examples: ['clear']
  },
  pwd: {
    usage: 'pwd',
    description: 'Print the current working directory path.',
    examples: ['pwd']
  },
  status: {
    usage: 'status',
    description: 'Show current mission progress and objectives.',
    examples: ['status']
  }
};

// Levenshtein distance for typo suggestions
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

export class CommandParser {
  constructor(mission, gameState, updateProgress, useHint, addNarrative) {
    this.mission = mission;
    this.gameState = gameState;
    this.updateProgress = updateProgress;
    this.useHint = useHint;
    this.addNarrative = addNarrative;
    this.fs = new VirtualFileSystem(mission.filesystem);
    
    // Set initial path
    if (mission.initialPath) {
      this.fs.changeDir(mission.initialPath);
    }

    this.allCommands = Object.keys(HELP_DATA);
  }

  getPrompt() {
    return this.fs.getPrompt();
  }

  getCurrentPath() {
    return this.fs.getCurrentPath();
  }

  execute(input) {
    const trimmed = input.trim();
    if (!trimmed) return null;

    const parts = this._tokenize(trimmed);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Check if command exists
    if (!this.allCommands.includes(cmd)) {
      const suggestion = this._findSuggestion(cmd);
      const msg = suggestion
        ? `bash: ${cmd}: command not found. Did you mean '${suggestion}'?`
        : `bash: ${cmd}: command not found. Type 'help' for available commands.`;
      return { type: 'error', output: msg };
    }

    // Check if command is unlocked for this mission
    if (!this.mission.unlockedCommands.includes(cmd)) {
      return {
        type: 'error',
        output: `[SYSTEM]: Command '${cmd}' is locked. Progress further to unlock.`
      };
    }

    // Execute command
    const result = this._executeCommand(cmd, args);

    // Check triggers after command execution
    if (result.type !== 'error') {
      this._checkTriggers(cmd, args);
    }

    return result;
  }

  _tokenize(input) {
    // Basic tokenizer: split on whitespace, but respect quoted strings
    const tokens = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (const ch of input) {
      if (inQuotes) {
        if (ch === quoteChar) {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else if (ch === '"' || ch === "'") {
        inQuotes = true;
        quoteChar = ch;
      } else if (ch === ' ' || ch === '\t') {
        if (current) {
          tokens.push(current);
          current = '';
        }
      } else {
        current += ch;
      }
    }
    if (current) tokens.push(current);
    return tokens;
  }

  _findSuggestion(cmd) {
    let best = null;
    let bestDist = Infinity;
    for (const known of this.mission.unlockedCommands) {
      const dist = levenshtein(cmd, known);
      if (dist < bestDist && dist <= 2) {
        best = known;
        bestDist = dist;
      }
    }
    return best;
  }

  _executeCommand(cmd, args) {
    switch (cmd) {
      case 'ls': return this._ls(args);
      case 'cd': return this._cd(args);
      case 'cat': return this._cat(args);
      case 'pwd': return this._pwd();
      case 'clear': return { type: 'clear', output: '' };
      case 'help': return this._help(args);
      case 'hint': return this._hint();
      case 'status': return this._status();
      case 'grep': return this._grep(args);
      case 'decode': return this._decode(args);
      case 'crack': return this._crack(args);
      case 'analyze': return this._analyze(args);
      case 'exploit': return this._exploit(args);
      default: return { type: 'error', output: `Command '${cmd}' not implemented.` };
    }
  }

  _ls(args) {
    if (args.length === 0) {
      // Check for -la or -a flag
      const result = this.fs.list('.', false);
      return { type: 'output', output: result.output };
    }
    
    const flag = args[0];
    if (flag === '-la' || flag === '-a' || flag === '-al') {
      const result = this.fs.listAll(args[1] || '.');
      return { type: 'output', output: result.output };
    }

    const result = this.fs.list(args[0], false);
    return { type: result.success ? 'output' : 'error', output: result.output };
  }

  _cd(args) {
    if (args.length === 0) {
      const result = this.fs.changeDir('~');
      return { type: 'output', output: result.output };
    }
    const result = this.fs.changeDir(args[0]);
    return { type: result.success ? 'output' : 'error', output: result.output };
  }

  _cat(args) {
    if (args.length === 0) {
      return { type: 'error', output: 'Usage: cat <filename>' };
    }
    const result = this.fs.readFile(args[0]);
    return { type: result.success ? 'output' : 'error', output: result.output };
  }

  _pwd() {
    return { type: 'output', output: this.fs.getCurrentPath() };
  }

  _help(args) {
    if (args.length === 0) {
      const unlocked = this.mission.unlockedCommands.filter(c => HELP_DATA[c]);
      const lines = [
        '╔══════════════════════════════════╗',
        '║     AVAILABLE COMMANDS           ║',
        '╚══════════════════════════════════╝',
        ''
      ];
      for (const cmd of unlocked) {
        const data = HELP_DATA[cmd];
        lines.push(`  ${cmd.padEnd(10)} — ${data.description.slice(0, 50)}${data.description.length > 50 ? '...' : ''}`);
      }
      lines.push('');
      lines.push("Type 'help <command>' for detailed usage.");
      return { type: 'output', output: lines.join('\n') };
    }

    const cmd = args[0].toLowerCase();
    const data = HELP_DATA[cmd];
    if (!data) {
      return { type: 'error', output: `No help available for '${cmd}'.` };
    }
    const lines = [
      `Command: ${cmd}`,
      `Usage:   ${data.usage}`,
      ``,
      data.description,
      ``,
      `Examples:`,
      ...data.examples.map(e => `  $ ${e}`)
    ];
    return { type: 'output', output: lines.join('\n') };
  }

  _hint() {
    const hintResult = this.useHint();
    if (!hintResult) {
      return { type: 'error', output: '[SYSTEM]: No hints remaining for this mission.' };
    }
    return {
      type: 'hint',
      output: `💡 HINT: ${hintResult}`
    };
  }

  _status() {
    const progress = this.gameState.missionProgress || {};
    const keys = this.mission.progressKeys || [];
    const total = keys.length;
    const done = keys.filter(k => progress[k] === true).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    const lines = [
      `╔══════════════════════════════════╗`,
      `║     MISSION STATUS               ║`,
      `╚══════════════════════════════════╝`,
      ``,
      `  Mission:    ${this.mission.name}`,
      `  Level:      ${this.mission.level}`,
      `  Objective:  ${this.mission.objective}`,
      ``,
      `  Progress:   ${done}/${total} objectives (${percent}%)`,
      `  ${'█'.repeat(Math.floor(percent / 5))}${'░'.repeat(20 - Math.floor(percent / 5))}`,
      ``
    ];

    for (const key of keys) {
      const status = progress[key] ? '✅' : '⬜';
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
      lines.push(`  ${status} ${label}`);
    }

    return { type: 'output', output: lines.join('\n') };
  }

  _grep(args) {
    if (args.length < 2) {
      return { type: 'error', output: 'Usage: grep <search_term> <filename>' };
    }
    const [term, file] = args;
    const result = this.fs.grep(term, file);
    return { type: result.success ? 'output' : 'error', output: result.output };
  }

  _decode(args) {
    if (args.length < 2) {
      return { type: 'error', output: 'Usage: decode <filename> <cipher_type>\nTypes: base64, caesar, hex' };
    }
    const [file, cipher] = args;
    const validCiphers = ['base64', 'caesar', 'hex'];
    if (!validCiphers.includes(cipher.toLowerCase())) {
      return { type: 'error', output: `Unknown cipher type: '${cipher}'. Valid types: base64, caesar, hex` };
    }

    // Check if this mission has decode data for this file
    const decodeDB = this.mission.decodeDatabase;
    if (!decodeDB || !decodeDB[file]) {
      return { type: 'error', output: `decode: ${file}: No encoded data found or file cannot be decoded.` };
    }

    const fileDecodes = decodeDB[file];
    const result = fileDecodes[cipher.toLowerCase()];
    if (!result) {
      return { type: 'error', output: `decode: Cannot decode '${file}' with ${cipher}. Try a different cipher type.` };
    }

    // Track decode progress for mission 3
    if (this.mission.id === 'mission3') {
      if (file === 'message1.txt' && cipher.toLowerCase() === 'base64') {
        this.updateProgress('decoded1', true);
      } else if (file === 'message2.txt' && cipher.toLowerCase() === 'caesar') {
        this.updateProgress('decoded2', true);
      } else if (file === 'message3.txt' && cipher.toLowerCase() === 'hex') {
        this.updateProgress('decoded3', true);
      }
    }

    // Track decode progress for mission 5
    if (this.mission.id === 'mission5' && file === 'attack_log_encrypted.txt') {
      this.updateProgress('decodedAttackLog', true);
    }

    return {
      type: 'success',
      output: `[DECODED — ${cipher.toUpperCase()}]\n\n${result}`
    };
  }

  _crack(args) {
    if (args.length < 2) {
      return { type: 'error', output: 'Usage: crack <md5_hash> <dictionary_file>' };
    }

    const [hash, dictFile] = args;
    const crackDB = this.mission.crackDatabase;

    if (!crackDB) {
      return { type: 'error', output: 'crack: No hash database available for this mission.' };
    }

    // Check if the dictionary file exists
    const dictCheck = this.fs.readFile(dictFile);
    if (!dictCheck.success) {
      return { type: 'error', output: `crack: ${dictFile}: Dictionary file not found.` };
    }

    // Simulate cracking animation in output
    const cleanHash = hash.trim();
    const result = crackDB[cleanHash];

    if (!result) {
      return {
        type: 'error',
        output: `crack: Hash '${cleanHash.slice(0, 16)}...' not found in dictionary.\nTry a different hash or dictionary.`
      };
    }

    // Track crack progress
    if (this.mission.id === 'mission2') {
      this.updateProgress('crackedPassword', true);
    }
    if (this.mission.id === 'mission5') {
      this.updateProgress('crackedAdminHash', true);
    }

    return {
      type: 'success',
      output: `[CRACKING...]\n\n` +
        `  Testing passwords from ${dictFile}...\n` +
        `  ████████████████████ 100%\n\n` +
        `  ✅ HASH CRACKED!\n` +
        `  Hash:     ${cleanHash}\n` +
        `  Password: ${result}\n\n` +
        `  The password is: "${result}"`
    };
  }

  _analyze(args) {
    if (args.length === 0) {
      return { type: 'error', output: 'Usage: analyze <filename>' };
    }

    const file = args[0];
    const fileContent = this.fs.readFile(file);
    if (!fileContent.success) {
      return { type: 'error', output: `analyze: ${file}: File not found.` };
    }

    // Mission 4 specific: analyze access log
    if (this.mission.id === 'mission4' && file === 'access_log.txt') {
      this.updateProgress('foundAnomaly', true);
      return {
        type: 'success',
        output: `[ANALYZING: ${file}]\n\n` +
          `  Scanning 26 log entries...\n` +
          `  ████████████████████ 100%\n\n` +
          `  ⚠️ ANOMALY DETECTED!\n\n` +
          `  ┌──────────────────────────────────────────────────┐\n` +
          `  │ SUSPICIOUS ENTRY:                                │\n` +
          `  │ Timestamp: 2024-04-15 03:15:12                  │\n` +
          `  │ User:      unknown_sys (NOT AUTHORIZED)         │\n` +
          `  │ Action:    BACKDOOR:installed                   │\n` +
          `  │ Source:    192.168.1.1 (EXTERNAL NETWORK)       │\n` +
          `  └──────────────────────────────────────────────────┘\n\n` +
          `  Summary: Unauthorized backdoor installation detected\n` +
          `  at 03:15 AM from external IP. User 'unknown_sys'\n` +
          `  is not in the authorized users list.`
      };
    }

    // Generic analyze for other files
    const lines = fileContent.output.split('\n').length;
    return {
      type: 'output',
      output: `[ANALYZING: ${file}]\n\n  Lines: ${lines}\n  Status: No anomalies detected in this file.\n  Try analyzing a different file.`
    };
  }

  _exploit(args) {
    if (args.length < 2) {
      return { type: 'error', output: 'Usage: exploit <protocol_file> <password>' };
    }

    const [file, password] = args;
    const config = this.mission.exploitConfig;

    if (!config) {
      return { type: 'error', output: 'exploit: No exploit protocol available in this mission.' };
    }

    // Check if the protocol file exists
    const fileCheck = this.fs.readFile(file);
    if (!fileCheck.success) {
      return { type: 'error', output: `exploit: ${file}: Protocol file not found.` };
    }

    if (password !== config.password) {
      return {
        type: 'error',
        output: `exploit: ❌ ACCESS DENIED — Incorrect password.\n⚠️ The attacker has been alerted. Try again quickly!`
      };
    }

    // Success!
    this.updateProgress('executedExploit', true);

    return {
      type: 'success',
      output: `[EXECUTING DEFENSE PROTOCOL...]\n\n` +
        `  Authenticating... ✅\n` +
        `  Terminating unauthorized sessions... ✅\n` +
        `  Rotating encryption keys... ✅\n` +
        `  Activating firewall countermeasures... ✅\n` +
        `  Locking out attacker (192.168.1.1)... ✅\n\n` +
        `  ████████████████████ COMPLETE\n\n` +
        `  🎖️ DEFENSE PROTOCOL EXECUTED SUCCESSFULLY!\n` +
        `  The attacker has been permanently locked out.\n` +
        `  The Agency is secure.`
    };
  }

  _checkTriggers(cmd, args) {
    if (!this.mission.triggers) return;

    for (const trigger of this.mission.triggers) {
      if (trigger.command !== cmd) continue;

      // Check args match if specified
      if (trigger.args) {
        const match = trigger.args.every((a, i) => args[i] && args[i].toLowerCase() === a.toLowerCase());
        if (!match) continue;
      }

      // Check condition if specified
      if (trigger.check) {
        const state = {
          currentPath: this.fs.getCurrentPath(),
          ...this.gameState
        };
        if (!trigger.check(state)) continue;
      }

      // Update progress
      if (trigger.progressUpdate) {
        for (const [key, value] of Object.entries(trigger.progressUpdate)) {
          this.updateProgress(key, value);
        }
      }

      // Show narrative
      if (trigger.narrative && this.addNarrative) {
        this.addNarrative(trigger.narrative);
      }
    }
  }
}
