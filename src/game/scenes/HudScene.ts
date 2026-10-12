import Phaser from 'phaser';
import { ASSETS, keyFor } from '../../assets/registry';
import { BALANCE } from '../../core/config/balance';
import {
  cashierUpgradeCost,
  floorBaseRevenue,
  floorUnlockCost,
  floorUpgradeCost,
  globalMultiplier,
  moneyOf,
  revenuePerSec,
} from '../../core/economy';
import { Decimal } from '../../core/decimal';
import { formatDuration, formatMoney, formatRate } from '../../core/format';
import type { GameState } from '../../core/state/types';
import { getSession } from '../session';
import { KitButton, kitText, panel } from '../ui/kit';

interface UpgradeRow {
  id: string;
  title: string;
  detail: string;
  cost: Decimal | null;
  maxed: boolean;
  buy: () => boolean;
}

const DEPTH_HUD = 100;
const DEPTH_PANEL = 200;
const DEPTH_TOAST = 300;

/**
 * HudScene — screen-space overlay: money bar, rate, boost chip, navigation
 * buttons, the upgrade panel and the settings popup. All art comes from the
 * kit's "Ui and PopUp" / "Shop Screen" sets.
 */
export class HudScene extends Phaser.Scene {
  constructor() {
    super('HudScene');
  }

  private moneyText!: Phaser.GameObjects.Text;
  private rateText!: Phaser.GameObjects.Text;
  private boostText!: Phaser.GameObjects.Text;
  private coinBar!: Phaser.GameObjects.Image;
  private coinIcon!: Phaser.GameObjects.Image;
  private buttons: KitButton[] = [];
  private panelObjects: Phaser.GameObjects.GameObject[] = [];
  private panelOpen = false;
  private panelFocus = 'unlock';
  private settingsOpen = false;
  private toast: Phaser.GameObjects.Text | null = null;
  private rowButtons = new Map<string, KitButton>();
  private rowCosts = new Map<string, Phaser.GameObjects.Text>();
  private rows: UpgradeRow[] = [];
  private scrollOffset = 0;
  private contentContainer!: Phaser.GameObjects.Container;
  private maskGraphics!: Phaser.GameObjects.Graphics;
  private panelMetrics = { x: 0, y: 0, w: 0, h: 0, rowH: 108, gap: 10, top: 0 };

  create(): void {
    this.buildTopBar();
    this.buildBottomBar();
    this.buildBoostChip();

    this.game.events.on('ui:open-upgrades', this.openUpgrades, this);
    this.events.once('shutdown', () => {
      this.game.events.off('ui:open-upgrades', this.openUpgrades, this);
    });

    const session = getSession();
    session.subscribe((_state, cause) => {
      if (cause === 'error') this.showToast(session.lastError ?? 'Operação inválida');
      if (cause === 'boost_granted') this.showToast('Lucro em dobro ativado!');
      if (this.panelOpen) this.refreshPanel();
    });
    this.scale.on('resize', () => {
      this.layout();
      if (this.panelOpen) this.refreshPanel();
    });
    this.time.addEvent({ delay: 250, loop: true, callback: () => this.refreshAffordability() });
    this.input.on('wheel', this.onWheel);
    this.layout();
  }

  // ------------------------------------------------------------------- bars
  private buildTopBar(): void {
    this.coinBar = this.add.image(0, 0, keyFor(ASSETS.ui.hudCoinBar)).setDepth(DEPTH_HUD);
    this.coinIcon = this.add.image(0, 0, keyFor(ASSETS.ui.coinIcon)).setDepth(DEPTH_HUD + 1);
    this.moneyText = kitText(this, 0, 0, '$0', { size: 30, color: '#fff8ec', stroke: '#3a2313', strokeThickness: 5 });
    this.moneyText.setOrigin(0, 0.5).setDepth(DEPTH_HUD + 1);
    this.rateText = kitText(this, 0, 0, '$0/s', { size: 20, color: '#d9f2c4', stroke: '#2c3a12', strokeThickness: 4 });
    this.rateText.setOrigin(0, 0.5).setDepth(DEPTH_HUD + 1);
  }

  private buildBoostChip(): void {
    this.boostText = kitText(this, 0, 0, '', { size: 18, color: '#ffe9a8', stroke: '#4a2c17', strokeThickness: 4 });
    this.boostText.setOrigin(0.5, 0).setDepth(DEPTH_HUD + 1);
  }

