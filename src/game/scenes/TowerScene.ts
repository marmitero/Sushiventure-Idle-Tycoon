import Phaser from 'phaser';
import { ASSETS, FRAME_COUNTS, carPaths, keyFor } from '../../assets/registry';
import { elevatorTripMs, floorVisualLevel, vehicleIntervalSec } from '../../core/economy';
import type { GameState } from '../../core/state/types';
import { getSession } from '../session';
import { TOWER } from '../worldLayout';

/**
 * TowerScene — the game world: parallax sky, street, the sushi tower built
 * from the official floor/cashier art, and the animated cast.
 * The economy advances here from real elapsed time (never from frame count).
 */
export class TowerScene extends Phaser.Scene {
  constructor() {
    super('TowerScene');
  }

  private floorSprites = new Map<number, Phaser.GameObjects.Image>();
  private nextSlot!: Phaser.GameObjects.Image;
  private cashierSprite!: Phaser.GameObjects.Image;
  private chef: Phaser.GameObjects.Sprite | null = null;
  private liftGuy: Phaser.GameObjects.Sprite | null = null;
  private floorGirl: Phaser.GameObjects.Sprite | null = null;
  private cashierGirl: Phaser.GameObjects.Sprite | null = null;
  private cloudSprites: Phaser.GameObjects.Image[] = [];
  private camTargetY = 0;
  private manualCamUntil = 0;
  private lastNow = 0;

