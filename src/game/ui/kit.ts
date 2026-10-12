import Phaser from 'phaser';

export const FONT = '"Lilita One", "Trebuchet MS", system-ui, sans-serif';

export interface TextStyle {
  size: number;
  color?: string;
  stroke?: string;
  strokeThickness?: number;
  align?: 'left' | 'center' | 'right';
}

export function kitText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  content: string,
  style: TextStyle = { size: 24 },
): Phaser.GameObjects.Text {
  return scene.add.text(x, y, content, {
    fontFamily: FONT,
    fontSize: `${style.size}px`,
    color: style.color ?? '#4a2c17',
    stroke: style.stroke ?? '#fff8ec',
    strokeThickness: style.strokeThickness ?? 4,
    align: style.align ?? 'center',
    lineSpacing: 2,
  });
}

export interface KitButtonOptions {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  pressedTexture?: string;
  disabledTexture?: string;
  width?: number;
  height?: number;
  label?: string;
  labelStyle?: TextStyle;
  onDown?: () => void;
}

/**
 * Button built from the official kit sprites (normal / pressed / disabled).
 * A disabled button still explains itself through `reason` (Part 20).
 */
export class KitButton {
  readonly image: Phaser.GameObjects.Image;
  readonly label: Phaser.GameObjects.Text | null;
  private enabled = true;
  private reason = '';
  private onDisabledClick: ((reason: string) => void) | null = null;

  constructor(private readonly options: KitButtonOptions) {
    const { scene, x, y, texture } = options;
    this.image = scene.add.image(x, y, texture);
    this.image.setInteractive({ useHandCursor: true });
    if (options.width && options.height) this.image.setDisplaySize(options.width, options.height);
    this.image.on('pointerdown', () => {
      if (!this.enabled) {
        this.onDisabledClick?.(this.reason);
        return;
      }
      if (options.pressedTexture && scene.textures.exists(options.pressedTexture)) {
        this.image.setTexture(options.pressedTexture);
      } else {
        this.image.setTint(0xdddddd);
      }
    });
    const release = () => {
      this.refreshTexture();
    };
    this.image.on('pointerup', () => {
      release();
      if (this.enabled) this.options.onDown?.();
    });
    this.image.on('pointerout', release);
    this.label = options.label
      ? kitText(scene, x, y, options.label, options.labelStyle ?? { size: 22 })
      : null;
  }

  setOnDisabledClick(handler: (reason: string) => void): this {
    this.onDisabledClick = handler;
    return this;
  }

  setEnabled(enabled: boolean, reason = ''): this {
    this.enabled = enabled;
    this.reason = reason;
    this.refreshTexture();
    return this;
  }

  get isEnabled(): boolean {
    return this.enabled;
  }

  get disabledReason(): string {
    return this.reason;
  }

  setPosition(x: number, y: number): this {
    this.image.setPosition(x, y);
    this.label?.setPosition(x, y);
    return this;
  }

  setDepth(depth: number): this {
    this.image.setDepth(depth);
    this.label?.setDepth(depth);
    return this;
  }

  setVisible(visible: boolean): this {
    this.image.setVisible(visible);
    this.label?.setVisible(visible);
    return this;
  }

  private refreshTexture(): void {
    const { scene, texture, pressedTexture, disabledTexture } = this.options;
    if (!this.enabled && disabledTexture && scene.textures.exists(disabledTexture)) {
      this.image.setTexture(disabledTexture);
      this.image.clearTint();
    } else if (!this.enabled) {
      this.image.setTexture(texture);
      this.image.setTint(0x9a9a9a);
    } else {
      this.image.setTexture(texture);
      this.image.clearTint();
      void pressedTexture;
    }
    if (this.label) this.label.setAlpha(this.enabled ? 1 : 0.55);
  }

  destroy(): void {
    this.image.destroy();
    this.label?.destroy();
  }
}

/** Stretched panel/box sprite (kit art is 9-slice-friendly enough for boxes). */
export function panel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  texture: string,
  width: number,
  height: number,
  depth = 0,
): Phaser.GameObjects.Image {
  const image = scene.add.image(x, y, texture);
  image.setDisplaySize(width, height);
  image.setDepth(depth);
  return image;
}
