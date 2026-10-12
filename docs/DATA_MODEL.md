# DATA_MODEL

## 1. Estado persistido (`GameState`, `src/core/state/types.ts`)

| Campo | Tipo | Observação |
|---|---|---|
| `version` | number | `SAVE_VERSION = 1`; migrações em `state/migrations.ts` |
| `createdAt`, `lastSeenAt` | epoch ms | base para ganhos offline (Fase 4) |
| `money`, `lifetimeEarned` | `{m,e}` | Decimal serializado |
| `floors[]` | `{index, level}` | torre contígua; `level 1..10` |
| `cashierLevel` | 1..6 | |
| `city` | `{id, run}` | Fase 6 usará `id` p/ configurações de cidade |
| `prestigePoints`, `prestigesCompleted` | `{m,e}` / number | Fase 6 |
| `boosts[]` | `{id, kind, startedAt, durationSeconds, grantSource}` | início/término persistentes |
| `consumedReceipts[]` | string[] | idempotência de recompensas (máx. 200) |
| `settings` | `{reducedMotion, sound, music}` | apenas opções com efeito real |
| `stats` | `{totalPlaySeconds, floorsUnlocked, cashierUpgrades}` | auditoria/missões |

**Derivados NÃO persistidos:** receita/s, multiplicadores, custos, affordances —
sempre recalculados por `core/economy.ts`.

## 2. Chaves de storage

- `sushiventure.save.main` — slot primário
- `sushiventure.save.main.bak` — último save conhecido como bom

## 3. Carga e recuperação (`loadState`)

1. JSON inválido → `recovered` (estado novo) com `reason: 'json-parse-error'`.
2. Versão fora de `[1, SAVE_VERSION]` → `recovered`.
3. Sanitização sempre aplicada: números finitos, floors contíguos e com cap de
   nível, `cashierLevel` clampado, boosts com duração > 0, receipts filtrados.
4. Primário corrompido → tenta `.bak` (`SaveManager` reporta `usedBackup`).
5. Nunca lança exceção; nunca bloqueia o jogador.

## 4. Migrações

- Toda mudança estrutural futura incrementa `SAVE_VERSION` e adiciona função de
  migração testada (ex.: `tests/persistence.test.ts` cobre sanitização hostil).
- Save de versão maior que a suportada é recusado com recuperação segura
  (evita corromper dados de um cliente mais novo).

## 5. Escrita

- Autosave com throttle de 5s + save imediato após operações (dirty flag).
- `flushSync()` no `pagehide`/`visibilitychange(hidden)`.
- Erros de cota são reportados (`SaveOutcome`), nunca lançados no loop do jogo.
