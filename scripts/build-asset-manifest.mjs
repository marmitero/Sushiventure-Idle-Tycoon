#!/usr/bin/env node
/**
 * Expande a spec de auditoria (scripts/asset-manifest-spec.mjs), VALIDA a
 * cobertura completa de `Sprites/` (cada arquivo classificado exatamente uma
 * vez) e gera:
 *   - docs/assets/ASSET_MANIFEST.json
 *   - docs/assets/ASSET_MANIFEST.md
 *   - docs/assets/ASSET_USAGE_MATRIX.md
 *
 * Falha (exit 1) se houver arquivo não classificado ou classificado duas vezes:
 * o manifesto não pode mentir por omissão.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { SPEC } from './asset-manifest-spec.mjs';

const ROOT = 'Sprites';

function walk(dir, base = ROOT, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, base, acc);
    else acc.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return acc;
}

function pngInfo(file) {
  const buf = readFileSync(file);
  if (buf.length < 33 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), bytes: buf.length };
}

function expand(entry) {
  if (entry.dir) {
    return walk(path.join(ROOT, entry.dir));
  }
  if (Array.isArray(entry.files)) return entry.files;
  const { dir, prefix, count } = entry.files;
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push(`${dir}/${prefix}${String(i).padStart(2, '0')}.png`);
  }
  return list;
}

// ---------------------------------------------------------------- expand all
const allFiles = walk(ROOT);
const owner = new Map();
const entries = [];

for (const spec of SPEC) {
  const files = expand(spec);
  for (const f of files) {
    const full = path.join(ROOT, f);
    if (!existsSync(full)) {
      console.error(`[manifest] ERRO: arquivo da spec não existe: ${f} (entry ${spec.id})`);
      process.exit(1);
    }
    if (owner.has(f)) {
      console.error(`[manifest] ERRO: ${f} classificado duas vezes (${owner.get(f)} e ${spec.id})`);
      process.exit(1);
    }
    owner.set(f, spec.id);
  }
  const detailed = files.map((f) => {
    const full = path.join(ROOT, f);
    const info = f.toLowerCase().endsWith('.png') ? pngInfo(full) : null;
    return info
      ? { path: f, ...info }
      : { path: f, bytes: statSync(full).size };
  });
  entries.push({
    id: spec.id,
    title: spec.title,
    category: spec.category,
    kind: spec.kind,
    visual: spec.visual,
    role: spec.role,
    phase: spec.phase,
    status: spec.status,
    validated: spec.validated === true,
    registry: spec.registry ?? [],
    notes: spec.notes ?? '',
    fileCount: detailed.length,
    files: detailed,
  });
}

const missing = allFiles.filter((f) => !owner.has(f));
if (missing.length > 0) {
  console.error(`[manifest] ERRO: ${missing.length} arquivo(s) sem classificação:`);
  for (const m of missing) console.error('  -', m);
  process.exit(1);
}

const byStatus = entries.reduce((acc, e) => {
  acc[e.status] = (acc[e.status] ?? 0) + 1;
  return acc;
}, {});
const pngBytes = entries
  .flatMap((e) => e.files)
  .filter((f) => f.path.toLowerCase().endsWith('.png'))
  .reduce((s, f) => s + f.bytes, 0);

const manifest = {
  generatedAt: new Date().toISOString(),
  sourceRoot: ROOT,
  auditDate: '2026-10-12',
  method:
    'Inspecão visual item a item (folhas de contato em docs/assets/previews/) + parser de headers PNG; nomes de arquivo NUNCA usados como única evidência.',
  totals: {
    files: allFiles.length,
    entries: entries.length,
    pngBytes,
    byStatus,
  },
  entries,
};

mkdirSync('docs/assets', { recursive: true });
writeFileSync('docs/assets/ASSET_MANIFEST.json', JSON.stringify(manifest, null, 2));

// ------------------------------------------------------------------ markdown
const md = [];
md.push('# ASSET_MANIFEST — o que é cada recurso e para que serve');
md.push('');
md.push(`_Gerado por \`scripts/build-asset-manifest.mjs\` em ${manifest.generatedAt}.`);
md.push('Auditoria visual realizada em 2026-10-12; evidências em [`previews/`](previews/)._');
md.push('');
md.push(
  `**Cobertura:** ${allFiles.length} arquivos classificados em ${entries.length} entradas, sem sobras e sem duplicidade (validado pelo gerador).  `,
);
md.push(
  `**Bytes PNG:** ${(pngBytes / 1024 / 1024).toFixed(2)} MB · **Status:** ${Object.entries(byStatus)
    .map(([k, v]) => `${v} ${k}`)
    .join(', ')}`
);
md.push('');
md.push('Legenda de status: `implementado` (em uso hoje, validado em preview) · `reservado`');
md.push('(destino definido para fase futura) · `nao-usado-runtime` (fonte Spine/vetor) · `metadado`.');
md.push('');

const categories = [...new Set(entries.map((e) => e.category))];
for (const cat of categories) {
  md.push(`## ${cat}`);
  md.push('');
  for (const e of entries.filter((x) => x.category === cat)) {
    const fileSummary =
      e.fileCount === 1
        ? `\`${e.files[0].path}\``
        : `\`${e.files[0].path}\` … \`${e.files[e.fileCount - 1].path}\` (${e.fileCount} arquivos)`;
    const dims = e.files[0].width ? ` · ${e.files[0].width}×${e.files[0].height}px` : '';
    md.push(`### \`${e.id}\` — ${e.title}`);
    md.push('');
    md.push(`- **Arquivos:** ${fileSummary}${dims}`);
    md.push(`- **O que é (verificado):** ${e.visual}`);
    md.push(`- **Uso no jogo:** ${e.role}`);
    md.push(`- **Fase:** ${e.phase} · **Status:** ${e.status}${e.validated ? ' · validado em preview' : ''}`);
    if (e.registry.length > 0) md.push(`- **Chaves no código:** \`src/assets/registry.ts\` → ${e.registry.join(', ')}`);
    if (e.notes) md.push(`- **Observação:** ${e.notes}`);
    md.push('');
  }
}
writeFileSync('docs/assets/ASSET_MANIFEST.md', md.join('\n'));

// ------------------------------------------------------------- usage matrix
const mx = [];
mx.push('# ASSET_USAGE_MATRIX');
mx.push('');
mx.push(`_Gerado a partir de \`ASSET_MANIFEST.json\` em ${manifest.generatedAt}.`);
mx.push('Destino concreto de cada entrada da auditoria; detalhe completo no manifesto.');
mx.push('');
mx.push('| Entrada | Categoria | Destino no jogo | Fase | Status | Validado |');
mx.push('|---|---|---|---|---|---|');
for (const e of entries) {
  mx.push(
    `| \`${e.id}\` | ${e.category} | ${e.role.split('.')[0]} | ${e.phase} | ${e.status} | ${e.validated ? '✅' : '—'} |`,
  );
}
mx.push('');
writeFileSync('docs/assets/ASSET_USAGE_MATRIX.md', mx.join('\n'));

console.log(
  `[manifest] OK — ${allFiles.length} arquivos, ${entries.length} entradas, status: ${JSON.stringify(byStatus)}`,
);
