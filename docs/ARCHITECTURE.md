# ARCHITECTURE

## 1. Stack

| Camada | Tecnologia | Motivo |
|---|---|---|
| Linguagem | TypeScript estrito (`noUncheckedIndexedAccess`) | segurança de tipos em economia/UI |
| Render | Phaser 3.90 (linha 3, estável) | 2D sprites/animações/câmera maduros; Phaser 4 avaliado e adiado (ADR-0001) |
| Build/dev | Vite 5 | dev server rápido, build otimizado |
| Testes | Vitest | mesmo transform do build, rodando o core puro em Node |
| Persistência local | `localStorage` via adaptador | simples, síncrono no lifecycle; IndexedDB avaliado para Fase 8 |
| Futuro mobile | Capacitor (webview) | core independente de browser APIs facilita empacotar |

## 2. Módulos e dependências

```
src/
  core/            # NUNCA importa Phaser/DOM
    decimal.ts         Decimal imutável (mantissa ∈ [1,10), expoente)
    format.ts          formatação de números/duração
    config/balance.ts  ÚNICA fonte de curvas e parâmetros
    economy.ts         receita, multiplicadores, custos (funções puras)
    ops.ts             operações atômicas (unlock/upgrade/tick/boost)
    state/             tipos do save, factory, migrações/sanitização
  persistence/
    saveRepository.ts  contrato + adaptadores (localStorage, memória)
    saveManager.ts     load/fallback backup/autosave/flushSync
  services/
    contracts.ts       AuthProvider, RewardedAdProvider, PaymentProvider,
                       PurchaseVerifier, AnalyticsProvider, RemoteConfigProvider
    devAdapters.ts     adaptadores "não configurado" + simulador DEV rotulado
    registry.ts        resolução por ambiente (dev vs prod)
  assets/
    registry.ts        nomes lógicos → caminhos reais (+ contagens de frames)
  game/
    session.ts         dono mutável do GameState + serviços + eventos
    worldLayout.ts     geometria do mundo (unidades = px nativos do kit)
    scenes/            BootScene, TowerScene, HudScene
    ui/kit.ts          botões/painéis/textos com sprites do kit
  main.ts              bootstrap: save → serviços → Phaser
```

Regra de dependência: `core ← persistence ← game`; `services` só é consumido
por `session`/`main`. Nenhuma cena calcula economia: elas chamam `core`.

## 3. Fluxo de uma operação (ex.: comprar upgrade)

1. UI chama `session.upgradeFloor(i)`.
2. `core/ops.upgradeFloor` valida pré-requisitos, debita e aplica → novo estado
   imutável ou `{ ok:false, reason }`.
3. Sucesso: `save.adopt(state)`, analytics, `emit('floor_upgraded')`.
4. Cenas inscritas reagem (torre reconstrói, painel refresca).
5. Autosave (5s) + save em `pagehide`/`visibilitychange` (`flushSync`).

## 4. Fluxo de receita

- `TowerScene` mede tempo real decorrido (`time.now`) e chama `session.advance(dt)`.
- `ops.tick` limita `dt` a `BALANCE.maxTickSeconds` (protege contra saltos de
  relógio/aba suspensa) e credita `revenuePerSec × dt`.
- `revenuePerSec = GlobalMult × Σ floorBaseRevenue(index, level)`;
  `GlobalMult = cashier × staff × recipes × reputation × events × prestige × boosts`
  (cada camada aplicada uma única vez — ver ECONOMY.md §3).

## 5. Contratos de serviço (5.3 da constituição)

Implementados hoje: `GuestOnlyAuthProvider` (modo convidado real),
`NotConfiguredRewardedAdProvider` (prod) / `DevSimulatedRewardedAdProvider` (dev,
rotulado, com confirmação), `NotConfiguredPaymentProvider`,
`NotConfiguredPurchaseVerifier`, `NoopAnalyticsProvider`,
`StaticRemoteConfigProvider`. Nenhum concede benefício sem configuração real.

## 6. Assets em runtime

- `npm run assets` copia `Sprites/Png/**` → `public/assets/png/**` e escreve
  `public/assets/manifest.json` (dims + bytes por arquivo).
- `BootScene` carrega o manifesto e só então enfileira texturas; deriva
  `bg.sky`/`bg.street` em memória a partir de `Backgrounds.png` (sem arquivos novos).
- Carros ficam fora do boot (`carPaths()`), para carga sob demanda na Fase 3.

## 7. Decisões de câmera/layout

- Mundo em unidades nativas do kit (largura da torre = 1056).
- Zoom = clamp(larguraTela / 1150, 0.40, 1.05): portrait mostra a torre legível;
  drag vertical com clamp; follow automático do topo após 4s sem interação.
- HUD em cena separada (`HudScene`) em coordenadas de tela, com `resize` tratado.
- Composição visual de torre+HUD segue a referência oficial do kit: tabela
  elemento→asset em `docs/GAME_DESIGN/VISUAL_REFERENCE.md` (com deltas documentados).

## 8. Limitações conhecidas

- Sem 9-slice real (stretch de boxes) — refinamento Fase 10.
- Sem atlas packing (muitas requisições) — débito registrado no ROADMAP.
- Save em `localStorage` (cota ~5MB): payload atual é < 5 KB; migração para
  IndexedDB prevista apenas se necessário (Fase 8).
