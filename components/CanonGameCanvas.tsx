"use client";

import { useEffect, useRef } from "react";

type GameMode = "menu" | "playing" | "upgrade" | "stageClear" | "victory" | "failed";
type EnemyType =
  | "deer"
  | "boar"
  | "monkey"
  | "wraith"
  | "guardian"
  | "serpent"
  | "oni"
  | "dragon";
type PickupType = "health" | "energy" | "relic";
type EffectType = "spark" | "burst" | "trail" | "damageText";
type DialogueBeat = "intro" | "midpoint" | "boss" | "clear";
type StageMotif = "cedarGate" | "riverPillars" | "snowPass" | "shrineVillage";
type UpgradeId = "vital" | "capacitor" | "edge" | "flux" | "phase" | "aegis";

interface StageConfig {
  title: string;
  subtitle: string;
  length: number;
  sublevelDurations: [number, number, number, number, number];
  skyA: string;
  skyB: string;
  haze: string;
  mountains: string;
  forest: string;
  groundA: string;
  groundB: string;
  accent: string;
  enemyPool: EnemyType[];
  bossType: EnemyType;
  bossName: string;
  bossTitle: string;
  bossThreatLine: string;
  motif: StageMotif;
  sublevels: [string, string, string, string, string];
}

interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  facing: -1 | 1;
  onGround: boolean;
  isDucking: boolean;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  invuln: number;
  shieldActive: boolean;
  shieldBreakTimer: number;
  slashCooldown: number;
  slashTimer: number;
  shotCooldown: number;
  dashCooldown: number;
  dashTimer: number;
  slashPowerMult: number;
  shotPowerMult: number;
  shotSpeedMult: number;
  energyRegenMult: number;
  dashCooldownMult: number;
  shieldEfficiency: number;
  combo: number;
  comboTimer: number;
  score: number;
}

interface Enemy {
  id: number;
  type: EnemyType;
  isBoss: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  onGround: boolean;
  attackCooldown: number;
  aiTimer: number;
  sine: number;
  contactDamage: number;
  worth: number;
  hitFlash: number;
}

interface Projectile {
  id: number;
  owner: "player" | "enemy";
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  ttl: number;
  damage: number;
  color: string;
}

interface Pickup {
  id: number;
  type: PickupType;
  x: number;
  y: number;
  vy: number;
  r: number;
  ttl: number;
}

interface Effect {
  id: number;
  type: EffectType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  ttl: number;
  text?: string;
}

interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  tone: "ally" | "warning" | "myth";
  holdSec?: number;
}

interface StageDialogueScript {
  intro: Omit<DialogueLine, "id">[];
  midpoint: Omit<DialogueLine, "id">[];
  boss: Omit<DialogueLine, "id">[];
  clear: Omit<DialogueLine, "id">[];
}

interface NarrativeFlags {
  intro: boolean;
  midpoint: boolean;
  boss: boolean;
  clear: boolean;
}

interface GameState {
  mode: GameMode;
  stageIndex: number;
  sublevelIndex: number;
  sublevelElapsed: number;
  stageDistance: number;
  totalDistance: number;
  elapsedSec: number;
  totalExperience: number;
  experience: number;
  level: number;
  xpToNextLevel: number;
  pendingUpgradeCount: number;
  relics: number;
  threadFragments: number;
  narrativeTitle: string;
  lastEvent: string;
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
  pickups: Pickup[];
  effects: Effect[];
  spawnTimer: number;
  bossSpawned: boolean;
  bossDefeated: boolean;
  bossIntroTimer: number;
  pendingUpgrades: UpgradeOption[];
  narrativeFlags: NarrativeFlags;
  dialogQueue: DialogueLine[];
  activeDialogue: DialogueLine | null;
  dialogTimer: number;
  chronicle: string[];
  cameraX: number;
  screenShake: number;
  hitStop: number;
  fullscreen: boolean;
  nextEnemyId: number;
  nextProjectileId: number;
  nextPickupId: number;
  nextEffectId: number;
}

interface UpgradeOption {
  id: UpgradeId;
  title: string;
  description: string;
}

interface EnemyTemplate {
  w: number;
  h: number;
  hp: number;
  speed: number;
  flying: boolean;
  contactDamage: number;
  worth: number;
}

interface SpriteSet {
  idle: HTMLCanvasElement[];
  run: HTMLCanvasElement[];
  jump: HTMLCanvasElement[];
  crouch: HTMLCanvasElement[];
  slash: HTMLCanvasElement[];
  dash: HTMLCanvasElement[];
  hurt: HTMLCanvasElement[];
}

interface SpriteLibrary {
  player: SpriteSet;
  enemies: Record<EnemyType, HTMLCanvasElement[]>;
}

declare global {
  interface Window {
    render_game_to_text?: () => string;
    advanceTime?: (ms: number) => void;
  }
}

const WIDTH = 960;
const HEIGHT = 540;
const FIXED_DT = 1 / 60;
const GROUND_Y = 430;
const GRAVITY = 1800;
const PLAYER_MOVE_SPEED = 226;
const PLAYER_JUMP_SPEED = 680;
const PLAYER_DASH_SPEED = 520;
const AUTO_SCROLL_SPEED = 34;
const CONTROL_CODES = {
  left: "KeyA",
  right: "KeyD",
  jump: "KeyW",
  duck: "KeyS",
  shield: "ArrowDown",
  slash: "ArrowLeft",
  shot: "ArrowUp",
  dash: "ArrowRight",
  start: "Enter",
  retry: "KeyR",
  fullscreen: "KeyF",
} as const;
const BLOCK_BROWSER_CODES = new Set<string>([
  CONTROL_CODES.slash,
  CONTROL_CODES.shot,
  CONTROL_CODES.dash,
  CONTROL_CODES.shield,
]);