  create(): void {
    const session = getSession();
    this.lastNow = this.time.now;

    this.buildBackdrop();
    this.buildStreet();
    this.buildTower(session.state);
    this.buildCast();

    this.cameras.main.setBackgroundColor('#7ec8e3');
    this.applyCamera(true);

    this.scale.on('resize', () => this.applyCamera(false));
    session.subscribe((state, cause) => {
      if (cause === 'floor_unlocked' || cause === 'floor_upgraded' || cause === 'cashier_upgraded') {
        this.rebuildTower(state);
      }
      if (cause === 'staff_hired' || cause === 'staff_upgraded') {
        this.refreshCast(state);
      }
      this.applyCamera(false);
    });
    this.loadCars([1, 2]);

    this.setupPan();
    const fresh =
      session.state.stats.totalPlaySeconds < 3 &&
      session.state.floors.length === 1 &&
      Object.values(session.state.staff).every((st) => st.level === 0);
    if (fresh) {
      this.time.delayedCall(900, () => {
        this.game.events.emit(
          'ui:toast',
          'Bem-vindo! Toque no andar bloqueado para expandir e contrate sua equipe no botão EQUIPE.',
        );
      });
    }
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        const dt = (this.time.now - this.lastNow) / 1000;
        this.lastNow = this.time.now;
        getSession().advance(dt);
      },
    });
  }

  // ---------------------------------------------------------------- backdrop
  private buildBackdrop(): void {
    const sky = this.add.image(0, 0, 'bg.sky');
    sky.setOrigin(0.5, 0);
    sky.setScrollFactor(0.08);
    sky.setDepth(-20);
    this.cloudSprites = [];
    for (let i = 0; i < 4; i += 1) {
      const cloud = this.add.image(i * 420 - 600, 120 + (i % 2) * 160, keyFor(ASSETS.clouds));
      cloud.setScrollFactor(0.22);
      cloud.setDepth(-15);
      cloud.setAlpha(0.85);
      this.cloudSprites.push(cloud);
    }
    void sky;
  }

  private buildStreet(): void {
    const street = this.add.image(0, TOWER.streetTop, 'bg.street');
    street.setOrigin(0.5, 0);
    street.setDepth(-10);
  }

  // ------------------------------------------------------------------- tower
  private buildTower(state: GameState): void {
    this.cashierSprite = this.add.image(0, 0, keyFor(ASSETS.cashiers(state.cashierLevel)));
    this.cashierSprite.setOrigin(0.5, 1);
    this.cashierSprite.setY(TOWER.cashierBottom);
    this.cashierSprite.setDepth(2);

    for (const floor of state.floors) this.addFloorSprite(floor.index, floor.level);

    this.nextSlot = this.add.image(0, 0, keyFor(ASSETS.floors(0)));
    this.nextSlot.setOrigin(0.5, 1);
    this.nextSlot.setDepth(1);
    this.nextSlot.setInteractive({ useHandCursor: true });
    this.nextSlot.on('pointerdown', () => {
      this.game.events.emit('ui:open-upgrades', { focus: 'unlock' });
    });
    this.positionNextSlot(state);
  }

  private addFloorSprite(index: number, level: number): void {
    const sprite = this.add.image(0, TOWER.floorBottom(index), keyFor(ASSETS.floors(floorVisualLevel(level))));
    sprite.setOrigin(0.5, 1);
    sprite.setDepth(2);
    sprite.setInteractive({ useHandCursor: true });
    sprite.on('pointerdown', () => {
      this.game.events.emit('ui:open-upgrades', { focus: `floor:${index}` });
    });
    this.floorSprites.set(index, sprite);
  }

  private rebuildTower(state: GameState): void {
    for (const sprite of this.floorSprites.values()) sprite.destroy();
    this.floorSprites.clear();
    for (const floor of state.floors) this.addFloorSprite(floor.index, floor.level);
    this.cashierSprite.setTexture(keyFor(ASSETS.cashiers(state.cashierLevel)));
    this.positionNextSlot(state);
    this.flashTowerTop(state);
  }

  private positionNextSlot(state: GameState): void {
    this.nextSlot.setY(TOWER.floorBottom(state.floors.length));
    this.nextSlot.setVisible(state.floors.length < 24);
  }

  private flashTowerTop(state: GameState): void {
    if (getSession().state.settings.reducedMotion) return;
    const topY = TOWER.floorBottom(state.floors.length - 1) - TOWER.floorHeight / 2;
    const flash = this.add.circle(0, topY, 60, 0xfff3b0, 0.85);
    flash.setDepth(30);
    this.tweens.add({
      targets: flash,
      scale: 4,
      alpha: 0,
      duration: 650,
      onComplete: () => flash.destroy(),
    });
  }

  // -------------------------------------------------------------------- cast
  /**
   * The cast mirrors the payroll: a character only exists on screen when the
   * corresponding staff member is hired (manifest-driven, no phantom workers).
   */
  private buildCast(): void {
    this.refreshCast(getSession().state);
  }

  private refreshCast(state: GameState): void {
    const hired = (id: 'attendant' | 'chef' | 'floorGirl' | 'liftGuy'): boolean =>
      (state.staff[id]?.level ?? 0) > 0;

    const wantCashier = hired('attendant');
    if (wantCashier && !this.cashierGirl) {
      this.cashierGirl = this.add
        .sprite(TOWER.cashierGirlX, TOWER.cashierGirlY, 'Cashier Girl/ChashierGirl-animation_00')
        .setDepth(3);
      this.cashierGirl.play('anim.cashierGirl');
    } else if (!wantCashier && this.cashierGirl) {
      this.cashierGirl.destroy();
      this.cashierGirl = null as unknown as Phaser.GameObjects.Sprite;
    }

    const wantChef = hired('chef');
    if (wantChef && !this.chef) {
      this.chef = this.add.sprite(0, TOWER.chefY, 'Chef Guy/Walk/ChefGuy-Walk_00').setDepth(4);
      this.chef.play('anim.chefWalk');
    } else if (!wantChef && this.chef) {
      this.chef.destroy();
      this.chef = null as unknown as Phaser.GameObjects.Sprite;
    }

    const wantFloor = hired('floorGirl');
    if (wantFloor && !this.floorGirl) {
      const floorIndex = Math.min(1, state.floors.length - 1);
      this.floorGirl = this.add
        .sprite(TOWER.floorGirlX, TOWER.floorGirlY(floorIndex), 'Floor Girl/FloorGirl-animation_00')
        .setDepth(3);
      this.floorGirl.play('anim.floorGirl');
    } else if (!wantFloor && this.floorGirl) {
      this.floorGirl.destroy();
      this.floorGirl = null as unknown as Phaser.GameObjects.Sprite;
    }

    const wantLift = hired('liftGuy');
    if (wantLift && !this.liftGuy) {
      this.liftGuy = this.add
        .sprite(TOWER.shaftX, TOWER.floorCenterY(0), 'Lift Guy/Lift Guy-animation_00')
        .setDepth(3);
      this.liftGuy.play('anim.liftGuy');
      this.startLiftTween(state);
    } else if (!wantLift && this.liftGuy) {
      this.tweens.killTweensOf(this.liftGuy);
      this.liftGuy.destroy();
      this.liftGuy = null as unknown as Phaser.GameObjects.Sprite;
    } else if (wantLift && this.liftGuy) {
      this.startLiftTween(state);
    }
  }

  /** Elevator speed comes from the economy (lift guy level), not from a constant. */
  private startLiftTween(state: GameState): void {
    if (!this.liftGuy) return;
    this.tweens.killTweensOf(this.liftGuy);
    const topFloor = Math.min(2, Math.max(0, state.floors.length - 1));
    this.tweens.add({
      targets: this.liftGuy,
      y: TOWER.floorCenterY(topFloor),
      duration: elevatorTripMs(state),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }

  // --------------------------------------------------------------- deliveries
  /**
   * Delivery traffic: vehicles cross the street and sometimes stop to drop an
   * order. Frequency derives from `vehicleIntervalSec` (lift guy efficiency),
   * so the visual is feedback of a documented economic layer — no hidden
   * effect (constitution 11.2).
   */
  private carsReady = new Set<number>();
  private cars: Phaser.GameObjects.Sprite[] = [];
  private lastCarAt = 0;

  private loadCars(variants: number[]): void {
    for (const car of variants) {
      for (const p of carPaths(car)) {
        if (!this.textures.exists(keyFor(p))) this.load.image(keyFor(p), `/assets/${p}`);
      }
    }
    this.load.once('complete', () => {
      for (const car of variants) {
        if (this.carsReady.has(car)) continue;
        const moveFrames: Phaser.Types.Animations.AnimationFrame[] = [];
        const idleFrames: Phaser.Types.Animations.AnimationFrame[] = [];
        for (let f = 0; f < FRAME_COUNTS.carMove; f += 1) {
          const key = keyFor(`png/Cars/Car${car}/Move/Cars-Car${car}_Move_${String(f).padStart(2, '0')}.png`);
          if (this.textures.exists(key)) moveFrames.push({ key });
        }
        for (let f = 0; f < FRAME_COUNTS.carIdle; f += 1) {
          const key = keyFor(`png/Cars/Car${car}/Idle/Cars-Car${car}_Idle_${String(f).padStart(2, '0')}.png`);
          if (this.textures.exists(key)) idleFrames.push({ key });
        }
        if (moveFrames.length > 0) {
          this.anims.create({ key: `anim.car${car}.move`, frames: moveFrames, frameRate: 24, repeat: -1 });
        }
        if (idleFrames.length > 0) {
          this.anims.create({ key: `anim.car${car}.idle`, frames: idleFrames, frameRate: 12, repeat: -1 });
        }
        this.carsReady.add(car);
      }
    });
    this.load.start();
  }

  private spawnCar(): void {
    const variants = [...this.carsReady];
    if (variants.length === 0) return;
    const car = variants[Math.floor(Math.random() * variants.length)] ?? 1;
    const dirRight = Math.random() < 0.5;
    const laneY = dirRight ? TOWER.roadNearLaneY : TOWER.roadFarLaneY;
    const startX = dirRight ? -1200 : 1200;
    const sprite = this.add.sprite(startX, laneY, `Cars/Car${car}/Move/Cars-Car${car}_Move_00`);
    sprite.setDepth(1);
    sprite.setFlipX(!dirRight);
    sprite.play(`anim.car${car}.move`);
    const stopX = Phaser.Math.Between(-350, 350);
    const data = {
      dir: dirRight ? 1 : -1,
      speed: Phaser.Math.Between(150, 210),
      stopX,
      stopping: true,
      stopUntil: 0,
      car,
    };
    sprite.setData('drive', data);
    this.cars.push(sprite);
  }

  private updateCars(): void {
    const session = getSession();
    const now = this.time.now;
    if (!session.state.settings.reducedMotion && this.carsReady.size > 0) {
      const interval = vehicleIntervalSec(session.state) * 1000;
      if (now - this.lastCarAt > interval && this.cars.length < 4) {
        this.lastCarAt = now;
        this.spawnCar();
      }
    }
    const dt = this.game.loop.delta / 1000;
    for (const sprite of [...this.cars]) {
      const data = sprite.getData('drive') as {
        dir: number;
        speed: number;
        stopX: number;
        stopping: boolean;
        stopUntil: number;
        car: number;
      };
      if (data.stopping && data.stopUntil === 0 && Math.abs(sprite.x - data.stopX) < 12) {
        data.stopUntil = now + Phaser.Math.Between(1500, 3500);
        sprite.play(`anim.car${data.car}.idle`, true);
      } else if (data.stopUntil > 0 && now >= data.stopUntil) {
        data.stopUntil = -1;
        data.stopping = false;
        sprite.play(`anim.car${data.car}.move`, true);
      } else if (data.stopUntil === 0) {
        sprite.x += data.dir * data.speed * dt;
      } else if (data.stopUntil === -1) {
        sprite.x += data.dir * data.speed * dt;
      }
      if (sprite.x < -1400 || sprite.x > 1400) {
        sprite.destroy();
        this.cars.splice(this.cars.indexOf(sprite), 1);
      }
    }
  }

  // ------------------------------------------------------------------ camera
  private applyCamera(immediate: boolean): void {
    const { width, height } = this.scale;
    const zoom = Phaser.Math.Clamp(width / TOWER.cameraFitWidth, TOWER.minZoom, TOWER.maxZoom);
    this.cameras.main.setZoom(zoom);
    const viewH = height / zoom;
    const state = getSession().state;
    const towerTop = TOWER.floorBottom(state.floors.length);
    const followY = towerTop + viewH * 0.42;
    const groundY = TOWER.streetTop + viewH * 0.34;
    this.camTargetY = Math.min(followY, groundY);
    if (this.time.now < this.manualCamUntil) return;
    if (immediate) {
      this.cameras.main.setScroll(0, this.camTargetY - viewH / 2);
    } else {
      this.cameras.main.setScroll(0, this.camTargetY - viewH / 2);
    }
    void this.cloudSprites;
  }

  private setupPan(): void {
    let dragStartY = 0;
    let scrollStart = 0;
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      dragStartY = pointer.y;
      scrollStart = this.cameras.main.scrollY;
    });
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return;
      const zoom = this.cameras.main.zoom;
      const dy = (pointer.y - dragStartY) / zoom;
      if (Math.abs(pointer.y - dragStartY) > 12) {
        this.manualCamUntil = this.time.now + 4000;
        const { height } = this.scale;
        const viewH = height / zoom;
        const state = getSession().state;
        const minY = TOWER.floorBottom(state.floors.length) - viewH * 0.75;
        const maxY = TOWER.streetTop + viewH * 0.5;
        this.cameras.main.scrollY = Phaser.Math.Clamp(scrollStart - dy, minY, maxY);
      }
    });
  }

  override update(): void {
    // Camera resumes following the tower top once manual pan expires.
    if (this.time.now >= this.manualCamUntil) {
      const viewH = this.scale.height / this.cameras.main.zoom;
      const target = this.camTargetY - viewH / 2;
      const current = this.cameras.main.scrollY;
      if (Math.abs(current - target) > 1) {
        this.cameras.main.scrollY = Phaser.Math.Linear(current, target, 0.08);
      }
    }
    this.updateCars();
    // Chef patrol: walk <-> cook cycle gives the kitchen visible life.
    if (this.chef && this.anims.exists('anim.chefWalk')) {
      const t = this.time.now / 1000;
      const cycle = t % 16;
      if (cycle < 6) {
        this.chef.play('anim.chefWalk', true);
        this.chef.x = Phaser.Math.Linear(-TOWER.chefRange, TOWER.chefRange, cycle / 6);
        this.chef.setFlipX(false);
      } else if (cycle < 10) {
        this.chef.play('anim.chefCooking', true);
        this.chef.x = TOWER.chefRange;
      } else if (cycle < 16) {
        this.chef.play('anim.chefWalkFull', true);
        this.chef.x = Phaser.Math.Linear(TOWER.chefRange, -TOWER.chefRange, (cycle - 10) / 6);
        this.chef.setFlipX(true);
      }
    }
    for (let i = 0; i < this.cloudSprites.length; i += 1) {
      const cloud = this.cloudSprites[i];
      if (cloud) cloud.x += (0.12 + i * 0.03) * (this.game.loop.delta / 16.6);
    }
  }
}
