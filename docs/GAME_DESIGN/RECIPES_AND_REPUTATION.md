# RECIPES_AND_REPUTATION (projeto — Fase 5)

## Receitas

- Entidade: id, nome, descrição, categoria, ícone (asset do kit quando existir;
  senão representação coerente e identificada como tal), requisito, estado de
  descoberta, custo de desenvolvimento, efeito econômico, nível de melhoria,
  origem do desbloqueio.
- Efeito: multiplicador próprio (`RecipeMult`) aditivo dentro da camada
  (soma de contribuições), nunca multiplicador redundante por receita.
- Desbloqueio por: torre, reputação, missões, conquistas, eventos, cidades.

## Reputação

- Derivada de marcos reais (andares, equipe, receitas, missões, eventos).
- Destrava: clientes especiais, receitas, metas e bônus de receita
  (`ReputationMult`), sempre com efeito observável (regra 13.1).

## Clientes especiais

Configuráveis: recorrente (recompensa), crítico (reputação), VIP (boost
temporário), colecionador (receita), evento (recompensa exclusiva).
Cada um: condições, frequência controlada, recompensa idempotente
(`consumedReceipts`), duração, feedback visual e persistência.
Sem sprites exclusivos no kit → reutilização coerente do elenco existente,
documentada como tal (nunca prometido personagem único inexistente).
