// DinoMon: Fossil Frontier — Story Data  v19
// Global namespace: window.DG
'use strict';

window.DG = window.DG || {};

DG.STORY = {
  DIALOGUES: {},
  FLAGS: {},
  EVENTS: {},
};

// ============================================================
// DIALOGUES
// ============================================================

DG.STORY.DIALOGUES = {

  // ----------------------------------------------------------
  // INTRO DIALOGUES
  // ----------------------------------------------------------

  PROF_INTRO_1: [
    "Ah, welcome! I am Dokter Timo, a researcher who studies prehistoric creatures called DinoMons.",
    "DinoMons are extraordinary beings awakened from fossils by a mysterious energy known as Primordial Aura.",
    "This aura pulses deep within the earth — ancient, powerful, and not fully understood.",
    "Humans and DinoMons have lived in harmony for generations, bonded by trust and adventure.",
    "Your very own journey as a DinoMon Trainer begins today!",
  ],

  PROF_INTRO_2: [
    "But I must warn you — times have grown uneasy.",
    "A shadowy organization called Team Extinction has been sighted near Ambertown.",
    "They seek to harness the Primordial Aura for their own dangerous ends.",
    "We don't yet know the full extent of their plans, but we cannot afford to ignore them.",
    "Stay vigilant as you travel, and trust in your DinoMons.",
  ],

  PROF_INTRO_3: [
    "Now then — every great journey starts with a partner.",
    "Here in my lab I have three DinoMons ready to begin their own adventure.",
    "Each comes from a different lineage and carries a unique kind of Primordial Aura.",
    "One important thing: Tindrel, Leafawn and Aqueel are VERY rare.",
    "These three cannot be found anywhere in the wild — not on any route, not in any cave.",
    "The one you choose here today will be the ONLY way to obtain it.",
    "Choose carefully. Whichever you pick, they will be your most loyal companion.",
    "So — which DinoMon calls out to you?",
  ],

  STARTER_TINDREL: [
    "A fiery ceratopsian! Tindrel's frill burns bright with excitement to meet you!",
  ],

  STARTER_LEAFAWN: [
    "A leafy stegosaur! Leafawn's plates rustle like a forest in the wind.",
  ],

  STARTER_AQUEEL: [
    "A swift plesiosaur! Aqueel splashes you happily, soaking your shoes.",
  ],

  STARTER_CONFIRM: [
    "You chose [STARTER]! Take good care of them!",
    "A DinoMon's strength comes from the bond they share with their Trainer.",
    "Treat them well, and they will never let you down. Good luck out there!",
  ],

  MOM_GOODBYE: [
    "Off already? My little Trainer, all grown up...",
    "Make sure to eat properly and rest when you need to!",
    "And call me if things get tough — a mother always worries, you know.",
    "Now go on. The world won't explore itself. I love you!",
  ],

  RIVAL_INTRO: [
    "Hey! So the professor gave YOU a DinoMon too?",
    "I'm Normal Normi. And I'm not about to let some rookie outshine me.",
    "I've been waiting for a real challenge — and you'll have to do for now.",
    "Show me what you and that DinoMon are made of!",
  ],

  // ----------------------------------------------------------
  // FLINT — RIVAL DIALOGUES
  // ----------------------------------------------------------

  FLINT_INTRO: [
    "DOKTER TIMO: 'Ah, before you go — let me introduce someone.'",
    "DOKTER TIMO: 'This is Flint. His grandfather and I worked together for decades.'",
    "FLINT: 'So you're the one the Professor's been going on about. Hm.'",
    "FLINT: 'Don't get used to having a DinoMon. Let's settle this now.'",
  ],

  // FASE 7: de professor vraagt de naam van de rival — het Oak-moment.
  // Na RIVAL_NAME_ASK opent het naam-invoerscherm; RIVAL_NAME_CONFIRM toont
  // daarna de gekozen naam (de 'Flint' hieronder wordt automatisch vervangen).
  RIVAL_NAME_ASK: [
    "DOKTER TIMO: 'Ah — before you two square off, let me introduce my old colleague's grandson.'",
    "DOKTER TIMO: 'This is... er... goodness, my memory these days.'",
    "DOKTER TIMO: 'What was his name again?'",
  ],
  RIVAL_NAME_CONFIRM: [
    "DOKTER TIMO: 'Flint! Of course. How could I forget.'",
  ],

  RIVAL_PRE_1: ["FLINT: 'Don't get used to that starter. This'll be over before you know it.'"],
  RIVAL_POST_1_WIN: ["FLINT: '...Beginner's luck. Enjoy it while it lasts.'"],
  RIVAL_POST_1_LOSE: ["FLINT: 'See? That's the difference between us. Remember that.'"],

  RIVAL_PRE_2: ["FLINT: 'Two badges. Fine. Let me show you what real training looks like.'"],
  RIVAL_POST_2_WIN: ["FLINT: '...You've gotten stronger. I'll admit that much. Don't let it go to your head.'"],
  RIVAL_POST_2_LOSE: ["FLINT: 'Keep pushing. I need you to actually be worth beating someday.'"],

  RIVAL_PRE_3: ["FLINT: 'Team Extinction, gym leaders, now you... I'm not losing to any of you.'"],
  RIVAL_POST_3_WIN: ["FLINT: 'Fine. You win. But I\'m not done — not by a long shot.'"],
  RIVAL_POST_3_LOSE: ["FLINT: 'Good. Stay strong. We\'ve both got bigger problems than each other right now.'"],

  RIVAL_PRE_4: ["FLINT: 'They took one of my DinoMons. MINE.'", "FLINT: 'Don\'t you dare lose to Clade before I get the chance to beat you properly.'"],
  RIVAL_POST_4_WIN: ["FLINT: '...Go. Stop them. I\'ll catch up.'"],
  RIVAL_POST_4_LOSE: ["FLINT: 'Good. You\'re going to need every bit of that.'"],

  RIVAL_PRE_5: ["FLINT: 'I couldn\'t stop them. I tried — I really did.'", "FLINT: 'But you still have a chance. First — prove to me you actually can.'"],
  RIVAL_POST_5_WIN: ["FLINT: '...Go finish this. I\'ll be right behind you.'", "FLINT: 'And hey — don\'t you dare lose to him.'"],
  RIVAL_POST_5_LOSE: ["FLINT: 'Get up. Get stronger. And go end this.'"],

  // ----------------------------------------------------------
  // TOWN NPCs
  // ----------------------------------------------------------

  // Ambertown
  NPC_AMBERTOWN_1: [
    "Welcome to Ambertown — the town frozen in amber, where history lives!",
    "Legend says a DinoMon as old as time itself sleeps beneath these streets.",
  ],
  NPC_AMBERTOWN_2: [
    "Dokter Timo's research has brought a lot of attention to our little town.",
    "Some of it... not the kind we wanted.",
  ],
  NPC_AMBERTOWN_3: [
    "My DinoMon loves rolling in the old fossil beds west of town.",
    "The Primordial Aura there is extra thick — you can almost taste it in the air!",
  ],

  // Shellcreek
  NPC_SHELLCREEK_1: [
    "Shellcreek's waters run clear all the way to the ocean.",
    "Normal Normi's gym is right in the town square — a tough Normal-type specialist.",
  ],
  NPC_SHELLCREEK_2: [
    "Fishermen here say they've spotted something massive in the deep waters.",
    "Could be a rare water-type DinoMon... or something worse.",
  ],
  NPC_SHELLCREEK_3: [
    "The Pearl Market runs every weekend — best place to find water-type items.",
    "Just watch your pockets. The Clamcrabs like shiny things.",
  ],

  // Dustwall
  NPC_DUSTWALL_1: [
    "These canyon walls have been carved by wind and time for millions of years.",
    "Jam Sennings says the rock strata here tell the whole history of DinoMons.",
  ],
  NPC_DUSTWALL_2: [
    "My grandfather found a Boneback fossil right at the base of the main cliff!",
    "It's in the town museum now. Go have a look if you get the chance.",
  ],
  NPC_DUSTWALL_3: [
    "Team Extinction was spotted poking around the old quarry last week.",
    "The sheriff's keeping an eye on things, but people are nervous.",
  ],

  // Pyreside
  NPC_PYRESIDE_1: [
    "The volcano hasn't erupted in a hundred years, but you can still feel the heat.",
    "Asset Toverdijk says it keeps his DinoMons strong — I believe it!",
  ],
  NPC_PYRESIDE_2: [
    "Don't touch the obsidian formations on Route 5 — they're sharper than they look.",
    "And if you see a Scorchback sunbathing on a rock, give it space. Seriously.",
  ],

  // Ferngrove
  NPC_FERNGROVE_1: [
    "The canopy here is so thick it blocks out the sun at midday.",
    "PuKing Maarten's gym is built right into a living tree — it's absolutely beautiful.",
  ],
  NPC_FERNGROVE_2: [
    "We found strange markings carved into the ancient trees deep in the grove.",
    "The elders say Team Extinction left them. A warning of some kind.",
  ],

  // Stonehaven
  NPC_STONEHAVEN_1: [
    "Stonehaven sits at the crossroads of three mountain passes.",
    "Rock Hard Toonen's gym is carved right into the bedrock — a Ground-type specialist through and through.",
  ],
  NPC_STONEHAVEN_2: [
    "Team Extinction hit the DinoMon museum here last month.",
    "They took fossils — not for research. For something darker.",
  ],
  NPC_STONEHAVEN_3: [
    "The Ground-type DinoMons that nest in these peaks are ancient beyond measure.",
    "Rock Hard Toonen says they remember the tremors from before humans walked the earth.",
  ],

  // Crestfall
  NPC_CRESTFALL_1: [
    "The lightning storms here are unlike anything else in the Frontier.",
    "Beyblade Luuk says it charges his Electric-type DinoMons to peak power. I believe it.",
  ],
  NPC_CRESTFALL_2: [
    "There's a network of underground tunnels beneath Crestfall.",
    "Team Extinction has been trying to access them. Beyblade Luuk and his DinoMons are holding them off.",
  ],

  // Bogmire
  NPC_BOGMIRE_1: [
    "The fog here never truly lifts. Even on a clear day, Bogmire sits in its own mist.",
    "Surfing Peter says it helps his DinoMons focus. I just find it creepy.",
  ],
  NPC_BOGMIRE_2: [
    "Don't stray from the lantern-lit paths at night.",
    "The Phantosaurs that wander the bog have a way of making you lose your sense of direction.",
  ],

  // Apexsummit
  NPC_APEXSUMMIT_1: [
    "You made it to Apexsummit. Not many Trainers reach this far.",
    "Bipolar Fieke has seen thousands of challengers. Hundreds never made it past his first DinoMon.",
  ],
  NPC_APEXSUMMIT_2: [
    "The air is thin up here, but the view of the whole Fossil Frontier is worth it.",
    "Once you beat Bipolar Fieke, they say the world feels different — like you've truly earned your place in it.",
  ],

  // ----------------------------------------------------------
  // GYM LEADER PRE-BATTLE DIALOGUES
  // ----------------------------------------------------------

  GYM_MARINA_PRE: [
    "So you've washed up on my shores, have you?",
    "The tide always wins in the end, young Trainer.",
    "Can you ride the wave — or will you be swept away like all the rest?",
  ],

  GYM_RIDLEY_PRE: [
    "These cliffs have stood for millennia, shaped by forces beyond imagination.",
    "My DinoMons are just as unyielding.",
    "You won't crack them — but you're welcome to try!",
  ],

  GYM_IGNIS_PRE: [
    "Feel that heat? That's not the volcano — that's my DinoMons.",
    "They burn hotter than any lava flow this mountain has ever produced.",
    "Step into my gym and you'd better be ready to melt!",
  ],

  GYM_SYLVA_PRE: [
    "The jungle never yields to anything it doesn't respect.",
    "It has grown for millions of years, patient and unstoppable.",
    "And neither do I. Prove you belong in this forest.",
  ],

  GYM_AFKJORN_PRE: [
    "Oh — sorry, was AFK for a sec! Welcome to Fairydell.",
    "Don't let the sparkles fool you. Fairy-types hit harder than they look,",
    "and they laugh at Dragons. Show me your focus!",
  ],
  GYM_AFKJORN_POST: [
    "GG, that was clean! The Charm Badge is yours.",
    "Head north to Stonehaven next — Rock Hard Toonen is waiting in the bedrock.",
  ],

  GYM_DRAGO_PRE: [
    "Dragons soar above all other creatures — above storms, above mountains, above time.",
    "To challenge me, you must rise to their level.",
    "You'll need to fly if you want to beat me. Let's see if you have wings.",
  ],

  GYM_TERRA_PRE: [
    "Every step you take, the ground beneath your feet answers to me.",
    "My DinoMons were born from the bedrock of this world.",
    "Brace yourself — this is going to shake you to your core.",
  ],

  GYM_MORAX_PRE: [
    "I already know why you've come. I've seen your path — every choice, every stumble.",
    "Your thoughts are an open book, Trainer.",
    "I've already seen how this ends... but let's play it out, shall we?",
  ],

  GYM_VALDEZ_PRE: [
    "...",
    "You've made it this far. That alone is impressive.",
    "I've watched your journey from a distance. You have real potential.",
    "But potential means nothing until it's proven. Now show me everything you've got.",
  ],

  // ----------------------------------------------------------
  // GYM LEADER POST-BATTLE DIALOGUES
  // ----------------------------------------------------------

  // Gym 1 — Rex (Normal) — Shellcreek — Herd Badge
  GYM_REX_PRE: [
    "So you've wandered into my gym, huh? Bold move.",
    "Normal-types might look ordinary to you — but there's nothing ordinary about my herd.",
    "Let's see if you can keep up!",
  ],

  GYM_REX_POST: [
    "Hah! Not bad at all. You've got real potential.",
    "Jam Sennings over at Dustwall is a tough one, so train up before you get there.",
    "And watch out for Team Extinction scouts on the route!",
  ],

  // Gym 2 — Ridley (Rock) — Dustwall — Fossil Badge
  GYM_RIDLEY_POST: [
    "Remarkable. You found the cracks I didn't know I had.",
    "The Fossil Badge is yours — wear it with the pride of stone.",
    "With the Fossil Badge, your DinoMons can use Rock Smash to break boulders!",
    "Team Extinction has been excavating illegally near the old quarry.",
    "Someone needs to stop them before they unearth something they can't control.",
  ],

  // Gym 3 — Ignis (Fire) — Pyreside — Magma Badge
  GYM_IGNIS_POST: [
    "You didn't melt. You burned right back. I respect that.",
    "Here — the Magma Badge. You've lit your own fire today.",
    "With the Magma Badge, your DinoMons can use Flash to light dark caves!",
    "I've heard Team Extinction is after thermal vents in the mountains.",
    "The energy stored in those vents... it could fuel something terrifying.",
  ],

  // Gym 4 — Sylva (Grass) — Ferngrove — Canopy Badge
  GYM_SYLVA_POST: [
    "The jungle has made its judgment — you belong here after all.",
    "Take the Canopy Badge. Wear it like a leaf, light and enduring.",
    "With the Canopy Badge, your DinoMons can use Cut to clear overgrown paths!",
    "Team Extinction has been cutting through the eastern grove.",
    "The trees have long memories. They know something dark is coming.",
  ],

  // Gym 6 — Terra (Ground) — Stonehaven — Bedrock Badge
  GYM_TERRA_POST: [
    "The ground shook... but so did you. And you held firm. Remarkable.",
    "Accept the Bedrock Badge — your foundation is solid.",
    "With the Bedrock Badge, your DinoMons can use Strength to move boulders!",
    "Team Extinction has been tunneling under Crestfall.",
    "They're searching for something in the deep places of the earth. I shudder to think what.",
  ],

  // Gym 7 — Volt (Electric) — Crestfall — Static Badge
  GYM_VOLT_PRE: [
    "You've got nerve, coming to challenge me in this storm.",
    "My Electric-type DinoMons are charged and ready to strike.",
    "Don't blink — or you'll miss the lightning!",
  ],

  GYM_VOLT_POST: [
    "You grounded my team completely. Impressive work.",
    "Take the Static Badge — you've earned every spark of it.",
    "With the Static Badge, your DinoMons can Fly between cities you've visited!",
    "Team Extinction has been disrupting communications near the relay towers.",
    "Whatever they're planning, they don't want anyone calling for help.",
  ],

  // Gym 8 — Marina (Water) — Bogmire — Tide Badge
  GYM_MARINA_POST: [
    "Ha... you really can ride the wave. Well done.",
    "Take the Tide Badge — you've earned it.",
    "With the Tide Badge, your DinoMons can Surf across water! New routes are now open!",
    "The waterways of the Pangaea Archipelago are now open to you!",
    "Team Extinction has been seen near the Route 3 wetlands.",
    "Whatever they're looking for out there, don't let them find it first.",
  ],

  // Gym 9 — Valdez (Dragon) — Apex Summit — Scale Badge
  GYM_VALDEZ_POST: [
    "That was a battle worthy of the Summit.",
    "Take the Scale Badge — as sharp as a dragon's claw.",
    "With the Scale Badge, your DinoMons can Dive into the deep! Seek out hidden underwater caves...",
    "Team Extinction is making their final move at Mt. Cretaceous.",
    "Director Clade seeks to awaken the Permian Core — an energy source from before even the DinoMons.",
    "You are the only Trainer with the badges, the bonds, and the heart to stop them.",
    "Go. The Fossil Frontier is counting on you.",
  ],

  GYM_MORAX_POST: [
    "I... didn't see that coming. Truly. Well done.",
    "Your mind proved stronger than I read.",
    "Team Extinction's commanders have been gathering near Mt. Cretaceous.",
    "Their leader — Director Clade — has been silent for too long. That silence worries me.",
  ],

  // ----------------------------------------------------------
  // TEAM EXTINCTION DIALOGUES
  // ----------------------------------------------------------

  GRUNT_1: [
    "You there! Stop right where you are!",
    "Team Extinction doesn't need nosy little Trainers poking around our operations.",
    "Time to teach you what happens when you interfere!",
  ],

  GRUNT_2: [
    "Heh. Another kid with a DinoMon thinks they can take on Team Extinction.",
    "Let's see how you handle a real fossil warrior!",
  ],

  GRUNT_3: [
    "Director Clade will restore the age of dinosaurs — and nothing you do can stop that!",
    "Stand aside, or get buried with the rest of the old world!",
  ],

  GRUNT_4: [
    "You've been a real thorn in our side, you know that?",
    "The Commander won't be pleased... but first, let's battle!",
  ],

  GRUNT_5: [
    "Extinction isn't the end — it's the beginning of something greater!",
    "That's what Director Clade says. I believe it. Do you?!",
  ],

  CMD_TRIASSIC_1: [
    "So the little Trainer thinks they can challenge Team Extinction?",
    "I am Commander Triassic — the iron fist of the Fossil Frontier!",
    "Team Extinction will ensure the dinosaurs RULE again, as they were always meant to!",
    "And you will not stand in our way!",
  ],

  CMD_TRIASSIC_2: [
    "Defeated... again? Impossible!",
    "Don't think this is over, child. This is barely a chapter.",
    "The Permian Core will awaken — and when it does, not even all nine badges will save you!",
  ],

  CMD_TRIASSIC_3: [
    "Back for more? I'll admit — you've grown since we last met.",
    "But so have I. Team Extinction has evolved beyond your understanding.",
    "This time, I won't hold back a single fossil's worth of power!",
  ],

  CMD_JURASSIC_1: [
    "Ah — the Trainer who's been causing us so much trouble.",
    "I am Commander Jurassic. I curate history... and I intend to rewrite it.",
    "These fossils you see around you? They belong to Team Extinction now.",
    "And so does the future. Stand aside — or become history yourself!",
  ],

  CMD_JURASSIC_2: [
    "You... you defeated my DinoMons?",
    "This collection... these fossils... it doesn't matter. Director Clade has what he needs.",
    "You're too late to stop the awakening. You've won nothing here.",
  ],

  CMD_CRETACEOUS_1: [
    "Wandering into Bogmire... brave, or foolish?",
    "I am Commander Cretaceous. The mist obeys me here.",
    "Your DinoMons will be confused, lost, and helpless before you even see mine coming.",
    "Welcome to extinction, little Trainer.",
  ],

  CMD_CRETACEOUS_2: [
    "How... how did you see through the fog?",
    "It doesn't matter. Director Clade is already at Mt. Cretaceous.",
    "The Permian Core is within reach. You've only delayed the inevitable.",
    "Go, then. Face him. See how well your bonds hold against sixty-six million years of power.",
  ],

  CMD_DEVONIAN_1: [
    "Far enough, surface-dweller. This dig is OFF LIMITS.",
    "I am Commander Devonian. While the others posture above ground, I unearth what truly matters — the oldest fossils, the first beasts.",
    "We caged a specimen down here that predates your little 'partners' by an age. It's ours now.",
    "Turn back, or be buried with the rest of history!",
  ],
  CMD_DEVONIAN_2: [
    "Defeated... in my own dig...",
    "Fine. Take the caged beast — a parting gift before extinction reclaims you all.",
    "Director Clade has the Permian Core nearly within reach. Nothing you do here changes that.",
  ],
  TE_HIDEOUT_SIGN: [
    "A crude tunnel mouth, freshly dug. Cart tracks lead down into the dark.",
    "Scrawled on a board: 'TEAM EXTINCTION — EXCAVATION SITE. KEEP OUT.'",
  ],
  TE_HIDEOUT_RESCUE: [
    "The cage hangs open. The frightened DinoMon inside looks up at you...",
    "It's a TARRASAUR — a confiscated fossil specimen! It steps out and bonds with you in gratitude.",
  ],
  TE_HIDEOUT_CAGE: [
    "A reinforced cage. Something ancient paces inside, eyeing the grunts warily.",
    "If you beat the commander, you might be able to free it.",
  ],

  BEACON_KEEPER: [
    "Welcome to Beacon Hamlet, traveler. I'm the keeper of the old storm-light.",
    "For a hundred years this beacon has guided lost trainers home through the cliffs.",
    "Legend says the first keeper sealed her greatest treasure in the tower — behind a boulder no ordinary soul could move.",
    "If your DinoMons have learned STRENGTH, perhaps the beacon has waited all this time... for you.",
  ],
  BEACON_KEEPER_DONE: [
    "So you reached the old keeper's vault. The beacon chose well.",
    "Use that ball wisely — some bonds are worth never letting slip away.",
  ],
  BEACON_LORE_1: [
    "On stormy nights you can hear the beacon DinoMon singing the ships home.",
    "My grandmother swore it was a Seraphwing. I've never seen it myself.",
  ],
  BEACON_LORE_2: [
    "The keeper never leaves the tower. Says the light would go dark without her.",
    "Strange folk, the keepers. But this hamlet would be lost rocks without them.",
  ],
  BEACON_VAULT: [
    "A dusty alcove, untouched for a century. A single perfect sphere rests on a pedestal...",
  ],

  DIRECTOR_CLADE_1: [
    "...",
    "So you've arrived. I expected you sooner.",
    "I am Director Clade, founder of Team Extinction and shepherd of the true timeline.",
    "66 million years. That is how long this world has been wrong.",
    "The asteroid was not an ending — it was an error. A corruption in the planet's history.",
    "Today... I correct it.",
    "The Permian Core will restore dominion to the dinosaurs.",
    "And you, young Trainer — you are the last obstacle.",
  ],

  DIRECTOR_CLADE_2: [
    "Impressive. You hold your ground well.",
    "But every fossil I command has endured millions of years. Your bonds are mere months old.",
    "Can love truly outlast deep time? Let's find out.",
  ],

  DIRECTOR_CLADE_DEFEAT: [
    "...",
    "I... you cannot stop evolution itself.",
    "This is... not the outcome I calculated.",
    "But perhaps...",
    "Perhaps you ARE evolution.",
    "The bond between a Trainer and their DinoMon — I never factored that into the equation.",
    "Maybe... the timeline was never wrong. Maybe it was always leading... here.",
    "...",
    "Take care of this world, young Trainer. It is more fragile than it looks.",
  ],

  // ----------------------------------------------------------
  // SIGNS
  // ----------------------------------------------------------

  SIGN_AMBERTOWN: [
    "AMBERTOWN",
    "Where the past is preserved forever.",
  ],

  SIGN_ROUTE1: [
    "ROUTE 1 — Primrose Path",
    "Connecting Ambertown to Shellcreek.",
    "Watch for wild DinoMons in the tall grass!",
  ],

  SIGN_SHELLCREEK: [
    "SHELLCREEK",
    "Tides in. Trainers welcome.",
  ],

  SIGN_DUSTWALL: [
    "DUSTWALL",
    "Carved from stone. Built to last.",
    "Population: 340",
  ],

  // ----------------------------------------------------------
  // UTILITY / SYSTEM DIALOGUES
  // ----------------------------------------------------------

  CENTER_TIP_1: [
    'The DinoCenter heals your entire party for free!',
    'Come back any time your DinoMons need rest.',
  ],

  CENTER_TIP_2: [
    "I heard wild DinoMons are stronger when they're weakened before you throw a ball!",
  ],

  HEALER_GREET: [
    "Welcome, Trainer! Your DinoMons look like they've been through quite a battle.",
    "Shall I heal your DinoMons?",
  ],

  NIELS_GREET: [
    "Daytrader Niels here — and have I got a coin for you!",
    "I designed my own cryptocurrency: Beachcoin. To the moon and back, kid!",
    "Buy in at the DinoExchange. The price swings every single visit —",
    "you could cash out fifty percent richer... or lose the lot. That's the thrill!",
  ],

  HEALER_DONE: [
    "Your DinoMons are fully healed!",
    "They're restored to perfect health and raring to go!",
    "We hope to see you again!",
  ],

  SHOP_GREET: [
    "Welcome to the DinoMon Store!",
    "We stock everything a traveling Trainer could need.",
    "What can I get you?",
  ],

  SAVE_PROMPT: [
    "Would you like to save your adventure?",
  ],

  SAVE_DONE: [
    "Progress saved!",
  ],

  CAUGHT_MON: [
    "Gotcha! [MON] was caught!",
  ],

  MON_FAINTED: [
    "[MON] fainted!",
  ],

  NO_PP: [
    "There's no PP left for that move!",
  ],

  BAG_EMPTY: [
    "You have none of those!",
  ],

  CANT_FLEE: [
    "Can't escape from a trainer battle!",
  ],

  LEVEL_UP: [
    "[MON] grew to level [LV]!",
  ],

  EVOLUTION_START: [
    "What?! [MON] is evolving!",
  ],

  EVOLUTION_DONE: [
    "Congratulations! [MON] evolved into [EVO]!",
  ],

  NEW_MOVE: [
    "[MON] wants to learn [MOVE].",
    "But [MON] already knows 4 moves...",
    "Which move should be forgotten?",
  ],

  // ----------------------------------------------------------
  // POST-GAME DIALOGUES
  // ----------------------------------------------------------

  CHAMPION_REWARD: [
    "You truly are the greatest Trainer the Fossil Frontier has ever seen.",
    "Director Clade is defeated. The Permian Core has gone silent. Peace has returned.",
    "But the world is still full of secrets — secrets only the rarest DinoMons can reveal.",
    "Take this. The DinoMaster Ball.",
    "It was forged from a shard of the Permian Core itself.",
    "No DinoMon — not even the MEGA ones — can resist it.",
    "Use it wisely. And never stop exploring.",
  ],

  PRIMORDIA_LEGEND: [
    "Ah... a Trainer worthy of this knowledge at last.",
    "Deep within this vault sleeps PRIMORDIA — a DinoMon born before time had a name.",
    "It is said that PRIMORDIA embodies all types at once, a living fossil of pure Primordial Aura.",
    "Many have sought it. None have been worthy of its attention.",
    "But you... you carry bonds strong enough to stir even ancient things.",
    "Approach the altar. If PRIMORDIA stirs for you, the world will know a new legend.",
  ],

  CREDITS_TITLE: [
    "- DinoMon: Fossil Frontier -",
    "Thank you for playing!",
  ],

  CRATERON_LEGEND: [
    "You feel an immense heat radiating from deep within the volcano...",
    "CRATERON — the Primordial Flame — was Director Clade's ultimate weapon.",
    "But with Clade defeated, CRATERON has broken free of his control.",
    "It roams these depths now, wild and ancient.",
    "If you are truly the strongest Trainer in the Fossil Frontier...",
    "CRATERON will find you worthy.",
  ],

  // ----------------------------------------------------------
  // FOSSIL CITADEL & WORLD CHAMPION
  // ----------------------------------------------------------

  FOSSIL_GATE_BLOCKED: [
    "GATE WARDEN: Halt, Trainer.",
    "Beyond this gate lies the Fossil Citadel — seat of the Grand Archon.",
    "Only those who have mastered all nine Gyms of the Pangaea Archipelago may enter.",
    "Collect all nine Gym Badges and return when you are ready.",
  ],

  // ── Route guard dialogues (updated for new gym order) ─────
  GUARD_NEED_HERD_BADGE: [
    "GUARD: Hold it right there!",
    "The path to Dustwall is restricted until you've proven yourself.",
    "Defeat Normal Normi at the Shellcreek Gym and earn the Herd Badge first.",
  ],

  GUARD_NEED_FOSSIL_BADGE: [
    "GUARD: I can't let you through yet.",
    "The route to Pyreside runs through dangerous cave systems.",
    "Earn the Fossil Badge from Jam Sennings at Dustwall first.",
  ],

  GUARD_NEED_MAGMA_BADGE: [
    "GUARD: Stop right there.",
    "The path to Ferngrove winds through a dark cave.",
    "You'll need the Magma Badge from Asset Toverdijk at Pyreside to pass.",
  ],

  GUARD_NEED_CANOPY_BADGE: [
    "GUARD: Entry denied.",
    "The forest trail to Stonehaven is overgrown.",
    "Earn the Canopy Badge from PuKing Maarten at Ferngrove — then your DinoMon can Cut the way through.",
  ],

  GUARD_NEED_BEDROCK_BADGE: [
    "GUARD: The mountain passes are sealed.",
    "Defeat Rock Hard Toonen at Stonehaven Gym and earn the Bedrock Badge before proceeding.",
  ],

  GUARD_NEED_STATIC_BADGE: [
    "GUARD: Bogmire's wetland routes are not safe for inexperienced Trainers.",
    "Earn the Static Badge from Beyblade Luuk at Crestfall first.",
  ],

  GUARD_NEED_TIDE_BADGE: [
    "GUARD: You can't reach Apex Summit without crossing the open water.",
    "Earn the Tide Badge from Surfing Peter at Bogmire and teach a DinoMon Surf.",
  ],

  GUARD_NEED_SURF: [
    "The water is too deep to cross.",
    "You'll need a DinoMon that knows Surf — and the Tide Badge to use it outside battle.",
  ],

  GUARD_NEED_ROCK_SMASH: [
    "A cracked boulder blocks the path.",
    "A DinoMon with Rock Smash could break it — earn the Fossil Badge first.",
  ],

  GUARD_NEED_FLASH: [
    "The cave ahead is pitch black.",
    "You'll need Flash to light the way — earn the Magma Badge first.",
  ],

  GUARD_NEED_CUT: [
    "The path is overgrown with thick brush.",
    "A DinoMon with Cut could clear it — earn the Canopy Badge first.",
  ],

  FOSSIL_GATE_OPEN: [
    "GATE WARDEN: All nine badges... You truly have surpassed every Gym in the land.",
    "Then pass, Trainer. The Grand Archon awaits you inside the Fossil Citadel.",
    "May the Primordial Aura guide your path.",
  ],

  GRAND_ARCHON_PRE: [
    "...",
    "So. A Trainer bearing all nine badges stands before me at last.",
    "I am Grand Archon Corvus — champion of the Fossil Citadel and keeper of the Primordial League.",
    "For twenty years no challenger has bested me.",
    "Your DinoMons have come far. But this ends here.",
    "Face me, and discover whether your bond with them is truly unbreakable!",
  ],

  GRAND_ARCHON_POST: [
    "...",
    "Extraordinary.",
    "Your bond with your DinoMons radiates a power I have never witnessed.",
    "I yield. You are the new Champion of the Fossil Citadel.",
    "The Primordial League acknowledges you — and so does the world.",
    "Go, Champion. The Pangaea Archipelago is in good hands.",
  ],

  GRAND_ARCHON_WIN: [
    "As I expected. No Trainer has beaten me in twenty years.",
    "Train harder. Strengthen your bonds. Return when you are ready.",
  ],

  FOSSIL_CITADEL_AMBIENCE: [
    "The ancient stone walls of the Fossil Citadel hum with Primordial Aura.",
    "Champions have walked these halls for centuries.",
    "You feel the weight of every great Trainer who came before you.",
  ],

  HEALER_FOSSIL: [
    "Welcome to the Fossil Citadel, Trainer!",
    "We will heal your DinoMons so you can challenge the Grand Archon!",
    "...",
    "Your DinoMons are ready for battle!",
    "Give it your all!",
  ],

  // ----------------------------------------------------------
  // TEAM EXTINCTION COMMANDER CUTSCENE DIALOGUES
  // ----------------------------------------------------------

  COMMANDER_TRIASSIC_INTRO: ["Team Extinction will restore the prehistoric order!", "Prove yourself worthy!"],
  COMMANDER_JURASSIC_INTRO: ["The Permian Core grows stronger each day!", "I, Commander Jurassic, will end your journey!"],
  COMMANDER_CRETACEOUS_INTRO: ["None shall pass to Mt. Cretaceous!", "The Permian Core awakens within hours!"],
  DIRECTOR_CLADE_INTRO: ["The Permian Core is nearly awakened!", "You want to stop me? Then battle me!"],
  TEAM_EXTINCTION_GRUNT_1: ["Team Extinction will rule the fossil world!"],
  TEAM_EXTINCTION_GRUNT_2: ["Director Clade's vision will be realized!"],

  // ── Double Battle ───────────────────────────────────────────
  DOUBLE_BATTLE_PRE: [
    "FLINT: 'You've made it this far. Impressive.'",
    "FLINT: 'But this ends here. Cretaceous and I together — you can't win.'",
    "COMMANDER CRETACEOUS: 'The Permian Core will activate regardless. Stand aside or be crushed.'",
    "FLINT: 'What does the Core ACTUALLY do to DinoMons? You said it would FREE them—'",
    "CRETACEOUS: 'They go feral. Acceptable losses. The species adapts.'",
    "FLINT: '...That's not freedom. That's a cage you can't see.'",
    "CRETACEOUS: 'Flint. Last warning.'",
    "* Morax breaks free from the Team Extinction grunts! *",
    "MORAX: 'A 2-on-2. Haven't done this in years. Let's remind them why that's a mistake.'",
    "* A wild double battle begins! *",
  ],
  DOUBLE_BATTLE_WIN: [
    "CRETACEOUS: 'Pathetic — both of you!' * calls in grunts and flees *",
    "FLINT: 'The Permian Core... it doesn't free them. Clade has been lying to all of us.'",
    "FLINT: 'The energy burst drives every DinoMon within range into a mindless frenzy. They tear themselves apart.'",
    "MORAX: 'Why would he want that?'",
    "FLINT: 'Power. Chaos. When civilisation collapses he rebuilds it under his rule.'",
    "FLINT: 'The DinoMons are just a weapon.' * looks at his own DinoMon *",
    "FLINT: 'I'm going to fix this.'",
  ],
  DOUBLE_BATTLE_LOSE: [
    "CRETACEOUS: 'Weak. Just as I expected.'",
    "FLINT: '...Train harder. You'll need to be stronger than this to stop Clade.'",
  ],

  // ----------------------------------------------------------
  // GYM QUIZ LABYRINTH — shared response dialogues
  // ----------------------------------------------------------

  GYM_QUIZ_CORRECT: [
    "Correct! The left gate opens — one trainer stands between you and the next stage!",
  ],
  GYM_QUIZ_WRONG: [
    "Wrong! The right gate opens — two trainers await you on the longer path...",
  ],

  // GYM PUZZLE SIGN DIALOGUES
  // ----------------------------------------------------------

  SIGN_SC_1: [
    "TIDAL NOTICE BOARD",
    "The tide always flows EAST toward the open harbor.",
    "A true sailor reads the current — follow it eastward to reach safe crossing.",
    "Those who swim against the tide will face the harbor guard.",
  ],
  SIGN_SC_2: [
    "HARBORMASTER'S NOTICE",
    "Plesiwave hunts in the DEEP CENTER channel, not the shallow pools.",
    "Keep to the central waters — the shallow western pools are patrolled.",
    "Only those who know deep water may pass freely to the arena.",
  ],
  SIGN_DW_1: [
    "FOSSIL EXCAVATION NOTICE",
    "The three-horned fossil on display belongs to the Ceratopsian lineage.",
    "Ceratopsians evolved into Fire-type DinoMons in the Cretaceous era.",
    "Those who mistake the fossil type will face the senior excavator.",
  ],
  SIGN_DW_2: [
    "GEOLOGICAL SURVEY BOARD",
    "Rock strata rule: the DEEPER the layer, the OLDER the fossil.",
    "Jam Sennings' strongest DinoMon came from the deepest Cretaceous stratum.",
    "Seek the path that goes DEEPER — the upper tunnels lead only to guards.",
  ],
  SIGN_PY_1: [
    "VOLCANIC SAFETY NOTICE",
    "BLUE flames burn HOTTER than orange flames.",
    "Tindrak's blue fire is effective against Grass-types — not Rock-types.",
    "Follow the blue flame markers WEST to the safe crossing bridge.",
  ],
  SIGN_PY_2: [
    "LAVA FLOW DIRECTION NOTICE",
    "Lava flows from HIGH ground to LOW ground — always moving SOUTH.",
    "To cross safely, travel AGAINST the flow — head NORTH along the eastern bank.",
    "Those who follow the lava south will face the lava guard.",
  ],
  SIGN_FN_1: [
    "GARDEN NAVIGATION BOARD",
    "Yellow flowers face the SUN — they always bloom toward the EAST.",
    "Follow the yellow blooms EAST to find the garden's true path.",
    "The blue western flowers lead only to the botanist's training ground.",
  ],
  SIGN_FN_2: [
    "ANCIENT TREE RING NOTICE",
    "Verdanthorn is the THIRD stage of the Leafawn evolutionary line.",
    "Two evolutions separate Leafawn from Verdanthorn — count the rings.",
    "The path with TWO ring-markers is correct. Three leads to the vine trainer.",
  ],
  SIGN_SH_1: [
    "CANYON SAFETY BOARD",
    "During an earthquake, NEVER flee into the canyon — head for HIGH GROUND.",
    "The eastern ridge path leads upward to safety and forward progress.",
    "The western canyon descent leads only to the canyon scout's patrol.",
  ],
  SIGN_SH_2: [
    "BRIDGE WEIGHT NOTICE",
    "The STONE bridge supports heavy DinoMons — sand bridges collapse.",
    "Terradon weighs 480 kg. Only the stone bridge to the EAST can bear it.",
    "The sandy western crossing will collapse — and the scout will find you.",
  ],
  SIGN_CF_1: [
    "ELECTRICAL CIRCUIT NOTICE",
    "The LIVE wire glows with a faint yellow light — follow the glow.",
    "The eastern circuit is live and leads to the generator room.",
    "The dark western wires are dead ends — and the electrician patrols them.",
  ],
  SIGN_CF_2: [
    "GENERATOR ROOM NOTICE",
    "Electric-type moves are SPECIAL attacks — lightning does not punch.",
    "Beyblade Luuk's DinoMons use Special Electric moves. Counter with Ground-types.",
    "Trainers who do not know their type chart must face the storm chaser.",
  ],
  SIGN_BG_1: [
    "TEMPLE FIRST TABLET",
    "Here rests the warden of the deep. Her scales are silver, her mind clear.",
    "She lives where water and thought converge — follow the NORTHERN star.",
    "The western pools are shallow and watched by the temple diver.",
  ],
  SIGN_BG_2: [
    "TEMPLE SECOND TABLET",
    "The North Star hangs above the deepest pool. The shrine faces NORTH.",
    "Navigate toward the star — the southern passages lead away from the heart.",
    "Those who stray south will face the temple oracle before finding the way.",
  ],
  SIGN_AP_1: [
    "CITADEL FIRST RIDDLE",
    "'I breathe fire but sleep in ice. I fly but am born of stone.'",
    "The answer is DRAGON. Dragons resist fire — but ICE pierces their scales.",
    "Follow the ice-crystal path EAST. The frozen western halls hold the warden.",
  ],
  SIGN_AP_2: [
    "CITADEL FINAL RIDDLE",
    "'What element brings low the mightiest dragon?'",
    "The answer is ICE. Ice-type moves are super-effective against Dragon-types.",
    "Take the ICE path LEFT to prove your knowledge. The right path faces the knight.",
  ],

  // ── Gym route choice signs (L/R two-route system) ──
  SIGN_SC_LEFT: [
    "TIDE GATE — LEFT ROUTE",
    "Cross the deep water pools westward to reach the arena.",
    "Herder Cal and Sailor Brine guard this path. Brave them for extra training!",
  ],
  SIGN_SC_RIGHT: [
    "CURRENT RUN — RIGHT ROUTE",
    "Follow the eastern current channel toward the arena.",
    "Rancher Tess and Diver Mira patrol this route. A swift but guarded path.",
  ],
  SIGN_DW_LEFT: [
    "EXCAVATION SHAFT — LEFT ROUTE",
    "Descend the fossil dig tunnels through the western cavern.",
    "Hiker Burl and Excavator Dag work this shaft. Fight them for rich fossil lore!",
  ],
  SIGN_DW_RIGHT: [
    "FOSSIL CHAMBER — RIGHT ROUTE",
    "Enter the eastern fossil chamber toward Jam Sennings' arena.",
    "Granite Gal and Geologist Fen study this chamber. Their knowledge is dangerous!",
  ],
  SIGN_PY_LEFT: [
    "STONE PASS — LEFT ROUTE",
    "Cross the stone bridges over the lava sea to the western approach.",
    "Blaze and Pyro Blaze guard the stone path. Test yourself in the heat!",
  ],
  SIGN_PY_RIGHT: [
    "EMBER RUN — RIGHT ROUTE",
    "Race the ember current along the eastern lava bank.",
    "Flint and Cinder hold the ember route. Survive the fire to reach Asset Toverdijk!",
  ],
  SIGN_FN_LEFT: [
    "BLOSSOM WALK — LEFT ROUTE",
    "Follow the flower blooms through the western hedge corridors.",
    "Ranger Fern and Botanist Fern tend this path. Learn from them or fight!",
  ],
  SIGN_FN_RIGHT: [
    "THORN PASS — RIGHT ROUTE",
    "Push through the thorny eastern hedgerows toward PuKing Maarten.",
    "Bramble Jr and Vine Bramble defend this thorny route. Proceed with care!",
  ],
  SIGN_SH_LEFT: [
    "DUST TRAIL — LEFT ROUTE",
    "Trek the dusty western canyon ridgepath toward Rock Hard Toonen.",
    "Hiker Dustin and Scout Drake patrol the dust trail. Earn your canyon badge!",
  ],
  SIGN_SH_RIGHT: [
    "BOULDER PASS — RIGHT ROUTE",
    "Navigate the boulder-strewn eastern canyon pass.",
    "Hiker Gravel and Elder Drake guard the boulder route. Tough terrain ahead!",
  ],
  SIGN_CF_LEFT: [
    "SPARK LANE — LEFT ROUTE",
    "Follow the live wires west through the generator banks.",
    "Amp and Electrician Zap patrol Spark Lane. Shocking encounters await!",
  ],
  SIGN_CF_RIGHT: [
    "VOLT ROW — RIGHT ROUTE",
    "Navigate the eastern high-voltage corridor to Beyblade Luuk.",
    "Volt Jr and Sparky guard Volt Row. High voltage — approach with caution!",
  ],
  SIGN_BG_LEFT: [
    "STONE PLATFORM — LEFT ROUTE",
    "Hop across the ancient stone platforms through the western swamp.",
    "Coral and Temple Coral guard the platform path. Ancient wisdom awaits!",
  ],
  SIGN_BG_RIGHT: [
    "DEEP CHANNEL — RIGHT ROUTE",
    "Wade through the deep eastern swamp channel toward Surfing Peter.",
    "Diver Oracle and Oracle Tide haunt the deep channel. Mysterious dangers!",
  ],
  SIGN_AP_LEFT: [
    "FROST WING — LEFT ROUTE",
    "Traverse the frozen western halls of the Dragon Citadel.",
    "Peak and Ice Warden defend the Frost Wing. The cold bites deep here!",
  ],
  SIGN_AP_RIGHT: [
    "STORM WING — RIGHT ROUTE",
    "Brave the storm-swept eastern battlements toward Bipolar Fieke.",
    "Storm and Dragon Knight guard the Storm Wing. The strongest route!",
  ],

};

