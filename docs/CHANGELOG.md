# CHANGELOG

Formato: datas + fases, com evidências. Detalhes operacionais em `AI_STATE.md`.

## 2026-10-12 — Alinhamento visual à referência oficial (Screenshot_7.png)

- Diretor enviou `Screenshot_7.png` (commit `58597f9`) como alvo visual do jogo
  em retrato. Análise item a item em `docs/GAME_DESIGN/VISUAL_REFERENCE.md`
  (18 linhas: elemento → asset/decisão → estado).
- Veredito: a composição que estamos produzindo É a da referência (mesma
  linguagem: torre central, rua viva, HUD composta com peças do kit). Deltas
  fechados agora: badge de distrito no topo (HubAreaBar + nome real de config),
  pílula de Pontos de Sucesso (btnGreen + GemsIcon + valor real), placas
  `ANDAR N` desenhadas sobre a tábua vazia baked no kit, badge verde+seta de
  upgrade por andar, botão de preço do próximo andar sobre o casulo, barra
  inferior escura com BOOST à esquerda e MAPA/LOJA rotulados à direita.
- Deltas documentados (sem arte inventada): cabine do elevador só existe em
  vetor (`Eps/Lift.eps`, sem rasterizador no sandbox); semáforo/placa drive-thru
  não existem como PNG no kit; fileira de carros parados é vitrine do promo, no
  jogo o tráfego é vivo.
- Manifesto: `ui.hubAreaBar`, `ui.gemsIcon`, `ui.manyUpgradeBoxGreen` →
  implementado (54 entradas). Testes: 65/65 (`tests/visual-reference.test.ts`).

## 2026-10-12 — Correções de honestidade de UI (relato de QA do diretor)

- Toggles de som/música apresentados como funcionais sem recurso de áudio
  (controle decorativo, violação da §23) → substituídos por linhas
  honestamente desativadas com a arte off oficial do kit e motivo ao tocar.
- Botões de serviço não configurado (mapa/loja) deixam o tint cinza genérico e
  passam a exibir o cadeado oficial do kit (`map.lock`) + motivo ao tocar.
- Dica de primeiro uso orienta andar bloqueado e botão EQUIPE (evita leitura
  de "torre vazia" como placeholder).
- Classificação registrada no manifesto: `map.lock` e `ui.rewardGlow` →
  `implementado`.

## 2026-10-12 — Fase 4: ganhos offline

- Cálculo fechado (sem simular segundo a segundo): rate offline sem camada de
  boost, piso de 30s, cap de 2h, relógio regressivo → 0.
- Popup composto com `PopUp_Box` + `Gams Image`: ausência, tempo contado,
  receita, total, COLETAR e ×2 por anúncio (só após completed do provedor).
- Integridade: receipt `offline-<lastSeenAt>` + carimbo de `lastSeenAt` no
  mesmo passo atômico; reload/reabrir não paga duas vezes (testado, inclusive
  fluxo de sessão com repositório e reload).
- 8 testes novos; total 62. Manifesto e docs sincronizados.

## 2026-10-12 — Fase 3: funcionários, elevador e entregas

- Equipe com 4 papéis de escopos econômicos distintos (térreo / andares
  superiores / cozinha / entregas), contratação e treino atômicos, caps e
  curvas próprias em `balance.staff`; personagem só aparece quando contratado.
- Elevador: tempo de viagem deriva do nível do operador (`elevatorTripMs`);
  entregas: intervalo de veículos deriva da mesma camada (`vehicleIntervalSec`),
  sem efeito oculto dos carros (regra 11.2); `reducedMotion` desliga o tráfego.
- Veículos 1-2 com lazy-load pós-boot e animações move/idle; variantes 3-5
  reclassificadas no manifesto para cidades (Fase 6).
- HUD: botão EQUIPE (asset `ui.btnUp`/label kit) e painel de equipe com
  efeito atual → próximo e custos explicados.
- Save v2: bloco `staff` com migração v1→v2 testada e sanitização de níveis.
- Balanceamento v3 da camada de equipe validado por simulação (ECONOMY.md §6);
  a v2 da equipe foi rejeitada por maxar a torre em 12h.
- Manifesto atualizado: 50 entradas `implementado`; testes de consistência 54/54.

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
