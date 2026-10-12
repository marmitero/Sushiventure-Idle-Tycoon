#!/usr/bin/env node
/**
 * sync-assets.mjs — derives the runtime asset set from the ORIGINAL Sprites/ folder.
 *
 * Rules enforced here (see docs/assets/ASSET_LICENSES.md and ADR-0002):
 *  - Originals under /Sprites are NEVER modified.
 *  - Derivatives are written to /public/assets (gitignored).
 *  - Only PNG runtime assets are copied (AI/EPS/Spine sources stay out of the build).
 *  - A manifest.json is emitted so the loader never guesses file names.
 */
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'Sprites', 'Png');
const OUT = path.join(root, 'public', 'assets');
const OUT_PNG = path.join(OUT, 'png');

function pngInfo(buf) {
  if (buf.length < 33 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function walk(dir, base = dir, acc = []) {
  const { readdir } = await import('node:fs/promises');
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === '.DS_Store') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, base, acc);
    else if (entry.name.toLowerCase().endsWith('.png')) acc.push(full);
  }
  return acc;
}

async function main() {
  if (!existsSync(SRC)) {
    console.error(`[sync-assets] source folder not found: ${SRC}`);
    process.exit(1);
  }
  await rm(OUT_PNG, { recursive: true, force: true });
  await mkdir(OUT_PNG, { recursive: true });

  const files = await walk(SRC);
  const manifest = { generatedAt: new Date().toISOString(), source: 'Sprites/Png', entries: {} };
  let copied = 0;
  for (const file of files.sort()) {
    const rel = path.relative(SRC, file).split(path.sep).join('/');
    const dest = path.join(OUT_PNG, rel);
    await mkdir(path.dirname(dest), { recursive: true });
    await cp(file, dest);
    const buf = await readFile(file);
    const info = pngInfo(buf);
    if (!info) {
      console.warn(`[sync-assets] skipping unreadable PNG: ${rel}`);
      continue;
    }
    manifest.entries[`png/${rel}`] = { ...info, bytes: buf.length };
    copied += 1;
  }
  await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`[sync-assets] copied ${copied} PNG assets -> public/assets/png (+manifest.json)`);
}

main().catch((err) => {
  console.error('[sync-assets] failed:', err);
  process.exit(1);
});
