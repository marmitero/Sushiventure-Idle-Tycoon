import { describe, expect, it } from 'vitest';
import manifest from '../docs/assets/ASSET_MANIFEST.json';
import { AREAS, START_AREA } from '../src/core/config/areas';
import { TOWER } from '../src/game/worldLayout';

/**
 * Guarantees for the visual alignment with the official reference
 * (Screenshot_7.png, commit "referencia visual"): the HUD/tower composition
 * must keep reading real state/config (no fictional places) and every kit
 * piece the composition relies on must be audited as `implementado`.
 */
interface ManifestEntry {
  id: string;
  status: string;
}
const entries = (manifest as { entries: ManifestEntry[] }).entries;

describe('referência visual (Screenshot_7.png)', () => {
  it('o badge de área lê configuração real de mundo, não lugar fictício', () => {
    expect(AREAS.length).toBeGreaterThan(0);
    expect(new Set(AREAS.map((a) => a.id)).size).toBe(AREAS.length);
    expect(AREAS.map((a) => a.id)).toContain(START_AREA.id);
    expect(START_AREA.name.trim().length).toBeGreaterThan(0);
  });

  it('toda peça do kit usada pela composição de referência está implementada no manifesto', () => {
    const byId = new Map(entries.map((e) => [e.id, e]));
    const usados = [
      'ui.hubAreaBar', // badge de distrito (topo esquerdo)
      'ui.btnGreen', // pílula de gemas + botão EQUIPE + preço do próximo andar
      'ui.gemsIcon', // ícone da pílula de Pontos de Sucesso
      'ui.hudCoinBar', // pílula de dinheiro
      'ui.coinIcon',
      'ui.manyUpgradeBoxGreen', // badge de upgrade por andar
      'ui.arrowUpgrade',
      'ui.btnBoost',
      'ui.boostIcon',
      'ui.mapIcon',
      'ui.shopIcon',
      'ui.settingIcon',
      'tower.floor.locked', // casulo com preço visível
    ];
    for (const id of usados) {
      expect(byId.get(id)?.status, id).toBe('implementado');
    }
  });

  it('âncoras de placa/badge/preço caem dentro da textura do andar (1056×340)', () => {
    const plateFromLeft = TOWER.plateX + TOWER.width / 2;
    expect(plateFromLeft).toBeGreaterThan(320); // tábua vazia começa ~330
    expect(plateFromLeft).toBeLessThan(620); // e termina ~610
    expect(TOWER.plateDy).toBeGreaterThan(230); // centro da tábua y≈70 (topo)
    expect(TOWER.plateDy).toBeLessThan(310);
    expect(TOWER.badgeX).toBeGreaterThanOrEqual(TOWER.width / 2); // borda direita
    expect(TOWER.badgeX).toBeLessThan(TOWER.width / 2 + 60);
    expect(TOWER.badgeDy).toBeGreaterThan(120); // miolo do andar
    expect(TOWER.badgeDy).toBeLessThan(260);
    expect(TOWER.nextSlotDy).toBeGreaterThan(150); // faixa cinza do casulo
    expect(TOWER.nextSlotDy).toBeLessThan(240); // acima da faixa "ADD NEW FLOOR"
  });
});
