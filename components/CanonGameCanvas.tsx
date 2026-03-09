"use client";

import { useEffect, useRef } from "react";

type GameMode = "menu" | "playing" | "victory" | "failed";
type PowerupType = "rain" | "fertilizer" | "lantern";
type CropState = "soil" | "sprout" | "growing" | "ripe";

interface CropTile {
  state: CropState;
  growth: number;
  water: number;
}

interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface WorldPowerup {
  id: number;
  type: PowerupType;
  x: number;
  y: number;
  r: number;
}

interface BuffState {
  rain: number;
  fertilizer: number;
  lantern: number;
}

interface GameState {
  mode: GameMode;
  player: Player;
  tiles: CropTile[][];
  coins: number;
  harvested: number;
  seasonSec: number;
  interactCooldown: number;
  powerups: WorldPowerup[];
  powerupSpawnTimer: number;
  buffs: BuffState;
  fullscreen: boolean;
  nextPowerupId: number;
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

const FIELD_COLS = 8;
const FIELD_ROWS = 4;
const TILE_SIZE = 86;
const TILE_GAP = 8;
const FIELD_WIDTH = FIELD_COLS * TILE_SIZE + (FIELD_COLS - 1) * TILE_GAP;
const FIELD_HEIGHT = FIELD_ROWS * TILE_SIZE + (FIELD_ROWS - 1) * TILE_GAP;
const FIELD_X = (WIDTH - FIELD_WIDTH) / 2;
const FIELD_Y = 112;

const PLAYER_SPEED = 220;
const INTERACT_DISTANCE = 56;
const SEASON_DURATION = 150;
const TARGET_COINS = 260;

function isFullscreenActive(): boolean {
  return typeof document !== "undefined" && Boolean(document.fullscreenElement);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function createField(): CropTile[][] {
  return Array.from({ length: FIELD_ROWS }, () =>
    Array.from({ length: FIELD_COLS }, () => ({
      state: "soil" as const,
      growth: 0,
      water: 0,
    })),
  );
}

function createMenuState(): GameState {
  return {
    mode: "menu",
    player: {
      x: WIDTH / 2,
      y: FIELD_Y + FIELD_HEIGHT / 2,
      vx: 0,
      vy: 0,
      r: 14,
    },
    tiles: createField(),
    coins: 0,
    harvested: 0,
    seasonSec: 0,
    interactCooldown: 0,
    powerups: [],
    powerupSpawnTimer: 8,
    buffs: {
      rain: 0,
      fertilizer: 0,
      lantern: 0,
    },
    fullscreen: isFullscreenActive(),
    nextPowerupId: 1,
  };
}

function createPlayingState(): GameState {
  const state = createMenuState();
  state.mode = "playing";
  return state;
}

function tileCenter(col: number, row: number): { x: number; y: number } {
  return {
    x: FIELD_X + col * (TILE_SIZE + TILE_GAP) + TILE_SIZE / 2,
    y: FIELD_Y + row * (TILE_SIZE + TILE_GAP) + TILE_SIZE / 2,
  };
}

function distSquared(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function chooseNearestTile(game: GameState): { col: number; row: number } | null {
  let best: { col: number; row: number } | null = null;
  let bestDist = INTERACT_DISTANCE * INTERACT_DISTANCE;

  for (let row = 0; row < FIELD_ROWS; row += 1) {
    for (let col = 0; col < FIELD_COLS; col += 1) {
      const center = tileCenter(col, row);
      const d = distSquared(game.player.x, game.player.y, center.x, center.y);
      if (d <= bestDist) {
        bestDist = d;
        best = { col, row };
      }
    }
  }

  return best;
}

function interactWithTile(game: GameState) {
  if (game.mode !== "playing" || game.interactCooldown > 0) {
    return;
  }

  const nearest = chooseNearestTile(game);
  if (!nearest) {
    return;
  }

  const tile = game.tiles[nearest.row][nearest.col];

  if (tile.state === "soil") {
    tile.state = "sprout";
    tile.growth = 0.05;
    tile.water = 42;
  } else if (tile.state === "ripe") {
    const lanternBonus = game.buffs.lantern > 0 ? 7 : 0;
    game.coins += 18 + lanternBonus;
    game.harvested += 1;
    tile.state = "soil";
    tile.growth = 0;
    tile.water = 0;
  } else {
    tile.water = 100;
  }

  game.interactCooldown = 0.16;
}

function applyPowerup(game: GameState, type: PowerupType) {
  if (type === "rain") {
    game.buffs.rain = 11;
  } else if (type === "fertilizer") {
    game.buffs.fertilizer = 13;
  } else {
    game.buffs.lantern = 15;
  }
}

function spawnPowerup(game: GameState) {
  const typeSeed = Math.floor(game.seasonSec * 10 + game.harvested);
  const type = (["rain", "fertilizer", "lantern"] as const)[typeSeed % 3];

  const margin = 16;
  const x = FIELD_X + margin + Math.random() * (FIELD_WIDTH - margin * 2);
  const y = FIELD_Y + margin + Math.random() * (FIELD_HEIGHT - margin * 2);

  game.powerups.push({
    id: game.nextPowerupId,
    type,
    x,
    y,
    r: 14,
  });
  game.nextPowerupId += 1;
}

function growthTick(game: GameState) {
  for (let row = 0; row < FIELD_ROWS; row += 1) {
    for (let col = 0; col < FIELD_COLS; col += 1) {
      const tile = game.tiles[row][col];

      if (tile.state === "soil" || tile.state === "ripe") {
        continue;
      }

      if (game.buffs.rain > 0) {
        tile.water = Math.max(tile.water, 76);
      }

      const fertilizerMultiplier = game.buffs.fertilizer > 0 ? 1.8 : 1;
      if (tile.water > 0) {
        tile.growth += 0.34 * fertilizerMultiplier;
        tile.water = Math.max(0, tile.water - 27);
      } else {
        tile.growth += 0.06;
      }

      if (tile.growth >= 2.2) {
        tile.state = "ripe";
      } else if (tile.growth >= 1.05) {
        tile.state = "growing";
      } else {
        tile.state = "sprout";
      }
    }
  }
}

function drawTile(ctx: CanvasRenderingContext2D, tile: CropTile, col: number, row: number) {
  const x = FIELD_X + col * (TILE_SIZE + TILE_GAP);
  const y = FIELD_Y + row * (TILE_SIZE + TILE_GAP);

  ctx.fillStyle = "#1C2B3A";
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  ctx.strokeStyle = "rgba(45, 74, 62, 0.72)";
  ctx.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);

  if (tile.state === "soil") {
    ctx.fillStyle = "#3A2A1F";
    ctx.fillRect(x + 9, y + 10, TILE_SIZE - 18, TILE_SIZE - 20);
  } else {
    ctx.fillStyle = "#4B3124";
    ctx.fillRect(x + 9, y + 10, TILE_SIZE - 18, TILE_SIZE - 20);

    if (tile.state === "sprout") {
      ctx.fillStyle = "#58A95A";
      ctx.fillRect(x + TILE_SIZE / 2 - 4, y + TILE_SIZE / 2 + 5, 8, 14);
      ctx.fillRect(x + TILE_SIZE / 2 - 10, y + TILE_SIZE / 2 + 2, 7, 6);
      ctx.fillRect(x + TILE_SIZE / 2 + 3, y + TILE_SIZE / 2, 7, 6);
    } else if (tile.state === "growing") {
      ctx.fillStyle = "#7DB66E";
      for (let i = 0; i < 3; i += 1) {
        const px = x + 24 + i * 16;
        ctx.fillRect(px, y + 40, 10, 20);
        ctx.fillRect(px - 5, y + 50, 8, 8);
        ctx.fillRect(px + 8, y + 46, 8, 8);
      }
    } else if (tile.state === "ripe") {
      ctx.fillStyle = "#E8D44D";
      for (let i = 0; i < 4; i += 1) {
        const px = x + 18 + i * 14;
        ctx.fillRect(px, y + 34, 9, 23);
      }
      ctx.fillStyle = "#9E6A2A";
      ctx.fillRect(x + 16, y + 56, TILE_SIZE - 32, 5);
    }
  }

  if (tile.water > 0 && tile.state !== "soil") {
    const alpha = clamp(tile.water / 130, 0.08, 0.32);
    ctx.fillStyle = `rgba(88, 165, 224, ${alpha})`;
    ctx.fillRect(x + 5, y + 5, TILE_SIZE - 10, TILE_SIZE - 10);
  }
}

function drawPowerup(ctx: CanvasRenderingContext2D, powerup: WorldPowerup) {
  ctx.beginPath();
  if (powerup.type === "rain") {
    ctx.fillStyle = "#5CA6E0";
  } else if (powerup.type === "fertilizer") {
    ctx.fillStyle = "#8BE27F";
  } else {
    ctx.fillStyle = "#F2B050";
  }
  ctx.arc(powerup.x, powerup.y, powerup.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0D1B2A";
  ctx.font = "700 11px Inter";
  ctx.textAlign = "center";
  const label = powerup.type === "rain" ? "RAIN" : powerup.type === "fertilizer" ? "GROW" : "GOLD";
  ctx.fillText(label, powerup.x, powerup.y + 4);
}

function drawOverlay(ctx: CanvasRenderingContext2D, title: string, lines: string[], action: string) {
  ctx.fillStyle = "rgba(13, 27, 42, 0.88)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.strokeStyle = "rgba(232, 212, 77, 0.22)";
  ctx.strokeRect(120, 92, WIDTH - 240, HEIGHT - 184);

  ctx.fillStyle = "#F5F2EB";
  ctx.textAlign = "center";
  ctx.font = "900 56px Playfair Display";
  ctx.fillText(title, WIDTH / 2, 182);

  ctx.fillStyle = "rgba(245, 242, 235, 0.83)";
  ctx.font = "400 20px Inter";
  lines.forEach((line, index) => {
    ctx.fillText(line, WIDTH / 2, 238 + index * 34);
  });

  ctx.fillStyle = "#E8D44D";
  ctx.fillRect(WIDTH / 2 - 196, HEIGHT - 132, 392, 56);
  ctx.fillStyle = "#0D1B2A";
  ctx.font = "700 14px Inter";
  ctx.fillText(action, WIDTH / 2, HEIGHT - 97);
}

export function CanonGameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<GameState>(createMenuState());
  const keysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let growthAccumulator = 0;
    let interactPressed = false;

    const startGame = () => {
      gameRef.current = createPlayingState();
      growthAccumulator = 0;
      interactPressed = false;
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

      if (game.mode !== "playing") {
        return;
      }

      game.seasonSec += dt;
      game.interactCooldown = Math.max(0, game.interactCooldown - dt);
      game.buffs.rain = Math.max(0, game.buffs.rain - dt);
      game.buffs.fertilizer = Math.max(0, game.buffs.fertilizer - dt);
      game.buffs.lantern = Math.max(0, game.buffs.lantern - dt);

      const left = keysRef.current.has("arrowleft") || keysRef.current.has("a");
      const right = keysRef.current.has("arrowright") || keysRef.current.has("d");
      const up = keysRef.current.has("arrowup") || keysRef.current.has("w");
      const down = keysRef.current.has("arrowdown") || keysRef.current.has("s");

      const moveX = (right ? 1 : 0) - (left ? 1 : 0);
      const moveY = (down ? 1 : 0) - (up ? 1 : 0);
      const magnitude = Math.hypot(moveX, moveY) || 1;

      game.player.vx = (moveX / magnitude) * PLAYER_SPEED;
      game.player.vy = (moveY / magnitude) * PLAYER_SPEED;

      game.player.x = clamp(game.player.x + game.player.vx * dt, FIELD_X + 16, FIELD_X + FIELD_WIDTH - 16);
      game.player.y = clamp(game.player.y + game.player.vy * dt, FIELD_Y + 16, FIELD_Y + FIELD_HEIGHT - 16);

      const interactDown = keysRef.current.has(" ") || keysRef.current.has("b");
      if (interactDown && !interactPressed) {
        interactWithTile(game);
      }
      interactPressed = interactDown;

      game.powerupSpawnTimer -= dt;
      if (game.powerupSpawnTimer <= 0) {
        spawnPowerup(game);
        game.powerupSpawnTimer = 8 + Math.random() * 7;
      }

      game.powerups = game.powerups.filter((powerup) => {
        const d2 = distSquared(powerup.x, powerup.y, game.player.x, game.player.y);
        if (d2 <= (powerup.r + game.player.r) * (powerup.r + game.player.r)) {
          applyPowerup(game, powerup.type);
          game.coins += 6;
          return false;
        }
        return true;
      });

      growthAccumulator += dt;
      while (growthAccumulator >= 1) {
        growthTick(game);
        growthAccumulator -= 1;
      }

      if (game.coins >= TARGET_COINS) {
        game.mode = "victory";
      } else if (game.seasonSec >= SEASON_DURATION) {
        game.mode = "failed";
      }
    };

    const draw = () => {
      const game = gameRef.current;
      const remaining = Math.max(0, Math.ceil(SEASON_DURATION - game.seasonSec));

      const bgGradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
      bgGradient.addColorStop(0, "#071222");
      bgGradient.addColorStop(0.4, "#0A2038");
      bgGradient.addColorStop(1, "#10263A");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (let i = 0; i < 36; i += 1) {
        ctx.fillStyle = "rgba(232, 212, 77, 0.06)";
        const x = (i * 173 + game.seasonSec * 9) % (WIDTH + 120) - 60;
        const y = 52 + (i * 61) % 80;
        ctx.fillRect(x, y, 2, 2);
      }

      ctx.fillStyle = "rgba(13, 27, 42, 0.62)";
      ctx.fillRect(FIELD_X - 18, FIELD_Y - 18, FIELD_WIDTH + 36, FIELD_HEIGHT + 36);
      ctx.strokeStyle = "rgba(45, 74, 62, 0.65)";
      ctx.strokeRect(FIELD_X - 17.5, FIELD_Y - 17.5, FIELD_WIDTH + 35, FIELD_HEIGHT + 35);

      for (let row = 0; row < FIELD_ROWS; row += 1) {
        for (let col = 0; col < FIELD_COLS; col += 1) {
          drawTile(ctx, game.tiles[row][col], col, row);
        }
      }

      game.powerups.forEach((powerup) => {
        drawPowerup(ctx, powerup);
      });

      ctx.beginPath();
      ctx.fillStyle = "#F5F2EB";
      ctx.arc(game.player.x, game.player.y, game.player.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = "#C0392B";
      ctx.lineWidth = 3;
      ctx.arc(game.player.x, game.player.y, game.player.r + 7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#E8D44D";
      ctx.font = "700 13px Inter";
      ctx.textAlign = "left";
      ctx.fillText("CANON HARVEST // SHINGO FIELD NODE", 22, 32);

      ctx.fillStyle = "rgba(245, 242, 235, 0.82)";
      ctx.font = "500 14px Inter";
      ctx.fillText("Plant, water, harvest. Hit target before the season closes.", 22, 54);

      ctx.fillStyle = "#F5F2EB";
      ctx.fillText(`Coins ${game.coins} / ${TARGET_COINS}`, 22, HEIGHT - 26);
      ctx.fillText(`Harvests ${game.harvested}`, 220, HEIGHT - 26);
      ctx.fillText(`Season ${remaining}s`, 380, HEIGHT - 26);
      ctx.fillText(`Rain ${Math.ceil(game.buffs.rain)}s`, 540, HEIGHT - 26);
      ctx.fillText(`Grow ${Math.ceil(game.buffs.fertilizer)}s`, 660, HEIGHT - 26);
      ctx.fillText(`Gold ${Math.ceil(game.buffs.lantern)}s`, 770, HEIGHT - 26);

      if (game.mode === "menu") {
        drawOverlay(
          ctx,
          "Canon Harvest",
          [
            "Move: WASD or Arrow Keys",
            "Action: Space or B (plant/water/harvest nearest tile)",
            "Collect floating buffs and hit the coin target before season end.",
          ],
          "PRESS ENTER TO START",
        );
      } else if (game.mode === "victory") {
        drawOverlay(
          ctx,
          "Season Secured",
          [
            `You produced ${game.harvested} harvests and ${game.coins} coins.`,
            "The Shingo field stays open for another cycle.",
          ],
          "PRESS R TO PLAY AGAIN",
        );
      } else if (game.mode === "failed") {
        drawOverlay(
          ctx,
          "Season Closed",
          [
            `You reached ${game.coins} / ${TARGET_COINS} coins before winter lock.`,
            "Reset and optimize your planting rhythm.",
          ],
          "PRESS R TO RETRY",
        );
      }
    };

    const toText = () => {
      const game = gameRef.current;
      const activePowerups = game.powerups.slice(0, 6).map((item) => ({
        id: item.id,
        type: item.type,
        x: Number(item.x.toFixed(1)),
        y: Number(item.y.toFixed(1)),
        r: item.r,
      }));

      const ripeTiles: Array<{ col: number; row: number }> = [];
      const needyTiles: Array<{ col: number; row: number; water: number }> = [];

      for (let row = 0; row < FIELD_ROWS; row += 1) {
        for (let col = 0; col < FIELD_COLS; col += 1) {
          const tile = game.tiles[row][col];
          if (tile.state === "ripe") {
            ripeTiles.push({ col, row });
          } else if (tile.state !== "soil" && tile.water < 30) {
            needyTiles.push({ col, row, water: Number(tile.water.toFixed(1)) });
          }
        }
      }

      return JSON.stringify({
        coordinateSystem:
          "origin=(0,0) top-left, +x right, +y down, canvas=960x540, field starts at (108,112)",
        mode: game.mode,
        player: {
          x: Number(game.player.x.toFixed(1)),
          y: Number(game.player.y.toFixed(1)),
          r: game.player.r,
          vx: Number(game.player.vx.toFixed(1)),
          vy: Number(game.player.vy.toFixed(1)),
        },
        economy: {
          coins: game.coins,
          targetCoins: TARGET_COINS,
          harvested: game.harvested,
          seasonRemainingSec: Number(Math.max(0, SEASON_DURATION - game.seasonSec).toFixed(2)),
        },
        buffs: {
          rainSec: Number(game.buffs.rain.toFixed(1)),
          fertilizerSec: Number(game.buffs.fertilizer.toFixed(1)),
          lanternSec: Number(game.buffs.lantern.toFixed(1)),
        },
        crops: {
          grid: { cols: FIELD_COLS, rows: FIELD_ROWS },
          ripeTiles: ripeTiles.slice(0, 10),
          dryTiles: needyTiles.slice(0, 10),
        },
        worldPowerups: activePowerups,
      });
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
      const key = event.key.toLowerCase();
      keysRef.current.add(key);

      const game = gameRef.current;
      if (key === "enter" && game.mode === "menu") {
        startGame();
      }
      if ((key === "r" || key === "enter") && (game.mode === "victory" || game.mode === "failed")) {
        startGame();
      }
      if (key === "f") {
        event.preventDefault();
        void toggleFullscreen();
      }
      if ((key === " " || key === "b") && game.mode === "playing") {
        interactWithTile(game);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key.toLowerCase());
    };

    const handleFullscreenChange = () => {
      gameRef.current.fullscreen = Boolean(document.fullscreenElement);
    };

    window.render_game_to_text = toText;
    window.advanceTime = (ms: number) => {
      const safeMs = Math.max(0, ms);
      const steps = Math.max(1, Math.round(safeMs / (FIXED_DT * 1000)));
      manualStepUntil = performance.now() + 250;
      for (let step = 0; step < steps; step += 1) {
        update(FIXED_DT);
      }
      draw();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    animationFrameId = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
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
      className="w-full h-auto border border-[#2D4A3E]/40 bg-[#081220] shadow-[0_22px_90px_rgba(0,0,0,0.55)]"
      aria-label="Canon Harvest game canvas"
    />
  );
}
