# SECURITY

## Modelo de ameaça (web idle game)

| Ameaça | Controle atual |
|---|---|
| Save corrompido/perdido | sanitização + slot `.bak` + recuperação sem crash |
| Recompensa duplicada (reload/replay) | receipts em `consumedReceipts`; concessão atômica |
| Relógio manipulado | elapsed clampado (≥0), cap offline, `maxTickSeconds` |
| Injeção de estado hostil via storage | `loadState` sanitiza todos os campos (tipos, caps, contiguidade) |
| Segredos no repositório | `.env` gitignored; `.env.example` com valores fictícios; nenhum segredo no frontend |
| Compra forjada no cliente | pagamentos só via provedor + verificação (Fase 9); adaptadores atuais nunca aprovam |
| Anúncio forjado | recompensa somente após callback `completed` com receipt do provedor |
| XSS/inputs | sem HTML gerado de dados do usuário; textos via Phaser Text |
| Quota excedida | `SaveOutcome` reportado; jogo continua em memória e tenta no próximo flush |

## Limites honestos

- Modo 100% local **não** oferece antifraude forte: o dispositivo não é fonte
  confiável. Operações sensíveis (compras reais, recompensas competitivas)
  exigirão validação server-side na Fase 8/9 — documentado, não prometido antes.
- Logs de analytics (quando existirem) não conterão dados pessoais por padrão.

## Segredos e credenciais

- Nenhum arquivo versionado contém token/chave/senha (verificado na auditoria).
- Fluxo para ativar serviços: diretor cria `.env` local a partir de
  `.env.example`; produção usa segredos do provedor de hosting.
