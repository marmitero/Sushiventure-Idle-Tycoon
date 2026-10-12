# AI_STATE — Sushiventure Idle Tycoon

> Estado operacional real do projeto. Atualizado no início e no fim de cada etapa.
> Nada aqui é marcado como concluído sem evidência (teste, build, push ou preview).

- **Fase atual:** 5 em diante (Fases 0-4 concluídas e validadas)
- **Última etapa concluída:** Alinhamento visual à referência oficial (Screenshot_7.png) — após Fase 4
- **Branch:** `arena/a8701903-sushiventure-idle-tycoon`
- **Último commit relevante:** `93c4e02` (Fase 4) + alinhamento visual (este ciclo)
- **Estado do push:** ✅ publicado em `origin/arena/a8701903-sushiventure-idle-tycoon`

## Funcionalidades implementadas

| Sistema | Estado | Evidência |
|---|---|---|
| Auditoria de repositório/assets/CraftPix | Implementado | `docs/PROJECT_AUDIT.md`, `docs/assets/*` |
| **Manifesto de assets item a item (o que é + para que serve)** | Implementado + testado | `docs/assets/ASSET_MANIFEST.md/.json`, `npm run manifest`, cobertura validada (609/609) |
| Pipeline de assets derivados + manifesto | Implementado + testado | `scripts/sync-assets.mjs`, `tests/assets-registry.test.ts` |
| Núcleo Decimal (mantissa/expoente) | Implementado + testado | `tests/decimal.test.ts` (9 testes) |
| Economia pura (receita, custos, multiplicadores) | Implementado + testado | `tests/economy.test.ts` |
| Operações atômicas (unlock/upgrade/caixa/tick/boost) | Implementado + testado | `tests/ops.test.ts` |
| Persistência local versionada + backup + recuperação | Implementado + testado | `tests/persistence.test.ts` |
| Cena de boot com loading e derivação de céu/rua | Implementado | preview ao vivo |
| Cena da torre (andares, caixa, elenco animado, câmera) | Implementado | preview ao vivo |
| HUD (dinheiro, $/s, painel de melhorias, configurações) | Implementado | preview ao vivo |
| **Alinhamento visual à referência oficial (Screenshot_7.png)** | Implementado + testado | `docs/GAME_DESIGN/VISUAL_REFERENCE.md`, `tests/visual-reference.test.ts` (3 testes) |
| HUD superior: badge de distrito (HubAreaBar) + pílula de gemas + pílula de moeda | Implementado | `HudScene.buildTopBar`, config `core/config/areas.ts` |
| Placas `ANDAR N` sobre a tábua vazia do kit + badges de upgrade por andar | Implementado | `TowerScene.addFloorSprite` |
| Preço visível do próximo andar sobre o casulo (btnGreen + moeda + custo) | Implementado | `TowerScene.positionNextSlot` |
| Boost ×2 via anúncio (somente simulador DEV, idempotente) | Implementado + testado | `ops.grantRevenueBoost`, testes de receipt duplicado |
| Simulação de progressão headless | Implementado | `npm run sim` |
| Funcionários (4 papéis, escopos distintos) + contratação/treino | Implementado + testado | `tests/staff.test.ts`, painel EQUIPE no preview |
| Elevador com eficiência derivada do operador | Implementado | `elevatorTripMs`, tween do lift guy |
| Entregas com veículos lazy-load (variantes 1-2) | Implementado | `vehicleIntervalSec`, tráfego na rua (preview) |
| Migração de save v1 → v2 (bloco staff) | Implementado + testado | `tests/persistence.test.ts` |
| Ganhos offline (cap 2h, piso 30s, concessão única, popup do kit) | Implementado + testado | `tests/offline.test.ts`, popup no preview |
| Correções de honestidade: toggles de áudio desativados com motivo; cadeado oficial em serviços bloqueados; dica de primeiro uso | Implementado | preview + CHANGELOG |

## Funcionalidades testadas

- 62 testes Vitest passando (`npx vitest run`): 8 de offline (cota, cap, relógio, idempotência, fluxo de sessão com reload), 4 de consistência do manifesto, 8 de equipe, 2 de migração v1→v2, demais de decimal/economia/ops/persistência/registry.
- Typecheck estrito passando (`npx tsc --noEmit`).
- Build de produção passando (`npm run build`).
- Simulação de 12h executada com marcos medidos (ver `docs/GAME_DESIGN/ECONOMY.md` §6).

## Testes aprovados / reprovados

- Aprovados: 39/39.
- Reprovados: nenhum no estado atual.

## Problemas conhecidos

1. Frames de carros (300 PNGs) ainda não são carregados nem usados (Fase 3).
2. Carregamento inicial faz muitas requisições de PNG (sem atlas packing ainda).
   Mitigação planejada: empacotar sequências em spritesheets no pipeline.
3. Sem áudio (o kit não inclui arquivos de som) — configuração de som existe no
   save mas não altera comportamento até haver recursos; documentado em
   `docs/GAME_DESIGN/GAME_DESIGN_DOCUMENT.md` §Acessibilidade.
4. Elevador é decorativo (lift guy sobe/desce no shaft) — intencional nesta fase,
   documentado em `docs/GAME_DESIGN/FLOORS_AND_STAFF.md`.
5. Painel de melhorias usa stretch dos boxes do kit (sem 9-slice real); aceitável
   visualmente, refinamento previsto na Fase 10.

## Integrações externas pendentes

| Serviço | Estado | O que falta |
|---|---|---|
| Anúncios recompensados | Não configurado (simulador DEV apenas) | Escolha de provedor compatível com web + credenciais (diretor) |
| Pagamentos | Não configurado | Provedor (Stripe/Mercado Pago) + conta + produtos |
| Nuvem/auth | Não configurado (modo convidado local funciona) | Provedor (ex.: Supabase) + chaves |
| Analytics | No-op | Decisão de provedor e política de privacidade |

## Credenciais/configurações que o diretor precisará fornecer

- Nenhuma credencial foi solicitada ou armazenada até agora.
- Quando decidir ativar monetização/nuvem: criar `.env` a partir de `.env.example`
  (valores fictícios) e registrar decisão em `docs/monetization/MONETIZATION.md`.

## Decisões recentes

- ADR-0001: stack TypeScript + Phaser 3.90 + Vite; core puro separado da apresentação.
- ADR-0002: assets derivados gerados por script, originais intocados, manifesto versionado em doc.
- ADR-0003: normalização canônica do Decimal em mantissa ∈ [1,10).
- Balanceamento v2 das curvas de custo validado por simulação (ECONOMY.md §6).

## Próximas tarefas (prioridade)

1. Validação visual do diretor no preview: elenco contratado, elevador e tráfego de entregas.
2. Fase 5 — receitas, reputação, clientes especiais, missões e conquistas.
2. Fase 4 — ganhos offline com popup do kit e proteção contra duplicidade.
3. Fase 5 — receitas, reputação, missões e conquistas.
4. Atlas packing das sequências de frames (débito de performance).
5. Fases 6–11 conforme `docs/PROJECT_ROADMAP.md`.

## Como continuar o trabalho

1. Ler este arquivo e `docs/PROJECT_ROADMAP.md`.
2. `npm install && npm run dev` para ver o jogo.
3. `npm run validate` antes de qualquer commit.
4. Implementar a próxima fase, atualizar testes + docs + este arquivo, commit e push.