  private buildBottomBar(): void {
    const session = getSession();
    const upgrades = new KitButton({
      scene: this,
      x: 0,
      y: 0,
      texture: keyFor(ASSETS.ui.btnGreen),
      pressedTexture: keyFor(ASSETS.ui.btnGreenPressed),
      width: 190,
      height: 78,
      label: 'MELHORIAS',
      labelStyle: { size: 24, color: '#ffffff', stroke: '#2f6b1f', strokeThickness: 5 },
      onDown: () => this.openUpgrades({ focus: 'unlock' }),
    }).setDepth(DEPTH_HUD);

    const boost = new KitButton({
      scene: this,
      x: 0,
      y: 0,
      texture: keyFor(ASSETS.ui.btnBoost),
      pressedTexture: keyFor(ASSETS.ui.btnBoostPressed),
      width: 120,
      height: 60,
      onDown: () => {
        void session.claimDoubleRevenueAd().then((res) => this.showToast(res.message));
      },
    }).setDepth(DEPTH_HUD);
    const boostIcon = this.add.image(0, 0, keyFor(ASSETS.ui.boostIcon)).setDepth(DEPTH_HUD + 1);
    boost.image.setData('icon', boostIcon);

    const map = new KitButton({
      scene: this,
      x: 0,
      y: 0,
      texture: keyFor(ASSETS.ui.mapIcon),
      width: 74,
      height: 72,
    })
      .setDepth(DEPTH_HUD)
      .setEnabled(false, 'Mapa de cidades chega na Fase 6.');
    map.setOnDisabledClick((reason) => this.showToast(reason));

    const shop = new KitButton({
      scene: this,
      x: 0,
      y: 0,
      texture: keyFor(ASSETS.ui.shopIcon),
      width: 74,
      height: 72,
    })
      .setDepth(DEPTH_HUD)
      .setEnabled(false, 'Loja premium indisponível: nenhum pagamento configurado.');
    shop.setOnDisabledClick((reason) => this.showToast(reason));

    const settings = new KitButton({
      scene: this,
      x: 0,
      y: 0,
      texture: keyFor(ASSETS.ui.settingsIcon),
      pressedTexture: keyFor(ASSETS.ui.settingsIconPressed),
      width: 64,
      height: 62,
      onDown: () => this.toggleSettings(),
    }).setDepth(DEPTH_HUD);
    settings.image.setData('role', 'settings');

    this.buttons = [upgrades, boost, map, shop, settings];
  }

  // ----------------------------------------------------------------- layout
  private layout(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const safeTop = 12;
    const barW = Math.min(w - 90, 330);
    const barH = barW * (81 / 310);
    this.coinBar.setDisplaySize(barW, barH);
    this.coinBar.setPosition(16 + barW / 2, safeTop + barH / 2);
    this.coinIcon.setDisplaySize(barH * 0.62, barH * 0.62);
    this.coinIcon.setPosition(16 + barH * 0.55, safeTop + barH / 2);
    this.moneyText.setPosition(16 + barH * 1.05, safeTop + barH / 2);
    this.rateText.setPosition(18, safeTop + barH + 8);
    this.boostText.setPosition(w / 2, safeTop + barH + 34);

    const settings = this.buttons[4];
    settings?.setPosition(w - 44, safeTop + 34);

    const bottom = h - 46;
    const upgrades = this.buttons[0];
    const boost = this.buttons[1];
    const map = this.buttons[2];
    const shop = this.buttons[3];
    upgrades?.setPosition(w / 2, bottom);
    boost?.setPosition(w - 150, bottom - 4);
    const boostIcon = boost?.image.getData('icon') as Phaser.GameObjects.Image | undefined;
    boostIcon?.setPosition(w - 150, bottom - 6);
    map?.setPosition(24 + 37, bottom - 6);
    shop?.setPosition(24 + 37 + 84, bottom - 6);
  }

  override update(): void {
    const session = getSession();
    const now = session.now();
    this.moneyText.setText(formatMoney(moneyOf(session.state)));
    this.rateText.setText(`${formatRate(revenuePerSec(session.state, now))}  ·  ×${globalMultiplier(session.state, now).toNumber().toFixed(1)}`);
    const boost = session.activeRevenueBoost();
    if (boost) {
      const left = (boost.startedAt + boost.durationSeconds * 1000 - now) / 1000;
      this.boostText.setText(`×2 LUCRO DOBRADO — ${formatDuration(left)}`);
      this.boostText.setVisible(true);
    } else {
      this.boostText.setVisible(false);
    }
  }