function normalizeInputCode(event: KeyboardEvent): string {
  if (event.code) {
    return event.code;
  }

  const key = event.key.toLowerCase();
  if (key === " " || key === "space" || key === "spacebar") {
    return "Space";
  }
  if (key === "arrowleft" || key === "left") {
    return "ArrowLeft";
  }
  if (key === "arrowright" || key === "right") {
    return "ArrowRight";
  }
  if (key === "arrowup" || key === "up") {
    return "ArrowUp";
  }
  if (key === "arrowdown" || key === "down") {
    return "ArrowDown";
  }
  if (key === "a") {
    return "KeyA";
  }
  if (key === "w") {
    return "KeyW";
  }
  if (key === "d") {
    return "KeyD";
  }
  if (key === "s") {
    return "KeyS";
  }
  if (key === "b") {
    return "KeyB";
  }
  if (key === "f") {
    return "KeyF";
  }
  if (key === "r") {
    return "KeyR";
  }
  if (key === "enter") {
    return "Enter";
  }
  return key;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

const SUBLEVEL_COUNT = 5;
const BOSS_SUBLEVEL_INDEX = SUBLEVEL_COUNT - 1;
const BOSS_LANE_MIN_SEC = 60;
const PLAYER_STAND_HEIGHT = 84;
const PLAYER_DUCK_HEIGHT = 58;
const WEAPON_TIERS = ["Pilgrim Edge", "Cedar Edge", "Sun Conduit", "Frost Arc", "Mythbreaker"];
const SHOT_COLORS = ["#9ee8ff", "#b3f3ff", "#ffd7a7", "#d8ecff", "#ffc6ff"];
const UPGRADE_CATALOG: UpgradeOption[] = [
  {
    id: "vital",
    title: "Vital Sigil",
    description: "+24 max HP and instant heal.",
  },
  {
    id: "capacitor",
    title: "Conduit Capacitor",
    description: "+22 max energy and regen boost.",
  },
  {
    id: "edge",
    title: "Edge Temper",
    description: "Slash damage and reach increase.",
  },
  {
    id: "flux",
    title: "Flux Lens",
    description: "Shot damage and projectile speed increase.",
  },
  {
    id: "phase",
    title: "Phase Coil",
    description: "Dash cooldown decreases.",
  },
  {
    id: "aegis",
    title: "Aegis Field",
    description: "Shield drains less energy and blocks harder.",
  },
];

function stageSublevelDuration(stage: StageConfig, sublevelIndex: number): number {
  return stage.sublevelDurations[clamp(sublevelIndex, 0, SUBLEVEL_COUNT - 1)] ?? 75;
}

function stageProgressRatio(game: GameState, stage: StageConfig): number {
  const duration = stageSublevelDuration(stage, game.sublevelIndex);
  const local = clamp(game.sublevelElapsed / duration, 0, 1);
  return clamp((game.sublevelIndex + local) / SUBLEVEL_COUNT, 0, 1);
}

function sublevelProgressRatio(game: GameState, stage: StageConfig): number {
  const duration = stageSublevelDuration(stage, game.sublevelIndex);
  return clamp(game.sublevelElapsed / duration, 0, 1);
}

function enemyPoolForSublevel(stage: StageConfig, sublevelIndex: number): EnemyType[] {
  const unlockedCount = Math.min(stage.enemyPool.length, Math.max(1, sublevelIndex + 1));
  return stage.enemyPool.slice(0, unlockedCount);
}

function weaponTierIndex(game: GameState): number {
  return clamp(Math.floor((game.level - 1) / 2), 0, WEAPON_TIERS.length - 1);
}

function slashDamageForTier(tier: number, boss: boolean): number {
  const base = boss ? 22 : 32;
  return Math.round(base * (1 + tier * 0.16));
}

function shotDamageForTier(tier: number): number {
  return Math.round(24 * (1 + tier * 0.18));
}

function shotCooldownForTier(tier: number): number {
  return Math.max(0.17, 0.32 - tier * 0.03);
}

function upgradeChoicesForLevel(level: number): UpgradeOption[] {
  const picks: UpgradeOption[] = [];
  const start = (Math.max(1, level) - 1) % UPGRADE_CATALOG.length;
  for (let i = 0; i < 3; i += 1) {
    const option = UPGRADE_CATALOG[(start + i) % UPGRADE_CATALOG.length];
    if (option) {
      picks.push(option);
    }
  }
  return picks;
}

function maybeOpenUpgradeMenu(game: GameState) {
  if (game.pendingUpgradeCount <= 0 || game.mode !== "playing" || game.pendingUpgrades.length > 0) {
    return;
  }
  game.pendingUpgradeCount -= 1;
  game.pendingUpgrades = upgradeChoicesForLevel(game.level);
  game.mode = "upgrade";
  game.lastEvent = `Rank ${game.level} reached. Choose enhancement.`;
}

function grantExperience(game: GameState, amount: number, source: string, x?: number, y?: number) {
  if (amount <= 0) {
    return;
  }

  game.totalExperience += amount;
  game.experience += amount;
  if (typeof x === "number" && typeof y === "number") {
    addEffect(game, "damageText", x, y, "#a9ecff", 12, 0.78, 0, -40, `+${amount} XP`);
  }
  while (game.experience >= game.xpToNextLevel) {
    game.experience -= game.xpToNextLevel;
    game.level += 1;
    game.pendingUpgradeCount += 1;
    game.xpToNextLevel = Math.round(game.xpToNextLevel * 1.24 + 18);
    pushChronicle(game, `Rank ${game.level} reached from ${source}.`);
  }

  if (game.mode === "playing" && game.bossIntroTimer <= 0) {
    maybeOpenUpgradeMenu(game);
  }
}

function getSlashHitbox(player: Player): { x: number; y: number; w: number; h: number } {
  const reach = 96;
  const x = player.facing === 1 ? player.x + player.w * 0.5 : player.x - player.w * 0.5 - reach;
  const y = player.y - player.h + 8;
  return {
    x,
    y,
    w: reach,
    h: player.h - 4,
  };
}

function applyUpgrade(game: GameState, option: UpgradeOption) {
  const player = game.player;
  if (option.id === "vital") {
    player.maxHp += 24;
    player.hp = clamp(player.hp + 34, 0, player.maxHp);
  } else if (option.id === "capacitor") {
    player.maxEnergy += 22;
    player.energy = clamp(player.energy + 30, 0, player.maxEnergy);
    player.energyRegenMult = clamp(player.energyRegenMult + 0.12, 1, 2);
  } else if (option.id === "edge") {
    player.slashPowerMult = clamp(player.slashPowerMult + 0.2, 1, 2.4);
  } else if (option.id === "flux") {
    player.shotPowerMult = clamp(player.shotPowerMult + 0.2, 1, 2.4);
    player.shotSpeedMult = clamp(player.shotSpeedMult + 0.12, 1, 2.2);
  } else if (option.id === "phase") {
    player.dashCooldownMult = clamp(player.dashCooldownMult - 0.1, 0.45, 1);
  } else {
    player.shieldEfficiency = clamp(player.shieldEfficiency + 0.2, 1, 2.6);
  }

  pushChronicle(game, `Enhancement selected: ${option.title}.`);
  game.lastEvent = `${option.title} integrated.`;
}

const STAGES: StageConfig[] = [
  {
    title: "Epoch 01 - The Wandering Spirit",
    subtitle: "Liminal cedar valleys and spectral currents.",
    length: 3420,
    sublevelDurations: [72, 74, 78, 82, 96],
    skyA: "#1a2f5e",
    skyB: "#28518b",
    haze: "#5e8ec8",
    mountains: "#243e73",
    forest: "#2f6d61",
    groundA: "#2a2f58",
    groundB: "#1a2245",
    accent: "#a9cdff",
    enemyPool: ["deer", "monkey"],
    bossType: "guardian",
    bossName: "Torii Warden Akakaze",
    bossTitle: "Gatekeeper of the Cedar Threshold",
    bossThreatLine: "A stone sentinel seals the liminal crossing.",
    motif: "cedarGate",
    sublevels: [
      "Cedar Verge",
      "Spirit Brook",
      "Gate Ruins",
      "Storm Approach",
      "Akakaze Threshold",
    ],
  },
  {
    title: "Epoch 02 - Incarnated As Jesus In Egypt",
    subtitle: "River fields, heat shimmer, and temple wards.",
    length: 3640,
    sublevelDurations: [74, 78, 82, 86, 102],
    skyA: "#593327",
    skyB: "#965338",
    haze: "#d78756",
    mountains: "#744736",
    forest: "#668748",
    groundA: "#5d4539",
    groundB: "#3f2b22",
    accent: "#ffd7a7",
    enemyPool: ["deer", "boar", "monkey"],
    bossType: "serpent",
    bossName: "Serpent of the Sun Court",
    bossTitle: "Temple Coil of Incarnate Trial",
    bossThreatLine: "The Nile temple ward hunts every oath you carry.",
    motif: "riverPillars",
    sublevels: [
      "River Flats",
      "Dust Orchard",
      "Temple Outskirts",
      "Sun Court Walls",
      "Serpent Sanctuary",
    ],
  },
  {
    title: "Epoch 03 - Eastward Journey Toward Aomori",
    subtitle: "Cold passes, broken maps, and whiteout spirits.",
    length: 3920,
    sublevelDurations: [78, 82, 86, 92, 108],
    skyA: "#253847",
    skyB: "#3f6688",
    haze: "#84aacd",
    mountains: "#30526d",
    forest: "#477064",
    groundA: "#36506a",
    groundB: "#23384d",
    accent: "#d8ecff",
    enemyPool: ["boar", "monkey", "wraith"],
    bossType: "oni",
    bossName: "Blizzard Oni Kuroyuki",
    bossTitle: "Whiteout Tyrant of the Eastward Pass",
    bossThreatLine: "A winter warlord blocks the final mountain route.",
    motif: "snowPass",
    sublevels: [
      "Windbreak Pass",
      "Broken Waystones",
      "Ice Switchback",
      "Whiteout Ridge",
      "Kuroyuki Fortress",
    ],
  },
  {
    title: "Epoch 04 - Life In Aomori",
    subtitle: "Lush northern fields, shrine winds, storm light.",
    length: 3580,
    sublevelDurations: [76, 80, 86, 92, 110],
    skyA: "#37295f",
    skyB: "#5c3f92",
    haze: "#8e75c7",
    mountains: "#473776",
    forest: "#549167",
    groundA: "#473a71",
    groundB: "#31254f",
    accent: "#e8dcff",
    enemyPool: ["deer", "boar", "monkey", "wraith"],
    bossType: "dragon",
    bossName: "Ryujin of Aomori Storm",
    bossTitle: "Conduit Dragon of the Northern Fields",
    bossThreatLine: "The final guardian tests whether memory can remain human.",
    motif: "shrineVillage",
    sublevels: [
      "Village Edge",
      "Rice Terraces",
      "Shrine Road",
      "Storm Courtyard",
      "Ryujin Gate",
    ],
  },
];

const NARRATIVE_TITLE = "THE MEMORY THREAD";

const STAGE_DIALOGUES: StageDialogueScript[] = [
  {
    intro: [
      {
        speaker: "Keeper",
        text: "Before flesh, you are only witness. Carry the first memory fragment.",
        tone: "myth",
      },
      {
        speaker: "Wanderer",
        text: "I can see every life below me, but I still cannot feel one heartbeat from inside.",
        tone: "ally",
      },
    ],
    midpoint: [
      {
        speaker: "Isukiri",
        text: "The thread wakes in the cedar static. Stay moving and it will answer.",
        tone: "ally",
      },
    ],
    boss: [
      {
        speaker: "Akakaze",
        text: "No crossing without burden. Prove you can carry memory into flesh.",
        tone: "warning",
      },
    ],
    clear: [
      {
        speaker: "Keeper",
        text: "First fragment secured. Egypt waits, and pain will give the thread a voice.",
        tone: "myth",
      },
    ],
  },
  {
    intro: [
      {
        speaker: "Keeper",
        text: "Now you are embodied in Egypt. Hunger, heat, and fear will write themselves into you.",
        tone: "myth",
      },
      {
        speaker: "Wanderer",
        text: "Every wound stays. Every kindness stays. Nothing is abstract anymore.",
        tone: "ally",
      },
    ],
    midpoint: [
      {
        speaker: "Isukiri",
        text: "Belief can cage you faster than chains. Keep the thread moving east.",
        tone: "warning",
      },
    ],
    boss: [
      {
        speaker: "Sun Court Serpent",
        text: "Your body belongs to this story now. Leave and you leave blood behind.",
        tone: "warning",
      },
    ],
    clear: [
      {
        speaker: "Keeper",
        text: "Second fragment secured. Turn north-east and walk until the maps begin to fail.",
        tone: "myth",
      },
    ],
  },
  {
    intro: [
      {
        speaker: "Keeper",
        text: "Desert becomes ice. Empire becomes silence. Keep the third fragment alive.",
        tone: "myth",
      },
      {
        speaker: "Wanderer",
        text: "I carry human memory now, and each mile makes it heavier.",
        tone: "ally",
      },
    ],
    midpoint: [
      {
        speaker: "Isukiri",
        text: "When the storm erases direction, follow the thread and not the horizon.",
        tone: "ally",
      },
    ],
    boss: [
      {
        speaker: "Kuroyuki",
        text: "You crossed too far to turn back. Let winter keep your name.",
        tone: "warning",
      },
    ],
    clear: [
      {
        speaker: "Keeper",
        text: "Third fragment secured. Aomori is close enough to remember you back.",
        tone: "myth",
      },
    ],
  },
  {
    intro: [
      {
        speaker: "Village Elder",
        text: "You arrived in Aomori as a stranger carrying weather in your eyes.",
        tone: "ally",
      },
      {
        speaker: "Keeper",
        text: "One final fragment. Keep memory and body joined until the thread seals.",
        tone: "myth",
      },
    ],
    midpoint: [
      {
        speaker: "Wanderer",
        text: "For the first time, this place feels less like a destination and more like a home.",
        tone: "ally",
      },
    ],
    boss: [
      {
        speaker: "Ryujin",
        text: "If memory survives your final fear, the gate will remain open.",
        tone: "warning",
      },
    ],
    clear: [
      {
        speaker: "Keeper",
        text: "Fourth fragment secured. The Memory Thread closes, and the canon begins again.",
        tone: "myth",
      },
    ],
  },
];

function isFullscreenActive(): boolean {
  return typeof document !== "undefined" && Boolean(document.fullscreenElement);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function rectsOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function circleRectOverlap(
  cx: number,
  cy: number,
  r: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): boolean {
  const closestX = clamp(cx, rx, rx + rw);
  const closestY = clamp(cy, ry, ry + rh);
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy <= r * r;
}

function createPlayer(): Player {
  return {
    x: 220,
    y: GROUND_Y,
    vx: 0,
    vy: 0,
    w: 46,
    h: PLAYER_STAND_HEIGHT,
    facing: 1,
    onGround: true,
    isDucking: false,
    hp: 150,
    maxHp: 150,
    energy: 100,
    maxEnergy: 100,
    invuln: 0,
    shieldActive: false,
    shieldBreakTimer: 0,
    slashCooldown: 0,
    slashTimer: 0,
    shotCooldown: 0,
    dashCooldown: 0,
    dashTimer: 0,
    slashPowerMult: 1,
    shotPowerMult: 1,
    shotSpeedMult: 1,
    energyRegenMult: 1,
    dashCooldownMult: 1,
    shieldEfficiency: 1,
    combo: 0,
    comboTimer: 0,
    score: 0,
  };
}

function createNarrativeFlags(): NarrativeFlags {
  return {
    intro: false,
    midpoint: false,
    boss: false,
    clear: false,
  };
}

function pushChronicle(game: GameState, entry: string) {
  game.chronicle.push(entry);
  if (game.chronicle.length > 8) {
    game.chronicle = game.chronicle.slice(game.chronicle.length - 8);
  }
}

function dialogueDuration(line: DialogueLine): number {
  if (line.holdSec) {
    return line.holdSec;
  }
  return clamp(2.8 + line.text.length * 0.028, 2.8, 7.6);
}

function advanceDialogue(game: GameState) {
  const next = game.dialogQueue.shift() ?? null;
  game.activeDialogue = next;
  game.dialogTimer = next ? dialogueDuration(next) : 0;
}

function queueDialogue(game: GameState, lines: Omit<DialogueLine, "id">[]) {
  const stamped = lines.map((line, index) => ({
    ...line,
    id: `${game.stageIndex}-${game.elapsedSec.toFixed(2)}-${index}-${game.nextEffectId + index}`,
  }));
  game.dialogQueue.push(...stamped);
  if (!game.activeDialogue) {
    advanceDialogue(game);
  }
}

function queueStageBeat(game: GameState, beat: DialogueBeat) {
  const script = STAGE_DIALOGUES[game.stageIndex];
  if (!script) {
    return;
  }
  queueDialogue(game, script[beat]);
}

function updateDialogue(game: GameState, dt: number) {
  if (!game.activeDialogue) {
    if (game.dialogQueue.length > 0) {
      advanceDialogue(game);
    }
    return;
  }

  game.dialogTimer -= dt;
  if (game.dialogTimer <= 0) {
    advanceDialogue(game);
  }
}

function createMenuState(): GameState {
  return {
    mode: "menu",
    stageIndex: 0,
    sublevelIndex: 0,
    sublevelElapsed: 0,
    stageDistance: 0,
    totalDistance: 0,
    elapsedSec: 0,
    totalExperience: 0,
    experience: 0,
    level: 1,
    xpToNextLevel: 140,
    pendingUpgradeCount: 0,
    relics: 0,
    threadFragments: 0,
    narrativeTitle: NARRATIVE_TITLE,
    lastEvent: "Channel the canon and begin the crossing.",
    player: createPlayer(),
    enemies: [],
    projectiles: [],
    pickups: [],
    effects: [],
    spawnTimer: 1.2,
    bossSpawned: false,
    bossDefeated: false,
    bossIntroTimer: 0,
    pendingUpgrades: [],
    narrativeFlags: createNarrativeFlags(),
    dialogQueue: [],
    activeDialogue: null,
    dialogTimer: 0,
    chronicle: [],
    cameraX: 0,
    screenShake: 0,
    hitStop: 0,
    fullscreen: isFullscreenActive(),
    nextEnemyId: 1,
    nextProjectileId: 1,
    nextPickupId: 1,
    nextEffectId: 1,
  };
}

function createPlayingState(): GameState {
  const state = createMenuState();
  state.mode = "playing";
  state.narrativeFlags.intro = true;
  pushChronicle(state, `Epoch 01 opened: The Wandering Spirit.`);
  pushChronicle(state, `Lane 1/5: ${STAGES[0].sublevels[0]}.`);
  queueStageBeat(state, "intro");
  return state;
}

function enemyTemplate(type: EnemyType): EnemyTemplate {
  if (type === "deer") {
    return { w: 44, h: 38, hp: 38, speed: 142, flying: false, contactDamage: 12, worth: 42 };
  }
  if (type === "boar") {
    return { w: 56, h: 40, hp: 62, speed: 108, flying: false, contactDamage: 14, worth: 56 };
  }
  if (type === "monkey") {
    return { w: 40, h: 48, hp: 40, speed: 124, flying: false, contactDamage: 11, worth: 46 };
  }
  if (type === "wraith") {
    return { w: 42, h: 42, hp: 36, speed: 122, flying: true, contactDamage: 10, worth: 52 };
  }
  if (type === "guardian") {
    return { w: 94, h: 102, hp: 340, speed: 82, flying: false, contactDamage: 18, worth: 320 };
  }
  if (type === "serpent") {
    return { w: 108, h: 74, hp: 380, speed: 90, flying: true, contactDamage: 18, worth: 360 };
  }
  if (type === "oni") {
    return { w: 98, h: 110, hp: 430, speed: 94, flying: false, contactDamage: 20, worth: 400 };
  }
  return { w: 120, h: 88, hp: 520, speed: 102, flying: true, contactDamage: 22, worth: 500 };
}

function makeSprite(
  width: number,
  height: number,
  painter: (ctx: CanvasRenderingContext2D, width: number, height: number) => void,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return canvas;
  }
  ctx.imageSmoothingEnabled = false;
  painter(ctx, width, height);
  return canvas;
}

function drawPlayerFrame(
  legOffset: number,
  cloakShift: number,
  sword: boolean,
  dash: boolean,
  hurt: boolean,
): HTMLCanvasElement {
  return makeSprite(24, 42, (ctx) => {
    const body = hurt ? "#c36f6f" : "#9f3b35";
    const bodyDark = hurt ? "#7f3535" : "#5f211f";
    const skin = "#f0dcc0";

    ctx.fillStyle = skin;
    ctx.fillRect(10, 4, 6, 6);

    ctx.fillStyle = "#cfcbc6";
    ctx.fillRect(9, 10, 8, 7);

    ctx.fillStyle = body;
    ctx.fillRect(7, 17, 10, 12);
    ctx.fillStyle = bodyDark;
    ctx.fillRect(8, 18, 8, 9);

    ctx.fillStyle = "#6a2f87";
    ctx.fillRect(17 + cloakShift, 15, 5, 13);

    ctx.fillStyle = "#d9c167";
    ctx.fillRect(8, 29 + legOffset, 3, 10);
    ctx.fillRect(13, 29 - legOffset, 3, 10);

    if (dash) {
      ctx.fillStyle = "#9fe7ff";
      ctx.fillRect(1, 16, 6, 10);
      ctx.fillRect(0, 18, 5, 8);
    }

    if (sword) {
      ctx.fillStyle = "#e6f7ff";
      ctx.fillRect(18, 18, 6, 2);
      ctx.fillStyle = "#8ec2e6";
      ctx.fillRect(20, 16, 3, 6);
    }
  });
}

function drawPlayerCrouchFrame(cloakShift: number, sword: boolean, hurt: boolean): HTMLCanvasElement {
  return makeSprite(24, 30, (ctx) => {
    const body = hurt ? "#c36f6f" : "#9f3b35";
    const bodyDark = hurt ? "#7f3535" : "#5f211f";
    const skin = "#f0dcc0";

    ctx.fillStyle = skin;
    ctx.fillRect(9, 6, 7, 5);

    ctx.fillStyle = "#cfcbc6";
    ctx.fillRect(8, 11, 9, 5);

    ctx.fillStyle = body;
    ctx.fillRect(7, 16, 12, 8);
    ctx.fillStyle = bodyDark;
    ctx.fillRect(8, 17, 10, 6);

    ctx.fillStyle = "#6a2f87";
    ctx.fillRect(17 + cloakShift, 14, 5, 9);

    ctx.fillStyle = "#d9c167";
    ctx.fillRect(8, 24, 5, 4);
    ctx.fillRect(14, 24, 5, 4);

    if (sword) {
      ctx.fillStyle = "#e6f7ff";
      ctx.fillRect(18, 18, 6, 2);
      ctx.fillStyle = "#8ec2e6";
      ctx.fillRect(20, 16, 3, 4);
    }
  });
}

function drawEnemyFrame(type: EnemyType, hop: number, boss: boolean): HTMLCanvasElement {
  return makeSprite(32, 32, (ctx) => {
    const palette =
      type === "deer"
        ? { body: "#c8a17a", shade: "#71523b", eye: "#fff4e5", accent: "#e7c9a8" }
        : type === "boar"
          ? { body: "#906b4f", shade: "#3e2b1e", eye: "#ffd8be", accent: "#bc926d" }
          : type === "monkey"
            ? { body: "#d4b087", shade: "#6f5033", eye: "#fff4e0", accent: "#f0d3af" }
            : type === "wraith"
              ? { body: "#b8afff", shade: "#4a438d", eye: "#fff3ff", accent: "#d9d4ff" }
              : type === "guardian"
                ? { body: "#ccb37f", shade: "#5b4a29", eye: "#fff2d0", accent: "#f0dcae" }
                : type === "serpent"
                  ? { body: "#ddb07a", shade: "#744f2f", eye: "#fff3df", accent: "#f3c997" }
                  : type === "oni"
                    ? { body: "#bf5f62", shade: "#5f2528", eye: "#ffe8e8", accent: "#ef9a9f" }
                    : { body: "#c38ee2", shade: "#5d3078", eye: "#fef0ff", accent: "#e7bfff" };

    const y = 8 + hop;

    if (!boss) {
      if (type === "deer") {
        ctx.fillStyle = palette.body;
        ctx.fillRect(7, y + 7, 18, 11);
        ctx.fillStyle = palette.shade;
        ctx.fillRect(10, y + 9, 12, 7);
        ctx.fillStyle = palette.accent;
        ctx.fillRect(22, y + 5, 6, 7);
        ctx.fillStyle = palette.eye;
        ctx.fillRect(25, y + 7, 2, 2);
        ctx.fillStyle = "#dfc392";
        ctx.fillRect(24, y + 2, 1, 3);
        ctx.fillRect(26, y + 1, 1, 4);
        ctx.fillStyle = "#9e7b58";
        ctx.fillRect(11, y + 18, 2, 6);
        ctx.fillRect(16, y + 18, 2, 6);
      } else if (type === "boar") {
        ctx.fillStyle = palette.body;
        ctx.fillRect(6, y + 9, 20, 10);
        ctx.fillStyle = palette.shade;
        ctx.fillRect(9, y + 11, 14, 6);
        ctx.fillStyle = palette.accent;
        ctx.fillRect(23, y + 10, 6, 6);
        ctx.fillStyle = "#f6e4d1";
        ctx.fillRect(27, y + 13, 2, 1);
        ctx.fillRect(27, y + 15, 2, 1);
        ctx.fillStyle = palette.eye;
        ctx.fillRect(24, y + 11, 2, 2);
        ctx.fillStyle = "#5a3f2c";
        ctx.fillRect(11, y + 19, 3, 5);
        ctx.fillRect(17, y + 19, 3, 5);
      } else if (type === "monkey") {
        ctx.fillStyle = palette.body;
        ctx.fillRect(9, y + 5, 13, 14);
        ctx.fillStyle = palette.shade;
        ctx.fillRect(11, y + 8, 9, 9);
        ctx.fillStyle = palette.accent;
        ctx.fillRect(20, y + 6, 7, 8);
        ctx.fillStyle = palette.eye;
        ctx.fillRect(22, y + 8, 2, 2);
        ctx.fillStyle = "#7f5f40";
        ctx.fillRect(10, y + 19, 4, 5);
        ctx.fillRect(16, y + 19, 4, 5);
        ctx.fillRect(23, y + 14, 4, 2);
      } else {
        ctx.fillStyle = palette.body;
        ctx.fillRect(8, y + 6, 14, 13);
        ctx.fillRect(6, y + 19, 18, 5);
        ctx.fillStyle = palette.shade;
        ctx.fillRect(10, y + 9, 10, 8);
        ctx.fillStyle = palette.eye;
        ctx.fillRect(18, y + 11, 3, 2);
        ctx.fillStyle = "rgba(239,228,207,0.3)";
        ctx.fillRect(12, y + 5, 6, 2);
      }
      return;
    }

    if (type === "guardian") {
      ctx.fillStyle = palette.body;
      ctx.fillRect(6, 8 + hop, 20, 18);
      ctx.fillStyle = palette.shade;
      ctx.fillRect(9, 11 + hop, 14, 12);
      ctx.fillStyle = palette.accent;
      ctx.fillRect(11, 5 + hop, 10, 6);
      ctx.fillStyle = "#3d3121";
      ctx.fillRect(13, 12 + hop, 6, 6);
      ctx.fillStyle = palette.eye;
      ctx.fillRect(14, 13 + hop, 2, 1);
      ctx.fillRect(17, 13 + hop, 2, 1);
      ctx.fillStyle = "#f4d89b";
      ctx.fillRect(8, 5 + hop, 3, 3);
      ctx.fillRect(21, 5 + hop, 3, 3);
      ctx.fillStyle = "#81663f";
      ctx.fillRect(8, 26 + hop, 5, 3);
      ctx.fillRect(19, 26 + hop, 5, 3);
    } else if (type === "serpent") {
      ctx.fillStyle = palette.body;
      ctx.fillRect(4, 18 + hop, 24, 8);
      ctx.fillRect(8, 12 + hop, 16, 6);
      ctx.fillRect(12, 6 + hop, 12, 6);
      ctx.fillStyle = palette.shade;
      ctx.fillRect(7, 20 + hop, 18, 4);
      ctx.fillRect(11, 14 + hop, 11, 3);
      ctx.fillStyle = palette.accent;
      ctx.fillRect(22, 7 + hop, 6, 6);
      ctx.fillStyle = palette.eye;
      ctx.fillRect(25, 9 + hop, 2, 2);
      ctx.fillStyle = "#f6dfbf";
      ctx.fillRect(27, 11 + hop, 3, 1);
      for (let x = 6; x <= 24; x += 4) {
        ctx.fillStyle = x % 8 === 0 ? "#7b5636" : "#9b6d47";
        ctx.fillRect(x, 22 + hop, 2, 2);
      }
    } else if (type === "oni") {
      ctx.fillStyle = palette.body;
      ctx.fillRect(7, 7 + hop, 18, 19);
      ctx.fillStyle = palette.shade;
      ctx.fillRect(10, 10 + hop, 12, 12);
      ctx.fillStyle = palette.accent;
      ctx.fillRect(10, 4 + hop, 4, 4);
      ctx.fillRect(19, 4 + hop, 4, 4);
      ctx.fillStyle = "#2a1215";
      ctx.fillRect(13, 12 + hop, 6, 6);
      ctx.fillStyle = palette.eye;
      ctx.fillRect(14, 13 + hop, 2, 1);
      ctx.fillRect(17, 13 + hop, 2, 1);
      ctx.fillStyle = "#6f2f31";
      ctx.fillRect(4, 16 + hop, 4, 12);
      ctx.fillStyle = "#c9ab6a";
      ctx.fillRect(4, 15 + hop, 4, 2);
      ctx.fillStyle = "#5b2528";
      ctx.fillRect(9, 26 + hop, 4, 3);
      ctx.fillRect(18, 26 + hop, 4, 3);
    } else {
      ctx.fillStyle = palette.body;
      ctx.fillRect(8, 11 + hop, 18, 10);
      ctx.fillRect(10, 6 + hop, 14, 6);
      ctx.fillStyle = palette.shade;
      ctx.fillRect(11, 13 + hop, 12, 6);
      ctx.fillStyle = palette.accent;
      ctx.fillRect(22, 8 + hop, 7, 5);
      ctx.fillStyle = palette.eye;
      ctx.fillRect(25, 9 + hop, 2, 2);
      ctx.fillStyle = "#f7dfbe";
      ctx.fillRect(28, 12 + hop, 3, 1);
      ctx.fillStyle = "#8d5da9";
      ctx.fillRect(5, 9 + hop, 4, 12);
      ctx.fillRect(6, 12 + hop, 3, 5);
      ctx.fillRect(12, 21 + hop, 10, 3);
      ctx.fillStyle = "#6d3f87";
      ctx.fillRect(5, 10 + hop, 2, 8);
      ctx.fillRect(4, 16 + hop, 2, 2);
    }
  });
}

function buildSprites(): SpriteLibrary {
  const player: SpriteSet = {
    idle: [drawPlayerFrame(0, 0, false, false, false), drawPlayerFrame(1, 0, false, false, false)],
    run: [
      drawPlayerFrame(2, 0, false, false, false),
      drawPlayerFrame(-2, 1, false, false, false),
      drawPlayerFrame(1, -1, false, false, false),
      drawPlayerFrame(-1, 0, false, false, false),
    ],
    jump: [drawPlayerFrame(-2, 0, false, false, false), drawPlayerFrame(-1, 1, false, false, false)],
    crouch: [drawPlayerCrouchFrame(0, false, false), drawPlayerCrouchFrame(1, false, false)],
    slash: [drawPlayerFrame(0, 0, true, false, false), drawPlayerFrame(1, 0, true, false, false)],
    dash: [drawPlayerFrame(0, 1, false, true, false), drawPlayerFrame(0, -1, false, true, false)],
    hurt: [drawPlayerFrame(0, 0, false, false, true), drawPlayerFrame(1, 0, false, false, true)],
  };

  const enemies: Record<EnemyType, HTMLCanvasElement[]> = {
    deer: [drawEnemyFrame("deer", 0, false), drawEnemyFrame("deer", 1, false)],
    boar: [drawEnemyFrame("boar", 0, false), drawEnemyFrame("boar", 1, false)],
    monkey: [drawEnemyFrame("monkey", 0, false), drawEnemyFrame("monkey", -1, false)],
    wraith: [drawEnemyFrame("wraith", -1, false), drawEnemyFrame("wraith", 1, false)],
    guardian: [drawEnemyFrame("guardian", 0, true), drawEnemyFrame("guardian", 1, true)],
    serpent: [drawEnemyFrame("serpent", 0, true), drawEnemyFrame("serpent", 1, true)],
    oni: [drawEnemyFrame("oni", 0, true), drawEnemyFrame("oni", 1, true)],
    dragon: [drawEnemyFrame("dragon", 0, true), drawEnemyFrame("dragon", 1, true)],
  };

  return { player, enemies };
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: HTMLCanvasElement,
  x: number,
  y: number,
  w: number,
  h: number,
  flip: boolean,
  alpha = 1,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  if (flip) {
    ctx.translate(x + w * 0.5, y);
    ctx.scale(-1, 1);
    ctx.drawImage(sprite, -w * 0.5, 0, w, h);
  } else {
    ctx.drawImage(sprite, x, y, w, h);
  }
  ctx.restore();
}

function addEffect(
  game: GameState,
  type: EffectType,
  x: number,
  y: number,
  color: string,
  size: number,
  ttl: number,
  vx = 0,
  vy = 0,
  text?: string,
) {
  game.effects.push({
    id: game.nextEffectId,
    type,
    x,
    y,
    vx,
    vy,
    size,
    color,
    ttl,
    text,
  });
  game.nextEffectId += 1;
}

function spawnProjectile(
  game: GameState,
  owner: "player" | "enemy",
  x: number,
  y: number,
  vx: number,
  vy: number,
  damage: number,
  color: string,
  r = 6,
  ttl = 2,
) {
  game.projectiles.push({
    id: game.nextProjectileId,
    owner,
    x,
    y,
    vx,
    vy,
    r,
    ttl,
    damage,
    color,
  });
  game.nextProjectileId += 1;
}

function spawnPickup(game: GameState, type: PickupType, x: number, y: number) {
  game.pickups.push({
    id: game.nextPickupId,
    type,
    x,
    y,
    vy: rand(-240, -170),
    r: type === "relic" ? 11 : 9,
    ttl: 10,
  });
  game.nextPickupId += 1;
}

function spawnEnemy(game: GameState, forcedType?: EnemyType, isBoss = false) {
  const stage = STAGES[game.stageIndex];
  const unlockedPool = enemyPoolForSublevel(stage, game.sublevelIndex);
  const type = forcedType ?? unlockedPool[Math.floor(Math.random() * unlockedPool.length)];
  const template = enemyTemplate(type);
  const sublevelScale = 1 + game.sublevelIndex * 0.18 + game.stageIndex * 0.04;
  const hp = isBoss ? template.hp : Math.round(template.hp * sublevelScale);
  const speed = isBoss ? template.speed : template.speed * (1 + game.sublevelIndex * 0.07);
  const contactDamage = isBoss ? template.contactDamage : template.contactDamage + Math.floor(game.sublevelIndex * 1.2);
  const worth = isBoss ? template.worth : Math.round(template.worth * (1 + game.sublevelIndex * 0.14));

  const spawnX = game.cameraX + WIDTH * 0.75 + rand(80, 220);
  const spawnY = template.flying ? rand(218, 340) : GROUND_Y;

  game.enemies.push({
    id: game.nextEnemyId,
    type,
    isBoss,
    x: spawnX,
    y: spawnY,
    vx: -speed,
    vy: 0,
    w: template.w,
    h: template.h,
    hp,
    maxHp: hp,
    onGround: !template.flying,
    attackCooldown: isBoss ? 0.8 : rand(0.7, 1.7),
    aiTimer: rand(0.8, 1.6),
    sine: rand(0, Math.PI * 2),
    contactDamage,
    worth,
    hitFlash: 0,
  });

  game.nextEnemyId += 1;
}

function applyDamageToPlayer(game: GameState, damage: number, sourceX: number) {
  const player = game.player;
  if (player.invuln > 0 || game.mode !== "playing") {
    return;
  }

  const shieldRatio = player.shieldActive ? clamp(0.48 - (player.shieldEfficiency - 1) * 0.16, 0.2, 0.48) : 1;
  const actualDamage = Math.max(1, Math.round(damage * shieldRatio));
  player.hp = Math.max(0, player.hp - actualDamage);
  player.invuln = 0.84;
  player.combo = 0;
  player.comboTimer = 0;
  player.vx += (sourceX > player.x ? -200 : 200) * (player.shieldActive ? 0.4 : 1);
  player.vy = player.shieldActive ? -190 : -340;
  if (player.shieldActive) {
    player.energy = clamp(player.energy - 10 / player.shieldEfficiency, 0, player.maxEnergy);
    addEffect(game, "spark", player.x + (sourceX > player.x ? 26 : -26), player.y - player.h * 0.58, "#9fe7ff", 18, 0.17);
  }

  game.hitStop = Math.max(game.hitStop, 0.05);
  game.screenShake = Math.max(game.screenShake, 0.3);
  addEffect(game, "burst", player.x, player.y - player.h * 0.65, "#ff9ea8", 34, 0.25);
  addEffect(game, "damageText", player.x, player.y - player.h - 12, "#ffd2da", 12, 0.7, 0, -44, `-${actualDamage}`);
  game.lastEvent = player.shieldActive ? `Shielded hit -${actualDamage} HP` : `Hit taken -${actualDamage} HP`;

  if (player.hp <= 0) {
    game.mode = "failed";
    game.lastEvent = "The vessel falls before the myth completes.";
  }
}

function rewardHit(game: GameState, value: number) {
  const player = game.player;
  player.combo += 1;
  player.comboTimer = 2.5;
  player.score += value + Math.min(220, player.combo * 5);
  player.energy = clamp(player.energy + 5.8, 0, player.maxEnergy);
}

function maybeDropLoot(game: GameState, enemy: Enemy) {
  const roll = Math.random();
  if (enemy.isBoss) {
    spawnPickup(game, "relic", enemy.x, enemy.y - enemy.h * 0.5);
    spawnPickup(game, "energy", enemy.x - 18, enemy.y - enemy.h * 0.5);
    spawnPickup(game, "health", enemy.x + 18, enemy.y - enemy.h * 0.5);
    return;
  }

  if (roll < 0.24) {
    spawnPickup(game, "health", enemy.x, enemy.y - enemy.h * 0.4);
  } else if (roll < 0.54) {
    spawnPickup(game, "energy", enemy.x, enemy.y - enemy.h * 0.4);
  } else if (roll > 0.95) {
    spawnPickup(game, "relic", enemy.x, enemy.y - enemy.h * 0.4);
  }
}

function applyDamageToEnemy(game: GameState, enemy: Enemy, damage: number): boolean {
  const stage = STAGES[game.stageIndex];
  enemy.hp -= damage;
  enemy.hitFlash = 0.12;

  game.hitStop = Math.max(game.hitStop, enemy.isBoss ? 0.06 : 0.035);
  addEffect(game, "spark", enemy.x, enemy.y - enemy.h * 0.56, "#ffdeae", 16, 0.18);

  if (enemy.hp > 0) {
    rewardHit(game, Math.ceil(enemy.worth * 0.26));
    return false;
  }

  rewardHit(game, enemy.worth);
  const xp = enemy.isBoss ? Math.round(enemy.worth * 0.9) : Math.round(enemy.worth * 0.55);
  grantExperience(game, xp, enemy.type, enemy.x, enemy.y - enemy.h);
  game.screenShake = Math.max(game.screenShake, enemy.isBoss ? 0.5 : 0.24);
  addEffect(game, "burst", enemy.x, enemy.y - enemy.h * 0.5, "#ffe9b8", enemy.isBoss ? 56 : 34, 0.3);
  addEffect(game, "damageText", enemy.x, enemy.y - enemy.h, "#fff4db", 14, 0.9, 0, -58, `${enemy.worth}`);
  game.lastEvent = enemy.isBoss ? `${stage.bossName.toUpperCase()} defeated.` : `${enemy.type.toUpperCase()} purged.`;
  maybeDropLoot(game, enemy);
  return true;
}

function trySlash(game: GameState) {
  const player = game.player;
  if (game.mode !== "playing" || player.slashCooldown > 0 || player.energy < 7 || player.shieldActive) {
    return;
  }
  const tier = weaponTierIndex(game);

  player.energy -= 7;
  player.slashCooldown = Math.max(0.16, 0.24 - tier * 0.015);
  player.slashTimer = 0.14;

  const slashBox = getSlashHitbox(player);

  let hits = 0;
  const survivors: Enemy[] = [];
  for (const enemy of game.enemies) {
    const ex = enemy.x - enemy.w * 0.5;
    const ey = enemy.y - enemy.h;
    if (rectsOverlap(slashBox.x, slashBox.y, slashBox.w, slashBox.h, ex, ey, enemy.w, enemy.h)) {
      const damage = Math.round(slashDamageForTier(tier, enemy.isBoss) * player.slashPowerMult);
      const dead = applyDamageToEnemy(game, enemy, damage);
      hits += 1;
      if (!dead) {
        survivors.push(enemy);
      }
    } else {
      survivors.push(enemy);
    }
  }
  game.enemies = survivors;

  const arcX = player.facing === 1 ? player.x + 46 : player.x - 46;
  addEffect(game, "trail", arcX, player.y - 42, SHOT_COLORS[tier], 48, 0.14, player.facing * 20, 0);
  if (hits === 0) {
    game.lastEvent = "Spirit blade cuts only wind.";
  }
}

function tryShoot(game: GameState) {
  const player = game.player;
  if (game.mode !== "playing" || player.shotCooldown > 0 || player.energy < 12 || player.shieldActive) {
    return;
  }
  const tier = weaponTierIndex(game);

  player.energy -= 12;
  player.shotCooldown = shotCooldownForTier(tier);

  const dir = player.facing;
  const color = SHOT_COLORS[tier];
  spawnProjectile(
    game,
    "player",
    player.x + dir * 30,
    player.y - 42,
    dir * (590 + tier * 18) * player.shotSpeedMult,
    0,
    Math.round(shotDamageForTier(tier) * player.shotPowerMult),
    color,
    7,
    1.55,
  );
  addEffect(game, "spark", player.x + dir * 28, player.y - 42, color, 14, 0.14);
  game.lastEvent = "Conduit shot released.";
}

function tryDash(game: GameState) {
  const player = game.player;
  if (game.mode !== "playing" || player.dashCooldown > 0 || player.energy < 18 || player.isDucking) {
    return;
  }

  player.energy -= 18;
  player.dashCooldown = 1.1 * player.dashCooldownMult;
  player.dashTimer = 0.2;
  player.invuln = Math.max(player.invuln, 0.3);
  player.vx = player.facing * PLAYER_DASH_SPEED;

  addEffect(game, "trail", player.x - player.facing * 24, player.y - 40, "#c5f0ff", 40, 0.2, -player.facing * 80, 0);
  game.lastEvent = "Phase dash engaged.";
}

function advanceToNextStage(game: GameState) {
  game.stageIndex += 1;
  game.sublevelIndex = 0;
  game.sublevelElapsed = 0;
  game.stageDistance = 0;
  game.mode = "playing";
  game.enemies = [];
  game.projectiles = [];
  game.pickups = [];
  game.effects = [];
  game.spawnTimer = 1.1;
  game.bossSpawned = false;
  game.bossDefeated = false;
  game.bossIntroTimer = 0;
  game.pendingUpgrades = [];
  game.narrativeFlags = createNarrativeFlags();
  game.narrativeFlags.intro = true;
  game.dialogQueue = [];
  game.activeDialogue = null;
  game.dialogTimer = 0;
  game.screenShake = 0;
  game.hitStop = 0;

  const player = game.player;
  player.x = 220;
  player.y = GROUND_Y;
  player.vx = 0;
  player.vy = 0;
  player.h = PLAYER_STAND_HEIGHT;
  player.isDucking = false;
  player.shieldActive = false;
  player.shieldBreakTimer = 0;
  player.onGround = true;
  player.hp = clamp(player.hp + 36, 0, player.maxHp);
  player.energy = clamp(player.energy + 30, 0, player.maxEnergy);
  player.invuln = 0;
  player.combo = 0;
  player.comboTimer = 0;

  pushChronicle(game, `Epoch ${String(game.stageIndex + 1).padStart(2, "0")} opened: ${STAGES[game.stageIndex].title}.`);
  pushChronicle(game, `Lane 1/5: ${STAGES[game.stageIndex].sublevels[0]}.`);
  queueStageBeat(game, "intro");
  game.lastEvent = `Entering ${STAGES[game.stageIndex].title}.`;
}

function updateEnemyAI(game: GameState, enemy: Enemy, dt: number) {
  const player = game.player;
  const paceScale = 0.72 + Math.min(0.26, game.sublevelIndex * 0.065);
  enemy.aiTimer -= dt;
  enemy.attackCooldown -= dt;
  enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);

  if (enemy.type === "deer") {
    const charge = enemy.aiTimer > 0;
    const base = 120 + game.stageIndex * 10;
    enemy.vx = -(charge ? base + 110 : base) * paceScale;
    if (enemy.aiTimer <= 0 && enemy.x > player.x + 140) {
      enemy.aiTimer = rand(0.9, 1.4);
    }
  } else if (enemy.type === "boar") {
    enemy.vx = -(92 + game.stageIndex * 9) * paceScale;
  } else if (enemy.type === "monkey") {
    enemy.vx = -(112 + game.stageIndex * 7) * paceScale;
    if (enemy.onGround && enemy.aiTimer <= 0) {
      enemy.vy = -rand(470, 560);
      enemy.onGround = false;
      enemy.aiTimer = rand(0.9, 1.5);
    }
  } else if (enemy.type === "wraith") {
    enemy.vx = -(106 + game.stageIndex * 8) * paceScale;
    enemy.y += Math.sin(game.elapsedSec * 5 + enemy.sine) * 72 * dt;
    if (enemy.attackCooldown <= 0 && Math.abs(enemy.x - player.x) < 330) {
      const dx = player.x - enemy.x;
      const dy = player.y - 42 - enemy.y;
      const len = Math.hypot(dx, dy) || 1;
      const speed = 240 + game.sublevelIndex * 14;
      spawnProjectile(
        game,
        "enemy",
        enemy.x,
        enemy.y,
        (dx / len) * speed + rand(-46, 46),
        (dy / len) * speed + rand(-52, 52),
        10 + Math.floor(game.sublevelIndex * 0.5),
        "#ffadca",
        5,
        2.4,
      );
      enemy.attackCooldown = rand(1.9, 3.2);
    }
  } else if (enemy.type === "guardian") {
    const anchor = game.cameraX + WIDTH * 0.68;
    const drift = enemy.x > anchor ? -1 : enemy.x < anchor - 86 ? 1 : 0;
    enemy.vx = drift * 92;
    if (enemy.attackCooldown <= 0) {
      const dir = player.x < enemy.x ? -1 : 1;
      spawnProjectile(
        game,
        "enemy",
        enemy.x + dir * 24,
        enemy.y - 58,
        dir * rand(250, 350),
        rand(-78, 42),
        15 + Math.floor(game.sublevelIndex * 0.7),
        "#ffd39d",
        7,
        2.1,
      );
      enemy.attackCooldown = rand(1.1, 1.55);
    }
  } else if (enemy.type === "serpent") {
    const anchor = game.cameraX + WIDTH * 0.7;
    const drift = enemy.x > anchor ? -1 : enemy.x < anchor - 74 ? 1 : 0;
    enemy.vx = drift * 96;
    enemy.y = 252 + Math.sin(game.elapsedSec * 2.5 + enemy.sine) * 74;
    if (enemy.attackCooldown <= 0) {
      const spread = [-0.24, 0, 0.24];
      for (const off of spread) {
        spawnProjectile(
          game,
          "enemy",
          enemy.x - 8,
          enemy.y,
          -rand(244, 306),
          (off + rand(-0.09, 0.09)) * rand(250, 330),
          13 + Math.floor(game.sublevelIndex * 0.8),
          "#ffd7aa",
          6,
          2.5,
        );
      }
      enemy.attackCooldown = rand(1.4, 1.85);
    }
  } else if (enemy.type === "oni") {
    if (enemy.aiTimer <= 0) {
      enemy.aiTimer = rand(0.8, 1.3);
      enemy.vx = -rand(300, 360);
    } else {
      enemy.vx = -144;
    }
    if (enemy.attackCooldown <= 0) {
      spawnProjectile(
        game,
        "enemy",
        enemy.x - 28,
        enemy.y - 60,
        -rand(186, 274),
        -rand(34, 150),
        16 + Math.floor(game.sublevelIndex * 0.9),
        "#ff9aa8",
        7,
        2.4,
      );
      enemy.attackCooldown = rand(1.65, 2.15);
    }
  } else if (enemy.type === "dragon") {
    const anchor = game.cameraX + WIDTH * 0.74;
    const drift = enemy.x > anchor ? -1 : enemy.x < anchor - 82 ? 1 : 0;
    enemy.vx = drift * 106;
    enemy.y = 222 + Math.sin(game.elapsedSec * 2.2 + enemy.sine) * 88;
    if (enemy.attackCooldown <= 0) {
      const spread = [-0.3, -0.1, 0.1, 0.3];
      for (const off of spread) {
        spawnProjectile(
          game,
          "enemy",
          enemy.x - 22,
          enemy.y - 10,
          -rand(284, 338),
          (off + rand(-0.12, 0.12)) * rand(210, 300),
          15 + Math.floor(game.sublevelIndex * 1.1),
          "#ffc27e",
          7,
          2.4,
        );
      }
      enemy.attackCooldown = rand(1.2, 1.6);
    }
  }

  const template = enemyTemplate(enemy.type);
  if (!template.flying) {
    enemy.vy += GRAVITY * dt;
    enemy.y += enemy.vy * dt;
    if (enemy.y >= GROUND_Y) {
      enemy.y = GROUND_Y;
      enemy.vy = 0;
      enemy.onGround = true;
    } else {
      enemy.onGround = false;
    }
  }

  enemy.x += enemy.vx * dt;
}

