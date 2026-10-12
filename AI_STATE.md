# AI_STATE — Sushiventure Idle Tycoon

> Estado operacional real do projeto. Atualizado no início e no fim de cada etapa.
> Nada aqui é marcado como concluído sem evidência (teste, build, push ou preview).

- **Fase atual:** 3 em diante (Fases 0, 1 e 2 concluídas e validadas)
- **Última etapa concluída:** Fase 2 — loop econômico e progressão inicial
- **Branch:** `arena/a8701903-sushiventure-idle-tycoon`
- **Último commit relevante:** `64c3d1e` (Fases 0-2)
- **Estado do push:** ✅ publicado em `origin/arena/a8701903-sushiventure-idle-tycoon`

## Funcionalidades implementadas

| Sistema | Estado | Evidência |
|---|---|---|
| Auditoria de repositório/assets/CraftPix | Implementado | `docs/PROJECT_AUDIT.md`, `docs/assets/*` |
| Pipeline de assets derivados + manifesto | Implementado + testado | `scripts/sync-assets.mjs`, `tests/assets-registry.test.ts` |
| Núcleo Decimal (mantissa/expoente) | Implementado + testado | `tests/decimal.test.ts` (9 testes) |
| Economia pura (receita, custos, multiplicadores) | Implementado + testado | `tests/economy.test.ts` |
| Operações atômicas (unlock/upgrade/caixa/tick/boost) | Implementado + testado | `tests/ops.test.ts` |
| Persistência local versionada + backup + recuperação | Implementado + testado | `tests/persistence.test.ts` |
| Cena de boot com loading e derivação de céu/rua | Implementado | preview ao vivo |
| Cena da torre (andares, caixa, elenco animado, câmera) | Implementado | preview ao vivo |
| HUD (dinheiro, $/s, painel de melhorias, configurações) | Implementado | preview ao vivo |
| Boost ×2 via anúncio (somente simulador DEV, idempotente) | Implementado + testado | `ops.grantRevenueBoost`, testes de receipt duplicado |
| Simulação de progressão headless | Implementado | `npm run sim` |

## Funcionalidades testadas

- 39 testes Vitest passando (`npx vitest run`).
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

1. Fase 3 — funcionários com efeitos econômicos reais + elevador + veículos de entrega.
2. Fase 4 — ganhos offline com popup do kit e proteção contra duplicidade.
3. Fase 5 — receitas, reputação, missões e conquistas.
4. Atlas packing das sequências de frames (débito de performance).
5. Fases 6–11 conforme `docs/PROJECT_ROADMAP.md`.

## Como continuar o trabalho

1. Ler este arquivo e `docs/PROJECT_ROADMAP.md`.
2. `npm install && npm run dev` para ver o jogo.
3. `npm run validate` antes de qualquer commit.
4. Implementar a próxima fase, atualizar testes + docs + este arquivo, commit e push.
