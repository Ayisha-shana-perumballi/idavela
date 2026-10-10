import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { RUNNER_SKINS } from '../data/skins';
import { ARENA_CONFIGS, ArenaConfig } from '../data/arenas';
import { DutyFreeShopModal } from './DutyFreeShopModal';
import { sound } from '../utils/audio';
import { 
  Play, 
  RotateCcw, 
  Pause, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Trophy, 
  Coins, 
  Sparkles, 
  Zap, 
  ShoppingBag,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface Obstacle {
  id: number;
  lane: number; // 0 = left, 1 = center, 2 = right
  z: number; // distance from player (1200 down to 0)
  type: 'hurdle' | 'overhead_sign' | 'heavy_barrier';
  width: number;
  height: number;
  yOffset: number; // For overhead signs (requires slide)
  passed?: boolean;
}

interface Collectible {
  id: number;
  lane: number;
  z: number;
  type: 'coin' | 'chai' | 'magnet';
  collected?: boolean;
}

interface RoadsideObject {
  id: number;
  side: 'left' | 'right';
  z: number;
  type: string;
}

export const DubaiDashGame: React.FC = () => {
  const { userStats, recordGameRun, soundEnabled, toggleSound, setActiveTab, selectedAirportCode, currentPlan } = useApp();
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showWardrobeModal, setShowWardrobeModal] = useState(false);

  // Default to planner destination if available, otherwise airport hub, default to DXB
  const initialArenaCode = currentPlan?.airportCode || selectedAirportCode || 'DXB';
  const [arenaCode, setArenaCode] = useState<string>(initialArenaCode);

  // Sync arena if planner destination changes
  useEffect(() => {
    if (currentPlan?.airportCode && ARENA_CONFIGS[currentPlan.airportCode]) {
      setArenaCode(currentPlan.airportCode);
    } else if (selectedAirportCode && ARENA_CONFIGS[selectedAirportCode]) {
      setArenaCode(selectedAirportCode);
    }
  }, [currentPlan?.airportCode, selectedAirportCode]);

  const currentArena = ARENA_CONFIGS[arenaCode] || ARENA_CONFIGS.DXB;
  
  // Game states
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameover'>('menu');
  const [liveDistance, setLiveDistance] = useState<number>(0);
  const [sessionCoins, setSessionCoins] = useState<number>(0);
  const [gameOverStats, setGameOverStats] = useState<{
    distance: number;
    coins: number;
    xp: number;
    isRecord: boolean;
  } | null>(null);

  // References to keep game loop decoupled from React render cycle
  const gameRef = useRef({
    lane: 1, // 0 = left, 1 = center, 2 = right
    targetLane: 1,
    laneX: 0, // current interpolated X position
    isJumping: false,
    jumpY: 0,
    jumpVelocity: 0,
    isSliding: false,
    slideTimer: 0,
    speed: 13,
    baseSpeed: 13,
    maxSpeed: 30,
    distance: 0,
    coinsCollected: 0,
    boostTimer: 0,
    magnetTimer: 0,
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    roadsideObjects: [] as RoadsideObject[],
    lastObstacleZ: 1000,
    lastRoadsideZ: 200,
    nextObstacleId: 1,
    nextCoinId: 1,
    nextRoadsideId: 1,
    animFrameId: 0,
    isRunning: false,
    touchStartX: 0,
    touchStartY: 0,
    arena: currentArena,
    slideSparks: [] as { x: number; y: number; life: number }[]
  });

  // Keep arena in ref up to date
  useEffect(() => {
    gameRef.current.arena = currentArena;
  }, [currentArena]);

  const equippedSkin = RUNNER_SKINS.find(s => s.id === userStats.selectedSkinId) || RUNNER_SKINS[0];

  // Helper to spawn initial roadside scenery
  const initRoadside = (g: typeof gameRef.current) => {
    g.roadsideObjects = [];
    for (let z = 200; z <= 1300; z += 180) {
      g.roadsideObjects.push({
        id: g.nextRoadsideId++,
        side: 'left',
        z,
        type: g.arena.roadsideTypeLeft
      });
      g.roadsideObjects.push({
        id: g.nextRoadsideId++,
        side: 'right',
        z: z + 90,
        type: g.arena.roadsideTypeRight
      });
    }
  };

  // Helper to spawn obstacles and collectibles
  const spawnPattern = (g: typeof gameRef.current, startZ: number) => {
    const laneChoice = Math.floor(Math.random() * 3);
    const roll = Math.random();

    let obsType: Obstacle['type'] = 'hurdle';
    let yOffset = 0;

    if (roll < 0.45) {
      obsType = 'hurdle'; // low roadblock/cones -> jump
    } else if (roll < 0.75) {
      obsType = 'overhead_sign'; // overhead highway clearance bar -> slide
      yOffset = 46;
    } else {
      obsType = 'heavy_barrier'; // high concrete divider -> dodge
    }

    g.obstacles.push({
      id: g.nextObstacleId++,
      lane: laneChoice,
      z: startZ,
      type: obsType,
      width: 44,
      height: obsType === 'overhead_sign' ? 28 : 38,
      yOffset
    });

    // Spawn coins in clear lanes
    const otherLanes = [0, 1, 2].filter(l => l !== laneChoice);
    const coinLane = otherLanes[Math.floor(Math.random() * otherLanes.length)];

    for (let c = 0; c < 3; c++) {
      const pRoll = Math.random();
      let itemType: 'coin' | 'chai' | 'magnet' = 'coin';
      if (pRoll < 0.05) itemType = 'magnet';
      else if (pRoll < 0.12) itemType = 'chai';

      g.collectibles.push({
        id: g.nextCoinId++,
        lane: coinLane,
        z: startZ + c * 80,
        type: itemType
      });
    }

    g.lastObstacleZ = startZ;
  };

  // Start new run
  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.arena = currentArena;
    g.lane = 1;
    g.targetLane = 1;
    g.laneX = 0;
    g.isJumping = false;
    g.jumpY = 0;
    g.jumpVelocity = 0;
    g.isSliding = false;
    g.slideTimer = 0;
    g.speed = g.baseSpeed;
    g.distance = 0;
    g.coinsCollected = 0;
    g.boostTimer = 0;
    g.magnetTimer = 0;
    g.obstacles = [];
    g.collectibles = [];
    g.slideSparks = [];
    g.lastObstacleZ = 700;
    g.nextObstacleId = 1;
    g.nextCoinId = 1;
    g.isRunning = true;

    initRoadside(g);
    spawnPattern(g, 900);
    spawnPattern(g, 1500);

    setLiveDistance(0);
    setSessionCoins(0);
    setGameOverStats(null);
    setGameState('playing');
  }, [currentArena]);

  // Player Controls
  const moveLeft = useCallback(() => {
    const g = gameRef.current;
    if (g.targetLane > 0) {
      g.targetLane -= 1;
      sound.playSlide();
    }
  }, []);

  const moveRight = useCallback(() => {
    const g = gameRef.current;
    if (g.targetLane < 2) {
      g.targetLane += 1;
      sound.playSlide();
    }
  }, []);

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (!g.isJumping && !g.isSliding) {
      g.isJumping = true;
      g.jumpVelocity = 14.5;
      sound.playJump();
    }
  }, []);

  const slide = useCallback(() => {
    const g = gameRef.current;
    if (!g.isSliding && !g.isJumping) {
      g.isSliding = true;
      g.slideTimer = 26; // frames
      sound.playSlide();
    }
  }, []);

  // Keyboard Event Listeners with page scroll prevention
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Keys to prevent window scrolling during play
      const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'KeyA', 'KeyD', 'KeyW', 'KeyS', 'KeyP', 'Escape'];
      if (gameKeys.includes(e.code)) {
        e.preventDefault();
      }

      if (gameState !== 'playing') {
        if ((e.code === 'Space' || e.code === 'Enter') && (gameState === 'menu' || gameState === 'gameover')) {
          startGame();
        }
        return;
      }

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft();
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight();
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          jump();
          break;
        case 'ArrowDown':
        case 'KeyS':
          slide();
          break;
        case 'KeyP':
        case 'Escape':
          setGameState(prev => (prev === 'playing' ? 'paused' : 'playing'));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, moveLeft, moveRight, jump, slide, startGame]);

  // Touch & Swipe handlers on canvas
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    gameRef.current.touchStartX = touch.clientX;
    gameRef.current.touchStartY = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (gameState !== 'playing') return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - gameRef.current.touchStartX;
    const dy = touch.clientY - gameRef.current.touchStartY;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 22) {
      if (absDx > absDy) {
        if (dx > 0) moveRight();
        else moveLeft();
      } else {
        if (dy < 0) jump();
        else slide();
      }
    }
  };

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      const g = gameRef.current;
      const arena = g.arena || currentArena;
      const laneXTargets = [-115, 0, 115];

      if (gameState === 'playing') {
        // --- 1. UPDATE GAME STATE ---
        // Smooth lane interpolation
        const targetX = laneXTargets[g.targetLane];
        g.laneX += (targetX - g.laneX) * 0.24;

        // Jump physics
        if (g.isJumping) {
          g.jumpY += g.jumpVelocity;
          g.jumpVelocity -= 0.88; // gravity
          if (g.jumpY <= 0) {
            g.jumpY = 0;
            g.isJumping = false;
            g.jumpVelocity = 0;
          }
        }

        // Slide timer & sparks
        if (g.isSliding) {
          g.slideTimer--;
          if (g.slideTimer <= 0) {
            g.isSliding = false;
          }
          // Spawn slide friction sparks
          if (Math.random() < 0.6) {
            g.slideSparks.push({
              x: (Math.random() - 0.5) * 28,
              y: (Math.random() - 0.5) * 10,
              life: 14
            });
          }
        }

        // Update sparks
        for (let s = g.slideSparks.length - 1; s >= 0; s--) {
          g.slideSparks[s].life--;
          if (g.slideSparks[s].life <= 0) g.slideSparks.splice(s, 1);
        }

        // Speed curve & Boosters
        if (g.boostTimer > 0) {
          g.boostTimer--;
          g.speed = g.baseSpeed + 8.5;
        } else {
          // Gradual speedup over distance
          const speedFactor = Math.min(1.0, g.distance / 2200);
          g.speed = g.baseSpeed + (g.maxSpeed - g.baseSpeed) * speedFactor;
        }

        // Advance distance
        g.distance += Math.round(g.speed * 0.08);
        setLiveDistance(g.distance);

        // Update Roadside Scenery Objects
        for (let i = g.roadsideObjects.length - 1; i >= 0; i--) {
          const item = g.roadsideObjects[i];
          item.z -= g.speed;
          if (item.z < -80) {
            // Recycle / respawn far ahead
            item.z += 1260;
          }
        }

        // Advance obstacles toward player
        for (let i = g.obstacles.length - 1; i >= 0; i--) {
          const obs = g.obstacles[i];
          obs.z -= g.speed;

          // Collision detection: player is at z ~ 60 to 110
          if (obs.z <= 110 && obs.z >= 50 && !obs.passed) {
            const currentDistToLane = Math.abs(g.laneX - laneXTargets[obs.lane]);

            if (currentDistToLane < 52) {
              let hit = false;

              if (obs.type === 'overhead_sign') {
                // Must be sliding to duck under!
                if (!g.isSliding) {
                  hit = true;
                }
              } else if (obs.type === 'hurdle') {
                // Must be jumping sufficiently high!
                if (g.jumpY < 32) {
                  hit = true;
                }
              } else if (obs.type === 'heavy_barrier') {
                // Cannot jump over heavy divider!
                hit = true;
              }

              if (hit) {
                // CRASH!
                sound.playCrash();
                g.isRunning = false;

                const recorded = recordGameRun(g.distance, g.coinsCollected);
                setGameOverStats({
                  distance: g.distance,
                  coins: g.coinsCollected,
                  xp: recorded.xpAwarded,
                  isRecord: recorded.isNewHighScore
                });
                setGameState('gameover');
                return;
              }
            }
          }

          if (obs.z < 20) {
            obs.passed = true;
          }

          if (obs.z < -100) {
            g.obstacles.splice(i, 1);
          }
        }

        // Advance collectibles & apply magnet pull
        if (g.magnetTimer > 0) {
          g.magnetTimer--;
        }

        for (let i = g.collectibles.length - 1; i >= 0; i--) {
          const col = g.collectibles[i];
          col.z -= g.speed;

          // If magnet is active, pull coins toward current player lane
          if (g.magnetTimer > 0 && col.type === 'coin' && col.z < 520 && col.z > 40) {
            col.lane = g.targetLane;
          }

          // Pickup collision check
          if (col.z <= 120 && col.z >= 40 && !col.collected) {
            const currentDist = Math.abs(g.laneX - laneXTargets[col.lane]);

            if (currentDist < 50) {
              col.collected = true;
              if (col.type === 'coin') {
                g.coinsCollected += 1;
                sound.playCoin();
                setSessionCoins(g.coinsCollected);
              } else if (col.type === 'chai') {
                g.boostTimer = 190;
                sound.playPowerup();
              } else if (col.type === 'magnet') {
                g.magnetTimer = 260;
                sound.playPowerup();
              }
            }
          }

          if (col.z < -50) {
            g.collectibles.splice(i, 1);
          }
        }

        // Periodically spawn new obstacles and coin lines
        const furthestZ = g.obstacles.length > 0 ? Math.max(...g.obstacles.map(o => o.z)) : 0;
        if (furthestZ < 1200) {
          const spacing = Math.max(380, 520 - Math.floor(g.distance / 15));
          spawnPattern(g, furthestZ + spacing);
        }
      }

      // --- 2. RENDER GRAPHICS ---
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Sky Gradient
      const horizonY = h * 0.42;
      const bgGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      bgGrad.addColorStop(0, arena.skyColors[0]);
      bgGrad.addColorStop(0.65, arena.skyColors[1]);
      bgGrad.addColorStop(1, arena.skyColors[2]);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, horizonY + 2);

      // Celestial Sun / Moon glow on horizon
      if (arena.sunColor && arena.sunPosition) {
        ctx.save();
        const sunX = w * arena.sunPosition.xPct;
        const sunY = horizonY * arena.sunPosition.yPct;
        const sunR = arena.sunPosition.radius;

        const sunGlow = ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 2.5);
        sunGlow.addColorStop(0, arena.sunColor);
        sunGlow.addColorStop(0.5, arena.sunColor + '44');
        sunGlow.addColorStop(1, 'transparent');

        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = arena.sunColor;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- HORIZON LANDMARK SCENERY (Parallax cityscapes) ---
      ctx.save();
      if (arena.landmarkType === 'burj_khalifa') {
        // DUBAI: Burj Khalifa & Downtown Skyline
        // Background desert dunes
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(w * 0.25, horizonY + 8, 140, 22, 0, 0, Math.PI * 2);
        ctx.ellipse(w * 0.8, horizonY + 6, 180, 26, 0, 0, Math.PI * 2);
        ctx.fill();

        // Surrounding Dubai Skyscrapers
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(w / 2 - 110, horizonY - 70, 36, 70);
        ctx.fillRect(w / 2 - 68, horizonY - 95, 26, 95);
        ctx.fillRect(w / 2 + 40, horizonY - 85, 30, 85);
        ctx.fillRect(w / 2 + 76, horizonY - 60, 40, 60);

        // Skyscraper glowing window grids
        ctx.fillStyle = '#fde047';
        ctx.globalAlpha = 0.45;
        for (let row = 0; row < 6; row++) {
          ctx.fillRect(w / 2 - 104, horizonY - 62 + row * 10, 24, 2);
          ctx.fillRect(w / 2 + 46, horizonY - 78 + row * 11, 18, 2);
        }

        // Majestic Burj Khalifa Centerpiece
        ctx.fillStyle = '#f59e0b';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(w / 2, horizonY - 145); // top antenna
        ctx.lineTo(w / 2 + 2, horizonY - 130);
        ctx.lineTo(w / 2 + 6, horizonY - 80);
        ctx.lineTo(w / 2 + 16, horizonY - 35);
        ctx.lineTo(w / 2 + 24, horizonY);
        ctx.lineTo(w / 2 - 24, horizonY);
        ctx.lineTo(w / 2 - 16, horizonY - 35);
        ctx.lineTo(w / 2 - 6, horizonY - 80);
        ctx.lineTo(w / 2 - 2, horizonY - 130);
        ctx.closePath();
        ctx.fill();

        // Burj Khalifa illuminated observation levels
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(w / 2 - 12, horizonY - 40, 24, 3);
        ctx.fillRect(w / 2 - 7, horizonY - 85, 14, 3);
        ctx.fillRect(w / 2 - 3, horizonY - 125, 6, 2);

        // Flashing aircraft beacon on needle tip
        if (Math.floor(Date.now() / 400) % 2 === 0) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(w / 2, horizonY - 146, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (arena.landmarkType === 'eiffel_tower') {
        // PARIS: Eiffel Tower & Haussmannian Mansard Roofs
        // Parisian Haussmann apartment facades on left & right
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(w / 2 - 130, horizonY - 55, 48, 55);
        ctx.fillRect(w / 2 - 78, horizonY - 48, 38, 48);
        ctx.fillRect(w / 2 + 45, horizonY - 50, 42, 50);
        ctx.fillRect(w / 2 + 92, horizonY - 58, 45, 58);

        // Mansard blue-grey zinc roofs & dormers
        ctx.fillStyle = '#4b5563';
        ctx.beginPath();
        ctx.moveTo(w / 2 - 134, horizonY - 55);
        ctx.lineTo(w / 2 - 106, horizonY - 70);
        ctx.lineTo(w / 2 - 82, horizonY - 55);
        ctx.fill();

        // The Eiffel Tower Centerpiece
        ctx.fillStyle = '#9ca3af';
        ctx.globalAlpha = 0.95;
        // Arch base
        ctx.beginPath();
        ctx.moveTo(w / 2 - 28, horizonY);
        ctx.lineTo(w / 2 - 18, horizonY - 40);
        ctx.lineTo(w / 2 - 8, horizonY - 78);
        ctx.lineTo(w / 2 - 3, horizonY - 138);
        ctx.lineTo(w / 2 + 3, horizonY - 138);
        ctx.lineTo(w / 2 + 8, horizonY - 78);
        ctx.lineTo(w / 2 + 18, horizonY - 40);
        ctx.lineTo(w / 2 + 28, horizonY);
        ctx.lineTo(w / 2 + 14, horizonY);
        // Base arched cutout
        ctx.quadraticCurveTo(w / 2, horizonY - 26, w / 2 - 14, horizonY);
        ctx.closePath();
        ctx.fill();

        // Platforms
        ctx.fillStyle = '#d1d5db';
        ctx.fillRect(w / 2 - 20, horizonY - 42, 40, 4);
        ctx.fillRect(w / 2 - 10, horizonY - 80, 20, 3);
        ctx.fillRect(w / 2 - 4, horizonY - 120, 8, 3);

        // Rotating Eiffel Tower Spotlight Searchlight
        const searchlightAngle = (g.distance * 0.04) % (Math.PI * 2);
        const beamX = w / 2 + Math.cos(searchlightAngle) * 90;
        const beamY = horizonY - 145 + Math.sin(searchlightAngle) * 30;

        const beamGrad = ctx.createLinearGradient(w / 2, horizonY - 140, beamX, beamY);
        beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.7)');
        beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(w / 2, horizonY - 140);
        ctx.lineTo(beamX - 18, beamY);
        ctx.lineTo(beamX + 18, beamY);
        ctx.closePath();
        ctx.fill();
      } else if (arena.landmarkType === 'solar_panels_palms') {
        // KOCHI: Chinese Fishing Nets & Kerala Backwater Waterfront
        // Distant backwater lagoon reflection
        ctx.fillStyle = '#0e7490';
        ctx.fillRect(0, horizonY - 18, w, 20);

        // Coconut groves along waterbank
        ctx.fillStyle = '#064e3b';
        for (let p = 0; p < 8; p++) {
          const px = w * 0.1 + p * (w * 0.12);
          ctx.beginPath();
          ctx.arc(px, horizonY - 32, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(px - 2, horizonY - 30, 4, 28);
        }

        // Traditional Kettuvallam Houseboat on the river
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.ellipse(w * 0.32, horizonY - 6, 26, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#d97706'; // thatched arched roof
        ctx.beginPath();
        ctx.arc(w * 0.32, horizonY - 9, 14, Math.PI, 0);
        ctx.fill();

        // Chinese Fishing Net (Cheena Vala) Cantilever Frame in Center
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Central pivot mast
        ctx.moveTo(w / 2 - 20, horizonY);
        ctx.lineTo(w / 2 - 10, horizonY - 45);
        ctx.lineTo(w / 2 + 35, horizonY - 70);
        ctx.stroke();
        // Cantilever arms dipping toward water
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 10, horizonY - 45);
        ctx.lineTo(w / 2 + 55, horizonY - 15);
        ctx.lineTo(w / 2 + 10, horizonY - 10);
        ctx.stroke();
        // Suspended mesh net
        ctx.fillStyle = 'rgba(234, 88, 12, 0.4)';
        ctx.beginPath();
        ctx.moveTo(w / 2 + 15, horizonY - 38);
        ctx.lineTo(w / 2 + 52, horizonY - 15);
        ctx.lineTo(w / 2 + 20, horizonY - 12);
        ctx.closePath();
        ctx.fill();
      } else if (arena.landmarkType === 'jewel_waterfall') {
        // SINGAPORE: Marina Bay Sands & Supertrees
        ctx.fillStyle = '#0f766e';
        // Left & right Marina Bay Sands 3 towers
        ctx.fillRect(w / 2 - 38, horizonY - 75, 16, 75);
        ctx.fillRect(w / 2 - 10, horizonY - 78, 16, 78);
        ctx.fillRect(w / 2 + 18, horizonY - 75, 16, 75);
        // SkyPark Rooftop Surfboard Boat
        ctx.fillStyle = '#14b8a6';
        ctx.beginPath();
        ctx.roundRect(w / 2 - 48, horizonY - 84, 96, 9, 4);
        ctx.fill();

        // Jewel Rain Vortex Waterfall
        ctx.fillStyle = '#a7f3d0';
        ctx.globalAlpha = 0.55;
        ctx.fillRect(w / 2 - 6, horizonY - 60, 12, 60);
        ctx.beginPath();
        ctx.ellipse(w / 2, horizonY, 32, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#6ee7b7';
        ctx.fill();
      } else if (arena.landmarkType === 'big_ben_clock') {
        // LONDON: Big Ben & London Eye
        // Big Ben Tower
        ctx.fillStyle = '#334155';
        ctx.fillRect(w / 2 - 16, horizonY - 105, 32, 105);
        // Roof Spire
        ctx.beginPath();
        ctx.moveTo(w / 2, horizonY - 132);
        ctx.lineTo(w / 2 + 16, horizonY - 105);
        ctx.lineTo(w / 2 - 16, horizonY - 105);
        ctx.closePath();
        ctx.fill();
        // Illuminated Golden Clock Face
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(w / 2, horizonY - 88, 9, 0, Math.PI * 2);
        ctx.fill();

        // London Eye Observation Wheel on right
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(w / 2 + 65, horizonY - 45, 34, 0, Math.PI * 2);
        ctx.stroke();
      } else if (arena.landmarkType === 'lamp_bear') {
        // DOHA: Urs Fischer Giant Yellow Lamp Bear
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(w / 2, horizonY - 48, 16, 0, Math.PI * 2);
        ctx.arc(w / 2, horizonY - 22, 22, 0, Math.PI * 2);
        ctx.fill();
        // Black lamp overhead
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(w / 2 + 16, horizonY - 75, 4, 45);
        ctx.beginPath();
        ctx.arc(w / 2 + 10, horizonY - 76, 12, Math.PI, 0);
        ctx.fill();
      } else {
        // KUALA LUMPUR: Petronas Twin Towers
        ctx.fillStyle = '#eab308';
        ctx.fillRect(w / 2 - 28, horizonY - 110, 16, 110);
        ctx.fillRect(w / 2 + 12, horizonY - 110, 16, 110);
        // Spires
        ctx.beginPath();
        ctx.moveTo(w / 2 - 20, horizonY - 128);
        ctx.lineTo(w / 2 - 12, horizonY - 110);
        ctx.lineTo(w / 2 - 28, horizonY - 110);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(w / 2 + 20, horizonY - 128);
        ctx.lineTo(w / 2 + 28, horizonY - 110);
        ctx.lineTo(w / 2 + 12, horizonY - 110);
        ctx.fill();
        // Skybridge
        ctx.fillRect(w / 2 - 12, horizonY - 60, 24, 6);
      }
      ctx.restore();

      // Overhead Ceiling Architecture / Skyway Arches
      ctx.save();
      ctx.strokeStyle = arena.archColor;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.28;
      for (let arch = 0; arch < 4; arch++) {
        const archOffset = ((g.distance * 0.2 + arch * 120) % 480);
        const archY = horizonY - 38 - arch * 15;
        ctx.beginPath();
        ctx.ellipse(w / 2, archY, 185 - arch * 25, 60, 0, Math.PI, 0);
        ctx.stroke();
      }
      ctx.restore();

      // Big Destination Flight & Street Signboard
      ctx.save();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(w / 2 - 135, horizonY - 84, 270, 44);
      ctx.strokeStyle = arena.archColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(w / 2 - 135, horizonY - 84, 270, 44);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(arena.fidsTitle, w / 2, horizonY - 69);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '9px monospace';
      ctx.fillText(`${arena.cityName.toUpperCase()} EXP · SPEED: ${Math.round(g.speed * 2.5)} KM/H · COINS: ${g.coinsCollected}`, w / 2, horizonY - 51);
      ctx.restore();

      // --- ROAD & TERRAIN (3D Perspective Road) ---
      // Road Shoulders (Left & Right terrain outside the curbs)
      ctx.fillStyle = arena.shoulderColor;
      ctx.fillRect(0, horizonY, w, h - horizonY);

      // Road Surface (Dark Asphalt/Tarmac with perspective)
      const vanishingX = w / 2;
      const roadHalfWidthFar = 48;
      const roadHalfWidthNear = 160;

      ctx.save();
      const roadGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      roadGrad.addColorStop(0, arena.floorColors[0]);
      roadGrad.addColorStop(0.35, arena.floorColors[1]);
      roadGrad.addColorStop(1, arena.floorColors[2]);
      ctx.fillStyle = roadGrad;

      ctx.beginPath();
      ctx.moveTo(vanishingX - roadHalfWidthFar, horizonY);
      ctx.lineTo(vanishingX + roadHalfWidthFar, horizonY);
      ctx.lineTo(vanishingX + roadHalfWidthNear, h);
      ctx.lineTo(vanishingX - roadHalfWidthNear, h);
      ctx.closePath();
      ctx.fill();

      // Moving Red/White or Yellow Curbs on Road Edges
      const curbSegmentHeight = 28;
      const curbOffset = (g.distance * 1.8) % (curbSegmentHeight * 2);

      for (let cy = horizonY; cy < h; cy += curbSegmentHeight) {
        const segProgress = (cy - horizonY) / (h - horizonY);
        const curHalfW = roadHalfWidthFar + (roadHalfWidthNear - roadHalfWidthFar) * segProgress;
        const colorIdx = Math.floor((cy + curbOffset) / curbSegmentHeight) % 2;
        ctx.fillStyle = arena.curbColors[colorIdx];

        // Left curb strip
        ctx.fillRect(vanishingX - curHalfW - 5, cy, 6, curbSegmentHeight);
        // Right curb strip
        ctx.fillRect(vanishingX + curHalfW - 1, cy, 6, curbSegmentHeight);
      }

      // Moving Dashed Lane Dividing Lines (3 Lanes -> 2 Dividers)
      const dashLength = 36;
      const dashGap = 30;
      const dashOffset = (g.distance * 1.8) % (dashLength + dashGap);

      ctx.strokeStyle = arena.trackLineColor;
      ctx.lineWidth = 3;

      const laneDividers = [-0.33, 0.33]; // positions between lanes -1, 0, 1
      laneDividers.forEach(ratio => {
        ctx.beginPath();
        for (let ly = horizonY + dashOffset; ly < h; ly += dashLength + dashGap) {
          const segProgress1 = (ly - horizonY) / (h - horizonY);
          const segProgress2 = Math.min(1, (ly + dashLength - horizonY) / (h - horizonY));
          const w1 = roadHalfWidthFar + (roadHalfWidthNear - roadHalfWidthFar) * segProgress1;
          const w2 = roadHalfWidthFar + (roadHalfWidthNear - roadHalfWidthFar) * segProgress2;

          ctx.moveTo(vanishingX + ratio * w1, ly);
          ctx.lineTo(vanishingX + ratio * w2, ly + dashLength);
        }
        ctx.stroke();
      });
      ctx.restore();

      // --- Helper for 3D perspective projection ---
      const project = (lane: number, z: number, yLift = 0) => {
        const scale = 280 / (z + 180);
        const laneOffsets = [-1, 0, 1];
        const segProgress = Math.pow(Math.max(0, 1 - z / 1200), 1.25);
        const curRoadHalfW = roadHalfWidthFar + (roadHalfWidthNear - roadHalfWidthFar) * segProgress;
        const baseX = vanishingX + laneOffsets[lane] * (curRoadHalfW * 0.65);
        const baseY = horizonY + (h - horizonY) * segProgress - yLift * scale;
        return { x: baseX, y: baseY, scale };
      };

      // --- DRAW ROADSIDE ASSETS (Trees, Lamps, Palms, Nets) ---
      // Sort roadside items by Z descending (furthest first)
      const sortedRoadside = [...g.roadsideObjects].sort((a, b) => b.z - a.z);
      sortedRoadside.forEach(item => {
        if (item.z < 0 || item.z > 1250) return;
        const scale = 280 / (item.z + 180);
        const segProgress = Math.pow(Math.max(0, 1 - item.z / 1200), 1.25);
        const curRoadHalfW = roadHalfWidthFar + (roadHalfWidthNear - roadHalfWidthFar) * segProgress;

        const shoulderOffset = 28 * scale;
        const posX = item.side === 'left' 
          ? vanishingX - curRoadHalfW - shoulderOffset 
          : vanishingX + curRoadHalfW + shoulderOffset;
        const posY = horizonY + (h - horizonY) * segProgress;

        ctx.save();
        ctx.translate(posX, posY);
        ctx.scale(scale, scale);

        if (item.type === 'palm_tree') {
          // Dubai Date Palm Tree
          ctx.fillStyle = '#78350f'; // trunk
          ctx.beginPath();
          ctx.moveTo(-6, 0);
          ctx.lineTo(6, 0);
          ctx.lineTo(3, -65);
          ctx.lineTo(-3, -65);
          ctx.closePath();
          ctx.fill();

          // Palm fronds
          ctx.fillStyle = '#15803d';
          for (let f = 0; f < 6; f++) {
            const fAngle = (f * Math.PI) / 3;
            ctx.beginPath();
            ctx.ellipse(Math.cos(fAngle) * 25, -65 + Math.sin(fAngle) * 12, 24, 7, fAngle, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (item.type === 'coconut_palm') {
          // Kerala Coconut Palm (gracefully curved)
          ctx.strokeStyle = '#573312';
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(item.side === 'left' ? -18 : 18, -40, item.side === 'left' ? -12 : 12, -75);
          ctx.stroke();

          // Drooping lush fronds
          const crownX = item.side === 'left' ? -12 : 12;
          ctx.fillStyle = '#16a34a';
          for (let f = 0; f < 7; f++) {
            const angle = (f * Math.PI) / 3.5;
            ctx.beginPath();
            ctx.ellipse(crownX + Math.cos(angle) * 28, -75 + Math.sin(angle) * 14, 26, 6, angle, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (item.type === 'avenue_tree') {
          // Parisian Avenue Linden Tree
          ctx.fillStyle = '#292524';
          ctx.fillRect(-5, -60, 10, 60);
          // Foliage crown
          ctx.fillStyle = '#166534';
          ctx.beginPath();
          ctx.arc(0, -68, 28, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(5, -74, 18, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'eiffel_lamp') {
          // Parisian Ornate Wrought Iron Street Lamp
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(-3, -65, 6, 65);
          ctx.fillRect(-12, -68, 24, 4);
          // Glowing warm amber lanterns
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(-10, -64, 5, 0, Math.PI * 2);
          ctx.arc(10, -64, 5, 0, Math.PI * 2);
          ctx.arc(0, -74, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'fishing_net') {
          // Kochi Chinese Fishing Net structure on shoulder
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(item.side === 'left' ? -25 : 25, -60);
          ctx.lineTo(item.side === 'left' ? -45 : 45, -20);
          ctx.stroke();
          ctx.fillStyle = 'rgba(234, 88, 12, 0.4)';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(item.side === 'left' ? -25 : 25, -60);
          ctx.lineTo(item.side === 'left' ? -45 : 45, -20);
          ctx.closePath();
          ctx.fill();
        } else if (item.type === 'phone_box') {
          // London Iconic Red Telephone Box
          ctx.fillStyle = '#dc2626';
          ctx.roundRect(-10, -55, 20, 55, 3);
          ctx.fill();
          // Glass window panes
          ctx.fillStyle = '#e0f2fe';
          ctx.fillRect(-7, -48, 14, 16);
          ctx.fillRect(-7, -28, 14, 16);
        } else {
          // Modern Highway Lamp
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -60);
          ctx.quadraticCurveTo(0, -75, item.side === 'left' ? 14 : -14, -75);
          ctx.stroke();
          // Lamp light head
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(item.side === 'left' ? 14 : -14, -75, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // --- DRAW COLLECTIBLES ---
      g.collectibles.forEach(col => {
        if (col.collected || col.z < 0 || col.z > 1200) return;
        const p = project(col.lane, col.z, 22);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(p.scale, p.scale);

        if (col.type === 'coin') {
          // Spinning 3D Golden Coin with shine
          const spinScaleX = Math.abs(Math.cos(g.distance * 0.12));
          ctx.scale(spinScaleX, 1);

          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#fef3c7';
          ctx.stroke();

          ctx.fillStyle = '#78350f';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🪙', 0, 0);
        } else if (col.type === 'chai') {
          // Local Snack Booster Icon (Karak Chai, Croissant, Karikku, etc.)
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(arena.snackIcon, 0, 0);
        } else if (col.type === 'magnet') {
          // Horseshoe Magnet Power-Up
          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🧲', 0, 0);
        }
        ctx.restore();
      });

      // --- DRAW OBSTACLES ---
      g.obstacles.forEach(obs => {
        if (obs.z < 0 || obs.z > 1200) return;
        const p = project(obs.lane, obs.z, obs.yOffset);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(p.scale, p.scale);

        if (obs.type === 'hurdle') {
          // Low Barrier / Hurdle (Jump over!)
          ctx.fillStyle = '#dc2626'; // red warning
          ctx.roundRect(-24, -20, 48, 24, 6);
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Reflective warning stripes
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-16, -16, 8, 16);
          ctx.fillRect(8, -16, 8, 16);

          // Jump indicator
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('▲ JUMP', 0, -2);
        } else if (obs.type === 'overhead_sign') {
          // Overhead Clearance Gantry (Slide under!)
          ctx.fillStyle = '#1e3a8a';
          ctx.roundRect(-52, -42, 104, 30, 4);
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Overhead steel hangers
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(-38, -75, 4, 34);
          ctx.fillRect(34, -75, 4, 34);

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(arena.cityName.toUpperCase() + ' SPEEDWAY', 0, -28);
          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText('▼ SLIDE UNDER ▼', 0, -16);
        } else {
          // Heavy Concrete / Police Road Divider (Must dodge lane!)
          ctx.fillStyle = '#ea580c';
          ctx.fillRect(-22, -44, 44, 44);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-22, -34, 44, 7);
          ctx.fillRect(-22, -18, 44, 7);
          ctx.strokeStyle = '#7c2d12';
          ctx.lineWidth = 2;
          ctx.strokeRect(-22, -44, 44, 44);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('DODGE', 0, -4);
        }

        ctx.restore();
      });

      // --- DRAW PLAYER (Endless Runner Hero) ---
      const playerBaseY = h * 0.88 - g.jumpY * 1.6;
      const playerBaseX = vanishingX + g.laneX;
      const laneTilt = (g.laneX - laneXTargets[g.targetLane]) * -0.0025; // subtle banking tilt

      ctx.save();
      // Draw shadow at road level (stays on road even when jumping)
      const shadowW = Math.max(12, 38 - g.jumpY * 0.35);
      ctx.beginPath();
      ctx.ellipse(playerBaseX, h * 0.88 + 14, shadowW, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fill();

      // Translate to player position (jumping elevates Y)
      ctx.translate(playerBaseX, playerBaseY);
      ctx.rotate(laneTilt);

      // Boost / Invincibility Ring
      if (g.boostTimer > 0) {
        ctx.beginPath();
        ctx.arc(0, -25, 44, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      // Magnet Aura Ring
      if (g.magnetTimer > 0) {
        ctx.beginPath();
        ctx.arc(0, -25, 48, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      if (g.isSliding) {
        // SLIDING DUCKED POSTURE
        ctx.fillStyle = equippedSkin.jacketColor;
        ctx.roundRect(-22, -18, 44, 22, 8);
        ctx.fill();

        // Wheeled luggage trailing
        ctx.fillStyle = equippedSkin.bagColor;
        ctx.fillRect(-36, -14, 18, 16);

        // Head
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(14, -10, 11, 0, Math.PI * 2);
        ctx.fill();

        // Friction Sparks
        g.slideSparks.forEach(spk => {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(-26 + spk.x, 2 + spk.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // RUNNING / JUMPING POSTURE
        const legCycle = Math.sin(g.distance * 0.25);

        // Wheeled Carry-on Bag / Backpack
        ctx.fillStyle = equippedSkin.bagColor;
        ctx.roundRect(-26, -34, 15, 26, 4);
        ctx.fill();
        ctx.fillStyle = '#451a03';
        ctx.fillRect(-22, -40, 8, 6); // handle

        // Runner Torso / Jacket
        ctx.fillStyle = equippedSkin.jacketColor;
        ctx.roundRect(-14, -42, 28, 30, 8);
        ctx.fill();

        // Head / Face
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(0, -52, 13, 0, Math.PI * 2);
        ctx.fill();

        // Cap / Hat
        ctx.fillStyle = equippedSkin.hatColor;
        ctx.beginPath();
        ctx.arc(0, -56, 13, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(-4, -58, 18, 4); // brim

        // Animated Running Legs
        ctx.fillStyle = equippedSkin.pantsColor;
        if (g.isJumping) {
          // Tucked legs during leap
          ctx.fillRect(-10, -12, 9, 14);
          ctx.fillRect(1, -12, 9, 12);
          // Red sneakers
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-11, 2, 11, 6);
          ctx.fillRect(0, 0, 11, 6);
        } else {
          // Alternating running stride
          ctx.fillRect(-10, -12, 8, 18 + legCycle * 5);
          ctx.fillRect(2, -12, 8, 18 - legCycle * 5);
          // Red sneakers
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-11, 6 + legCycle * 5, 11, 7);
          ctx.fillRect(1, 6 - legCycle * 5, 11, 7);
        }
      }

      ctx.restore();

      // Request next frame
      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, recordGameRun, currentArena]);

  return (
    <div className="space-y-4 pb-20 md:pb-12 max-w-4xl mx-auto px-4 sm:px-6 pt-4">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentArena.flag}</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {currentArena.title}
            </h1>
            <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
              {currentArena.airportCode} Arena
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentArena.environmentName} · Grab {currentArena.snackName} ({currentArena.snackIcon}) & bank coins.
          </p>
        </div>

        {/* Controls, Arena Switcher, Wardrobe & Audio */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Destination Arena Switcher Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <select
              value={arenaCode}
              onChange={(e) => {
                setArenaCode(e.target.value);
                if (gameState === 'playing') {
                  setGameState('menu');
                }
              }}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer pr-1"
              title="Change Destination Scenery"
            >
              {Object.values(ARENA_CONFIGS).map((ac) => (
                <option key={ac.airportCode} value={ac.airportCode}>
                  {ac.flag} {ac.cityName} ({ac.airportCode})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowWardrobeModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm transition-transform hover:scale-105"
            title="Open Wardrobe & Outfits"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Wardrobe</span>
          </button>

          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="text-slate-600">Best:</span>
            <span className="text-amber-900">{userStats.highScoreDubaiDash}m</span>
          </div>

          <button
            onClick={toggleSound}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Main Game Screen Canvas Container */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-slate-900 bg-slate-950 aspect-[4/3] max-h-[520px] w-full flex items-center justify-center select-none">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full object-contain cursor-crosshair touch-none"
        />

        {/* Live HUD Overlay (when playing) */}
        {gameState === 'playing' && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            {/* Live Distance & Destination Flag */}
            <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700 px-3.5 py-1.5 rounded-2xl text-white flex items-center gap-2 shadow-lg">
              <span className="text-xs">{currentArena.flag}</span>
              <span className="text-sky-400 font-black text-xs sm:text-sm">DISTANCE:</span>
              <span className="text-lg sm:text-xl font-black tracking-tight">{liveDistance}m</span>
            </div>

            {/* Collected Coins */}
            <div className="bg-slate-900/85 backdrop-blur-md border border-amber-500/40 px-3.5 py-1.5 rounded-2xl text-amber-300 flex items-center gap-2 shadow-lg">
              <span className="text-base">🪙</span>
              <span className="text-lg sm:text-xl font-black tracking-tight">+{sessionCoins}</span>
            </div>
          </div>
        )}

        {/* Start / Menu Overlay */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 text-white">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-3xl shadow-lg animate-bounce">
              {currentArena.snackIcon || '⚡'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
                <span>{currentArena.flag} {currentArena.cityName}</span>
                <span>•</span>
                <span>{currentArena.terminalSubtitle}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {currentArena.title.toUpperCase()}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm">
                Sprint past {currentArena.landmarkName}! Switch lanes, jump over road hurdles, duck under gantries, and bank real coins.
              </p>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-xs text-slate-300 max-w-xs space-y-1 text-left">
              <div className="font-bold text-amber-300 text-center mb-1">🎮 CONTROLS</div>
              <div className="flex justify-between">
                <span>Move Left / Right:</span>
                <span className="font-mono text-white">← → or A / D</span>
              </div>
              <div className="flex justify-between">
                <span>Jump Over Hurdles:</span>
                <span className="font-mono text-white">↑ or W or Space</span>
              </div>
              <div className="flex justify-between">
                <span>Slide Under Signs:</span>
                <span className="font-mono text-white">↓ or S</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-base shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START {currentArena.cityName.toUpperCase()} DASH</span>
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && gameOverStats && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 text-white animate-in zoom-in-95 duration-200">
            <div className="text-4xl">💥</div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-red-400">
                ROAD COLLISION!
              </h2>
              <p className="text-xs text-slate-300">
                You tripped near {currentArena.landmarkName}! But your {currentArena.cityName} run was glorious.
              </p>
            </div>

            {/* Run summary card */}
            <div className="grid grid-cols-3 gap-3 bg-white/10 border border-white/10 p-4 rounded-2xl w-full max-w-xs text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Distance</span>
                <span className="text-lg font-black text-white">{gameOverStats.distance}m</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-300 uppercase block font-bold">Coins Banked</span>
                <span className="text-lg font-black text-amber-400">+{gameOverStats.coins}</span>
              </div>
              <div>
                <span className="text-[10px] text-sky-300 uppercase block font-bold">XP Gained</span>
                <span className="text-lg font-black text-sky-400">+{gameOverStats.xp}</span>
              </div>
            </div>

            {gameOverStats.isRecord && (
              <div className="bg-amber-500/20 border border-amber-400/50 px-4 py-1.5 rounded-full text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>NEW PERSONAL BEST DISTANCE!</span>
              </div>
            )}

            {/* Travel Wallet connection notice */}
            <div className="bg-sky-950/60 border border-sky-500/30 rounded-2xl p-3 text-xs text-sky-200 max-w-sm flex items-center gap-2.5">
              <span className="text-xl">💳</span>
              <div className="text-left leading-tight">
                <span className="font-bold text-white block">Travel Wallet Connected</span>
                <span className="text-[11px] text-sky-300">
                  +{gameOverStats.coins} coins added! Convert 100 coins into ₹10 in concourse discounts.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                onClick={startGame}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-lg transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RUN AGAIN</span>
              </button>

              <button
                onClick={() => setActiveTab('wallet')}
                className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <span>Convert in Wallet</span>
                <span className="text-xs">💳</span>
              </button>

              <button
                onClick={() => setActiveTab('passport')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Passport
              </button>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 text-white">
            <h2 className="text-2xl font-black">GAME PAUSED</h2>
            <p className="text-xs text-slate-300">
              Catch your breath in {currentArena.cityName}!
            </p>
            <button
              onClick={() => setGameState('playing')}
              className="bg-sky-500 hover:bg-sky-400 text-white font-black px-6 py-2.5 rounded-xl text-sm shadow-md transition-transform hover:scale-105"
            >
              Resume Run
            </button>
          </div>
        )}
      </div>

      {/* On-Screen Mobile & Touch Game Controls */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>TOUCH CONTROLS</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Swipe on canvas or use on-screen buttons
          </span>
          <button
            onClick={() => setGameState(prev => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev))}
            className="text-[11px] font-bold text-sky-600 hover:underline"
          >
            {gameState === 'playing' ? 'Pause Game' : gameState === 'paused' ? 'Resume Game' : ''}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {/* Left */}
          <button
            type="button"
            onClick={moveLeft}
            className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold p-3.5 rounded-2xl flex flex-col items-center justify-center transition-transform active:scale-90 touch-manipulation cursor-pointer"
            title="Move Left"
          >
            <ArrowLeft className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Left</span>
          </button>

          {/* Jump */}
          <button
            type="button"
            onClick={jump}
            className="bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold p-3.5 rounded-2xl flex flex-col items-center justify-center shadow-sm transition-transform active:scale-90 touch-manipulation cursor-pointer"
            title="Jump"
          >
            <ArrowUp className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Jump</span>
          </button>

          {/* Slide */}
          <button
            type="button"
            onClick={slide}
            className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold p-3.5 rounded-2xl flex flex-col items-center justify-center shadow-sm transition-transform active:scale-90 touch-manipulation cursor-pointer"
            title="Slide"
          >
            <ArrowDown className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Slide</span>
          </button>

          {/* Right */}
          <button
            type="button"
            onClick={moveRight}
            className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold p-3.5 rounded-2xl flex flex-col items-center justify-center transition-transform active:scale-90 touch-manipulation cursor-pointer"
            title="Move Right"
          >
            <ArrowRight className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Right</span>
          </button>
        </div>
      </div>

      {/* Wardrobe / Duty Free Outfits Modal */}
      <DutyFreeShopModal
        isOpen={showWardrobeModal}
        onClose={() => setShowWardrobeModal(false)}
      />
    </div>
  );
};