function updatePlaying(
  game: GameState,
  dt: number,
  keys: Set<string>,
  jumpJustPressed: boolean,
  duckDown: boolean,
  shieldDown: boolean,
) {
  const stage = STAGES[game.stageIndex];
  const player = game.player;
  const weaponTier = weaponTierIndex(game);

  game.elapsedSec += dt;
  game.screenShake = Math.max(0, game.screenShake - dt * 1.8);
  player.invuln = Math.max(0, player.invuln - dt);
  player.slashCooldown = Math.max(0, player.slashCooldown - dt);
  player.shotCooldown = Math.max(0, player.shotCooldown - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
  player.slashTimer = Math.max(0, player.slashTimer - dt);
  player.dashTimer = Math.max(0, player.dashTimer - dt);
  player.shieldBreakTimer = Math.max(0, player.shieldBreakTimer - dt);
  player.comboTimer = Math.max(0, player.comboTimer - dt);
  if (player.comboTimer <= 0) {
    player.combo = 0;
  }

  player.energy = clamp(player.energy + dt * 15 * player.energyRegenMult, 0, player.maxEnergy);

  const wantsDuck = duckDown && player.onGround && player.dashTimer <= 0;
  if (wantsDuck !== player.isDucking) {
    player.isDucking = wantsDuck;
    player.h = wantsDuck ? PLAYER_DUCK_HEIGHT : PLAYER_STAND_HEIGHT;
    if (wantsDuck) {
      player.vx = 0;
      game.lastEvent = "Ducking under incoming fire.";
    }
  }

  const wantsShield = shieldDown && player.shieldBreakTimer <= 0 && player.energy > 0;
  player.shieldActive = wantsShield && player.dashTimer <= 0;
  if (player.shieldActive) {
    const drain = (22 * dt) / player.shieldEfficiency;
    player.energy = clamp(player.energy - drain, 0, player.maxEnergy);
    if (player.energy <= 0) {
      player.shieldActive = false;
      player.shieldBreakTimer = 0.8;
      game.lastEvent = "Shield overextended. Recharge required.";
    }
  }

  const left = keys.has(CONTROL_CODES.left);
  const right = keys.has(CONTROL_CODES.right);
  const move = player.isDucking ? 0 : (right ? 1 : 0) - (left ? 1 : 0);

  if (move !== 0) {
    player.facing = move > 0 ? 1 : -1;
  }

  if (player.dashTimer > 0) {
    player.vx = player.facing * PLAYER_DASH_SPEED;
    if (Math.random() < 0.62) {
      addEffect(game, "trail", player.x - player.facing * 22, player.y - 44, "#c6ecff", 26, 0.16, -player.facing * 60, 0);
    }
  } else {
    const shieldSlow = player.shieldActive ? 0.58 : 1;
    player.vx = move * PLAYER_MOVE_SPEED * shieldSlow;
  }

  if (jumpJustPressed && player.onGround && !player.isDucking) {
    player.vy = -PLAYER_JUMP_SPEED;
    player.onGround = false;
    addEffect(game, "spark", player.x, player.y - 8, "#d7ecff", 14, 0.14, 0, -70);
  }

  player.vy += GRAVITY * dt;

  const baseForward = AUTO_SCROLL_SPEED + Math.max(0, move) * 24 + Math.min(32, player.combo * 1.8);
  player.x += (player.vx + baseForward) * dt;
  player.x = clamp(player.x, 80, stage.length + 260);

  player.y += player.vy * dt;
  if (player.y >= GROUND_Y) {
    player.y = GROUND_Y;
    player.vy = 0;
    player.onGround = true;
  }

  const targetCamera = player.x - 220;
  game.cameraX = lerp(game.cameraX, targetCamera, 0.12);

  game.sublevelElapsed += dt;
  const currentSublevelDuration = stageSublevelDuration(stage, game.sublevelIndex);
  if (game.sublevelIndex < BOSS_SUBLEVEL_INDEX && game.sublevelElapsed >= currentSublevelDuration) {
    game.sublevelIndex += 1;
    game.sublevelElapsed = 0;
    const label = stage.sublevels[game.sublevelIndex];
    pushChronicle(game, `Lane ${game.sublevelIndex + 1}/5: ${label}.`);
    game.lastEvent = `Lane ${game.sublevelIndex + 1} reached: ${label}.`;
    queueDialogue(game, [
      {
        speaker: "Keeper",
        text: `Sublevel ${game.sublevelIndex + 1} opens: ${label}. Pressure is rising.`,
        tone: "myth",
        holdSec: 2.4,
      },
    ]);
  }

  game.stageDistance = stage.length * stageProgressRatio(game, stage);
  game.totalDistance += baseForward * dt;

  if (!game.narrativeFlags.midpoint && stageProgressRatio(game, stage) >= 0.45) {
    game.narrativeFlags.midpoint = true;
    pushChronicle(game, `Midpoint crossed in ${stage.title}.`);
    queueStageBeat(game, "midpoint");
  }

  if (!game.bossSpawned) {
    if (game.sublevelIndex < BOSS_SUBLEVEL_INDEX) {
      game.spawnTimer -= dt;
      if (game.spawnTimer <= 0) {
        spawnEnemy(game);
        const stagePressure = stageProgressRatio(game, stage);
        const levelPressure = game.sublevelIndex / BOSS_SUBLEVEL_INDEX;
        game.spawnTimer = rand(1.15, 2.3) - stagePressure * 0.18 - levelPressure * 0.22;
      }
    } else if (game.sublevelElapsed < BOSS_LANE_MIN_SEC) {
      game.spawnTimer -= dt;
      if (game.spawnTimer <= 0) {
        spawnEnemy(game);
        if (Math.random() < 0.24) {
          spawnEnemy(game, stage.enemyPool[stage.enemyPool.length - 1]);
        }
        game.spawnTimer = rand(1.1, 2.2);
      }
    } else {
      game.bossSpawned = true;
      game.bossIntroTimer = 1.5;
      game.enemies = game.enemies.filter((enemy) => enemy.isBoss);
      spawnEnemy(game, stage.bossType, true);
      if (!game.narrativeFlags.boss) {
        game.narrativeFlags.boss = true;
        pushChronicle(game, `Boss encountered: ${stage.bossName}.`);
        queueStageBeat(game, "boss");
      }
      game.lastEvent = `${stage.bossName} enters the field.`;
    }
  }

  if (game.bossIntroTimer > 0) {
    game.bossIntroTimer = Math.max(0, game.bossIntroTimer - dt);
  }

  const pauseCombat = game.bossIntroTimer > 0;

  const enemySurvivors: Enemy[] = [];
  for (const enemy of game.enemies) {
    if (!pauseCombat) {
      updateEnemyAI(game, enemy, dt);
    } else {
      enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
    }

    const ex = enemy.x - enemy.w * 0.5;
    const ey = enemy.y - enemy.h;
    const px = player.x - player.w * 0.5;
    const py = player.y - player.h;

    if (!pauseCombat && rectsOverlap(ex, ey, enemy.w, enemy.h, px, py, player.w, player.h)) {
      applyDamageToPlayer(game, enemy.contactDamage, enemy.x);
    }

    if (!enemy.isBoss && enemy.x < game.cameraX - 220) {
      continue;
    }
    enemySurvivors.push(enemy);
  }
  game.enemies = enemySurvivors;

  const projectileSurvivors: Projectile[] = [];
  for (const projectile of game.projectiles) {
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.ttl -= dt;

    let consumed = false;

    if (!pauseCombat && projectile.owner === "player") {
      const nextEnemies: Enemy[] = [];
      for (const enemy of game.enemies) {
        const ex = enemy.x - enemy.w * 0.5;
        const ey = enemy.y - enemy.h;
        if (!consumed && circleRectOverlap(projectile.x, projectile.y, projectile.r, ex, ey, enemy.w, enemy.h)) {
          const dead = applyDamageToEnemy(game, enemy, projectile.damage);
          consumed = true;
          if (!dead) {
            nextEnemies.push(enemy);
          }
        } else {
          nextEnemies.push(enemy);
        }
      }
      game.enemies = nextEnemies;
    } else if (!pauseCombat && projectile.owner === "enemy") {
      const slashBox = getSlashHitbox(player);
      const canDeflect = player.slashTimer > 0;
      if (
        canDeflect &&
        circleRectOverlap(projectile.x, projectile.y, projectile.r, slashBox.x, slashBox.y, slashBox.w, slashBox.h)
      ) {
        projectile.owner = "player";
        projectile.vx = player.facing * Math.max(420, Math.abs(projectile.vx) + 140) * player.shotSpeedMult;
        projectile.vy = projectile.vy * 0.45 + rand(-72, 72);
        projectile.color = SHOT_COLORS[weaponTier];
        projectile.damage = Math.round(projectile.damage * (1.2 + weaponTier * 0.12) * player.shotPowerMult);
        projectile.ttl = Math.max(projectile.ttl, 1.2);
        addEffect(game, "spark", projectile.x, projectile.y, "#fff0b8", 18, 0.14);
        game.lastEvent = "Projectile deflected.";
      }
      const px = player.x - player.w * 0.5;
      const py = player.y - player.h;
      if (
        projectile.owner === "enemy" &&
        circleRectOverlap(projectile.x, projectile.y, projectile.r, px, py, player.w, player.h)
      ) {
        applyDamageToPlayer(game, projectile.damage, projectile.x);
        consumed = true;
      }
    }

    if (
      consumed ||
      projectile.ttl <= 0 ||
      projectile.x < game.cameraX - 260 ||
      projectile.x > game.cameraX + WIDTH + 260 ||
      projectile.y < -120 ||
      projectile.y > HEIGHT + 120
    ) {
      continue;
    }

    projectileSurvivors.push(projectile);
  }
  game.projectiles = projectileSurvivors;

  const pickupSurvivors: Pickup[] = [];
  for (const pickup of game.pickups) {
    pickup.ttl -= dt;
    pickup.vy += GRAVITY * dt * 0.5;
    pickup.y += pickup.vy * dt;

    if (pickup.y >= GROUND_Y - 4) {
      pickup.y = GROUND_Y - 4;
      pickup.vy *= -0.35;
    }

    const px = player.x - player.w * 0.5;
    const py = player.y - player.h;
    if (circleRectOverlap(pickup.x, pickup.y, pickup.r, px, py, player.w, player.h)) {
      if (pickup.type === "health") {
        player.hp = clamp(player.hp + 24, 0, player.maxHp);
        grantExperience(game, 18, "health relic", pickup.x, pickup.y - 8);
        game.lastEvent = "Herbal relic recovered.";
      } else if (pickup.type === "energy") {
        player.energy = clamp(player.energy + 28, 0, player.maxEnergy);
        grantExperience(game, 16, "conduit charge", pickup.x, pickup.y - 8);
        game.lastEvent = "Conduit charge restored.";
      } else {
        game.relics += 1;
        player.score += 150;
        grantExperience(game, 60, "rare relic", pickup.x, pickup.y - 8);
        game.lastEvent = "Rare relic fragment secured.";
        pushChronicle(game, `Relic ${game.relics} recovered in ${stage.title}.`);
        if (game.relics % 2 === 1) {
          queueDialogue(game, [
            {
              speaker: "Keeper",
              text: "Another fragment resonates. The Memory Thread holds.",
              tone: "myth",
            },
          ]);
        }
      }
      addEffect(game, "burst", pickup.x, pickup.y, "#fff1c1", 22, 0.17);
      continue;
    }

    if (pickup.ttl <= 0 || pickup.x < game.cameraX - 220) {
      continue;
    }
    pickupSurvivors.push(pickup);
  }
  game.pickups = pickupSurvivors;

  const effectSurvivors: Effect[] = [];
  for (const effect of game.effects) {
    effect.ttl -= dt;
    effect.x += effect.vx * dt;
    effect.y += effect.vy * dt;

    if (effect.type === "trail") {
      effect.size *= 0.98;
    }

    if (effect.ttl > 0) {
      effectSurvivors.push(effect);
    }
  }
  game.effects = effectSurvivors;

  if (game.bossSpawned) {
    const boss = game.enemies.find((enemy) => enemy.isBoss);
    if (!boss && !game.bossDefeated) {
      game.bossDefeated = true;
      if (!game.narrativeFlags.clear) {
        game.narrativeFlags.clear = true;
        game.threadFragments = Math.min(4, game.threadFragments + 1);
        pushChronicle(game, `Fragment ${game.threadFragments} secured after ${stage.title}.`);
        queueStageBeat(game, "clear");
      }
      if (game.stageIndex >= STAGES.length - 1) {
        game.mode = "victory";
        game.lastEvent = "Aomori endures. The four-epoch crossing is complete.";
      } else {
        game.mode = "stageClear";
        game.lastEvent = `${stage.title} cleared.`;
      }
    }
  }
}

function drawParallaxLayer(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  color: string,
  baseY: number,
  widthStep: number,
  minHeight: number,
  maxHeight: number,
  factor: number,
) {
  const offset = cameraX * factor;
  for (let i = -3; i < 18; i += 1) {
    const x = i * widthStep - (offset % widthStep);
    const seed = ((i * 19) % 10) / 9;
    const h = minHeight + seed * (maxHeight - minHeight);
    ctx.fillStyle = color;
    ctx.fillRect(x, baseY - h, widthStep * 0.78, h);
  }
}

function drawStageMotif(ctx: CanvasRenderingContext2D, game: GameState, stage: StageConfig) {
  const motifOffset = game.cameraX * 0.42;

  if (stage.motif === "cedarGate") {
    for (let i = -2; i < 11; i += 1) {
      const x = i * 236 - (motifOffset % 236);
      const y = GROUND_Y - 6;
      ctx.fillStyle = "#384e7f";
      ctx.fillRect(x + 26, y - 62, 8, 62);
      ctx.fillRect(x + 88, y - 62, 8, 62);
      ctx.fillRect(x + 16, y - 66, 92, 6);
      ctx.fillRect(x + 20, y - 72, 84, 4);
      ctx.fillStyle = "rgba(169,205,255,0.22)";
      ctx.fillRect(x + 18, y - 70, 88, 2);
    }
    return;
  }

  if (stage.motif === "riverPillars") {
    for (let i = -2; i < 14; i += 1) {
      const x = i * 174 - (motifOffset % 174);
      const y = GROUND_Y - 4;
      ctx.fillStyle = "#845642";
      ctx.fillRect(x + 30, y - 58, 16, 58);
      ctx.fillStyle = "#a77554";
      ctx.fillRect(x + 32, y - 54, 12, 50);
      ctx.fillStyle = "#cf965f";
      ctx.fillRect(x + 26, y - 61, 24, 4);
      ctx.fillStyle = "#5e7f49";
      ctx.fillRect(x + 58, y - 32, 4, 32);
      ctx.fillRect(x + 64, y - 22, 3, 22);
    }
    return;
  }

  if (stage.motif === "snowPass") {
    for (let i = -2; i < 13; i += 1) {
      const x = i * 190 - (motifOffset % 190);
      const y = GROUND_Y - 5;
      ctx.fillStyle = "#2f536f";
      ctx.fillRect(x + 22, y - 46, 6, 46);
      ctx.fillRect(x + 42, y - 58, 7, 58);
      ctx.fillStyle = "#3f6889";
      ctx.fillRect(x + 16, y - 36, 18, 7);
      ctx.fillRect(x + 35, y - 43, 21, 8);
      ctx.fillRect(x + 30, y - 56, 22, 8);
      ctx.fillStyle = "#d8ecff";
      ctx.fillRect(x + 16, y - 36, 18, 2);
      ctx.fillRect(x + 35, y - 43, 21, 2);
      ctx.fillRect(x + 30, y - 56, 22, 2);
    }
    return;
  }

  for (let i = -2; i < 12; i += 1) {
    const x = i * 214 - (motifOffset % 214);
    const y = GROUND_Y - 6;
    ctx.fillStyle = "#4f3d7b";
    ctx.fillRect(x + 28, y - 32, 66, 32);
    ctx.fillStyle = "#6f5a9f";
    ctx.fillRect(x + 22, y - 40, 78, 10);
    ctx.fillRect(x + 24, y - 46, 74, 4);
    ctx.fillStyle = "#e8dcff";
    ctx.fillRect(x + 54, y - 24, 6, 24);
    ctx.fillStyle = "#f6cc7a";
    ctx.fillRect(x + 112, y - 24, 6, 10);
  }
}

function drawSublevelAtmosphere(ctx: CanvasRenderingContext2D, game: GameState, stage: StageConfig) {
  const lv = game.sublevelIndex;

  if (lv >= 1) {
    const alpha = 0.05 + lv * 0.015;
    ctx.fillStyle = `rgba(239,228,207,${alpha})`;
    ctx.fillRect(0, 154, WIDTH, 24);
  }

  if (lv >= 2) {
    for (let i = 0; i < 24; i += 1) {
      const x = (i * 47 + game.cameraX * 0.6) % (WIDTH + 50);
      const y = 170 + ((i * 29) % 130);
      ctx.fillStyle = "rgba(232,212,77,0.16)";
      ctx.fillRect(x, y, 2, 2);
    }
  }

  if (lv >= 3) {
    for (let i = 0; i < 9; i += 1) {
      const x = ((i * 122) - (game.cameraX * 0.35)) % (WIDTH + 90);
      ctx.fillStyle = "rgba(255,120,140,0.14)";
      ctx.fillRect(x, GROUND_Y - 72, 20, 4);
      ctx.fillStyle = stage.accent;
      ctx.fillRect(x + 7, GROUND_Y - 68, 6, 3);
    }
  }

  if (lv === BOSS_SUBLEVEL_INDEX) {
    ctx.fillStyle = "rgba(8, 6, 24, 0.24)";
    ctx.fillRect(0, 120, WIDTH, HEIGHT - 120);
  }
}

function drawBackground(ctx: CanvasRenderingContext2D, game: GameState) {
  const stage = STAGES[game.stageIndex];

  for (let y = 0; y < HEIGHT; y += 8) {
    const t = y / HEIGHT;
    ctx.fillStyle = t < 0.5 ? stage.skyA : stage.skyB;
    if (y % 16 === 0) {
      ctx.fillStyle = stage.skyB;
    }
    ctx.fillRect(0, y, WIDTH, 8);
  }

  drawParallaxLayer(ctx, game.cameraX, stage.mountains, 336, 176, 68, 150, 0.15);
  drawParallaxLayer(ctx, game.cameraX, stage.haze, 370, 124, 54, 128, 0.32);
  drawParallaxLayer(ctx, game.cameraX, stage.forest, 412, 88, 28, 94, 0.58);

  const horizonShift = game.cameraX * 0.24;
  for (let i = -3; i < 26; i += 1) {
    const x = i * 68 - (horizonShift % 68);
    const glow = 8 + ((i * 13) % 4) * 3;
    ctx.fillStyle = "rgba(239,228,207,0.08)";
    ctx.fillRect(x + 24, 180 + ((i * 7) % 3) * 2, glow, 2);
  }

  ctx.fillStyle = stage.groundA;
  ctx.fillRect(0, GROUND_Y + 1, WIDTH, HEIGHT - GROUND_Y);

  for (let y = GROUND_Y + 6; y < HEIGHT; y += 10) {
    ctx.fillStyle = y % 20 === 0 ? stage.groundB : stage.groundA;
    ctx.fillRect(0, y, WIDTH, 6);
  }

  const tileSize = 32;
  const tileOffset = game.cameraX % tileSize;
  for (let x = -tileSize; x < WIDTH + tileSize; x += tileSize) {
    ctx.fillStyle = stage.groundB;
    ctx.fillRect(x - tileOffset, GROUND_Y - 2, 18, 4);
  }

  const nearOffset = game.cameraX * 0.9;
  for (let i = -4; i < 28; i += 1) {
    const x = i * 70 - (nearOffset % 70);
    const h = 14 + ((i * 5) % 4) * 6;
    ctx.fillStyle = stage.forest;
    ctx.fillRect(x + 10, GROUND_Y - h, 4, h);
    ctx.fillRect(x + 4, GROUND_Y - Math.floor(h * 0.55), 3, 9);
    ctx.fillRect(x + 15, GROUND_Y - Math.floor(h * 0.5), 3, 9);
  }

  drawStageMotif(ctx, game, stage);
  drawSublevelAtmosphere(ctx, game, stage);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let i = 0; i < 6; i += 1) {
    const waveY = 150 + i * 22;
    ctx.fillRect(0, waveY, WIDTH, 2);
  }

  const fogAlpha = stage.title.includes("Egypt") ? 0.12 : stage.title.includes("Eastward") ? 0.09 : 0.06;
  ctx.fillStyle = `rgba(239,228,207,${fogAlpha})`;
  ctx.fillRect(0, 118, WIDTH, 60);
}

