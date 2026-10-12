import Phaser from 'phaser';
import { BootScene } from './game/scenes/BootScene';
import { HudScene } from './game/scenes/HudScene';
import { TowerScene } from './game/scenes/TowerScene';
import { GameSession, setSession } from './game/session';
import { SaveManager } from './persistence/saveManager';
import { LocalStorageSaveRepository } from './persistence/saveRepository';
import { buildServices } from './services/registry';

async function bootstrap(): Promise<void> {
  const services = buildServices(import.meta.env.DEV);
  const repo = new LocalStorageSaveRepository(window.localStorage);
  const save = new SaveManager(repo, 5000);
  const report = await save.load(Date.now());
  if (report.usedBackup || report.result.status === 'recovered') {
    console.warn('[save] recovery path used:', report.result.status, report.usedBackup);
  }

  const session = new GameSession(save, report.result.state, {
    ads: services.ads,
    analytics: services.analytics,
  });
  setSession(session);

  // Persistence lifecycle hooks (constitution 18.3): never lose progress on
  // tab switch / reload / app switch.
  const flushNow = (): void => {
    save.adopt(session.state);
    if (!save.flushSync()) void session.flush(true);
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) flushNow();
  });
  window.addEventListener('pagehide', flushNow);
  window.setInterval(() => void session.flush(), 5000);

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#7ec8e3',
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: '100%',
      height: '100%',
    },
    input: { touch: true, mouse: true },
    render: { antialias: true, roundPixels: false },
    scene: [BootScene, TowerScene, HudScene],
  });
  void game;
}

bootstrap().catch((error) => {
  console.error('[boot] fatal', error);
  const node = document.getElementById('boot-error');
  if (node) {
    node.style.display = 'flex';
    node.textContent = `Falha ao iniciar o jogo: ${error instanceof Error ? error.message : String(error)}`;
  }
});