  // ------------------------------------------------------------------ toast
  private showToast(message: string): void {
    this.toast?.destroy();
    this.toast = kitText(this, this.scale.width / 2, this.scale.height * 0.3, message, {
      size: 24,
      color: '#fff8ec',
      stroke: '#3a2313',
      strokeThickness: 6,
    })
      .setOrigin(0.5)
      .setDepth(DEPTH_TOAST);
    this.tweens.add({
      targets: this.toast,
      alpha: 0,
      y: this.scale.height * 0.3 - 40,
      duration: 1800,
      onComplete: () => {
        this.toast?.destroy();
        this.toast = null;
      },
    });
  }

  // ------------------------------------------------------------------ panel
  private openUpgrades = (payload: { focus?: string }): void => {
    this.panelFocus = payload.focus ?? 'unlock';
    if (this.settingsOpen) this.toggleSettings();
    if (!this.panelOpen) {
      this.panelOpen = true;
      this.scrollOffset = 0;
    }
    this.refreshPanel();
  };

  private closePanel(): void {
    this.panelOpen = false;
    for (const obj of this.panelObjects) obj.destroy();
    this.panelObjects = [];
    this.rowButtons.clear();
    this.rowCosts.clear();
  }

  private buildRows(state: GameState): UpgradeRow[] {
    const rows: UpgradeRow[] = [];
    const cashierCost = cashierUpgradeCost(state.cashierLevel);
    const curMult = BALANCE.cashier.multipliers[state.cashierLevel - 1] ?? 1;
    const nextMult = BALANCE.cashier.multipliers[state.cashierLevel] ?? curMult;
    rows.push({
      id: 'cashier',
      title: `Caixa — Nv ${state.cashierLevel}`,
      detail: cashierCost ? `Multiplicador global ×${curMult} → ×${nextMult}` : 'Multiplicador global no máximo',
      cost: cashierCost,
      maxed: cashierCost == null,
      buy: () => getSession().upgradeCashier(),
    });
    if (state.floors.length < BALANCE.floors.maxFloors) {
      rows.push({
        id: 'unlock',
        title: `Desbloquear andar ${state.floors.length + 1}`,
        detail: `Nova loja na torre (+${formatRate(floorBaseRevenue(state.floors.length, 1))} base)`,
        cost: floorUnlockCost(state.floors.length),
        maxed: false,
        buy: () => getSession().unlockFloor(state.floors.length),
      });
    }
    for (const floor of [...state.floors].reverse()) {
      const maxed = floor.level >= BALANCE.floors.maxVisualLevel;
      rows.push({
        id: `floor:${floor.index}`,
        title: `Andar ${floor.index + 1} — Nv ${floor.level}`,
        detail: maxed
          ? 'Reforma completa'
          : `Receita base ${formatRate(floorBaseRevenue(floor.index, floor.level))} → ${formatRate(
              floorBaseRevenue(floor.index, floor.level + 1),
            )}`,
        cost: maxed ? null : floorUpgradeCost(floor.index, floor.level),
        maxed,
        buy: () => getSession().upgradeFloor(floor.index),
      });
    }
    return rows;
  }

