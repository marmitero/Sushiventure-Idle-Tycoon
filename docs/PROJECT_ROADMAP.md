# PROJECT_ROADMAP

Status em 2026-10-12. Critérios de aceitação copiados da constituição
(`docs/master-prompt.md` Parte 29); "✅" exige evidência (testes/build/preview).

## FASE 0 — Auditoria e preparação ✅

- Inventário, matriz de uso, licenças, auditoria técnica, constituição,
  arquitetura, roadmap, `AI_STATE.md`.
- Evidência: `docs/PROJECT_AUDIT.md`, `docs/assets/*`, ADR-0001/0002/0003.

## FASE 1 — Fundação técnica e primeiro jogo executável ✅

- App Vite+TS+Phaser; boot com manifesto; torre com assets reais; HUD;
  resize/resize-aware; navegação básica; build de produção.
- Evidência: `npm run build` ok; preview ao vivo; typecheck estrito ok.

## FASE 2 — Loop econômico e progressão inicial ✅

- Dinheiro, receita automática, $/s, andares (unlock+upgrade), caixa (6 níveis),
  custos configurados, compras atômicas, persistência local versionada.
- Evidência: 39 testes; simulação de 12h com marcos (ECONOMY.md §6); reload
  preserva progresso (teste de round-trip do SaveManager).

## FASE 3 — Funcionários, elevador e entregas ⏳ (próxima)

- Contratação/melhoria de 4 funcionários com efeitos distintos e testados;
  elevador com estado/eficiência; veículos de entrega com carga sob demanda;
  animações integradas; persistência.
- Critério: cada sistema com efeito real verificável no jogo e nos testes.

## FASE 4 — Ganhos offline e qualidade de vida ⏳

- Cálculo offline com cap e popup do kit; proteção contra duplicidade/recarga;
  configurações com efeito real; tratamento de falhas de save.

## FASE 5 — Receitas, reputação, missões e conquistas ⏳

## FASE 6 — Cidades e renascimento ⏳

## FASE 7 — Eventos e bônus temporários ⏳

## FASE 8 — Contas e salvamento em nuvem ⏳ (depende de provedor/credenciais)

## FASE 9 — Monetização real ⏳ (depende de credenciais do diretor)

## FASE 10 — Polimento, balanceamento e testes finais ⏳

- Inclui débitos atuais: atlas packing das sequências, 9-slice dos boxes,
  revisão de responsividade em telas muito pequenas.

## FASE 11 — Preparação para publicação ⏳

- PWA, política de privacidade, créditos/licenças, checklist, operação.

## Débitos técnicos registrados

| Débito | Origem | Plano |
|---|---|---|
| Muitas requisições de PNG no boot | Fase 1 | empacotar sequências em spritesheets no pipeline (Fase 3/10) |
| Stretch em vez de 9-slice | Fase 2 | Fase 10 |
| Elevador decorativo | Fase 1 | Fase 3 dá função econômica leve |
| Sem áudio | kit não fornece | avaliar síntese simples ou assets licenciados (Fase 10) |
