// Chapter 3: Cryptography & Ciphers (Missions 26-35)
const mk = (id,name,level,time,cmds,briefing,obj,intro,comp,fs,path,hints,pK,sC,trig,extra={}) => ({
  id,name,level,estimatedTime:time,unlockedCommands:cmds,
  briefing:`[SECURE MESSAGE FROM HANDLER]\n\n${briefing}\n\n— Handler ${level%2===0?'Alpha':'Bravo'}`,
  objective:obj,story:{intro,completion:comp},filesystem:fs,initialPath:path,hints,progressKeys:pK,
  successCondition:sC,triggers:trig,...extra
});

export const mission26 = mk('mission26','Caesar\'s Secret',26,7,
  ['ls','cd','cat','decode','help','clear','pwd','hint','status'],
  "Intercepted a coded message using Caesar cipher. Decode it to find the target.",
  'Decode the Caesar cipher message','Caesar cipher intercept.',
  "Decoded: syndicate plans to rob Federal Reserve vault April 20.",
  {'cipher_room':{'intercept.txt':'Wkh ihghudo uhvhuyh jrog ydxow\nDsulo wzhqwlhwk dw plgqljkw','notes.txt':'Cipher: Caesar (shift 3)\nUse: decode intercept.txt caesar'}},
  '/cipher_room',["Read notes for cipher type.","decode intercept.txt caesar","The shift is 3."],
  ['decodedMessage'],(p)=>p.decodedMessage===true,
  [{command:'decode',args:['intercept.txt','caesar'],progressUpdate:{decodedMessage:true},narrative:'🔓 Decoded! Target: Federal Reserve gold vault, April 20 at midnight.'}],
  {decodeDatabase:{'intercept.txt':{caesar:'The federal reserve gold vault\nApril twentieth at midnight'}}}
);

export const mission27 = mk('mission27','Base64 Bonanza',27,7,
  ['ls','cd','cat','decode','help','clear','pwd','hint','status'],
  "Three encoded spy drops found. All base64. Decode them for complete instructions.",
  'Decode all 3 base64 messages','Three encoded drops to decode.',
  "Full instructions: Meet Checkpoint Charlie, Berlin, red umbrella, 1400 hours.",
  {'drops':{'drop_1.txt':'TWVldCBhdCBDaGVja3BvaW50IENoYXJsaWU=','drop_2.txt':'QnJpbmcgcmVkIHVtYnJlbGxh','drop_3.txt':'VGltZTogMTQwMCBob3Vycw==','readme.txt':'3 dead drops. All base64 encoded.'}},
  '/drops',["decode drop_1.txt base64","Decode all three.","Each reveals part of the instructions."],
  ['d1','d2','d3'],(p)=>p.d1&&p.d2&&p.d3,
  [{command:'decode',args:['drop_1.txt','base64'],progressUpdate:{d1:true},narrative:'📍 Drop 1: Meet at Checkpoint Charlie'},
   {command:'decode',args:['drop_2.txt','base64'],progressUpdate:{d2:true},narrative:'☂️ Drop 2: Bring red umbrella'},
   {command:'decode',args:['drop_3.txt','base64'],progressUpdate:{d3:true},narrative:'🕐 Drop 3: Time 1400 hours'}],
  {decodeDatabase:{'drop_1.txt':{base64:'Meet at Checkpoint Charlie'},'drop_2.txt':{base64:'Bring red umbrella'},'drop_3.txt':{base64:'Time: 1400 hours'}}}
);

export const mission28 = mk('mission28','Hex Dump',28,7,
  ['ls','cd','cat','decode','help','clear','pwd','hint','status'],
  "Criminal's hex-encoded file found. Decode for evidence of drug trafficking.",
  'Decode the hex dump','Hex dump from criminal drive.',
  "Decoded: drug ledger with $25K in transactions.",
  {'hex':{'dump.txt':'44727567204c65646765723a0a4a616e3a2024353030300a4665623a2024383030300a4d61723a20243132303030','notes.txt':'Source: seized laptop\nEncoding: hex\nUse: decode dump.txt hex'}},
  '/hex',["Read notes for encoding type.","decode dump.txt hex","Evidence of drug sales."],
  ['decoded'],(p)=>p.decoded===true,
  [{command:'decode',args:['dump.txt','hex'],progressUpdate:{decoded:true},narrative:'💊 Drug ledger: Jan $5K, Feb $8K, Mar $12K. Solid evidence.'}],
  {decodeDatabase:{'dump.txt':{hex:'Drug Ledger:\nJan: $5000\nFeb: $8000\nMar: $12000'}}}
);

