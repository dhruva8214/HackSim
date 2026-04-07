export const mission4 = {
  id: 'mission4',
  name: 'Find the Anomaly',
  level: 4,
  estimatedTime: 10,
  unlockedCommands: ['ls', 'cd', 'cat', 'grep', 'decode', 'crack', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],

  briefing: `[CRITICAL ALERT — HANDLER ALPHA]

Agent, we have a situation. Our intrusion detection system flagged unusual activity in the access logs, but the automated filters couldn't isolate the threat.

Someone is trying to infiltrate the Agency's systems. The logs contain hundreds of normal entries, but one doesn't belong.

Your mission: Find the anomalous log entry. Look for:
  - Unusual timestamps (outside business hours)
  - Unknown usernames (not in expected_users.txt)
  - Suspicious access types

Use 'grep' to filter logs and 'analyze' to investigate specific entries.

Find the breach. Now.

— Handler Alpha`,

  objective: 'Analyze access logs and identify the unauthorized entry',

  story: {
    intro: "A breach is happening. Find the suspicious log entry before the attacker covers their tracks.",
    completion: "You found it! User 'unknown_sys' at 03:15 — they installed a backdoor. The attacker's IP traces to an external network. This is bigger than we thought..."
  },

  filesystem: {
    'logs': {
      'access_log.txt': `═══════════════════════════════════════════════════════════════
  AGENCY ACCESS LOG — CLASSIFIED
═══════════════════════════════════════════════════════════════
2024-04-15 09:00:12 USER:admin_user    ACCESS:granted  SOURCE:10.0.0.5   ACTION:login
2024-04-15 09:05:33 USER:agent_smith   ACCESS:granted  SOURCE:10.0.0.12  ACTION:login
2024-04-15 09:12:45 USER:handler_alpha ACCESS:granted  SOURCE:10.0.0.1   ACTION:login
2024-04-15 09:23:45 USER:admin_user    ACCESS:granted  SOURCE:10.0.0.5   ACTION:file_read
2024-04-15 09:45:00 USER:agent_smith   ACCESS:granted  SOURCE:10.0.0.12  ACTION:file_read
2024-04-15 10:00:00 USER:handler_alpha ACCESS:granted  SOURCE:10.0.0.1   ACTION:system_check
2024-04-15 10:15:23 USER:analyst_jones ACCESS:granted  SOURCE:10.0.0.8   ACTION:login
2024-04-15 10:30:00 USER:admin_user    ACCESS:granted  SOURCE:10.0.0.5   ACTION:file_write
2024-04-15 11:00:45 USER:agent_smith   ACCESS:granted  SOURCE:10.0.0.12  ACTION:report_gen
2024-04-15 11:15:00 USER:handler_alpha ACCESS:granted  SOURCE:10.0.0.1   ACTION:msg_send
2024-04-15 11:30:22 USER:analyst_jones ACCESS:granted  SOURCE:10.0.0.8   ACTION:data_query
2024-04-15 12:00:00 USER:admin_user    ACCESS:granted  SOURCE:10.0.0.5   ACTION:backup
2024-04-15 12:30:00 USER:agent_smith   ACCESS:granted  SOURCE:10.0.0.12  ACTION:logout
2024-04-15 13:00:15 USER:handler_alpha ACCESS:granted  SOURCE:10.0.0.1   ACTION:file_read
2024-04-15 13:30:00 USER:analyst_jones ACCESS:granted  SOURCE:10.0.0.8   ACTION:analysis
2024-04-15 14:00:00 USER:admin_user    ACCESS:granted  SOURCE:10.0.0.5   ACTION:config_update
2024-04-15 14:30:12 USER:agent_smith   ACCESS:granted  SOURCE:10.0.0.12  ACTION:login
2024-04-15 15:00:00 USER:handler_alpha ACCESS:granted  SOURCE:10.0.0.1   ACTION:system_check
2024-04-15 15:30:00 USER:analyst_jones ACCESS:granted  SOURCE:10.0.0.8   ACTION:logout
2024-04-15 16:00:00 USER:admin_user    ACCESS:granted  SOURCE:10.0.0.5   ACTION:report_gen
2024-04-15 03:15:12 USER:unknown_sys   BACKDOOR:installed SOURCE:192.168.1.1 ACTION:exploit
2024-04-15 16:30:00 USER:handler_alpha ACCESS:granted  SOURCE:10.0.0.1   ACTION:file_read
2024-04-15 17:00:00 USER:admin_user    ACCESS:granted  SOURCE:10.0.0.5   ACTION:logout
2024-04-15 17:15:00 USER:analyst_jones ACCESS:granted  SOURCE:10.0.0.8   ACTION:login
2024-04-15 17:30:00 USER:agent_smith   ACCESS:granted  SOURCE:10.0.0.12  ACTION:file_read
2024-04-15 17:45:00 USER:handler_alpha ACCESS:granted  SOURCE:10.0.0.1   ACTION:logout
═══════════════════════════════════════════════════════════════`,

      'expected_users.txt': `AUTHORIZED USERS LIST
═══════════════════════
- admin_user     (Administrator)
- agent_smith    (Field Agent)
- handler_alpha  (Handler)
- analyst_jones  (Intelligence Analyst)

NOTE: Any username NOT on this list 
is considered UNAUTHORIZED.

Report unauthorized access immediately.`,

      'investigation.txt': `INVESTIGATION TEMPLATE
══════════════════════

Fill in your findings:

Suspicious Entry Timestamp: ___________
Suspicious Username:        ___________
Suspicious Source IP:        ___________
Suspicious Action:           ___________

Use 'grep' to search the access log
for anomalies.

Tip: Check timestamps, usernames, 
and access types that don't match
the normal pattern.`,

      'network_map.txt': `AGENCY NETWORK MAP
══════════════════

Internal Network: 10.0.0.x
  10.0.0.1  — Handler Station
  10.0.0.5  — Admin Terminal
  10.0.0.8  — Analyst Workstation
  10.0.0.12 — Field Agent Terminal

External/Unknown: 192.168.x.x
  ⚠️ Any access from 192.168.x.x
  is UNAUTHORIZED and must be
  reported immediately.`
    }
  },

  initialPath: '/logs',

  hints: [
    "Most log entries have timestamps between 09:00 and 18:00. Try 'grep 03: access_log.txt' to find entries outside business hours.",
    "Check the expected_users.txt file. Then use 'grep unknown access_log.txt' to find unauthorized users.",
    "The anomaly is: '2024-04-15 03:15:12 USER:unknown_sys BACKDOOR:installed'. Use 'analyze access_log.txt' to confirm."
  ],

  progressKeys: ['foundAnomaly'],

  successCondition: (progress) => {
    return progress.foundAnomaly === true;
  },

  triggers: []  // Handled by analyze command
};