  private refreshPanel(): void {
    if (!this.panelOpen) return;
    for (const obj of this.panelObjects) obj.destroy();
    this.panelObjects = [];
    this.rowButtons.clear();
    this.rowCosts.clear();

    const session = getSession();
    const w = this.scale.width;
    const h = this.scale.height;
    const pw = Math.min(w - 24, 620);
    const ph = Math.min(h - 120, 700);
    const px = w / 2;
    const py = h / 2;
    this.panelMetrics = { x: px, y: py, w: pw, h: ph, rowH: 104, gap: 10, top: py - ph / 2 + 74 };

    const bg = panel(this, px, py, keyFor(ASSETS.ui.popUpBox), pw, ph, DEPTH_PANEL);
    this.panelObjects.push(bg);
    bg.setInteractive(new Phaser.Geom.Rectangle(px - pw / 2, py - ph / 2, pw, ph), Phaser.Geom.Rectangle.Contains);
    bg.on('pointerdown', () => {
      /* swallow clicks */
    });

    const title = kitText(this, px, py - ph / 2 + 38, 'MELHORIAS DO RESTAURANTE', {
      size: 30,
      color: '#4a2c17',
      stroke: '#fff3d6',
      strokeThickness: 5,
    }).setDepth(DEPTH_PANEL + 1);
    this.panelObjects.push(title);

    const close = new KitButton({
      scene: this,
      x: px + pw / 2 - 40,
      y: py - ph / 2 + 40,
      texture: keyFor(ASSETS.ui.btnClose),
      width: 56,
      height: 56,
      onDown: () => this.closePanel(),
    }).setDepth(DEPTH_PANEL + 2);
    this.panelObjects.push(close.image);

    this.contentContainer = this.add.container(0, 0).setDepth(DEPTH_PANEL + 1);
    this.panelObjects.push(this.contentContainer);

    this.rows = this.buildRows(session.state);
    this.rows.forEach((row, i) => this.addRow(row, i));

    this.maskGraphics = this.make.graphics({ x: 0, y: 0 }, false);
    this.maskGraphics.fillStyle(0xffffff);
    this.maskGraphics.fillRect(px - pw / 2 + 8, this.panelMetrics.top - 6, pw - 16, ph - 96);
    const mask = this.maskGraphics.createGeometryMask();
    this.contentContainer.setMask(mask);
    this.panelObjects.push(this.maskGraphics);

    let dragFrom: number | null = null;
    let dragScroll = 0;
    bg.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      dragFrom = pointer.y;
      dragScroll = this.scrollOffset;
    });
    bg.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (dragFrom == null || !pointer.isDown) return;
      if (Math.abs(pointer.y - dragFrom) < 8) return;
      this.scrollOffset = dragScroll + (pointer.y - dragFrom);
      this.applyScroll();
    });
    bg.on('pointerup', () => {
      dragFrom = null;
    });
    this.applyScroll();
    this.focusRow(this.panelFocus);
  }

  private onWheel = (_pointer: unknown, _gameObjects: unknown, _dx: number, dy: number): void => {
    if (!this.panelOpen) return;
    this.scrollOffset -= dy * 0.6;
    this.applyScroll();
  };

  private addRow(row: UpgradeRow, index: number): void {
    const { x, w, rowH, gap, top } = this.panelMetrics;
    const rowW = w - 36;
    const rowY = top + index * (rowH + gap) + rowH / 2;
    const bgRow = panel(this, x, rowY, keyFor(ASSETS.ui.contentBox), rowW, rowH, 0);
    const title = kitText(this, x - rowW / 2 + 18, rowY - 22, row.title, {
      size: 22,
      color: '#4a2c17',
      stroke: '#fff3d6',
      strokeThickness: 4,
    }).setOrigin(0, 0.5);
    const detail = kitText(this, x - rowW / 2 + 18, rowY + 16, row.detail, {
      size: 15,
      color: '#6b4a2c',
      stroke: '#fff8ec',
      strokeThickness: 3,
    }).setOrigin(0, 0.5);
    const costText = kitText(this, x + rowW / 2 - 130, rowY - 20, row.cost ? formatMoney(row.cost) : 'MÁX', {
      size: 20,
      color: row.cost ? '#2f6b1f' : '#8a6a4a',
      stroke: '#fff8ec',
      strokeThickness: 4,
    }).setOrigin(0.5, 0.5);
    const buy = new KitButton({
      scene: this,
      x: x + rowW / 2 - 130,
      y: rowY + 18,
      texture: keyFor(ASSETS.ui.btnGreen),
      pressedTexture: keyFor(ASSETS.ui.btnGreenPressed),
      disabledTexture: keyFor(ASSETS.ui.btnBlueOff),
      width: 120,
      height: 46,
      label: row.maxed ? '—' : 'COMPRAR',
      labelStyle: { size: 16, color: '#ffffff', stroke: '#2f6b1f', strokeThickness: 4 },
      onDown: () => {
        const okBuy = row.buy();
        if (!okBuy) this.showToast(getSession().lastError ?? 'Não foi possível comprar');
        this.refreshPanel();
      },
    });
    buy.setEnabled(!row.maxed, row.maxed ? 'Nível máximo' : 'Dinheiro insuficiente');
    this.contentContainer.add([bgRow, title, detail, costText, buy.image, ...(buy.label ? [buy.label] : [])]);
    this.rowButtons.set(row.id, buy);
    this.rowCosts.set(row.id, costText);
  }

  private focusRow(id: string): void {
    const index = this.rows.findIndex((r) => r.id === id);
    if (index < 0) return;
    const { rowH, gap, h } = this.panelMetrics;
    this.scrollOffset = -Math.max(0, index * (rowH + gap) - h * 0.18);
    this.applyScroll();
  }

  private applyScroll(): void {
    const { rowH, gap, h } = this.panelMetrics;
    const total = this.rows.length * (rowH + gap);
    const visible = h - 140;
    const minOffset = Math.min(0, visible - total);
    this.scrollOffset = Phaser.Math.Clamp(this.scrollOffset, minOffset, 0);
    this.contentContainer?.setPosition(0, this.scrollOffset);
  }

  private refreshAffordability(): void {
    if (!this.panelOpen) return;
    const session = getSession();
    const money = moneyOf(session.state);
    for (const row of this.rows) {
      const button = this.rowButtons.get(row.id);
      if (!button || row.maxed) continue;
      const affordable = row.cost ? money.gte(row.cost) : false;
      button.setEnabled(affordable, affordable ? '' : 'Dinheiro insuficiente');
      const costText = this.rowCosts.get(row.id);
      if (costText && row.cost) costText.setColor(affordable ? '#2f6b1f' : '#a03b2a');
    }
  }

  // --------------------------------------------------------------- settings
  private toggleSettings(): void {
    if (this.settingsOpen) {
      this.settingsOpen = false;
      for (const obj of this.panelObjects) obj.destroy();
      this.panelObjects = [];
      return;
    }
    if (this.panelOpen) this.closePanel();
    this.settingsOpen = true;
    const session = getSession();
    const w = this.scale.width;
    const h = this.scale.height;
    const pw = Math.min(w - 40, 460);
    const ph = 380;
    const bg = panel(this, w / 2, h / 2, keyFor(ASSETS.ui.settingsPopUp), pw, ph, DEPTH_PANEL);
    const title = kitText(this, w / 2, h / 2 - ph / 2 + 46, 'CONFIGURAÇÕES', {
      size: 28,
      color: '#4a2c17',
      stroke: '#fff3d6',
      strokeThickness: 5,
    }).setDepth(DEPTH_PANEL + 1);
    const makeToggle = (label: string, get: () => boolean, set: (v: boolean) => void, dy: number): KitButton => {
      let btn: KitButton;
      btn = new KitButton({
        scene: this,
        x: w / 2,
        y: h / 2 + dy,
        texture: keyFor(ASSETS.ui.btnOrangeSmall),
        pressedTexture: keyFor(ASSETS.ui.btnOrangeSmallOff),
        width: 300,
        height: 56,
        label: `${label}: ${get() ? 'ON' : 'OFF'}`,
        labelStyle: { size: 20, color: '#ffffff', stroke: '#7a3c14', strokeThickness: 4 },
        onDown: () => {
          const value = !get();
          set(value);
          btn.label?.setText(`${label}: ${value ? 'ON' : 'OFF'}`);
        },
      }).setDepth(DEPTH_PANEL + 1);
      return btn;
    };
    const t1 = makeToggle(
      'Movimento reduzido',
      () => session.state.settings.reducedMotion,
      (v) => session.setSettings({ reducedMotion: v }),
      -80,
    );
    const t2 = makeToggle(
      'Efeitos sonoros',
      () => session.state.settings.sound,
      (v) => session.setSettings({ sound: v }),
      -10,
    );
    const t3 = makeToggle(
      'Música',
      () => session.state.settings.music,
      (v) => session.setSettings({ music: v }),
      60,
    );
    const close = new KitButton({
      scene: this,
      x: w / 2 + pw / 2 - 36,
      y: h / 2 - ph / 2 + 36,
      texture: keyFor(ASSETS.ui.btnClose),
      width: 48,
      height: 48,
      onDown: () => this.toggleSettings(),
    }).setDepth(DEPTH_PANEL + 2);
    this.panelObjects.push(bg, title, t1.image, t2.image, t3.image, close.image);
    if (t1.label) this.panelObjects.push(t1.label);
    if (t2.label) this.panelObjects.push(t2.label);
    if (t3.label) this.panelObjects.push(t3.label);
  }
}