function drawPlayer(ctx: CanvasRenderingContext2D, game: GameState, sprites: SpriteLibrary) {
  const player = game.player;

  let frames: HTMLCanvasElement[];
  if (player.invuln > 0.12) {
    frames = sprites.player.hurt;
  } else if (player.isDucking && player.onGround && player.slashTimer <= 0) {
    frames = sprites.player.crouch;
  } else if (player.slashTimer > 0) {
    frames = sprites.player.slash;
  } else if (player.dashTimer > 0) {
    frames = sprites.player.dash;
  } else if (!player.onGround) {
    frames = sprites.player.jump;
  } else if (Math.abs(player.vx) > 12) {
    frames = sprites.player.run;
  } else {
    frames = sprites.player.idle;
  }

  const frameIndex = Math.floor(game.elapsedSec * 10) % frames.length;
  const sprite = frames[frameIndex];

  const left = player.x - player.w * 0.5;
  const top = player.y - player.h;

  const flicker = player.invuln > 0 && Math.floor(player.invuln * 20) % 2 === 0;
  if (!flicker) {
    drawSprite(ctx, sprite, left, top, player.w, player.h, player.facing === -1, 1);
  }

  if (player.shieldActive) {
    ctx.strokeStyle = "rgba(159,231,255,0.88)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(player.x, player.y - player.h * 0.56, 32, 38, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(159,231,255,0.2)";
    ctx.beginPath();
    ctx.ellipse(player.x, player.y - player.h * 0.56, 30, 36, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (player.slashTimer > 0) {
    ctx.strokeStyle = "#ffe39d";
    ctx.lineWidth = 4;
    ctx.beginPath();
    const slashCenterY = player.y - Math.min(42, player.h * 0.55);
    if (player.facing === 1) {
      ctx.arc(player.x + 42, slashCenterY, 34, -0.9, 0.85);
    } else {
      ctx.arc(player.x - 42, slashCenterY, 34, 2.3, 4.05);
    }
    ctx.stroke();
  }
}

function drawEnemy(ctx: CanvasRenderingContext2D, game: GameState, enemy: Enemy, sprites: SpriteLibrary) {
  const frames = sprites.enemies[enemy.type];
  const frame = frames[Math.floor(game.elapsedSec * 8 + enemy.id) % frames.length];

  const left = enemy.x - enemy.w * 0.5;
  const top = enemy.y - enemy.h;

  drawSprite(ctx, frame, left, top, enemy.w, enemy.h, enemy.vx > 0, 1);

  if (enemy.hitFlash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${clamp(enemy.hitFlash * 6, 0, 0.7)})`;
    ctx.fillRect(left, top, enemy.w, enemy.h);
  }

  if (enemy.isBoss) {
    ctx.fillStyle = "#efe4cf";
    ctx.font = "700 11px 'Courier New', monospace";
    ctx.textAlign = "center";
    const bossTag = STAGES[game.stageIndex].bossName.split(" ")[0] ?? "BOSS";
    ctx.fillText(bossTag.toUpperCase(), enemy.x, top - 8);
    ctx.textAlign = "left";
  }
}

function drawProjectile(ctx: CanvasRenderingContext2D, projectile: Projectile) {
  const glow = projectile.owner === "player" ? "rgba(158,232,255,0.34)" : "rgba(255,156,184,0.34)";
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, projectile.r + 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = projectile.color;
  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, projectile.r, 0, Math.PI * 2);
  ctx.fill();
}

function drawPickup(ctx: CanvasRenderingContext2D, pickup: Pickup) {
  const left = pickup.x - pickup.r;
  const top = pickup.y - pickup.r;

  const palette =
    pickup.type === "health"
      ? { a: "#ff9c9c", b: "#7a2f2f", t: "H" }
      : pickup.type === "energy"
        ? { a: "#94ddff", b: "#2f5978", t: "E" }
        : { a: "#ffe2a2", b: "#7a612a", t: "R" };

  ctx.fillStyle = palette.a;
  ctx.fillRect(left, top, pickup.r * 2, pickup.r * 2);
  ctx.fillStyle = palette.b;
  ctx.fillRect(left + 3, top + 3, pickup.r * 2 - 6, pickup.r * 2 - 6);
  ctx.fillStyle = "#efe4cf";
  ctx.font = "700 9px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText(palette.t, pickup.x, pickup.y + 3);
  ctx.textAlign = "left";
}

function drawEffect(ctx: CanvasRenderingContext2D, effect: Effect) {
  if (effect.type === "spark") {
    ctx.fillStyle = effect.color;
    ctx.fillRect(effect.x - 3, effect.y - 3, 6, 6);
    return;
  }

  if (effect.type === "burst") {
    const alpha = clamp(effect.ttl * 4, 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = effect.color;
    ctx.fillRect(effect.x - effect.size * 0.5, effect.y - effect.size * 0.5, effect.size, effect.size);
    ctx.restore();
    return;
  }

  if (effect.type === "trail") {
    const alpha = clamp(effect.ttl * 6, 0, 0.7);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = effect.color;
    ctx.fillRect(effect.x - effect.size * 0.5, effect.y - effect.size * 0.5, effect.size, effect.size * 0.6);
    ctx.restore();
    return;
  }

  const alpha = clamp(effect.ttl * 1.8, 0, 1);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = effect.color;
  ctx.font = "700 14px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText(effect.text ?? "", effect.x, effect.y);
  ctx.textAlign = "left";
  ctx.restore();
}

function drawHud(ctx: CanvasRenderingContext2D, game: GameState) {
  const stage = STAGES[game.stageIndex];
  const player = game.player;
  const sublevelLabel = stage.sublevels[game.sublevelIndex] ?? "Unknown";
  const tierName = WEAPON_TIERS[weaponTierIndex(game)];

  ctx.fillStyle = "rgba(8, 13, 34, 0.9)";
  ctx.fillRect(0, 0, WIDTH, 92);
  ctx.fillStyle = stage.accent;
  ctx.font = "700 14px 'Courier New', monospace";
  ctx.textAlign = "left";
  ctx.fillText("CANON BLADE // 16-BIT MYTH ACTION", 18, 24);

  ctx.fillStyle = "#efe4cf";
  ctx.font = "700 12px 'Courier New', monospace";
  ctx.fillText(stage.title.toUpperCase(), 18, 45);
  ctx.fillStyle = "#cad8ff";
  ctx.fillText(stage.subtitle.toUpperCase(), 18, 63);

  const ratio = clamp(game.stageDistance / stage.length, 0, 1);
  ctx.fillStyle = "#2c3b6a";
  ctx.fillRect(18, 72, 402, 10);
  ctx.fillStyle = stage.accent;
  ctx.fillRect(18, 72, Math.floor(402 * ratio), 10);
  ctx.strokeStyle = "#6074b6";
  ctx.strokeRect(18, 72, 402, 10);
  ctx.fillStyle = "#efe4cf";
  ctx.fillText(`DIST ${Math.floor(game.stageDistance)}/${stage.length}`, 430, 81);
  ctx.fillText(`LANE ${game.sublevelIndex + 1}/5 ${sublevelLabel.toUpperCase()}`, 430, 63);
  ctx.fillText(`THREAD ${game.threadFragments}/4`, 640, 45);
  ctx.fillText(`RANK ${game.level}`, 640, 63);
  ctx.fillText(`XP ${Math.floor(game.experience)}/${game.xpToNextLevel}`, 760, 63);
  ctx.fillText(`TOTAL ${Math.floor(game.totalExperience)}`, 760, 45);

  ctx.fillStyle = "#0b1534";
  ctx.fillRect(0, HEIGHT - 72, WIDTH, 72);

  ctx.fillStyle = "#36487f";
  ctx.fillRect(18, HEIGHT - 57, 210, 10);
  ctx.fillStyle = "#ff9a9a";
  ctx.fillRect(18, HEIGHT - 57, Math.floor((player.hp / player.maxHp) * 210), 10);
  ctx.strokeStyle = "#6b80bc";
  ctx.strokeRect(18, HEIGHT - 57, 210, 10);

  ctx.fillStyle = "#36487f";
  ctx.fillRect(18, HEIGHT - 39, 210, 10);
  ctx.fillStyle = "#9fe7ff";
  ctx.fillRect(18, HEIGHT - 39, Math.floor((player.energy / player.maxEnergy) * 210), 10);
  ctx.strokeStyle = "#6b80bc";
  ctx.strokeRect(18, HEIGHT - 39, 210, 10);

  ctx.fillStyle = "#efe4cf";
  ctx.font = "700 11px 'Courier New', monospace";
  ctx.fillText(`HP ${Math.ceil(player.hp)}`, 236, HEIGHT - 48);
  ctx.fillText(`EN ${Math.ceil(player.energy)}`, 236, HEIGHT - 30);

  ctx.fillText(`SCORE ${player.score}`, 362, HEIGHT - 48);
  ctx.fillText(`COMBO ${player.combo}`, 362, HEIGHT - 30);
  ctx.fillText(`RELIC ${game.relics}`, 502, HEIGHT - 48);
  ctx.fillText(`WEAPON ${tierName.toUpperCase()}`, 502, HEIGHT - 30);

  ctx.fillText(`SLASH ${Math.ceil(player.slashCooldown * 10) / 10}`, 642, HEIGHT - 48);
  ctx.fillText(`SHOT ${Math.ceil(player.shotCooldown * 10) / 10}`, 642, HEIGHT - 30);
  ctx.fillText(`DASH ${Math.ceil(player.dashCooldown * 10) / 10}`, 794, HEIGHT - 48);
  const shieldText = player.shieldActive
    ? "ACTIVE"
    : player.shieldBreakTimer > 0
      ? `BREAK ${player.shieldBreakTimer.toFixed(1)}`
      : "READY";
  ctx.fillText(`SHIELD ${shieldText}`, 794, HEIGHT - 30);

  ctx.fillStyle = "rgba(10, 18, 44, 0.86)";
  ctx.fillRect(18, 97, WIDTH - 36, 22);
  ctx.strokeStyle = "rgba(112, 133, 206, 0.85)";
  ctx.strokeRect(18, 97, WIDTH - 36, 22);
  ctx.fillStyle = "#c6a25a";
  ctx.fillText(game.lastEvent.slice(0, 118).toUpperCase(), 26, 111);

  const boss = game.enemies.find((enemy) => enemy.isBoss);
  if (boss) {
    const barX = WIDTH * 0.22;
    const barW = WIDTH * 0.56;
    const hpRatio = clamp(boss.hp / boss.maxHp, 0, 1);

    ctx.fillStyle = "rgba(26, 10, 18, 0.92)";
    ctx.fillRect(barX, 124, barW, 16);
    ctx.fillStyle = "#ff808f";
    ctx.fillRect(barX, 124, barW * hpRatio, 16);
    ctx.strokeStyle = "#ebadba";
    ctx.strokeRect(barX, 124, barW, 16);

    ctx.fillStyle = "#efe4cf";
    ctx.font = "700 11px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${stage.bossName.toUpperCase()} ${Math.ceil(boss.hp)} HP`, WIDTH / 2, 136);
    ctx.font = "700 9px 'Courier New', monospace";
    ctx.fillStyle = "#ffd8a7";
    ctx.fillText(stage.bossTitle.toUpperCase(), WIDTH / 2, 148);
    ctx.textAlign = "left";
  }
}

