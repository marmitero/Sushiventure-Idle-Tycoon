import Phaser from 'phaser';
import { allRegistryPaths, keyFor } from '../../assets/registry';
import { getSession } from '../session';
import { FONT, kitText } from '../ui/kit';

interface Manifest {
  generatedAt: string;
  source: string;
  entries: Record<string, { width: number; height: number; bytes: number }>;
}

/**
 * BootScene — loads the generated asset manifest, then every runtime texture
 * the tower/cast/UI need (cars are deferred to Phase 3 deliveries).
 * Derives sky/street sub-textures from the official background so the world
 * can parallax without inventing new art.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  private bar!: Phaser.GameObjects.Graphics;
  private status!: Phaser.GameObjects.Text;

  preload(): void {
    this.bar = this.add.graphics();
    this.status = kitText(this, 0, 0, 'Carregando o restaurante…', { size: 26, color: '#ffe9c9', stroke: '#3a2313' });
    this.status.setOrigin(0.5);
    this.load.on('progress', (value: number) => this.drawProgress(value));
    this.load.json('manifest', '/assets/manifest.json');
  }

  private layoutBootUi(): void {
    const { width, height } = this.scale;
    this.status.setPosition(width / 2, height / 2 + 60);
    this.drawProgress(0);
  }

  private drawProgress(value: number): void {
    const { width, height } = this.scale;
    const w = Math.min(width * 0.7, 480);
    const h = 26;
    const x = width / 2 - w / 2;
    const y = height / 2;
    this.bar.clear();
    this.bar.fillStyle(0x2b1a12, 0.9);
    this.bar.fillRoundedRect(x - 4, y - 4, w + 8, h + 8, 10);
    this.bar.fillStyle(0xffc93c, 1);
    this.bar.fillRoundedRect(x, y, Math.max(4, w * value), h, 8);
  }

  create(): void {
    this.layoutBootUi();
    const manifest = this.cache.json.get('manifest') as Manifest | undefined;
    if (!manifest) {
      this.status.setText('Falha ao carregar manifest de assets.');
      return;
    }
    const missing = allRegistryPaths().filter((p) => !manifest.entries[p]);
    if (missing.length > 0) {
      // Fail loud in console but keep booting with what exists (audit trail).
      console.error('[boot] registry paths missing from manifest:', missing);
    }
    for (const path of allRegistryPaths()) {
      if (manifest.entries[path]) this.load.image(keyFor(path), `/assets/${path}`);
    }
    this.load.once('complete', () => {
      this.deriveBackgroundTextures();
      this.registerAnimations();
      void this.awaitFonts().finally(() => {
        this.scene.start('TowerScene');
        this.scene.launch('HudScene');
        getSession().services.analytics.track('boot_complete');
      });
    });
    this.load.start();
  }

  private awaitFonts(): Promise<unknown> {
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (!fonts) return Promise.resolve();
    return Promise.race([
      Promise.all([fonts.load(`32px ${FONT}`), fonts.load(`20px ${FONT}`)]),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);
  }

  /**
   * Splits Backgrounds.png (1904x3118) into:
   *  - bg.sky    : sky + parallax skyline (scrolls slowly)
   *  - bg.street : sidewalk + road + soil (lives in world space)
   * Originals remain untouched; derivation happens in GPU/CPU memory only.
   */
  private deriveBackgroundTextures(): void {
    const src = this.textures.get(keyFor('png/Backgrounds/Backgrounds.png'));
    const img = src.getSourceImage() as HTMLImageElement;
    const W = img.width;
    const H = img.height;
    const streetTop = Math.round(H * 0.72);
    const sky = this.textures.createCanvas('bg.sky', W, streetTop);
    const street = this.textures.createCanvas('bg.street', W, H - streetTop);
    if (!sky || !street) {
      console.warn('[boot] canvas texture derivation unavailable; using full background');
      return;
    }
    sky.context.drawImage(img, 0, 0, W, streetTop, 0, 0, W, streetTop);
    sky.refresh();
    street.context.drawImage(img, 0, streetTop, W, H - streetTop, 0, 0, W, H - streetTop);
    street.refresh();
  }

  private registerAnimations(): void {
    const seq = (prefix: string, count: number, rate: number, key: string): void => {
      const frames: Phaser.Types.Animations.AnimationFrame[] = [];
      for (let i = 0; i < count; i += 1) {
        const texKey = `${prefix}${String(i).padStart(2, '0')}`;
        if (this.textures.exists(texKey)) frames.push({ key: texKey });
      }
      if (frames.length > 0) this.anims.create({ key, frames, frameRate: rate, repeat: -1 });
    };
    seq('Cashier Girl/ChashierGirl-animation_', 40, 16, 'anim.cashierGirl');
    seq('Chef Guy/Cooking/ChefGuy-Cooking_', 20, 10, 'anim.chefCooking');
    seq('Chef Guy/Walk/ChefGuy-Walk_', 20, 10, 'anim.chefWalk');
    seq('Chef Guy/Walk Full Order/ChefGuy-Walk Full Order_', 20, 10, 'anim.chefWalkFull');
    seq('Floor Girl/FloorGirl-animation_', 20, 12, 'anim.floorGirl');
    seq('Lift Guy/Lift Guy-animation_', 20, 12, 'anim.liftGuy');
  }
}
