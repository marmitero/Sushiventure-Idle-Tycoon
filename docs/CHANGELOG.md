# CHANGELOG

Formato: datas + fases, com evidências. Detalhes operacionais em `AI_STATE.md`.

## 2026-10-12 — Manifesto de assets (re-auditoria item a item)

- Nova fonte canônica: `docs/assets/ASSET_MANIFEST.md` / `.json` — 113 entradas
  cobrindo os 609 arquivos do repositório, cada uma com descrição visual
  verificada (folhas de contato em `docs/assets/previews/`, incluindo novas
  folhas de UI em escala nativa, partes Spine e atlases), uso no jogo, fase,
  status e chaves de código.
- Gerador `scripts/build-asset-manifest.mjs` com **validação de cobertura**:
  falha se qualquer arquivo ficar sem classificação ou for classificado duas
  vezes. Status: 44 implementado, 53 reservado, 12 nao-usado-runtime, 4 metadado.
- `ASSET_USAGE_MATRIX.md` passa a ser gerado do manifesto (sem descrição manual
  paralela que possa divergir).
- Testes novos (4): cobertura/unicidade do manifesto, registry ⊆ manifesto,
  entradas `implementado` com chave de registry e arquivo runtime. Total: 43.
- Correções de atribuição da matriz anterior: `HubAreaBar` (barra de hub com
  mapa) diferenciado de `NamePlate` (placa de nome); `ContentBox` descrito como
  linha com marcador; `Area Box` como preenchimento de painel de área;
  `Gams Image` como monte de gemas com brilho (recompensa); artboards da loja
  descritos um a um; cores/modelos dos 5 veículos documentados.

## 2026-10-12 — Fases 0, 1 e 2

### Auditoria (Fase 0)
- Inventário completo de `Sprites/` (609 arquivos; 559 PNG runtime) com CSV e
  folhas de contato visuais; duplicatas explicadas (frames espelhados dos carros).
- Página oficial da CraftPix confrontada com o conteúdo local; lacunas reais
  documentadas (shaft isolado, popup offline genérico, logo não isolado, sem áudio).
- ADR-0001 (stack), ADR-0002 (pipeline de assets), ADR-0003 (Decimal canônico).

### Fundação (Fase 1)
- App Vite + TS estrito + Phaser 3.90; boot com manifesto e barra de progresso;
  derivação de céu/rua em memória; torre com andares/caixa reais; elenco
  animado (cashier girl, chef com ciclo, floor girl, lift guy); câmera
  portrait-first com drag; HUD em cena própria; resize tratado.

### Loop econômico (Fase 2)
- Decimal canônico testado; economia pura com camadas de multiplicador;
  operações atômicas (unlock/upgrade/caixa/tick/boost); painel de melhorias com
  estados explicados; configurações com efeito real (reducedMotion);
  persistência versionada com slot de backup e recuperação; flush em pagehide.
- Boost ×2 por 30 min: produção idempotente por receipt; em dev, simulador
  rotulado; em prod, indisponível com mensagem clara.
- Balanceamento v2 validado por simulação headless de 12h (ECONOMY.md §6).

### Qualidade
- 39 testes Vitest; typecheck estrito; build de produção; preview ao vivo.

### Não incluído (próximas fases)
- Funcionários com efeito econômico, elevador funcional, carros (Fase 3);
  ganhos offline com popup (Fase 4); receitas/reputação/missões (Fase 5);
  cidades/renascimento (Fase 6); eventos (Fase 7); nuvem (Fase 8);
  monetização real (Fase 9); polimento/perf (Fase 10); publicação (Fase 11).