function drawOverlay(ctx: CanvasRenderingContext2D, title: string, lines: string[], footer: string) {
  ctx.fillStyle = "rgba(4, 8, 24, 0.9)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#1a2f66";
  ctx.fillRect(116, 86, WIDTH - 232, HEIGHT - 172);
  ctx.fillStyle = "#09142f";
  ctx.fillRect(124, 94, WIDTH - 248, HEIGHT - 188);

  ctx.fillStyle = "#efe4cf";
  ctx.textAlign = "center";
  ctx.font = "700 34px 'Courier New', monospace";
  ctx.fillText(title.toUpperCase(), WIDTH / 2, 168);

  ctx.fillStyle = "#c8d6ff";
  ctx.font = "700 14px 'Courier New', monospace";
  lines.forEach((line, index) => {
    ctx.fillText(line.toUpperCase(), WIDTH / 2, 212 + index * 30);
  });

  ctx.fillStyle = "#ffbf52";
  ctx.fillRect(WIDTH / 2 - 214, HEIGHT - 118, 428, 50);
  ctx.fillStyle = "#5d3f13";
  ctx.fillRect(WIDTH / 2 - 205, HEIGHT - 109, 410, 32);
  ctx.fillStyle = "#ffebc4";
  ctx.font = "700 13px 'Courier New', monospace";
  ctx.fillText(footer.toUpperCase(), WIDTH / 2, HEIGHT - 88);
}

