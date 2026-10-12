import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { allRegistryPaths, carPaths, keyFor, CAR_VARIANTS } from '../src/assets/registry';

const manifestPath = path.resolve(__dirname, '../public/assets/manifest.json');
const auditManifestPath = path.resolve(__dirname, '../docs/assets/ASSET_MANIFEST.json');

interface RuntimeManifest {
  entries: Record<string, { width: number; height: number; bytes: number }>;
}

interface AuditEntry {
  id: string;
  category: string;
  status: string;
  role: string;
  registry: string[];
  files: Array<{ path: string }>;
}

interface AuditManifest {
  totals: { files: number; entries: number };
  entries: AuditEntry[];
}

const readAudit = (): AuditManifest | null =>
  existsSync(auditManifestPath)
    ? (JSON.parse(readFileSync(auditManifestPath, 'utf8')) as AuditManifest)
    : null;

function allSpriteFiles(dir: string, base = dir, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) allSpriteFiles(full, base, acc);
    else acc.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return acc;
}

describe('asset registry ↔ generated manifest', () => {
  it('manifest exists (run `npm run assets`)', () => {
    expect(existsSync(manifestPath), 'public/assets/manifest.json missing — run npm run assets').toBe(true);
  });

  it('every registry path exists in the manifest', () => {
    if (!existsSync(manifestPath)) return;
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as RuntimeManifest;
    const missing = allRegistryPaths().filter((p) => !manifest.entries[p]);
    expect(missing).toEqual([]);
  });

  it('car lazy-load paths exist in the manifest', () => {
    if (!existsSync(manifestPath)) return;
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as RuntimeManifest;
    for (const car of CAR_VARIANTS) {
      const missing = carPaths(car).filter((p) => !manifest.entries[p]);
      expect(missing).toEqual([]);
    }
  });

  it('texture keys are unique per path', () => {
    const keys = allRegistryPaths().map(keyFor);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('audit manifest (ASSET_MANIFEST.json)', () => {
  it('exists and covers every file under Sprites/ exactly once', () => {
    const audit = readAudit();
    expect(audit, 'docs/assets/ASSET_MANIFEST.json missing — run node scripts/build-asset-manifest.mjs').not.toBeNull();
    if (!audit) return;
    const owned = new Map<string, string>();
    for (const entry of audit.entries) {
      for (const file of entry.files) {
        expect(owned.has(file.path), `duplicado: ${file.path}`).toBe(false);
        owned.set(file.path, entry.id);
      }
    }
    const onDisk = allSpriteFiles(path.resolve(__dirname, '../Sprites'));
    const missing = onDisk.filter((f) => !owned.has(f));
    const phantom = [...owned.keys()].filter((f) => !onDisk.includes(f));
    expect(missing).toEqual([]);
    expect(phantom).toEqual([]);
    expect(audit.totals.files).toBe(onDisk.length);
  });

  it('every runtime path used by the registry belongs to exactly one audit entry', () => {
    const audit = readAudit();
    if (!audit) return;
    const owner = new Map<string, string>();
    for (const entry of audit.entries) {
      for (const file of entry.files) owner.set(file.path, entry.id);
    }
    // registry paths are relative to public/assets ('png/...'), audit paths to
    // Sprites ('Png/...'); normalize before comparing.
    const toAudit = (p: string): string => (p.startsWith('png/') ? `Png/${p.slice(4)}` : p);
    const runtimePaths = [...allRegistryPaths(), ...CAR_VARIANTS.flatMap((c) => carPaths(c))];
    const unclassified = runtimePaths.filter((p) => !owner.has(toAudit(p)));
    expect(unclassified).toEqual([]);
  });

  it('entries marked implementado declare registry keys and runtime files', () => {
    const audit = readAudit();
    if (!audit) return;
    if (!existsSync(manifestPath)) return;
    const runtime = JSON.parse(readFileSync(manifestPath, 'utf8')) as RuntimeManifest;
    for (const entry of audit.entries.filter((e) => e.status === 'implementado')) {
      expect(entry.registry.length, `${entry.id} sem chave de registry`).toBeGreaterThan(0);
      for (const file of entry.files) {
        if (file.path.startsWith('Png/')) {
          const runtimePath = `png/${file.path.slice(4)}`;
          expect(runtime.entries[runtimePath], `${entry.id}: ${runtimePath} fora do runtime`).toBeDefined();
        }
      }
    }
  });

  it('no entry outside Fontes/Metadados is left without a destination', () => {
    const audit = readAudit();
    if (!audit) return;
    for (const entry of audit.entries) {
      if (entry.category === 'Fontes' || entry.category === 'Metadados') continue;
      expect(entry.role.length, `${entry.id} sem uso definido`).toBeGreaterThan(10);
    }
  });
});