// ============================================================
// FLAGS
// ============================================================

DG.STORY.FLAGS = {
  GAME_STARTED:              'GAME_STARTED',
  STARTER_CHOSEN:            'STARTER_CHOSEN',
  LEFT_AMBERTOWN:            'LEFT_AMBERTOWN',
  BADGE_1:                   'BADGE_1',   // Herd Badge     — Normal Normi,        Shellcreek (Normal)
  BADGE_2:                   'BADGE_2',   // Fossil Badge   — Jam Sennings,     Dustwall   (Rock)
  BADGE_3:                   'BADGE_3',   // Magma Badge    — Asset Toverdijk,      Pyreside   (Fire)
  BADGE_4:                   'BADGE_4',   // Canopy Badge   — PuKing Maarten,      Ferngrove  (Grass)
  BADGE_5:                   'BADGE_5',   // Charm Badge    — AFK Jorn, Fairydell (Fairy)
  BADGE_6:                   'BADGE_6',   // Bedrock Badge  — Rock Hard Toonen, Stonehaven (Ground)
  BADGE_7:                   'BADGE_7',   // Static Badge   — Beyblade Luuk, Crestfall (Electric)
  BADGE_8:                   'BADGE_8',   // Tide Badge     — Surfing Peter, Bogmire (Water)
  BADGE_9:                   'BADGE_9',   // Scale Badge    — Bipolar Fieke, Apex Summit (Dragon)
  // Field move unlock flags (set after each corresponding gym badge is awarded)
  ROCK_SMASH_UNLOCKED:       'ROCK_SMASH_UNLOCKED',  // Gym 2 — Fossil Badge
  FLASH_UNLOCKED:            'FLASH_UNLOCKED',        // Gym 3 — Magma Badge
  CUT_UNLOCKED:              'CUT_UNLOCKED',          // Gym 4 — Canopy Badge
  STRENGTH_UNLOCKED:         'STRENGTH_UNLOCKED',     // Gym 6 — Bedrock Badge
  FLY_UNLOCKED:              'FLY_UNLOCKED',          // Gym 7 — Static Badge
  SURF_UNLOCKED:             'SURF_UNLOCKED',         // Gym 8 — Tide Badge
  DIVE_UNLOCKED:             'DIVE_UNLOCKED',         // Gym 9 — Scale Badge
  RIVAL_BATTLE_1_DONE:       'RIVAL_BATTLE_1_DONE',
  RIVAL_BATTLE_2_DONE:       'RIVAL_BATTLE_2_DONE',
  RIVAL_BATTLE_3_DONE:       'RIVAL_BATTLE_3_DONE',
  RIVAL_BATTLE_4_DONE:       'RIVAL_BATTLE_4_DONE',
  RIVAL_BATTLE_5_DONE:       'RIVAL_BATTLE_5_DONE',
  CMD_TRIASSIC_DEFEATED_1:   'CMD_TRIASSIC_DEFEATED_1',
  CMD_TRIASSIC_DEFEATED_2:   'CMD_TRIASSIC_DEFEATED_2',
  CMD_JURASSIC_DEFEATED:     'CMD_JURASSIC_DEFEATED',
  CMD_CRETACEOUS_DEFEATED:   'CMD_CRETACEOUS_DEFEATED',
  DIRECTOR_CLADE_DEFEATED:   'DIRECTOR_CLADE_DEFEATED',
  CRATERON_AVAILABLE:        'CRATERON_AVAILABLE',
  GLACIODON_AVAILABLE:       'GLACIODON_AVAILABLE',
  PRIMORDIA_AVAILABLE:       'PRIMORDIA_AVAILABLE',
  MEGA_AVAILABLE:            'MEGA_AVAILABLE',
  MASTERBALL_OBTAINED:       'MASTERBALL_OBTAINED',
  GAME_COMPLETE:             'GAME_COMPLETE',
};

