# GAME_DESIGN_DOCUMENT

## Fantasia e loop

Construir um pequeno restaurante de sushi e transformá-lo em império: a torre
cresce, a equipe trabalha sozinha, o dinheiro entra, o jogador decide onde
investir, conquista cidades e renasce com bônus permanentes.

Loop: receita automática → coleta/investimento → melhorias → novos andares →
equipe melhor → receitas/reputação → missões → limite da cidade → renascimento
→ Pontos de Sucesso → nova jornada mais eficiente.

## Tela principal

- Céu + skyline em parallax, rua com entregas (Fase 3), térreo = fachada do
  caixa (6 níveis visuais), torre de andares (Lv1–Lv10) e slot bloqueado Lv0.
- Elenco animado: caixa (girl), chef (walk/cook/walk-full), floor girl, lift guy.
- Câmera portrait-first com zoom mínimo que mantém personagens legíveis;
  drag vertical para inspecionar rua/topo.

## HUD

- Topo: barra de moedas do kit + dinheiro + `$ /s` + multiplicador global.
- Chip de boost ativo com tempo restante.
- Base: MELHORIAS (painel), boost por anúncio, mapa (Fase 6), loja (Fase 9),
  configurações.
- Painel de melhorias: linhas com nome, efeito (antes → depois), custo e botão
  com estado explicado (nunca botão morto sem motivo).

## Sistemas e fase de entrega

| Sistema | Fase | Nota de design |
|---|---|---|
| Andares/caixa | 2 ✅ | unlock + upgrade com arte real por nível |
| Funcionários | 3 | 4 papéis com efeitos distintos (FLOORS_AND_STAFF.md) |
| Elevador/entregas | 3 | feedback visual + eficiência leve |
| Offline | 4 | cap 2h base, popup composto do kit |
| Receitas/reputação/clientes | 5 | coleção com efeitos mensuráveis |
| Missões/conquistas | 5 | alimentadas por eventos do core, não pela UI |
| Cidades/renascimento/PS | 6 | PRESTIGE_SYSTEM.md |
| Eventos/boosts | 7 | temporizadores persistentes |
| Nuvem/auth | 8 | convidado primeiro, vínculo depois |
| Monetização | 9 | só com configuração real |

## Acessibilidade e qualidade de vida

- `reducedMotion` reduz flashes/tweens (implementado e com efeito real).
- Som/música existem no save mas **não são apresentados como funcionais** até
  existirem recursos de áudio (regra: nenhum controle decorativo).
- Textos em pt-BR; arquitetura de strings centralizada nos scenes para futura i18n.

## Monetização (resumo)

Anúncio recompensado = 30 min de lucro ×2, concedido somente após confirmação do
provedor e uma única vez por receipt. Em dev, simulador rotulado com confirmação
explícita. Loja premium somente com produtos reais (Fase 9).
