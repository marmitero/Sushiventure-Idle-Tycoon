# ADR-0002 — Pipeline de assets: originais intocados, derivados gerados, manifesto explícito

- **Estado:** Aceito (2026-10-12)
- **Contexto:** 609 arquivos em `Sprites/` (PNG runtime + AI/EPS/Spine/atlases).
  A constituição exige preservar originais, gerar derivados separadamente e
  nunca usar placeholder onde há asset oficial.
- **Decisão:**
  1. `Sprites/` permanece versionado e **imutável**.
  2. `scripts/sync-assets.mjs` copia apenas PNGs para `public/assets/png/`
     (gitignored) e escreve `public/assets/manifest.json` com dims/bytes.
  3. `src/assets/registry.ts` é o único lugar com nomes reais de arquivo;
     `tests/assets-registry.test.ts` garante registry ⊆ manifesto.
  4. Derivações em memória (céu/rua a partir de `Backgrounds.png`) acontecem no
     boot via canvas — sem novos arquivos.
  5. **Spine/atlases não são usados em runtime**: as sequências PNG oficiais
     cobrem todas as animações necessárias; adicionar runtime Spine seria
     dependência nova sem benefício atual (regra 17). Reavaliar se surgir
     necessidade de blending/IK real.
  6. Carros (300 frames, 6,7 MB) ficam fora do boot: carga sob demanda (Fase 3).
- **Consequências:** build leve e reproduzível; inventário sempre verdadeiro
  (`scripts/gen-asset-docs.mjs`); débito de muitas requisições no boot
  registrado para atlas packing futuro.
