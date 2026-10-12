# OFFLINE_PROGRESS (implementado — Fase 4; boost ×2 desde a Fase 2/7)

## Boost ×2 por anúncio (implementado — Fase 2/7 antecipado)

- Fluxo: botão → `RewardedAdProvider.showRewarded()` → somente `completed`
  com receipt concede (`ops.grantRevenueBoost`), uma única vez por receipt.
- Início/término persistidos em `boosts[]`; timer sobrevive a reload; HUD mostra
  o tempo restante; camada de aplicação = `BoostMult` (uma vez).
- Sem provedor configurado: mensagem clara de indisponibilidade (regra 15.2.10).
- Em dev: simulador rotulado com diálogo de confirmação; cancelar não concede.

## Ganhos offline (implementado — Fase 4)

```
offlineGain = OfflineRatePerSec × offlineRate × min(elapsed, cap)
offlineRate = 0.5   cap = 2h base (+ upgrades permanentes na Fase 6)
elapsed = max(0, now - lastSeenAt)   (relógio no passado → 0)
OfflineRatePerSec = camadas de produção (escopos, cozinha, entregas, caixa…)
                    SEM a camada de boost online (decisão documentada)
```

- **Popup real** com `PopUp_Box` + `Gams Image` (`ui.rewardGlow`): tempo
  ausente, tempo contado (com aviso de cap), receita offline e valor final;
  botões COLETAR e ×2 por anúncio.
- **Concessão única por ausência:** receipt `offline-<lastSeenAt>` entra em
  `consumedReceipts` e `lastSeenAt` é carimbado no mesmo passo atômico
  (`ops.applyOfflineGain`); reload/reabrir não paga de novo (testado).
- O valor **não** entra no dinheiro até o jogador coletar; fechar o jogo sem
  coletar apenas recalcula na próxima carga (ausência real continua).
- ×2 por anúncio: somente após `completed` do provedor; sem provedor
  configurado a opção explica a indisponibilidade e não dobra (testado).
- Ausências < 30s não geram popup nem ganho (anti-farm de reload).
- Relógio para trás → elapsed 0; ausência extrema → cap de 2h.
- Modo local não promete antifraude perfeita (regra 17.3); validação
  server-side entra com a nuvem (Fase 8).
