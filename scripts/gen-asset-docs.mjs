#!/usr/bin/env node
/**
 * Regenerates docs/assets/ASSET_INVENTORY.md (+ CSV) from the generated
 * manifest so the inventory can never drift from the files on disk.
 * Run: npm run assets && node scripts/gen-asset-docs.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const manifest = JSON.parse(readFileSync('public/assets/manifest.json', 'utf8'));
const entries = Object.entries(manifest.entries).sort(([a], [b]) => a.localeCompare(b));

const CATEGORY_RULES = [
  ['Floors (tower levels)', (p) => p.startsWith('png/Floors/')],
  ['Cashiers (storefront / cashier upgrades)', (p) => p.startsWith('png/Cashiers/')],
  ['Background (sky, skyline, street)', (p) => p.startsWith('png/Backgrounds/')],
  ['Cars (delivery vehicles)', (p) => p.startsWith('png/Cars/')],
  ['Character: Cashier Girl', (p) => p.startsWith('png/Cashier Girl/')],
  ['Character: Chef Guy', (p) => p.startsWith('png/Chef Guy/')],
  ['Character: Floor Girl', (p) => p.startsWith('png/Floor Girl/')],
  ['Character: Lift Guy', (p) => p.startsWith('png/Lift Guy/')],
  ['City map', (p) => p.startsWith('png/Open Area Map/')],
  ['Shop screen / IAP icons', (p) => p.startsWith('png/Shop Screen/')],
  ['UI & popups', (p) => p.startsWith('png/Ui and PopUp/')],
];

function categoryOf(p) {
  for (const [name, test] of CATEGORY_RULES) if (test(p)) return name;
  return 'Other';
}

const groups = new Map();
for (const [p, info] of entries) {
  const cat = categoryOf(p);
  if (!groups.has(cat)) groups.set(cat, []);
  groups.get(cat).push([p, info]);
}

const md = [];
md.push('# ASSET_INVENTORY — Sushiventure Idle Tycoon');
md.push('');
md.push(`_Gerado automaticamente por \`scripts/gen-asset-docs.mjs\` em ${new Date().toISOString()}_`);
md.push('');
md.push('Fonte: `Sprites/Png` (originais versionados no repositório). Derivados de runtime');
md.push('vivem em `public/assets/` (gitignored) e são regenerados por `npm run assets`.');
md.push('');
md.push(`**Total de PNGs de runtime:** ${entries.length}  `);
md.push(
  `**Bytes totais:** ${(entries.reduce((s, [, i]) => s + i.bytes, 0) / 1024 / 1024).toFixed(2)} MB  `,
);
md.push(`**Manifest:** \`public/assets/manifest.json\` (gerado em ${manifest.generatedAt})`);
md.push('');
md.push('Fontes não-runtime presentes no repositório (não entram no build):');
md.push('');
md.push('| Conjunto | Arquivos | Uso |');
md.push('|---|---|---|');
md.push('| `Sprites/Ai/*.ai` | 12 | Fontes vetoriais Illustrator (edição de arte) |');
md.push('| `Sprites/Eps/*.eps` | 12 | Fontes vetoriais EPS |');
md.push('| `Sprites/Spine/**` | 38 | Projetos Spine 4.2 + imagens de partes |');
md.push('| `Sprites/Json Atlas/**` | 15 | Atlases TexturePacker usados pelo Spine |');
md.push('| `Sprites/FontLink.txt` | 1 | Fontes Google sugeridas (Bebas Neue, Passion One, Lilita One) |');
md.push('| `Sprites/license.txt` | 1 | Aponta para https://craftpix.net/file-licenses/ |');
md.push('');

for (const [cat, list] of groups) {
  md.push(`## ${cat}`);
  md.push('');
  md.push(`_${list.length} arquivo(s)_`);
  md.push('');
  md.push('| Caminho (relativo a `public/assets/`) | Dimensões | Bytes |');
  md.push('|---|---|---|');
  // Collapse animation sequences into ranges for readability
  const seq = new Map();
  for (const [p, info] of list) {
    const m = p.match(/^(.*_)(\d{2})\.png$/);
    if (m) {
      const key = m[1];
      const cur = seq.get(key) ?? { count: 0, w: info.width, h: info.height, bytes: 0, first: p };
      cur.count += 1;
      cur.bytes += info.bytes;
      seq.set(key, cur);
    } else {
      md.push(`| \`${p}\` | ${info.width}×${info.height} | ${info.bytes} |`);
    }
  }
  for (const [key, info] of seq) {
    md.push(
      `| \`${key}00.png … ${key}${String(info.count - 1).padStart(2, '0')}.png\` (sequência de ${info.count} frames) | ${info.w}×${info.h} | ${info.bytes} |`,
    );
  }
  md.push('');
}

mkdirSync('docs/assets', { recursive: true });
writeFileSync('docs/assets/ASSET_INVENTORY.md', md.join('\n'));

const csv = ['path,width,height,bytes'];
for (const [p, info] of entries) csv.push(`"${p}",${info.width},${info.height},${info.bytes}`);
writeFileSync('docs/assets/asset_inventory.csv', csv.join('\n'));

console.log(`[gen-asset-docs] ASSET_INVENTORY.md (${entries.length} entradas) + asset_inventory.csv`);
