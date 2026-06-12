/**
 * add_moves_p2c.js — Phase 2 Batch C (Final)
 * Adds ~120 more moves to reach ~1000 total.
 * Focus on lower-count types: GHOST, FLYING, FAIRY, BUG, FIGHTING, STEEL + extras for FIRE/WATER/GRASS
 */
const fs = require('fs');
const src = fs.readFileSync('./js/data/moves.js', 'utf8');
const existing = new Set([...src.matchAll(/^\s{2}([A-Z_0-9]+):\s*\{/gm)].map(m => m[1]).filter(id => id !== 'DG'));
console.log('Existing moves:', existing.size);

const newMoves = `
  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH C — GHOST (15 more → total ~36)
  // ═══════════════════════════════════════════════════════
  ETHEREAL_SLASH: { id:'ETHEREAL_SLASH', name:'Ethereal Slash', type:'GHOST', category:'PHYSICAL', power:80, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'Cuts with an ethereal blade that passes through barriers.' },
  SPIRIT_SURGE: { id:'SPIRIT_SURGE', name:'Spirit Surge', type:'GHOST', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Surges with the power of many departed spirits.' },
  GHOUL_CLAW: { id:'GHOUL_CLAW', name:'Ghoul Claw', type:'GHOST', category:'PHYSICAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'POISON_CHANCE',chance:20}, description:'Ghoulish claws may infect the foe with poison.' },
  POLTERGEIST_WAVE: { id:'POLTERGEIST_WAVE', name:'Poltergeist Wave', type:'GHOST', category:'SPECIAL', power:70, accuracy:95, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'CONFUSE',chance:30}, description:'Invisible forces strike and may cause confusion.' },
  SOUL_BLAST: { id:'SOUL_BLAST', name:'Soul Blast', type:'GHOST', category:'SPECIAL', power:95, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Releases the energy of trapped souls in a burst.' },
  PHANTOM_CLAW: { id:'PHANTOM_CLAW', name:'Phantom Claw', type:'GHOST', category:'PHYSICAL', power:65, accuracy:100, pp:20, priority:1, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A phantom claw strikes before the foe can react.' },
  WRAITH_WAVE: { id:'WRAITH_WAVE', name:'Wraith Wave', type:'GHOST', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'A wraith wave erodes the foe\'s Sp. Def.' },
  SPECTER_SLAM: { id:'SPECTER_SLAM', name:'Specter Slam', type:'GHOST', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'A slam charged with spectral force.' },
  SHADOW_PULSE: { id:'SHADOW_PULSE', name:'Shadow Pulse', type:'GHOST', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'CONFUSE',chance:20}, description:'Shadowy pulses vibrate through the foe\'s mind.' },
  CURSED_BLAST: { id:'CURSED_BLAST', name:'Cursed Blast', type:'GHOST', category:'SPECIAL', power:100, accuracy:85, pp:8, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'A blast of ancient cursed energy.' },
  NIGHTMARE_PULSE: { id:'NIGHTMARE_PULSE', name:'Nightmare Pulse', type:'GHOST', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'CONFUSE',chance:40}, description:'Nightmare energy likely to confuse sleeping foes.' },
  SPIRIT_SHIELD: { id:'SPIRIT_SHIELD', name:'Spirit Shield', type:'GHOST', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['def','spDef'],stages:1}, description:'Spirits shield the user, boosting both defenses.' },
  VOID_CLAW: { id:'VOID_CLAW', name:'Void Claw', type:'GHOST', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER',stat:'def',stages:1}, description:'Strikes from the void, lowering Defense.' },
  HAUNTED_BEAM: { id:'HAUNTED_BEAM', name:'Haunted Beam', type:'GHOST', category:'SPECIAL', power:90, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A beam of energy haunted by fallen spirits.' },
  GRAVE_PULSE: { id:'GRAVE_PULSE', name:'Grave Pulse', type:'GHOST', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Energy from the grave pulses through the earth.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH C — FLYING (15 more → total ~37)
  // ═══════════════════════════════════════════════════════
  GALE_STRIKE: { id:'GALE_STRIKE', name:'Gale Strike', type:'FLYING', category:'PHYSICAL', power:80, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'Strikes with wind sharpened to a gale.' },
  WIND_SURGE: { id:'WIND_SURGE', name:'Wind Surge', type:'FLYING', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'A surge of compressed wind blasts the foe.' },
  STORMWING_SLAM: { id:'STORMWING_SLAM', name:'Stormwing Slam', type:'FLYING', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Slams with wings channeling storm energy.' },
  FEATHER_STORM: { id:'FEATHER_STORM', name:'Feather Storm', type:'FLYING', category:'SPECIAL', power:80, accuracy:90, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'STAT_LOWER',stat:'acc',stages:1}, description:'A feather storm lowers the foe\'s accuracy.' },
  WING_PULSE: { id:'WING_PULSE', name:'Wing Pulse', type:'FLYING', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Wing beats send a pulse of air at the foe.' },
  SKYDIVE: { id:'SKYDIVE', name:'Skydive', type:'FLYING', category:'PHYSICAL', power:95, accuracy:95, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'FLINCH',chance:20}, description:'Dives from maximum altitude for a crushing blow.' },
  AERIAL_BEAM: { id:'AERIAL_BEAM', name:'Aerial Beam', type:'FLYING', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A beam of wind energy fired from altitude.' },
  SWIFT_WING: { id:'SWIFT_WING', name:'Swift Wing', type:'FLYING', category:'PHYSICAL', power:55, accuracy:100, pp:25, priority:1, animStyle:'ARC',
    effect:{type:'NONE'}, description:'A swift wing strike that never misses.' },
  TORNADO_SPIN: { id:'TORNADO_SPIN', name:'Tornado Spin', type:'FLYING', category:'SPECIAL', power:85, accuracy:85, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'FLINCH',chance:30}, description:'Spins up a miniature tornado that may cause flinching.' },
  WIND_DRAIN: { id:'WIND_DRAIN', name:'Wind Drain', type:'FLYING', category:'SPECIAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains energy through a focused wind vortex.' },
  AERIAL_AURA: { id:'AERIAL_AURA', name:'Aerial Aura', type:'FLYING', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE',stats:['atk','spd'],stages:1}, description:'Aerial aura boosts Attack and Speed.' },
  STORM_SLAM: { id:'STORM_SLAM', name:'Storm Slam', type:'FLYING', category:'PHYSICAL', power:90, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'PARALYSIS',chance:30}, description:'A slam charged with storm electricity may paralyze.' },
  CYCLONE_BURST: { id:'CYCLONE_BURST', name:'Cyclone Burst', type:'FLYING', category:'SPECIAL', power:90, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'A burst of cyclonic force erupts around the foe.' },
  BIRD_OF_PREY: { id:'BIRD_OF_PREY', name:'Bird of Prey', type:'FLYING', category:'PHYSICAL', power:85, accuracy:95, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'FLINCH',chance:20}, description:'A diving strike like a predatory bird.' },
  FEATHER_VEIL: { id:'FEATHER_VEIL', name:'Feather Veil', type:'FLYING', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'spd',stages:2}, description:'Sheds old feathers to reveal a swifter form.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH C — FAIRY (12 more → total ~35)
  // ═══════════════════════════════════════════════════════
  GLIMMER_STRIKE: { id:'GLIMMER_STRIKE', name:'Glimmer Strike', type:'FAIRY', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A strike infused with glimmering fairy light.' },
  STARFALL: { id:'STARFALL', name:'Starfall', type:'FAIRY', category:'SPECIAL', power:95, accuracy:90, pp:10, priority:0, animStyle:'MULTI',
    effect:{type:'NONE'}, description:'Stars rain down on the foe.' },
  FAIRY_CLAW: { id:'FAIRY_CLAW', name:'Fairy Claw', type:'FAIRY', category:'PHYSICAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'CONFUSE',chance:20}, description:'A fairy-enchanted claw may confuse the foe.' },
  DREAMBEAM: { id:'DREAMBEAM', name:'Dreambeam', type:'FAIRY', category:'SPECIAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'SLEEP',chance:10}, description:'A beam of dream energy may put the foe to sleep.' },
  ENCHANTED_SLAM: { id:'ENCHANTED_SLAM', name:'Enchanted Slam', type:'FAIRY', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'A slam infused with enchanting fairy magic.' },
  FAIRY_FLAME: { id:'FAIRY_FLAME', name:'Fairy Flame', type:'FAIRY', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'BURST',
    effect:{type:'BURN_CHANCE',chance:10}, description:'Magical fairy flame may inflict a burn.' },
  GRACE: { id:'GRACE', name:'Grace', type:'FAIRY', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'OMNI_RAISE',chance:100}, description:'Channels fairy grace to raise all stats.' },
  MOONFORCE_SURGE: { id:'MOONFORCE_SURGE', name:'Moon Surge', type:'FAIRY', category:'SPECIAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'Moon energy surges to lower the foe\'s Sp. Def.' },
  PIXIE_STRIKE: { id:'PIXIE_STRIKE', name:'Pixie Strike', type:'FAIRY', category:'PHYSICAL', power:50, accuracy:100, pp:25, priority:1, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A quick pixie strike that always goes first.' },
  STARDUST_PULSE: { id:'STARDUST_PULSE', name:'Stardust Pulse', type:'FAIRY', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Cosmic stardust pulses through the foe.' },
  FAIRY_WAVE: { id:'FAIRY_WAVE', name:'Fairy Wave', type:'FAIRY', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A wave of pure fairy energy.' },
  MIDSUMMER_BLAST: { id:'MIDSUMMER_BLAST', name:'Midsummer Blast', type:'FAIRY', category:'SPECIAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'The height of fairy power on midsummer night.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH C — BUG (12 more → total ~35)
  // ═══════════════════════════════════════════════════════
  INSECT_BEAM: { id:'INSECT_BEAM', name:'Insect Beam', type:'BUG', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A sonic beam from insect stridulation.' },
  BUG_VORTEX: { id:'BUG_VORTEX', name:'Bug Vortex', type:'BUG', category:'SPECIAL', power:70, accuracy:90, pp:15, priority:0, animStyle:'VORTEX',
    effect:{type:'STAT_LOWER',stat:'acc',stages:1}, description:'A vortex of bugs reduces visibility.' },
  STINGER: { id:'STINGER', name:'Stinger', type:'BUG', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PROJECTILE',
    effect:{type:'POISON_CHANCE',chance:30}, description:'A precision stinger strike may poison.' },
  BUG_BURST: { id:'BUG_BURST', name:'Bug Burst', type:'BUG', category:'SPECIAL', power:85, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'The hive explodes outward in a burst attack.' },
  CARAPACE_CRASH: { id:'CARAPACE_CRASH', name:'Carapace Crash', type:'BUG', category:'PHYSICAL', power:95, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Crashes with the full weight of a battle-hardened shell.' },
  GOSSAMER_SLASH: { id:'GOSSAMER_SLASH', name:'Gossamer Slash', type:'BUG', category:'PHYSICAL', power:55, accuracy:100, pp:25, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'Razor-thin wings cut like gossamer silk.' },
  DRAGONFLY_DIVE: { id:'DRAGONFLY_DIVE', name:'Dragonfly Dive', type:'BUG', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'NONE'}, description:'Dives with the speed of a dragonfly.' },
  ACID_COCOON: { id:'ACID_COCOON', name:'Acid Cocoon', type:'BUG', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['def','spDef'],stages:2}, description:'Wraps in an acidic cocoon, sharply boosting both defenses.' },
  SKITTER: { id:'SKITTER', name:'Skitter', type:'BUG', category:'PHYSICAL', power:55, accuracy:100, pp:20, priority:1, animStyle:'ARC',
    effect:{type:'STAT_LOWER',stat:'spAtk',stages:1}, description:'A fast skittering strike lowers Sp. Atk.' },
  MULTIBITE: { id:'MULTIBITE', name:'Multibite', type:'BUG', category:'PHYSICAL', power:20, accuracy:100, pp:15, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'Bites rapidly with mandibles 2-5 times.' },
  SILK_BIND: { id:'SILK_BIND', name:'Silk Bind', type:'BUG', category:'STATUS', power:0, accuracy:90, pp:15, priority:0, animStyle:'FIELD',
    effect:{type:'PARALYSIS',chance:100}, description:'Wraps the foe in thick silk, paralyzing them.' },
  COLONY_STRIKE: { id:'COLONY_STRIKE', name:'Colony Strike', type:'BUG', category:'PHYSICAL', power:100, accuracy:90, pp:8, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'An entire colony attacks in one crushing blow.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH C — FIGHTING (10 more → total ~34)
  // ═══════════════════════════════════════════════════════
  TITAN_FIST: { id:'TITAN_FIST', name:'Titan Fist', type:'FIGHTING', category:'PHYSICAL', power:110, accuracy:90, pp:8, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A fist with the force of a titan.' },
  WAR_CRY: { id:'WAR_CRY', name:'War Cry', type:'FIGHTING', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE',stat:'atk',stages:2}, description:'A thunderous war cry sharply raises Attack.' },
  COUNTER_CRASH: { id:'COUNTER_CRASH', name:'Counter Crash', type:'FIGHTING', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Counters then crashes into the foe.' },
  GRAPPLE_THROW: { id:'GRAPPLE_THROW', name:'Grapple Throw', type:'FIGHTING', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'Grapples and throws, slowing the foe.' },
  HEADBUTT_STRIKE: { id:'HEADBUTT_STRIKE', name:'Head Strike', type:'FIGHTING', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'FLINCH',chance:30}, description:'A headbutt strike may cause flinching.' },
  SWEEP_KICK: { id:'SWEEP_KICK', name:'Sweep Kick', type:'FIGHTING', category:'PHYSICAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'Sweeps the foe off their feet, lowering Speed.' },
  POWER_RUSH: { id:'POWER_RUSH', name:'Power Rush', type:'FIGHTING', category:'PHYSICAL', power:95, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Charges with overwhelming fighting power.' },
  DINOSAUR_STOMP: { id:'DINOSAUR_STOMP', name:'Dino Stomp', type:'FIGHTING', category:'PHYSICAL', power:80, accuracy:100, pp:15, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH',chance:20}, description:'A prehistoric stomping attack. May cause flinching.' },
  ENDURE_STRIKE: { id:'ENDURE_STRIKE', name:'Endure Strike', type:'FIGHTING', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_RAISE',stat:'def',stages:1}, description:'Tanks a hit then counters, raising own Defense.' },
  FINAL_BLOW: { id:'FINAL_BLOW', name:'Final Blow', type:'FIGHTING', category:'PHYSICAL', power:120, accuracy:85, pp:5, priority:0, animStyle:'SLAM',
    effect:{type:'RECOIL',fraction:25}, description:'A final, desperate, all-or-nothing strike.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH C — STEEL (10 more → total ~34)
  // ═══════════════════════════════════════════════════════
  IRON_PULSE: { id:'IRON_PULSE', name:'Iron Pulse', type:'STEEL', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Pulses of iron energy resonate through the foe.' },
  STEEL_CRASH: { id:'STEEL_CRASH', name:'Steel Crash', type:'STEEL', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'A steel-body crash of immense weight.' },
  IRON_TORNADO: { id:'IRON_TORNADO', name:'Iron Tornado', type:'STEEL', category:'PHYSICAL', power:85, accuracy:90, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'}, description:'A tornado of iron shards engulfs the foe.' },
  CHROME_STRIKE: { id:'CHROME_STRIKE', name:'Chrome Strike', type:'STEEL', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A polished chrome limb strikes with precision.' },
  STEEL_LANCE: { id:'STEEL_LANCE', name:'Steel Lance', type:'STEEL', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A lance of steel pierces through defenses.' },
  METAL_BURST_WAVE: { id:'METAL_BURST_WAVE', name:'Metal Wave', type:'STEEL', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A wave of metallic energy clangs across the field.' },
  IRON_FRENZY: { id:'IRON_FRENZY', name:'Iron Frenzy', type:'STEEL', category:'PHYSICAL', power:50, accuracy:100, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'Frenzied iron strikes hit 2-5 times.' },
  STEEL_BEAM_SURGE: { id:'STEEL_BEAM_SURGE', name:'Steel Surge', type:'STEEL', category:'PHYSICAL', power:90, accuracy:100, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'A surge of magnetized steel energy.' },
  FORTRESS: { id:'FORTRESS', name:'Fortress', type:'STEEL', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'def',stages:3}, description:'Transforms into a fortress, drastically raising Defense.' },
  METALLIC_PULSE: { id:'METALLIC_PULSE', name:'Metallic Pulse', type:'STEEL', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'PARALYSIS',chance:20}, description:'Metal resonance may paralyze the foe.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH C — FIRE/WATER/GRASS (extras to balance types)
  // ═══════════════════════════════════════════════════════
  PYROCLASM: { id:'PYROCLASM', name:'Pyroclasm', type:'FIRE', category:'SPECIAL', power:130, accuracy:85, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'RECHARGE'}, description:'A pyroclastic explosion of volcanic force. Must recharge.' },
  LAVA_DRAIN: { id:'LAVA_DRAIN', name:'Lava Drain', type:'FIRE', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains the foe\'s heat energy, healing the user.' },
  FLAME_PULSE: { id:'FLAME_PULSE', name:'Flame Pulse', type:'FIRE', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'PULSE',
    effect:{type:'BURN_CHANCE',chance:20}, description:'Pulses of fire energy may burn the foe.' },
  ABYSSAL_TORRENT: { id:'ABYSSAL_TORRENT', name:'Abyssal Torrent', type:'WATER', category:'SPECIAL', power:120, accuracy:85, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'RECHARGE'}, description:'The torrent of the abyss. Must recharge afterward.' },
  WATER_DRAIN: { id:'WATER_DRAIN', name:'Water Drain', type:'WATER', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Draws moisture from the foe to heal the user.' },
  WATER_PULSE_SURGE: { id:'WATER_PULSE_SURGE', name:'Water Pulse', type:'WATER', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'PULSE',
    effect:{type:'CONFUSE',chance:20}, description:'Ultrasonic water pulses may confuse the foe.' },
  ANCIENT_VINE: { id:'ANCIENT_VINE', name:'Ancient Vine', type:'GRASS', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'An ancient vine with primordial strength.' },
  GRASS_PULSE: { id:'GRASS_PULSE', name:'Grass Pulse', type:'GRASS', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Pulses of grassland energy ripple through the foe.' },
  CHLORO_DRAIN: { id:'CHLORO_DRAIN', name:'Chloro Drain', type:'GRASS', category:'SPECIAL', power:75, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Absorbs chlorophyll to restore the user\'s health.' },
  DRAGON_DRAIN: { id:'DRAGON_DRAIN', name:'Dragon Drain', type:'DRAGON', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains the foe\'s draconic energy to heal.' },
  PSYCHIC_DRAIN: { id:'PSYCHIC_DRAIN', name:'Psychic Drain', type:'PSYCHIC', category:'SPECIAL', power:70, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains mental energy from the foe.' },
  GROUND_DRAIN: { id:'GROUND_DRAIN', name:'Ground Drain', type:'GROUND', category:'SPECIAL', power:70, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Draws energy from the earth beneath the foe.' },
  DARK_PULSE_SURGE: { id:'DARK_PULSE_SURGE', name:'Darkness Pulse', type:'DARK', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'FLINCH',chance:20}, description:'Dark pulses may cause the foe to flinch.' },
  ICE_DRAIN: { id:'ICE_DRAIN', name:'Cryo Drain', type:'ICE', category:'SPECIAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains body heat from the foe, healing the user.' },
  ROCK_DRAIN: { id:'ROCK_DRAIN', name:'Mineral Drain', type:'ROCK', category:'SPECIAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Draws mineral energy from the foe.' },
  ELECTRIC_DRAIN: { id:'ELECTRIC_DRAIN', name:'Volt Drain', type:'ELECTRIC', category:'SPECIAL', power:70, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains electrical energy from the foe.' },
  POISON_DRAIN: { id:'POISON_DRAIN', name:'Venom Drain', type:'POISON', category:'SPECIAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Draws toxic energy from the foe.' },
`;

// Filter and insert
const blocks = newMoves.split(/\n  (?=[A-Z_0-9]+:\s*\{)/).filter(b => {
  const m = b.match(/^([A-Z_0-9]+):/);
  return m && !existing.has(m[1]);
});

console.log('New moves to add:', blocks.length);

const insertPos = src.lastIndexOf('\n};');
if (insertPos === -1) { console.error('Could not find insertion point'); process.exit(1); }

const toInsert = '\n' + blocks.join('\n  ') + '\n';
const newSrc = src.slice(0, insertPos) + toInsert + src.slice(insertPos);

fs.writeFileSync('./js/data/moves.js', newSrc, 'utf8');
console.log('Done! moves.js updated.');