function drawUpgradeOverlay(ctx: CanvasRenderingContext2D, game: GameState) {
  const stage = STAGES[game.stageIndex];
  const options = game.pendingUpgrades;
  ctx.fillStyle = "rgba(3, 8, 26, 0.92)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "rgba(21, 37, 82, 0.96)";
  ctx.fillRect(106, 74, WIDTH - 212, HEIGHT - 148);
  ctx.fillStyle = "rgba(8, 14, 38, 0.96)";
  ctx.fillRect(116, 84, WIDTH - 232, HEIGHT - 168);

  ctx.fillStyle = stage.accent;
  ctx.font = "700 30px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("ENHANCEMENT CHOICE", WIDTH / 2, 142);

  ctx.fillStyle = "#cad8ff";
  ctx.font = "700 12px 'Courier New', monospace";
  ctx.fillText(`RANK ${game.level}  //  PICK 1, 2, OR 3`, WIDTH / 2, 169);

  options.forEach((option, index) => {
    const x = 146;
    const y = 196 + index * 86;
    const w = WIDTH - 292;
    const h = 70;

    ctx.fillStyle = "rgba(11, 23, 60, 0.95)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = index === 0 ? "#c6a25a" : "rgba(120, 142, 214, 0.85)";
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = "#c6a25a";
    ctx.font = "700 13px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`${index + 1}. ${option.title.toUpperCase()}`, x + 14, y + 24);

    ctx.fillStyle = "#efe4cf";
    ctx.font = "700 12px 'Courier New', monospace";
    ctx.fillText(option.description.toUpperCase(), x + 14, y + 48);
  });

  ctx.fillStyle = "#b8c9ff";
  ctx.font = "700 10px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("ENTER PICKS OPTION 1  //  KEEP MOVING NORTH", WIDTH / 2, HEIGHT - 84);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.slice(0, 3);
}

