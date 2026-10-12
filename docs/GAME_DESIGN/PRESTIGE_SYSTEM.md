# PRESTIGE_SYSTEM (projeto — Fase 6)

## Condição de conclusão da cidade

Conjunto configurável e **visível antes de ser concluído**:
andares exigidos, níveis mínimos de caixa, meta de receita acumulada,
reputação mínima e missões principais da cidade.

## Renascimento

- Confirmação em duas etapas (nunca clique único).
- Reset local: dinheiro → `startMoney`, torre → 1 andar nv1, caixa → 1,
  funcionários locais → não contratados, boosts temporários → expirados.
- Preservado: Pontos de Sucesso, bônus permanentes, conquistas globais,
  coleções globais, histórico de renascimentos, `consumedReceipts`, settings.
- Fórmula de PS (testável): `PS = floor(basePoints × (lifetimeEarned / threshold)^growth)`
  com `growth < 1` para punir ciclos curtos; simulação comparará "vários resets
  rápidos" vs "uma jornada longa" (regra 16.3).

## Cidades

Configuração por cidade: metas, multiplicadores de custo/receita, receitas
exclusivas, eventos regionais e variação visual quando o kit permitir
(ex.: tint do céu/nuvens do mapa). Diferenças nunca serão só de nome.

## Árvore de Pontos de Sucesso

Categorias: receita global, velocidade de progressão, eficiência de equipe,
eficiência de melhorias, ganhos offline, redução controlada de custos,
reputação, receita inicial. Cada nó: custo, efeito, níveis máximos,
pré-requisitos, fórmula, persistência e teste; compra sem saldo é recusada;
bônus nunca reaplicado após load/reset (aplicação deriva do estado, não de eventos).
