# FLOORS_AND_STAFF

## Andares (implementado — Fase 2)

- Torre contígua: posição `i` só desbloqueia após `i-1`; começa com 1 andar nv1.
- Nível visual = nível lógico (1..10) mapeado direto para `Floor_Lv{n}.png`;
  slot seguinte usa `Floor_Lv0.png` (casulo bloqueado) e é tocável → abre o
  painel focado no desbloqueio.
- Receita e custos: ECONOMY.md §3–4. Limite atual de posições: 24 (config),
  além do qual novos visuais precisarão de variantes/composição (regra 9.3).
- Ao desbloquear: estado, arte, receita, HUD, missões (Fase 5) e save atualizam
  numa única operação atômica + flash visual no topo (suprimido com reducedMotion).

## Caixa (implementado — Fase 2)

- 6 níveis = `CashierL1..L6.png` (fachada térrea evolui: toldo, menu, semáforos).
- Efeito: multiplicador **global** [1, 1.5, 2.2, 3.2, 4.6, 6.5]; custos em tabela.
- Não é "botão de dinheiro": o painel mostra o antes → depois do multiplicador.

## Funcionários (Fase 3 — projeto)

| Papel | Asset | Efeito planejado (distinto) |
|---|---|---|
| Atendente (Cashier Girl) | 40f | +receita do térreo/caixa por nível (aditivo em StaffMult) |
| Chef (Chef Guy) | 3×20f | reduz "tempo de preparo" → aumenta base dos andares |
| Floor Girl | 20f | +receita dos andares acima do 1º por nível |
| Lift Guy | 20f | +eficiência do elevador → bônus de entregas e offline cap leve |

Cada funcionário: custo de contratação, custo por nível, efeito por nível,
persistência, representação visual no local de trabalho e teste próprio.
Nenhum funcionário terá efeito idêntico ao de outro (pilar D).

## Elevador

Hoje: decorativo intencional (lift guy percorre o shaft embutido dos floors).
Fase 3: estado (espera/movimento), tempo de deslocamento e eficiência com
efeito pequeno e documentado na receita de entregas — sem simulação logística
complexa (regra 11.1).

## Entregas (Fase 3)

- Carros (5 variantes, idle/move) entram pela rua, param e saem; frequência
  liga-se ao nível de entregas; se algum dia afetarem receita, a relação será
  documentada em ECONOMY.md (hoje: nenhum efeito oculto).