function dialogueToneColor(tone: DialogueLine["tone"]): string {
  if (tone === "warning") {
    return "#ffadad";
  }
  if (tone === "myth") {
    return "#c6a25a";
  }
  return "#b6d8ff";
}

function drawDialoguePanel(ctx: CanvasRenderingContext2D, game: GameState) {
  const line = game.activeDialogue;
  if (!line) {
    return;
  }

  const panelW = 356;
  const panelH = 82;
  const panelX = WIDTH - panelW - 16;
  const panelY = game.enemies.some((enemy) => enemy.isBoss) ? 162 : 126;

  ctx.fillStyle = "rgba(7, 12, 31, 0.9)";
  ctx.fillRect(panelX, panelY, panelW, panelH);
  ctx.strokeStyle = "rgba(116, 137, 209, 0.85)";
  ctx.strokeRect(panelX, panelY, panelW, panelH);

  const accent = dialogueToneColor(line.tone);
  ctx.fillStyle = accent;
  ctx.fillRect(panelX + 12, panelY + 12, 44, 44);
  ctx.fillStyle = "#0b1734";
  ctx.font = "700 20px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText(line.speaker[0] ?? "?", panelX + 34, panelY + 40);

  ctx.textAlign = "left";
  ctx.fillStyle = accent;
  ctx.font = "700 12px 'Courier New', monospace";
  ctx.fillText(line.speaker.toUpperCase(), panelX + 68, panelY + 25);

  ctx.fillStyle = "#efe4cf";
  ctx.font = "700 11px 'Courier New', monospace";
  const wrapped = wrapText(ctx, line.text, panelW - 84).slice(0, 2);
  wrapped.forEach((part, index) => {
    ctx.fillText(part.toUpperCase(), panelX + 68, panelY + 45 + index * 15);
  });

  ctx.fillStyle = "rgba(184, 201, 255, 0.9)";
  ctx.font = "700 9px 'Courier New', monospace";
  ctx.fillText(
    `ENTER TO SKIP // ${game.narrativeTitle} ${game.threadFragments}/4`,
    panelX + 12,
    panelY + panelH - 10,
  );
}