export const mission29 = mk('mission29','Hash Cracker',29,8,
  ['ls','cd','cat','crack','help','clear','pwd','hint','status'],
  "MD5 password hash from fraud database. Crack it with the dictionary to access evidence.",
  'Crack the MD5 hash','Hash protecting fraud database.',
  "Cracked: 'dragon2024'. Access to 10K fraudulent transactions.",
  {'lab':{'hash.txt':'MD5: 8621ffdbc5698829397d97767ac13db3\nSource: Fraud DB admin','dict.txt':'admin\npassword\n123456\ndragon2024\nqwerty\nletmein','preview.txt':'FRAUD DB (LOCKED)\nRecords: 10,247\nValue: $45.2M'}},
  '/lab',["Read hash.txt for the target hash.","crack 8621ffdbc5698829397d97767ac13db3 dict.txt","The dictionary contains common passwords."],
  ['cracked'],(p)=>p.cracked===true,
  [{command:'crack',args:['8621ffdbc5698829397d97767ac13db3','dict.txt'],progressUpdate:{cracked:true},narrative:'🔓 Cracked: "dragon2024". Access to $45.2M fraud database!'}],
  {crackDatabase:{'8621ffdbc5698829397d97767ac13db3':'dragon2024'}}
);

export const mission30 = mk('mission30','The Enigma File',30,8,
  ['ls','cd','cat','decode','help','clear','pwd','hint','status'],
  "Multi-layered encrypted file found. Three layers: base64, hex, caesar. Decode each.",
  'Decode all 3 encryption layers','Multi-layer encryption to peel back.',
  "All layers decoded: Agent meeting in Paris at Eiffel Tower, 2200 hours.",
  {'enigma':{'layer1.txt':'VGhlIG1lZXRpbmcgaXMgaW4gUGFyaXM=','notes.txt':'Layer 1: base64\nLayer 2: hex\nLayer 3: caesar\nDecode each layer.','layer2.txt':'45696666656c20546f776572206261736520617420323230302068','layer3.txt':'Frqilup dqg surfhhg'}},
  '/enigma',["Start with layer1.txt base64.","Then layer2.txt hex.","Finally layer3.txt caesar."],
  ['l1','l2','l3'],(p)=>p.l1&&p.l2&&p.l3,
  [{command:'decode',args:['layer1.txt','base64'],progressUpdate:{l1:true},narrative:'Layer 1: Meeting is in Paris!'},
   {command:'decode',args:['layer2.txt','hex'],progressUpdate:{l2:true},narrative:'Layer 2: Eiffel Tower base at 2200h!'},
   {command:'decode',args:['layer3.txt','caesar'],progressUpdate:{l3:true},narrative:'🔓 Layer 3: Confirm and proceed! All layers decoded!'}],
  {decodeDatabase:{'layer1.txt':{base64:'The meeting is in Paris'},'layer2.txt':{hex:'Eiffel Tower base at 2200 h'},'layer3.txt':{caesar:'Confirm and proceed'}}}
);

export const mission31 = mk('mission31','Cipher Challenge',31,8,
  ['ls','cd','cat','decode','help','clear','pwd','hint','status'],
  "Hacker group taunts police with cipher puzzles. Solve 3 before they strike the power grid.",
  'Solve all 3 cipher puzzles','Cipher puzzles from hackers.',
  "Solved: Power grid attack planned at midnight.",
  {'ch':{'p1.txt':'V2Ugd2lsbCBzdHJpa2UgdGhlIHBvd2VyIGdyaWQ=','p2.txt':'4174206d69646e69676874','p3.txt':'Fdq brx vwrs xv?','rules.txt':'Puzzle 1: base64\nPuzzle 2: hex\nPuzzle 3: caesar'}},
  '/ch',["Read rules for cipher types.","decode p1.txt base64","Solve all three."],
  ['s1','s2','s3'],(p)=>p.s1&&p.s2&&p.s3,
  [{command:'decode',args:['p1.txt','base64'],progressUpdate:{s1:true},narrative:'🧩 Puzzle 1: We will strike the power grid!'},
   {command:'decode',args:['p2.txt','hex'],progressUpdate:{s2:true},narrative:'🧩 Puzzle 2: At midnight!'},
   {command:'decode',args:['p3.txt','caesar'],progressUpdate:{s3:true},narrative:'🧩 All solved! Power grid attack at midnight!'}],
  {decodeDatabase:{'p1.txt':{base64:'We will strike the power grid'},'p2.txt':{hex:'At midnight'},'p3.txt':{caesar:'Can you stop us?'}}}
);

export const mission32 = mk('mission32','Key Exchange',32,9,
  ['ls','cd','cat','grep','help','clear','pwd','hint','status'],
  "Intercepted a Diffie-Hellman key exchange using dangerously small prime p=23. Exploit the weakness.",
  'Exploit the weak key exchange to find the shared secret','Weak DH key exchange intercepted.',
  "Shared secret: OMEGA-7-BLACKOUT = coordinated power grid attack.",
  {'crypto':{'exchange.txt':'DH Exchange:\ng=5, p=23, A=8\nBob sends B=19\n⚠️ p=23 is tiny!','vuln.txt':'ANALYSIS:\np=23 → brute force trivial\na=6 (5^6 mod 23 = 8)\nShared: 19^6 mod 23 = 2\nKey 2 → OMEGA-7-BLACKOUT','codebook.txt':'1→ALPHA-1-SUNRISE\n2→OMEGA-7-BLACKOUT (power grid attack)\n3→DELTA-3-MONSOON'}},
  '/crypto',["The prime p=23 is too small for DH.","Read vuln.txt for the exploit.","Codebook maps number to operation."],
  ['foundVuln','gotSecret'],(p)=>p.foundVuln&&p.gotSecret,
  [{command:'cat',args:['vuln.txt'],progressUpdate:{foundVuln:true},narrative:'🔢 DH cracked! Shared secret = 2.'},
   {command:'cat',args:['codebook.txt'],progressUpdate:{gotSecret:true},narrative:'📖 Key 2 = OMEGA-7-BLACKOUT: power grid attack!'}]
);