// ============================================================
// EVENTS (placeholders for scripted scene triggers)
// ============================================================

DG.STORY.EVENTS = {
  // Format: EVENT_KEY: { flag: 'FLAG_REQUIRED', mapId: 'MAP_ID', trigger: 'auto|interact|battle' }
  INTRO_CUTSCENE:         { flag: null,                             mapId: 'PROF_LAB',      trigger: 'auto'     },
  STARTER_SELECTION:      { flag: 'GAME_STARTED',                  mapId: 'PROF_LAB',      trigger: 'interact' },
  MOM_FAREWELL:           { flag: 'STARTER_CHOSEN',                mapId: 'AMBERTOWN',     trigger: 'interact' },
  GRUNT_AMBUSH_ROUTE3:    { flag: 'LEFT_AMBERTOWN',                mapId: 'ROUTE_3',       trigger: 'auto'     },
  CMD_TRIASSIC_FIGHT_1:   { flag: 'LEFT_AMBERTOWN',                mapId: 'ROUTE_3',       trigger: 'auto'     },
  // CMD_JURASSIC triggers after Gym 6 (Bedrock Badge — Rock Hard Toonen, Stonehaven)
  CMD_JURASSIC_FIGHT:     { flag: 'BADGE_6',                       mapId: 'STONEHAVEN',    trigger: 'auto'     },
  // CMD_CRETACEOUS triggers after Gym 8 (Tide Badge — Surfing Peter, Bogmire)
  CMD_CRETACEOUS_FIGHT:   { flag: 'BADGE_8',                       mapId: 'BOGMIRE',       trigger: 'auto'     },
  // CMD_TRIASSIC 2nd fight triggers after Gym 7 (Static Badge — Beyblade Luuk, Crestfall)
  CMD_TRIASSIC_FIGHT_2:   { flag: 'BADGE_7',                       mapId: 'ROUTE_8',       trigger: 'auto'     },
  FINAL_CLIMB:            { flag: 'BADGE_8',                       mapId: 'MT_CRETACEOUS', trigger: 'auto'     },
  DIRECTOR_CLADE_FIGHT:   { flag: 'CMD_CRETACEOUS_DEFEATED',       mapId: 'MT_CRETACEOUS', trigger: 'auto'     },
  ENDGAME_CUTSCENE:       { flag: 'DIRECTOR_CLADE_DEFEATED',       mapId: 'MT_CRETACEOUS', trigger: 'auto'     },
};

console.log('[DinoMon] Story loaded.');
