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

## Funcionários (implementado — Fase 3)

| Papel | Asset (manifesto) | Efeito (escopo próprio, sem sobreposição) |
|---|---|---|
| Atendente de Caixa (Cashier Girl) | `cast.cashierGirl` | ×(1+0.15·nv) **somente no térreo** (índice 0) |
| Chef de Cozinha (Chef Guy) | `cast.chef.*` | ×(1+0.08·nv) **sobre a soma de todos os andares** |
| Atendente de Andar (Floor Girl) | `cast.floorGirl` | ×(1+0.12·nv) **somente andares superiores** (índice ≥ 1) |
| Operador de Elevador (Lift Guy) | `cast.liftGuy` | ×(1+0.06·nv) **camada de eficiência de entregas/elevador** |

- Nível 0 = não contratado; contratar = nível 1. Custos em `balance.staff`
  (contratação + curva de treino por papel, caps 25).
- Personagem só existe na cena quando está contratado (sem "funcionário
  fantasma"); contratação/treino atualizam elenco, elevador e entregas.
- Ops atômicas `hireStaff`/`upgradeStaff` com testes (`tests/staff.test.ts`),
  incluindo escopos distintos verificados por receita esperada exata.

## Elevador (implementado — Fase 3, intencionalmente leve)

- Tempo de viagem deriva do nível do operador: `baseTripMs / (1+0.1·(nv-1))`,
  piso de 900 ms (`elevatorTripMs`).
- O operador sobe/desce o shaft embutido dos floors com esse tempo; feedback
  visual do mesmo valor que alimenta a camada de entregas (regra 11.1: sem
  simulação logística complexa).

## Entregas (implementado — Fase 3)

- Veículos das variantes 1–2 (`vehicle.car1/2.*`, lazy-load) cruzam a rua,
  param para entregar e saem; intervalo = `baseVehicleIntervalSec / deliveryMult`
  com clamp [6s, 40s] (`vehicleIntervalSec`).
- **Relação econômica documentada:** a frequência visual deriva da camada
  `delivery` (operador de elevador); os carros não acrescentam efeito oculto
  próprio (regra 11.2). Variantes 3–5 ficam reservadas para cidades (Fase 6).
- `reducedMotion` desativa o tráfego (acessibilidade).