export const mission33 = mk('mission33','XOR Breaker',33,8,
  ['ls','cd','cat','grep','help','clear','pwd','hint','status'],
  "Company claimed military-grade encryption but used single-byte XOR. Break it to expose 50K plaintext passwords.",
  'Break the XOR encryption and expose the breach','Weak XOR encryption to break.',
  "XOR key 0x42 found. 50,000 plaintext passwords exposed.",
  {'xor':{'report.txt':'XOR ANALYSIS:\nKey: 0x42 (single byte)\nDecrypted: 50K user passwords in PLAINTEXT\nFails: PCI-DSS, GDPR, SOC2','evidence.txt':'Company liable under GDPR (€20M fine)\n50,000 passwords exposed\nClass action lawsuit inevitable'}},
  '/xor',["Read report for XOR key.","The key is trivially simple.","Evidence file has full impact."],
  ['foundKey','confirmed'],(p)=>p.foundKey&&p.confirmed,
  [{command:'cat',args:['report.txt'],progressUpdate:{foundKey:true},narrative:'🔑 XOR key: 0x42. "Military-grade" = single-byte XOR!'},
   {command:'cat',args:['evidence.txt'],progressUpdate:{confirmed:true},narrative:'⚖️ 50K plaintext passwords. GDPR violation confirmed.'}]
);

export const mission34 = mk('mission34','Null Cipher',34,8,
  ['ls','cd','cat','grep','help','clear','pwd','hint','status'],
  "Social media posts contain hidden null cipher messages. First letter of each sentence spells a threat.",
  'Find the hidden message in social media posts','Hidden messages in plain sight.',
  "First letters spell: BOMB AT NOON TOWER",
  {'posts':{'post1.txt':'Beautiful sunset today!\nOver the horizon amazing.\nMy camera failed.\nBirds flying overhead.','post2.txt':'A perfect morning.\nTrees blooming.\nNothing like spring.\nOrchids stunning.\nOld buildings nice.\nNobody appreciates them.','post3.txt':'Trying new restaurant.\nOriginal Italian recipes.\nWonderful pasta.\nEveryone should visit.\nReally enjoyed it.','key.txt':'First letter each sentence:\nPost 1: B-O-M-B\nPost 2: A-T-N-O-O-N\nPost 3: T-O-W-E-R\n\n⚠️ BOMB AT NOON TOWER'}},
  '/posts',["Read each post carefully.","First letter of each sentence...","Check key.txt for the analysis."],
  ['readPosts','foundMsg'],(p)=>p.readPosts&&p.foundMsg,
  [{command:'cat',args:['post1.txt'],progressUpdate:{readPosts:true}},
   {command:'cat',args:['key.txt'],progressUpdate:{foundMsg:true},narrative:'🚨 BOMB AT NOON TOWER! Immediate alert issued!'}]
);

export const mission35 = mk('mission35','Crypto Wallet',35,9,
  ['ls','cd','cat','crack','grep','help','clear','pwd','hint','status'],
  "Ransomware Bitcoin wallet seized. Crack the passphrase hash to trace $12M in payments.",
  'Crack wallet and trace payments','Seized crypto wallet.',
  "Cracked: 'darknet_king_2024'. $12M traced across 47 transactions.",
  {'wallet':{'info.txt':'Wallet: 187.5 BTC (~$12.2M)\nHash: e10adc3949ba59abbe56e057f20f883e','dict.txt':'darknet_2024\nking_of_dark\ndarknet_king_2024\nshadow_master','txns.txt':'47 incoming ransom payments\nOutgoing to 3 exchanges:\n→ 50 BTC Binance\n→ 80 BTC KuCoin\n→ 57.5 BTC LocalBitcoins\nAll flagged for seizure.'}},
  '/wallet',["Read info.txt for the hash.","crack e10adc3949ba59abbe56e057f20f883e dict.txt","Then read txns.txt"],
  ['cracked','traced'],(p)=>p.cracked&&p.traced,
  [{command:'crack',args:['e10adc3949ba59abbe56e057f20f883e','dict.txt'],progressUpdate:{cracked:true},narrative:'🔓 Cracked: darknet_king_2024. 187.5 BTC accessible!'},
   {command:'cat',args:['txns.txt'],progressUpdate:{traced:true},narrative:'💰 $12M traced to 3 exchanges. All flagged for seizure.'}],
  {crackDatabase:{'e10adc3949ba59abbe56e057f20f883e':'darknet_king_2024'}}
);

export const chapter3Missions = [mission26,mission27,mission28,mission29,mission30,mission31,mission32,mission33,mission34,mission35];
