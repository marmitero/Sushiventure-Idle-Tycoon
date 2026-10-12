import Phaser from 'phaser';
import { ASSETS, keyFor } from '../../assets/registry';
import { BALANCE } from '../../core/config/balance';
import { START_AREA } from '../../core/config/areas';
import type { OfflineQuote } from '../../core/offline';
import {
  cashierUpgradeCost,
  floorBaseRevenue,
  floorUnlockCost,
  floorUpgradeCost,
  globalMultiplier,
  moneyOf,
  revenuePerSec,
  staffHireCost,
  staffMultiplierValue,
  staffUpgradeCost,
} from '../../core/economy';
import { Decimal } from '../../core/decimal';
import { formatDuration, formatMoney, formatNumber, formatRate } from '../../core/format';
import type { GameState, StaffId } from '../../core/state/types';
import { STAFF_IDS } from '../../core/state/types';
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
  private boostLabel!: Phaser.GameObjects.Text;
  private areaBar!: Phaser.GameObjects.Image;
  private areaText!: Phaser.GameObjects.Text;
  private gemBar!: Phaser.GameObjects.Image;
  private gemIcon!: Phaser.GameObjects.Image;
  private gemText!: Phaser.GameObjects.Text;
  private coinBar!: Phaser.GameObjects.Image;
  private coinIcon!: Phaser.GameObjects.Image;
  private bottomStrip!: Phaser.GameObjects.Rectangle;
  private mapLabel!: Phaser.GameObjects.Text;
  private shopLabel!: Phaser.GameObjects.Text;
  private btnBoost!: KitButton;
  private btnEquipe!: KitButton;
  private btnMap!: KitButton;
  private btnShop!: KitButton;
  private btnSettings!: KitButton;
  private mapLock!: Phaser.GameObjects.Image;
  private shopLock!: Phaser.GameObjects.Image;
  private panelObjects: Phaser.GameObjects.GameObject[] = [];
  private panelOpen = false;
  private panelFocus = 'unlock';
  private panelMode: 'upgrades' | 'staff' = 'upgrades';
  private panelTitle = 'MELHORIAS DO RESTAURANTE';
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
    this.game.events.on('ui:toast', this.onToastEvent, this);
    this.events.once('shutdown', () => {
      this.game.events.off('ui:open-upgrades', this.openUpgrades, this);
      this.game.events.off('ui:toast', this.onToastEvent, this);
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
    if (session.pendingOffline) this.showOfflinePopup(session.pendingOffline);
  }

  // --------------------------------------------------------- offline popup
  private offlineObjects: Phaser.GameObjects.GameObject[] = [];

  private showOfflinePopup(quote: OfflineQuote): void {
    const session = getSession();
    const w = this.scale.width;
    const h = this.scale.height;
    const pw = Math.min(w - 32, 460);
    const ph = 470;
    const dim = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.55).setDepth(DEPTH_PANEL - 1);
    dim.setInteractive(new Phaser.Geom.Rectangle(0, 0, w, h), Phaser.Geom.Rectangle.Contains);
    const box = panel(this, w / 2, h / 2, keyFor(ASSETS.ui.popUpBox), pw, ph, DEPTH_PANEL);
    const glow = this.add
      .image(w / 2, h / 2 - ph / 2 + 96, keyFor(ASSETS.ui.rewardGlow))
      .setDepth(DEPTH_PANEL + 1)
      .setDisplaySize(120, 120);
    const title = kitText(this, w / 2, h / 2 - ph / 2 + 34, 'BEM-VINDO DE VOLTA!', {
      size: 28,
      color: '#4a2c17',
      stroke: '#fff3d6',
      strokeThickness: 5,
    }).setDepth(DEPTH_PANEL + 1);
    const capSeconds = BALANCE.offline.baseCapSeconds;
    const lines = [
      `Tempo ausente: ${formatDuration(quote.elapsedSeconds)}`,
      quote.capped
        ? `Contado: ${formatDuration(quote.countedSeconds)} (limite ${formatDuration(capSeconds)})`
        : `Contado: ${formatDuration(quote.countedSeconds)}`,
      `Receita offline: ${formatRate(quote.ratePerSec)} × ${(BALANCE.offline.rate * 100).toFixed(0)}%`,
    ];
    const body = kitText(this, w / 2, h / 2 - 40, lines.join('\n'), {
      size: 18,
      color: '#6b4a2c',
      stroke: '#fff8ec',
      strokeThickness: 3,
    }).setDepth(DEPTH_PANEL + 1);
    const total = kitText(this, w / 2, h / 2 + 40, formatMoney(quote.gain), {
      size: 34,
      color: '#2f6b1f',
      stroke: '#fff8ec',
      strokeThickness: 6,
    }).setDepth(DEPTH_PANEL + 1);

    const double = new KitButton({
      scene: this,
      x: w / 2 - 90,
      y: h / 2 + ph / 2 - 70,
      texture: keyFor(ASSETS.ui.btnBoost),
      pressedTexture: keyFor(ASSETS.ui.btnBoostPressed),
      width: 120,
      height: 60,
      label: '×2',
      labelStyle: { size: 22, color: '#ffffff', stroke: '#7a3c14', strokeThickness: 5 },
      onDown: () => {
        void session.requestOfflineDouble().then((res) => {
          this.showToast(res.message);
          if (session.offlineDoubleReserved) {
            double.setEnabled(false, '×2 reservado: toque em COLETAR para aplicar.');
            total.setText(formatMoney(quote.gain.mulNumber(2)));
          }
        });
      },
    }).setDepth(DEPTH_PANEL + 2);
    const collect = new KitButton({
      scene: this,
      x: w / 2 + 90,
      y: h / 2 + ph / 2 - 70,
      texture: keyFor(ASSETS.ui.btnGreen),
      pressedTexture: keyFor(ASSETS.ui.btnGreenPressed),
      width: 150,
      height: 62,
      label: 'COLETAR',
      labelStyle: { size: 22, color: '#ffffff', stroke: '#2f6b1f', strokeThickness: 5 },
      onDown: () => {
        const res = session.collectOffline();
        this.showToast(res.message);
        this.closeOfflinePopup();
      },
    }).setDepth(DEPTH_PANEL + 2);

    this.offlineObjects = [
      dim,
      box,
      glow,
      title,
      body,
      total,
      double.image,
      collect.image,
      ...(double.label ? [double.label] : []),
      ...(collect.label ? [collect.label] : []),
    ];
  }

  private closeOfflinePopup(): void {
    for (const obj of this.offlineObjects) obj.destroy();
    this.offlineObjects = [];
  }

  // ------------------------------------------------------------------- bars
  /**
   * Top bar follows the official reference (Screenshot_7.png): area badge on
   * the left (kit HubAreaBar), premium-currency pill (green button art + gem
   * icon), money pill (kit HudCoinBar + coin) and the settings gear at right.
   */
  private buildTopBar(): void {
    this.areaBar = this.add.image(0, 0, keyFor(ASSETS.ui.hubAreaBar)).setDepth(DEPTH_HUD);
    this.areaText = kitText(this, 0, 0, START_AREA.name, {
      size: 15,
      color: '#eafff2',
      stroke: '#0c3b25',
      strokeThickness: 4,
    })
      .setOrigin(0, 0.5)
      .setDepth(DEPTH_HUD + 1);
    this.gemBar = this.add.image(0, 0, keyFor(ASSETS.ui.btnGreen)).setDepth(DEPTH_HUD);
    this.gemIcon = this.add.image(0, 0, keyFor(ASSETS.ui.gemsIcon)).setDepth(DEPTH_HUD + 1);
    this.gemText = kitText(this, 0, 0, '0', {
      size: 18,
      color: '#ffffff',
      stroke: '#2f6b1f',
      strokeThickness: 4,
    })
      .setOrigin(0, 0.5)
      .setDepth(DEPTH_HUD + 1);
    this.coinBar = this.add.image(0, 0, keyFor(ASSETS.ui.hudCoinBar)).setDepth(DEPTH_HUD);
    this.coinIcon = this.add.image(0, 0, keyFor(ASSETS.ui.coinIcon)).setDepth(DEPTH_HUD + 1);
    this.moneyText = kitText(this, 0, 0, '$0', { size: 22, color: '#fff8ec', stroke: '#3a2313', strokeThickness: 5 });
    this.moneyText.setOrigin(0, 0.5).setDepth(DEPTH_HUD + 1);
    this.rateText = kitText(this, 0, 0, '$0/s', { size: 15, color: '#d9f2c4', stroke: '#2c3a12', strokeThickness: 4 });
    this.rateText.setOrigin(0, 0.5).setDepth(DEPTH_HUD + 1);
  }

  private buildBoostChip(): void {
    this.boostText = kitText(this, 0, 0, '', { size: 18, color: '#ffe9a8', stroke: '#4a2c17', strokeThickness: 4 });
    this.boostText.setOrigin(0.5, 0).setDepth(DEPTH_HUD + 1);
  }

  /**
   * Bottom bar follows the reference: dark strip, BOOST at left, team button
   * centered, CITY MAP / SHOP icons with labels at right. The upgrade panel is
   * reached from the tower itself (next-slot price button and per-floor
   * badges), exactly as the reference composition implies.
   */
  private buildBottomBar(): void {
    const session = getSession();
    this.bottomStrip = this.add.rectangle(0, 0, 10, 10, 0x241209, 0.92).setDepth(DEPTH_HUD - 1);

    this.btnEquipe = new KitButton({
      scene: this,
      x: 0,
      y: 0,
      texture: keyFor(ASSETS.ui.btnGreen),
      pressedTexture: keyFor(ASSETS.ui.btnGreenPressed),
      width: 138,
      height: 60,
      label: 'EQUIPE',
      labelStyle: { size: 22, color: '#ffffff', stroke: '#2f6b1f', strokeThickness: 5 },
      onDown: () => this.openStaff(),
    }).setDepth(DEPTH_HUD);

    this.btnBoost = new KitButton({
      scene: this,
      x: 0,
      y: 0,
      texture: keyFor(ASSETS.ui.btnBoost),
      pressedTexture: keyFor(ASSETS.ui.btnBoostPressed),
      width: 122,
      height: 56,
      onDown: () => {
        void session.claimDoubleRevenueAd().then((res) => this.showToast(res.message));
      },
    }).setDepth(DEPTH_HUD);
    const boostIcon = this.add.image(0, 0, keyFor(ASSETS.ui.boostIcon)).setDepth(DEPTH_HUD + 1);
    this.btnBoost.image.setData('icon', boostIcon);
    this.boostLabel = kitText(this, 0, 0, 'BOOST', {
      size: 17,
      color: '#5a2d0c',
      stroke: '#ffe9a8',
      strokeThickness: 3,
    }).setDepth(DEPTH_HUD + 1);

    this.btnMap = new KitButton({
      scene: this,
      x: 0,
      y: 0,
      texture: keyFor(ASSETS.ui.mapIcon),
      width: 64,
      height: 62,
    })
      .setDepth(DEPTH_HUD)
      .setEnabled(false, 'Mapa de cidades chega na Fase 6 (toque para ver os requisitos).');
    this.btnMap.setOnDisabledClick((reason) => this.showToast(reason));
    this.mapLock = this.add
      .image(0, 0, keyFor(ASSETS.mapLock))
      .setDepth(DEPTH_HUD + 1)
      .setDisplaySize(26, 32);
    this.mapLabel = kitText(this, 0, 0, 'MAPA', {
      size: 12,
      color: '#ffe9c4',
      stroke: '#241209',
      strokeThickness: 3,
    }).setDepth(DEPTH_HUD + 1);

    this.btnShop = new KitButton({
      scene: this,
      x: 0,
      y: 0,
      texture: keyFor(ASSETS.ui.shopIcon),
      width: 64,
      height: 62,
    })
      .setDepth(DEPTH_HUD)
      .setEnabled(false, 'Loja premium: nenhum pagamento configurado neste ambiente (Fase 9).');
    this.btnShop.setOnDisabledClick((reason) => this.showToast(reason));
    this.shopLock = this.add
      .image(0, 0, keyFor(ASSETS.mapLock))
      .setDepth(DEPTH_HUD + 1)
      .setDisplaySize(26, 32);
    this.shopLabel = kitText(this, 0, 0, 'LOJA', {
      size: 12,
      color: '#ffe9c4',
      stroke: '#241209',
      strokeThickness: 3,
    }).setDepth(DEPTH_HUD + 1);

    this.btnSettings = new KitButton({
      scene: this,
      x: 0,
      y: 0,
      texture: keyFor(ASSETS.ui.settingsIcon),
      pressedTexture: keyFor(ASSETS.ui.settingsIconPressed),
      width: 52,
      height: 50,
      onDown: () => this.toggleSettings(),
    }).setDepth(DEPTH_HUD);
    this.btnSettings.image.setData('role', 'settings');
  }

  // ----------------------------------------------------------------- layout
  private layout(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const safeTop = 8;
    const gap = 6;
    const gearW = 52;

    // Top row (reference order): area badge · gems pill · coin pill · gear.
    const areaW = Phaser.Math.Clamp(Math.round(w * 0.3), 104, 150);
    const areaH = Math.round(areaW * (140 / 360));
    this.areaBar.setDisplaySize(areaW, areaH);
    this.areaBar.setPosition(10 + areaW / 2, safeTop + areaH / 2);
    const barCenterY = safeTop + areaH * 0.66;
    this.areaText.setPosition(10 + areaW * 0.3, barCenterY);
    const pillH = 34;
    let x = 10 + areaW + gap;
    const gemW = Phaser.Math.Clamp(Math.round(w * 0.22), 82, 118);
    this.gemBar.setDisplaySize(gemW, pillH);
    this.gemBar.setPosition(x + gemW / 2, barCenterY);
    this.gemIcon.setDisplaySize(pillH * 0.78, pillH * 0.78);
    this.gemIcon.setPosition(x + pillH * 0.52, barCenterY);
    this.gemText.setPosition(x + pillH * 0.98, barCenterY);
    x += gemW + gap;
    const coinW = Math.max(92, w - 10 - gearW - gap - x);
    this.coinBar.setDisplaySize(coinW, pillH + 6);
    this.coinBar.setPosition(x + coinW / 2, barCenterY);
    this.coinIcon.setDisplaySize(pillH * 0.8, pillH * 0.8);
    this.coinIcon.setPosition(x + pillH * 0.55, barCenterY);
    this.moneyText.setPosition(x + pillH * 1.02, barCenterY);
    this.rateText.setPosition(12, safeTop + areaH + 12);
    this.boostText.setPosition(w / 2, safeTop + areaH + 32);
    this.btnSettings.setPosition(w - 10 - gearW / 2, safeTop + gearW / 2);

    // Bottom strip: BOOST left · EQUIPE center · MAPA/LOJA right, labeled.
    const stripH = 84;
    this.bottomStrip.setSize(w, stripH);
    this.bottomStrip.setPosition(w / 2, h - stripH / 2);
    const cy = h - stripH / 2 - 4;
    const boostX = 12 + 61;
    this.btnBoost.setPosition(boostX, cy);
    const boostIcon = this.btnBoost.image.getData('icon') as Phaser.GameObjects.Image | undefined;
    boostIcon?.setDisplaySize(30, 34);
    boostIcon?.setPosition(boostX - 26, cy);
    this.boostLabel.setPosition(boostX + 14, cy);
    this.btnEquipe.setPosition(w / 2, cy);
    const shopX = w - 12 - 32;
    const mapX = shopX - 72;
    this.btnMap.setPosition(mapX, cy - 6);
    this.btnShop.setPosition(shopX, cy - 6);
    this.mapLabel.setPosition(mapX, h - 12);
    this.shopLabel.setPosition(shopX, h - 12);
    this.mapLock.setPosition(mapX + 16, cy - 28);
    this.shopLock.setPosition(shopX + 16, cy - 28);
  }

  override update(): void {
    const session = getSession();
    const now = session.now();
    this.moneyText.setText(formatMoney(moneyOf(session.state)));
    const pts = formatNumber(Decimal.deserialize(session.state.prestigePoints));
    if (this.gemText.text !== pts) this.gemText.setText(pts);
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
  private onToastEvent = (message: string): void => {
    this.showToast(message);
  };

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
    this.panelMode = 'upgrades';
    this.panelTitle = 'MELHORIAS DO RESTAURANTE';
    this.panelFocus = payload.focus ?? 'unlock';
    if (this.settingsOpen) this.toggleSettings();
    if (!this.panelOpen) {
      this.panelOpen = true;
      this.scrollOffset = 0;
    }
    this.refreshPanel();
  };

  private openStaff = (): void => {
    this.panelMode = 'staff';
    this.panelTitle = 'EQUIPE DO RESTAURANTE';
    this.panelFocus = 'staff:attendant';
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

  private static readonly STAFF_META: Record<
    StaffId,
    { name: string; scope: string }
  > = {
    attendant: { name: 'Atendente de Caixa', scope: 'Receita do térreo (1º andar)' },
    chef: { name: 'Chef de Cozinha', scope: 'Produção de todos os andares' },
    floorGirl: { name: 'Atendente de Andar', scope: 'Receita dos andares superiores (2º+)' },
    liftGuy: { name: 'Operador de Elevador', scope: 'Entregas e velocidade do elevador' },
  };

  private buildStaffRows(state: GameState): UpgradeRow[] {
    return STAFF_IDS.map((id) => {
      const meta = HudScene.STAFF_META[id];
      const level = state.staff[id]?.level ?? 0;
      const maxLevel = BALANCE.staff[id].maxLevel;
      const hired = level > 0;
      const current = staffMultiplierValue(id, level);
      const next = staffMultiplierValue(id, level + 1);
      const cost = hired ? staffUpgradeCost(id, level) : staffHireCost(id);
      return {
        id: `staff:${id}`,
        title: `${meta.name}${hired ? ` — Nv ${level}` : ' — não contratado'}`,
        detail: `${meta.scope}: ×${current.toFixed(2)} → ×${next.toFixed(2)}`,
        cost: cost ?? null,
        maxed: hired && level >= maxLevel,
        buy: () => (hired ? getSession().upgradeStaff(id) : getSession().hireStaff(id)),
      };
    });
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

    const title = kitText(this, px, py - ph / 2 + 38, this.panelTitle, {
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

    this.rows =
      this.panelMode === 'staff' ? this.buildStaffRows(session.state) : this.buildRows(session.state);
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
    // Audio: the official kit ships NO sound files. Presenting working-looking
    // toggles would be a decorative control (constitution §23), so these rows
    // are honestly disabled with the kit's own off-art and an explanation.
    const audioRow = (label: string, texture: string, dy: number, reason: string): KitButton =>
      new KitButton({
        scene: this,
        x: w / 2,
        y: h / 2 + dy,
        texture,
        width: 56,
        height: 54,
        label,
        labelStyle: { size: 17, color: '#7a5a3a', stroke: '#fff8ec', strokeThickness: 3 },
      })
        .setDepth(DEPTH_PANEL + 1)
        .setEnabled(false, reason)
        .setOnDisabledClick((r) => this.showToast(r));
    const t2 = audioRow(
      'SOM: INDISPONÍVEL',
      keyFor(ASSETS.ui.btnSoundOff),
      -10,
      'O kit oficial não inclui áudio; efeitos sonoros entram na Fase 10 com recurso real.',
    );
    const t3 = audioRow(
      'MÚSICA: INDISPONÍVEL',
      keyFor(ASSETS.ui.btnMusicOff),
      60,
      'O kit oficial não inclui áudio; música entra na Fase 10 com recurso real.',
    );
    t2.label?.setX(w / 2 + 60);
    t3.label?.setX(w / 2 + 60);
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
