import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { allRegistryPaths, carPaths, keyFor } from '../src/assets/registry';

const manifestPath = path.resolve(__dirname, '../public/assets/manifest.json');

interface Manifest {
  entries: Record<string, { width: number; height: number; bytes: number }>;
}

describe('asset registry ↔ generated manifest', () => {
  it('manifest exists (run `npm run assets`)', () => {
    expect(existsSync(manifestPath), 'public/assets/manifest.json missing — run npm run assets').toBe(true);
  });

  it('every registry path exists in the manifest', () => {
    if (!existsSync(manifestPath)) return;
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Manifest;
    const missing = allRegistryPaths().filter((p) => !manifest.entries[p]);
    expect(missing).toEqual([]);
  });

  it('car lazy-load paths exist in the manifest', () => {
    if (!existsSync(manifestPath)) return;
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Manifest;
    const missing = carPaths(1).filter((p) => !manifest.entries[p]);
    expect(missing).toEqual([]);
  });

  it('texture keys are unique per path', () => {
    const keys = allRegistryPaths().map(keyFor);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
