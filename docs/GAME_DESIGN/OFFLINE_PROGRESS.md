# OFFLINE_PROGRESS (projeto — Fase 4; boost já implementado)

## Boost ×2 por anúncio (implementado — Fase 2/7 antecipado)

- Fluxo: botão → `RewardedAdProvider.showRewarded()` → somente `completed`
  com receipt concede (`ops.grantRevenueBoost`), uma única vez por receipt.
- Início/término persistidos em `boosts[]`; timer sobrevive a reload; HUD mostra
  o tempo restante; camada de aplicação = `BoostMult` (uma vez).
- Sem provedor configurado: mensagem clara de indisponibilidade (regra 15.2.10).
- Em dev: simulador rotulado com diálogo de confirmação; cancelar não concede.

## Ganhos offline (Fase 4)

```
offlineGain = RevenuePerSec(at save) × offlineRate × min(elapsed, cap)
offlineRate = 0.5   cap = 2h base (+ upgrades permanentes)
elapsed = max(0, now - lastSeenAt)   (ignora relógio no passado)
```

- Popup composto com `PopUp_Box` + `Gams Image` mostrando: tempo ausente,
  receita-base, bônus aplicados, valor final e opção ×2 por anúncio (real).
- Concessão única por retorno: o cálculo ocorre na carga e grava
  `lastSeenAt = now` no mesmo passo do save (reload não repete).
- Ausências < 30s não geram popup nem ganho (evita farm de reload).
- Relógio manipulado para trás → elapsed 0; para frente extremo → cap aplica.
- Modo local não promete antifraude perfeita (documentado, regra 17.3).
