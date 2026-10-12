# ECONOMY

## 1. Moedas

| Moeda | Uso | Estado |
|---|---|---|
| Dinheiro (`$`) | andares, caixa, funcionários, receitas | ✅ implementado |
| Pontos de Sucesso | bônus permanentes pós-renascimento | ⏳ Fase 6 |
| (avaliar) tokens de evento | eventos sazonais | ⏳ Fase 7+ |

Não existe moeda premium nesta fase; a loja premium só existirá com produtos
reais e efeito real (Parte 19).

## 2. Representação numérica

`Decimal` = mantissa × 10^expoente, **mantissa canônica em [1, 10)** (ADR-0003),
15 dígitos significativos preservados em somas, clamp em 10^1e6 (nunca
`Infinity`/`NaN`), sem zero negativo. Serialização `{m, e}` no save.
`Number` só é usado para exibição/simulação.

## 3. Fórmula de receita

```
ScopeMult(i)  = i == 0 ? AttendantMult : FloorGirlMult          (escopo por andar)
FloorSum      = Σ_floors FloorBase(i, L) × ScopeMult(i)
RevenuePerSec = FloorSum × KitchenMult × DeliveryMult × GlobalMult
FloorBase(i, L) = baseRevenuePerSec × indexGrowth^i × levelGrowth^(L-1)   (L ≥ 1; L=0 → 0)
GlobalMult = CashierMult × RecipeMult × ReputationMult
           × EventMult × PrestigeMult × BoostMult
```

- Cada camada multiplicativa é aplicada **uma única vez** e cada funcionário
  atua em **um escopo próprio** (térreo / andares superiores / cozinha /
  entregas), o que impede double-dip por construção (regra da constituição).
  Multiplicadores de equipe: `1 + perLevel × nível` (nível 0 → ×1).
- `BoostMult` = 2 enquanto houver boost `revenue_x2` ativo (início/término
  persistentes), senão 1.

Parâmetros (únicos, em `src/core/config/balance.ts`):

| Parâmetro | Valor |
|---|---|
| `startMoney` | 15 |
| `baseRevenuePerSec` | 0.6 |
| `indexRevenueGrowth` | 1.9 |
| `levelRevenueGrowth` | 1.6 |
| `unlockBaseCost` / `unlockCostGrowth` | 50 / 7.5 |
| `upgradeBaseCost` / por nível / por índice | 15 / 2.9 / 4.5 |
| `cashier.multipliers` | [1, 1.5, 2.2, 3.2, 4.6, 6.5] |
| `cashier.upgradeCosts` | [–, 400, 6k, 90k, 1.5M, 30M] |
| `staff.*.perLevel` | attendant 0.15 · chef 0.08 · floorGirl 0.12 · liftGuy 0.06 |
| `staff.*.hireCost` | 200 · 900 · 3k · 9k |
| `staff.*.upgradeBase / growth` | 300/2.6 · 800/2.7 · 2k/2.7 · 6k/2.8 |
| `elevator.baseTripMs / min` | 4200 / 900 |
| `elevator.baseVehicleIntervalSec` | 24 (clamp 6–40) |
| `maxTickSeconds` | 60 |

## 4. Custos

```
unlockCost(i)      = unlockBaseCost × unlockCostGrowth^(i-1)          (i ≥ 1)
floorUpgrade(i, L) = upgradeBaseCost × perLevel^L × perIndex^i
cashierCost(nível) = tabela fixa (6 níveis)
```

Curvas estritamente crescentes — garantido por teste (`economy.test.ts`).

## 5. Ritmo pretendido

- Melhorias baratas e frequentes no primeiro minuto (upgrade do andar 1).
- Marcos visuais (novo andar) a cada poucos minutos no início, horas no meio.
- Nunca zero ações úteis: sempre há ao menos 2 trilhos compráveis
  (upgrade de andar vs. próximo andar vs. caixa).

## 6. Evidência de balanceamento (`npm run sim`, política gulosa, 12h)

Medição de 2026-10-12 (balanceamento v2):

```
0.03h  2º andar            1.84h  6 andares
0.12h  3 andares           3.88h  7 andares
0.17h  caixa nv 2          5.91h  caixa nv 5
0.31h  4 andares           9.04h  8 andares
0.65h  caixa nv 3          12h   → andares #1nv10 #2nv10 #3nv10 #4nv9 #5nv8 #6nv7 #7nv5 #8nv4
0.74h  5 andares                caixa 5, receita ≈ 6.0e3/s
2.05h  caixa nv 4
```

Leitura: primeiro desbloqueio em ~2 min; 4 andares em ~19 min; 8 andares em ~9h;
max completo exige dias — compatível com idle web com sessões curtas e offline.
A primeira versão (crescimentos 3.2/2.1/1.7) maxava tudo em 0.19h e foi
rejeitada pela simulação antes de chegar ao jogador.

Medição v3 (2026-10-12, com equipe — política gulosa inclui contratar/treinar):

```
0.14h  contrata attendant     1.39h  6 andares
0.27h  contrata chef          2.16h  7 andares
0.45h  contrata floorGirl     3.56h  8 andares
0.70h  contrata liftGuy       5.80h  caixa max
12h → andares #1-6 nv10, #7 nv9, #8 nv7; equipe nv 13-15; receita ≈ 3.0e5/s
```

A v2 da camada de equipe (perLevel 0.25/0.15/0.20/0.10 com growth 2.2-2.5)
maxava a torre em 12h e foi rejeitada pela simulação; os valores atuais mantêm
a cauda de progressão em dias, com a equipe acelerando sem dominar.

## 7. Explorações conhecidas e proteções

- Salto de relógio/aba em background: `tick` limita dt a 60s por chamada
  (ganhos longos vêm do cálculo offline da Fase 4, com cap próprio).
- Recarga repetida para duplicar boost: receipts em `consumedReceipts`.
- Valores negativos: ops debitam somente após validação; `clampNegativeDrift`.
