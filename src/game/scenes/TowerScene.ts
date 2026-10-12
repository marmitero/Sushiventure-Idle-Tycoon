import Phaser from 'phaser';
import { ASSETS, keyFor } from '../../assets/registry';
import { floorVisualLevel } from '../../core/economy';
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
  private chef!: Phaser.GameObjects.Sprite;
  private liftGuy!: Phaser.GameObjects.Sprite;
  private floorGirl!: Phaser.GameObjects.Sprite;
  private cashierGirl!: Phaser.GameObjects.Sprite;
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
      this.applyCamera(false);
    });

    this.setupPan();
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
  private buildCast(): void {
    this.cashierGirl = this.add.sprite(TOWER.cashierGirlX, TOWER.cashierGirlY, 'Cashier Girl/ChashierGirl-animation_00');
    this.cashierGirl.setDepth(3);
    this.cashierGirl.play('anim.cashierGirl');

    this.chef = this.add.sprite(0, TOWER.chefY, 'Chef Guy/Walk/ChefGuy-Walk_00');
    this.chef.setDepth(4);
    this.chef.play('anim.chefWalk');

    this.floorGirl = this.add.sprite(TOWER.floorGirlX, TOWER.floorGirlY(0), 'Floor Girl/FloorGirl-animation_00');
    this.floorGirl.setDepth(3);
    this.floorGirl.play('anim.floorGirl');

    this.liftGuy = this.add.sprite(TOWER.shaftX, TOWER.floorCenterY(0), 'Lift Guy/Lift Guy-animation_00');
    this.liftGuy.setDepth(3);
    this.liftGuy.play('anim.liftGuy');
    this.tweens.add({
      targets: this.liftGuy,
      y: TOWER.floorCenterY(2),
      duration: 4200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
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
