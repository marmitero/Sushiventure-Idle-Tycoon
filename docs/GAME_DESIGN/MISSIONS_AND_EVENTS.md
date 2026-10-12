# MISSIONS_AND_EVENTS (projeto — Fases 5 e 7)

## Missões

- Alimentadas por **eventos do core** (`floor_unlocked`, `cashier_upgraded`,
  `boost_granted`, marcos de receita), nunca por polling de UI.
- Entidade: id estável, objetivo, progresso, meta, condição, recompensa,
  estado, disponibilidade, persistência. Recompensa concedida uma única vez.

## Conquistas

- Globais vs. por cidade; persistentes; jamais re-concedidas.
- Primeiro lucro, primeiro andar, primeira contratação, primeira receita,
  primeira cidade, primeiro renascimento, marcos de receita, coleção completa.

## Eventos aleatórios (Fase 7)

- Elegibilidade, duração, frequência com cooldown e teto de simultâneos,
  efeito econômico em camada própria (`EventMult`), regras de encerramento e
  persistência de temporizadores (reload não reinicia nem duplica).
- Aleatoriedade com semente + janelas mínimas/máximas entre eventos.

## Sazonais (arquitetura preparada)

Datas/duração configuráveis; ativação futura por remote config; sem multiplayer;
sem depender só do relógio local para recompensas sensíveis.