function toTextState(game: GameState): string {
  const stage = STAGES[game.stageIndex];
  const boss = game.enemies.find((enemy) => enemy.isBoss);

  return JSON.stringify({
    coordinateSystem:
      "origin=(0,0) top-left, +x right, +y down, canvas=960x540, world uses cameraX, groundY=430",
    mode: game.mode,
    stage: {
      index: game.stageIndex,
      title: stage.title,
      sublevel: {
        index: game.sublevelIndex,
        level: game.sublevelIndex + 1,
        title: stage.sublevels[game.sublevelIndex],
        elapsedSec: Number(game.sublevelElapsed.toFixed(1)),
        durationSec: stageSublevelDuration(stage, game.sublevelIndex),
        progress: Number(sublevelProgressRatio(game, stage).toFixed(3)),
      },
      distance: Number(game.stageDistance.toFixed(1)),
      length: stage.length,
      ratio: Number((game.stageDistance / stage.length).toFixed(3)),
      totalDistance: Number(game.totalDistance.toFixed(1)),
      elapsedSec: Number(game.elapsedSec.toFixed(1)),
      bossSpawned: game.bossSpawned,
      bossIntroSec: Number(game.bossIntroTimer.toFixed(2)),
      pendingUpgrades: game.pendingUpgrades.map((option) => ({
        id: option.id,
        title: option.title,
      })),
    },
    narrative: {
      title: game.narrativeTitle,
      threadFragments: game.threadFragments,
      chronicle: game.chronicle.slice(-6),
      activeDialogue: game.activeDialogue
        ? {
            speaker: game.activeDialogue.speaker,
            text: game.activeDialogue.text,
            tone: game.activeDialogue.tone,
            remainingSec: Number(game.dialogTimer.toFixed(2)),
          }
        : null,
      queuedDialogueCount: game.dialogQueue.length,
    },
    camera: {
      x: Number(game.cameraX.toFixed(1)),
      shake: Number(game.screenShake.toFixed(2)),
      hitStop: Number(game.hitStop.toFixed(2)),
    },
    player: {
      x: Number(game.player.x.toFixed(1)),
      y: Number(game.player.y.toFixed(1)),
      vx: Number(game.player.vx.toFixed(1)),
      vy: Number(game.player.vy.toFixed(1)),
      hp: Number(game.player.hp.toFixed(1)),
      maxHp: game.player.maxHp,
      energy: Number(game.player.energy.toFixed(1)),
      maxEnergy: game.player.maxEnergy,
      facing: game.player.facing,
      onGround: game.player.onGround,
      isDucking: game.player.isDucking,
      shield: {
        active: game.player.shieldActive,
        breakSec: Number(game.player.shieldBreakTimer.toFixed(2)),
        efficiency: Number(game.player.shieldEfficiency.toFixed(2)),
      },
      weaponTier: WEAPON_TIERS[weaponTierIndex(game)],
      invuln: Number(game.player.invuln.toFixed(2)),
      cooldowns: {
        slash: Number(game.player.slashCooldown.toFixed(2)),
        shot: Number(game.player.shotCooldown.toFixed(2)),
        dash: Number(game.player.dashCooldown.toFixed(2)),
      },
      combat: {
        combo: game.player.combo,
        comboTimer: Number(game.player.comboTimer.toFixed(2)),
        score: game.player.score,
        relics: game.relics,
        level: game.level,
        experience: game.experience,
        totalExperience: game.totalExperience,
        xpToNextLevel: game.xpToNextLevel,
        pendingUpgradeCount: game.pendingUpgradeCount,
      },
    },
    world: {
      boss: boss
        ? {
            name: stage.bossName,
            title: stage.bossTitle,
            type: boss.type,
            x: Number(boss.x.toFixed(1)),
            y: Number(boss.y.toFixed(1)),
            hp: Number(boss.hp.toFixed(1)),
            maxHp: boss.maxHp,
          }
        : null,
      enemies: game.enemies.slice(0, 12).map((enemy) => ({
        id: enemy.id,
        type: enemy.type,
        isBoss: enemy.isBoss,
        x: Number(enemy.x.toFixed(1)),
        y: Number(enemy.y.toFixed(1)),
        hp: Number(enemy.hp.toFixed(1)),
        maxHp: enemy.maxHp,
      })),
      projectiles: game.projectiles.slice(0, 14).map((projectile) => ({
        id: projectile.id,
        owner: projectile.owner,
        x: Number(projectile.x.toFixed(1)),
        y: Number(projectile.y.toFixed(1)),
        vx: Number(projectile.vx.toFixed(1)),
        vy: Number(projectile.vy.toFixed(1)),
        ttl: Number(projectile.ttl.toFixed(2)),
      })),
      pickups: game.pickups.slice(0, 10).map((pickup) => ({
        id: pickup.id,
        type: pickup.type,
        x: Number(pickup.x.toFixed(1)),
        y: Number(pickup.y.toFixed(1)),
        ttl: Number(pickup.ttl.toFixed(2)),
      })),
    },
    lastEvent: game.lastEvent,
  });
}

export function CanonGameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<GameState>(createMenuState());
  const keysRef = useRef<Set<string>>(new Set());
  const spritesRef = useRef<SpriteLibrary | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    spritesRef.current = buildSprites();

    let upHeld = false;
    let slashHeld = false;
    let shotHeld = false;
    let dashHeld = false;

    const startGame = () => {
      gameRef.current = createPlayingState();
      keysRef.current.clear();
      upHeld = false;
      slashHeld = false;
      shotHeld = false;
      dashHeld = false;
    };

    const toggleFullscreen = async () => {
      if (!document.fullscreenElement) {
        await canvas.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      gameRef.current.fullscreen = Boolean(document.fullscreenElement);
    };

    const update = (dt: number) => {
      const game = gameRef.current;

      const jumpDown = keysRef.current.has(CONTROL_CODES.jump);
      const duckDown = keysRef.current.has(CONTROL_CODES.duck);
      const shieldDown = keysRef.current.has(CONTROL_CODES.shield);
      const slashDown = keysRef.current.has(CONTROL_CODES.slash);
      const shotDown = keysRef.current.has(CONTROL_CODES.shot);
      const dashDown = keysRef.current.has(CONTROL_CODES.dash);

      if (game.mode === "playing") {
        if (slashDown && !slashHeld && !shieldDown) {
          trySlash(game);
        }
        if (shotDown && !shotHeld && !shieldDown) {
          tryShoot(game);
        }
        if (dashDown && !dashHeld && !shieldDown) {
          tryDash(game);
        }

        if (game.hitStop > 0) {
          game.hitStop = Math.max(0, game.hitStop - dt);

          const effectSurvivors: Effect[] = [];
          for (const effect of game.effects) {
            effect.ttl -= dt * 0.35;
            effect.x += effect.vx * dt * 0.2;
            effect.y += effect.vy * dt * 0.2;
            if (effect.ttl > 0) {
              effectSurvivors.push(effect);
            }
          }
          game.effects = effectSurvivors;
        } else {
          updatePlaying(game, dt, keysRef.current, jumpDown && !upHeld, duckDown, shieldDown);
        }
      }

      if (game.mode !== "upgrade") {
        updateDialogue(game, dt);
      }

      upHeld = jumpDown;
      slashHeld = slashDown;
      shotHeld = shotDown;
      dashHeld = dashDown;
    };

    const draw = () => {
      const game = gameRef.current;
      const sprites = spritesRef.current;
      if (!sprites) {
        return;
      }

      ctx.save();
      ctx.imageSmoothingEnabled = false;

      const shakeMag = game.screenShake > 0 ? Math.ceil(game.screenShake * 10) : 0;
      const shakeX = shakeMag > 0 ? rand(-shakeMag, shakeMag) : 0;
      const shakeY = shakeMag > 0 ? rand(-shakeMag, shakeMag) : 0;
      ctx.translate(shakeX, shakeY);

      drawBackground(ctx, game);

      ctx.save();
      ctx.translate(-game.cameraX, 0);

      for (const pickup of game.pickups) {
        drawPickup(ctx, pickup);
      }
      for (const projectile of game.projectiles) {
        drawProjectile(ctx, projectile);
      }
      for (const enemy of game.enemies) {
        drawEnemy(ctx, game, enemy, sprites);
      }
      drawPlayer(ctx, game, sprites);
      for (const effect of game.effects) {
        drawEffect(ctx, effect);
      }

      ctx.restore();
      ctx.restore();

      drawHud(ctx, game);
      if (game.mode === "playing") {
        drawDialoguePanel(ctx, game);
      }

      if (game.bossIntroTimer > 0 && game.mode === "playing") {
        const boss = game.enemies.find((enemy) => enemy.isBoss);
        if (boss) {
          const stage = STAGES[game.stageIndex];
          drawOverlay(
            ctx,
            `${stage.bossName.toUpperCase()} RISES`,
            [stage.bossTitle, stage.bossThreatLine],
            "Survive, adapt, and strike",
          );
        }
      }

      if (game.mode === "menu") {
        drawOverlay(
          ctx,
          "Canon Blade",
          [
            "16-bit mythological side-scrolling action through four canon epochs.",
            "Each epoch has five long sublevels; each lane runs 1-2 minutes before shift.",
            "Gain XP from kills and relics to level up and unlock enhancement picks.",
            "Move: W/A/S/D (W jump, S duck)  //  Actions: Arrow keys",
            "Arrow Left slash (deflect), Arrow Up shot, Arrow Right dash, Arrow Down shield",
          ],
          "Press Enter to Start // F Fullscreen",
        );
      } else if (game.mode === "upgrade") {
        drawUpgradeOverlay(ctx, game);
      } else if (game.mode === "stageClear") {
        const chronicleLine = game.chronicle[game.chronicle.length - 1] ?? "The memory thread remains active.";
        drawOverlay(
          ctx,
          "Epoch Cleared",
          [
            STAGES[game.stageIndex].title,
            `Score ${game.player.score} // Relics ${game.relics} // HP ${Math.ceil(game.player.hp)}`,
            chronicleLine,
            `${game.narrativeTitle} ${game.threadFragments}/4`,
          ],
          "Press Enter for Next Epoch",
        );
      } else if (game.mode === "victory") {
        const chronicleLine = game.chronicle[game.chronicle.length - 1] ?? "The memory thread closes.";
        drawOverlay(
          ctx,
          "Aomori Endures",
          [
            `Total Score ${game.player.score}`,
            `Relics ${game.relics} // Time ${Math.floor(game.elapsedSec)}s // Distance ${Math.floor(game.totalDistance)}`,
            chronicleLine,
            `${game.narrativeTitle} ${game.threadFragments}/4`,
          ],
          "Press R or Enter to Run Again",
        );
      } else if (game.mode === "failed") {
        drawOverlay(
          ctx,
          "Crossing Broken",
          [
            `Final Score ${game.player.score} // Relics ${game.relics}`,
            "Chain slash, shot, and dash to control pressure.",
            `${game.narrativeTitle} ${game.threadFragments}/4`,
          ],
          "Press R or Enter to Retry",
        );
      }
    };

    let animationFrameId = 0;
    let previousTimestamp = 0;
    let accumulator = 0;
    let manualStepUntil = 0;

    const frame = (timestamp: number) => {
      if (!previousTimestamp) {
        previousTimestamp = timestamp;
      }
      const deltaSec = Math.min(0.1, (timestamp - previousTimestamp) / 1000);
      previousTimestamp = timestamp;

      if (timestamp >= manualStepUntil) {
        accumulator += deltaSec;
        while (accumulator >= FIXED_DT) {
          update(FIXED_DT);
          accumulator -= FIXED_DT;
        }
      } else {
        accumulator = 0;
      }

      draw();
      animationFrameId = window.requestAnimationFrame(frame);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const code = normalizeInputCode(event);
      if (BLOCK_BROWSER_CODES.has(code) && !isEditableTarget(event.target)) {
        event.preventDefault();
      }

      keysRef.current.add(code);

      const game = gameRef.current;
      if (game.mode === "upgrade") {
        const pickFromCode =
          code === "Digit1" || code === "Numpad1"
            ? 0
            : code === "Digit2" || code === "Numpad2"
              ? 1
              : code === "Digit3" || code === "Numpad3"
                ? 2
                : code === CONTROL_CODES.start
                  ? 0
                  : -1;
        if (pickFromCode >= 0) {
          const option = game.pendingUpgrades[pickFromCode];
          if (option) {
            applyUpgrade(game, option);
            game.pendingUpgrades = [];
            game.mode = "playing";
            maybeOpenUpgradeMenu(game);
          }
        }
        return;
      }
      if (code === CONTROL_CODES.start && game.mode === "menu") {
        startGame();
      }
      if (
        (code === CONTROL_CODES.retry || code === CONTROL_CODES.start) &&
        (game.mode === "victory" || game.mode === "failed")
      ) {
        startGame();
      }
      if (
        code === CONTROL_CODES.start &&
        game.mode === "playing" &&
        (game.activeDialogue || game.dialogQueue.length > 0)
      ) {
        advanceDialogue(game);
      }
      if (code === CONTROL_CODES.start && game.mode === "stageClear") {
        if (game.stageIndex >= STAGES.length - 1) {
          game.mode = "victory";
        } else {
          advanceToNextStage(game);
        }
      }
      if (code === CONTROL_CODES.fullscreen) {
        event.preventDefault();
        void toggleFullscreen();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const code = normalizeInputCode(event);
      if (BLOCK_BROWSER_CODES.has(code) && !isEditableTarget(event.target)) {
        event.preventDefault();
      }
      keysRef.current.delete(code);
    };

    const handleWindowBlur = () => {
      keysRef.current.clear();
      upHeld = false;
      slashHeld = false;
      shotHeld = false;
      dashHeld = false;
    };

    const handleFullscreenChange = () => {
      gameRef.current.fullscreen = Boolean(document.fullscreenElement);
    };

    window.render_game_to_text = () => toTextState(gameRef.current);
    window.advanceTime = (ms: number) => {
      const safeMs = Math.max(0, ms);
      const steps = Math.max(1, Math.round(safeMs / (FIXED_DT * 1000)));
      manualStepUntil = performance.now() + 250;
      for (let i = 0; i < steps; i += 1) {
        update(FIXED_DT);
      }
      draw();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    animationFrameId = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      className="w-full h-auto border border-[#EFE4CF]/40 bg-[#070B14] shadow-[0_22px_90px_rgba(0,0,0,0.55)]"
      style={{ imageRendering: "pixelated" }}
      aria-label="Canon Blade myth-action game canvas"
    />
  );
}
