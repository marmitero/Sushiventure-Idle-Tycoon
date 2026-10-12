# ASSET_MANIFEST — o que é cada recurso e para que serve

_Gerado por `scripts/build-asset-manifest.mjs` em 2026-10-12T11:27:50.557Z.
Auditoria visual realizada em 2026-10-12; evidências em [`previews/`](previews/)._

**Cobertura:** 609 arquivos classificados em 113 entradas, sem sobras e sem duplicidade (validado pelo gerador).  
**Bytes PNG:** 10.09 MB · **Status:** 44 implementado, 53 reservado, 12 nao-usado-runtime, 4 metadado

Legenda de status: `implementado` (em uso hoje, validado em preview) · `reservado`
(destino definido para fase futura) · `nao-usado-runtime` (fonte Spine/vetor) · `metadado`.

## Torre

### `tower.floor.locked` — Andar bloqueado (casulo de expansão)

- **Arquivos:** `Png/Floors/Floor_Lv0.png` · 1056×340px
- **O que é (verificado):** Casulo de andar ainda não construído: persiana metálica fechada com placa vermelha "CLOSED", faixa marrom "ADD NEW FLOOR" e coluna escura do shaft de elevador à esquerda. Telhado igual ao dos andares construídos.
- **Uso no jogo:** Slot do próximo andar na torre. É tocável e abre o painel de melhorias focado no desbloqueio.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → floors(0)

### `tower.floor.lv1` — Andar construído — nível visual 1

- **Arquivos:** `Png/Floors/Floor_Lv1.png` · 1056×341px
- **O que é (verificado):** Interior vazio: balcão simples, cozinha básica ao fundo e shaft escuro à esquerda.
- **Uso no jogo:** Arte do andar de índice i quando seu nível lógico é 1 (mapeamento 1:1 nível→arte).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → floors(1)

### `tower.floor.lv2` — Andar construído — nível visual 2

- **Arquivos:** `Png/Floors/Floor_Lv2.png` · 1056×341px
- **O que é (verificado):** Nv2: adiciona exaustor/equipamento de parede e bancada inox.
- **Uso no jogo:** Arte do andar de índice i quando seu nível lógico é 2 (mapeamento 1:1 nível→arte).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → floors(2)

### `tower.floor.lv3` — Andar construído — nível visual 3

- **Arquivos:** `Png/Floors/Floor_Lv3.png` · 1056×340px
- **O que é (verificado):** Nv3: divisória de madeira e mais bancada; cozinha ganha segunda estação.
- **Uso no jogo:** Arte do andar de índice i quando seu nível lógico é 3 (mapeamento 1:1 nível→arte).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → floors(3)

### `tower.floor.lv4` — Andar construído — nível visual 4

- **Arquivos:** `Png/Floors/Floor_Lv4.png` · 1056×341px
- **O que é (verificado):** Nv4: linha de cozinha completa com coifas e armários.
- **Uso no jogo:** Arte do andar de índice i quando seu nível lógico é 4 (mapeamento 1:1 nível→arte).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → floors(4)

### `tower.floor.lv5` — Andar construído — nível visual 5

- **Arquivos:** `Png/Floors/Floor_Lv5.png` · 1056×341px
- **O que é (verificado):** Nv5: quadro de menus na parede e estação de preparo ampliada.
- **Uso no jogo:** Arte do andar de índice i quando seu nível lógico é 5 (mapeamento 1:1 nível→arte).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → floors(5)

### `tower.floor.lv6` — Andar construído — nível visual 6

- **Arquivos:** `Png/Floors/Floor_Lv6.png` · 1056×340px
- **O que é (verificado):** Nv6: decoração (quadros/luminárias) e bancada auxiliar.
- **Uso no jogo:** Arte do andar de índice i quando seu nível lógico é 6 (mapeamento 1:1 nível→arte).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → floors(6)

### `tower.floor.lv7` — Andar construído — nível visual 7

- **Arquivos:** `Png/Floors/Floor_Lv7.png` · 1056×341px
- **O que é (verificado):** Nv7: mesas de atendimento e mais equipamentos suspensos.
- **Uso no jogo:** Arte do andar de índice i quando seu nível lógico é 7 (mapeamento 1:1 nível→arte).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → floors(7)

### `tower.floor.lv8` — Andar construído — nível visual 8

- **Arquivos:** `Png/Floors/Floor_Lv8.png` · 1056×341px
- **O que é (verificado):** Nv8: iluminação quente de balcão e vitrine acesa.
- **Uso no jogo:** Arte do andar de índice i quando seu nível lógico é 8 (mapeamento 1:1 nível→arte).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → floors(8)

### `tower.floor.lv9` — Andar construído — nível visual 9

- **Arquivos:** `Png/Floors/Floor_Lv9.png` · 1056×341px
- **O que é (verificado):** Nv9: plantas, vitrines cheias e cozinha totalmente equipada.
- **Uso no jogo:** Arte do andar de índice i quando seu nível lógico é 9 (mapeamento 1:1 nível→arte).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → floors(9)

### `tower.floor.lv10` — Andar construído — nível visual 10

- **Arquivos:** `Png/Floors/Floor_Lv10.png` · 1056×341px
- **O que é (verificado):** Nv10: restaurante completo e aconchegante, iluminação máxima e plantas nos dois lados.
- **Uso no jogo:** Arte do andar de índice i quando seu nível lógico é 10 (mapeamento 1:1 nível→arte).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → floors(10)

### `tower.cashier.lv1` — Fachada térrea / caixa — nível 1

- **Arquivos:** `Png/Cashiers/CashierL1.png` · 1040×412px
- **O que é (verificado):** Fachada térrea com logo "SUSHI TOWER" no topo, placa CASHIER, janela de atendimento à esquerda, placa DRIVE THRU à direita e shaft escuro.
- **Uso no jogo:** Arte do térreo (storefront) quando cashierLevel = 1. Base da torre; o logo do jogo vem rasterizado aqui.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → cashiers(1)

### `tower.cashier.lv2` — Fachada térrea / caixa — nível 2

- **Arquivos:** `Png/Cashiers/CashierL2.png` · 1040×412px
- **O que é (verificado):** Nv2: adiciona quadro de menu iluminado na janela.
- **Uso no jogo:** Arte do térreo (storefront) quando cashierLevel = 2. Base da torre; o logo do jogo vem rasterizado aqui.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → cashiers(2)

### `tower.cashier.lv3` — Fachada térrea / caixa — nível 3

- **Arquivos:** `Png/Cashiers/CashierL3.png` · 1040×412px
- **O que é (verificado):** Nv3: toldo vermelho sobre a janela do caixa.
- **Uso no jogo:** Arte do térreo (storefront) quando cashierLevel = 3. Base da torre; o logo do jogo vem rasterizado aqui.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → cashiers(3)

### `tower.cashier.lv4` — Fachada térrea / caixa — nível 4

- **Arquivos:** `Png/Cashiers/CashierL4.png` · 1040×412px
- **O que é (verificado):** Nv4: toldo listrado vermelho/branco + semáforo lateral de entregas.
- **Uso no jogo:** Arte do térreo (storefront) quando cashierLevel = 4. Base da torre; o logo do jogo vem rasterizado aqui.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → cashiers(4)

### `tower.cashier.lv5` — Fachada térrea / caixa — nível 5

- **Arquivos:** `Png/Cashiers/CashierL5.png` · 1040×412px
- **O que é (verificado):** Nv5: fachada com mais sinalização lateral e detalhes de madeira.
- **Uso no jogo:** Arte do térreo (storefront) quando cashierLevel = 5. Base da torre; o logo do jogo vem rasterizado aqui.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → cashiers(5)

### `tower.cashier.lv6` — Fachada térrea / caixa — nível 6

- **Arquivos:** `Png/Cashiers/CashierL6.png` · 1040×412px
- **O que é (verificado):** Nv6: vitrines verdes acesas e dois semáforos laterais (operação plena).
- **Uso no jogo:** Arte do térreo (storefront) quando cashierLevel = 6. Base da torre; o logo do jogo vem rasterizado aqui.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → cashiers(6)

## Cenário

### `scene.background` — Backdrop urbano vertical completo

- **Arquivos:** `Png/Backgrounds/Backgrounds.png` · 1904×3118px
- **O que é (verificado):** Canvas vertical 1904×3118: céu em degradê azul (topo), skyline de prédios coloridos com vegetação (~61–72% da altura), calçada clara, rua asfaltada com faixa pontilhada e solo escuro na base.
- **Uso no jogo:** Fonte única do cenário: no boot é derivado em memória em `bg.sky` (céu+skyline, parallax lento) e `bg.street` (calçada+rua+solo, espaço de mundo onde a torre assenta e os carros passarão).
- **Fase:** 1 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → background

### `scene.clouds` — Nuvem de parallax

- **Arquivos:** `Png/Backgrounds/Clouds.png` · 791×283px
- **O que é (verificado):** Nuvem branca/ciano suave, recortada com transparência.
- **Uso no jogo:** Instâncias em parallax no céu da cena da torre.
- **Fase:** 1 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → clouds

## Elenco

### `cast.cashierGirl` — Atendente do caixa (animação)

- **Arquivos:** `Png/Cashier Girl/ChashierGirl-animation_00.png` … `Png/Cashier Girl/ChashierGirl-animation_39.png` (40 arquivos) · 92×73px
- **O que é (verificado):** Moça com headset e avental laranja atrás de um balcão com pilha de bandejas/caixas e monitor de pedidos; a animação movimenta braços/cabeça atendendo o caixa.
- **Uso no jogo:** Funcionária visual do térreo, posicionada na janela do caixa.
- **Fase:** 1 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → cashierGirl(f)
- **Observação:** Nome original do arquivo contém typo do kit ("ChashierGirl"); preservado.

### `cast.chef.cooking` — Chef cozinhando (animação)

- **Arquivos:** `Png/Chef Guy/Cooking/ChefGuy-Cooking_00.png` … `Png/Chef Guy/Cooking/ChefGuy-Cooking_19.png` (20 arquivos) · 100×120px
- **O que é (verificado):** Chef de uniforme branco e chapéu mexendo/preparendo panela; braços e vapor animados.
- **Uso no jogo:** Estado "cozinhando" do chef no ciclo de vida da cozinha.
- **Fase:** 1 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → chefCooking(f)

### `cast.chef.walk` — Chef andando vazio (animação)

- **Arquivos:** `Png/Chef Guy/Walk/ChefGuy-Walk_00.png` … `Png/Chef Guy/Walk/ChefGuy-Walk_19.png` (20 arquivos) · 100×120px
- **O que é (verificado):** Chef caminhando sem carregar nada (ciclo de passada).
- **Uso no jogo:** Deslocamento do chef entre estação e balcão.
- **Fase:** 1 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → chefWalk(f)

### `cast.chef.walkFullOrder` — Chef andando com pedido completo (animação)

- **Arquivos:** `Png/Chef Guy/Walk Full Order/ChefGuy-Walk Full Order_00.png` … `Png/Chef Guy/Walk Full Order/ChefGuy-Walk Full Order_19.png` (20 arquivos) · 100×120px
- **O que é (verificado):** Chef caminhando carregando bandeja/pilha de pedidos prontos.
- **Uso no jogo:** Momento de entrega do pedido no ciclo da cozinha.
- **Fase:** 1 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → chefWalkFull(f)

### `cast.floorGirl` — Funcionária de andar (animação)

- **Arquivos:** `Png/Floor Girl/FloorGirl-animation_00.png` … `Png/Floor Girl/FloorGirl-animation_19.png` (20 arquivos) · 84×59px
- **O que é (verificado):** Moça com headset em pé/atendendo junto a um balcão com monitor (estação de atendimento de andar).
- **Uso no jogo:** Funcionária visual dos andares superiores.
- **Fase:** 1 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → floorGirl(f)

### `cast.liftGuy` — Operador do elevador (animação)

- **Arquivos:** `Png/Lift Guy/Lift Guy-animation_00.png` … `Png/Lift Guy/Lift Guy-animation_19.png` (20 arquivos) · 45×91px
- **O que é (verificado):** Homem de uniforme segurando uma caixa/pacote, em pé (idle respirando).
- **Uso no jogo:** Operador visual dentro do shaft de elevador embutido nos floors.
- **Fase:** 1 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → liftGuy(f)
- **Observação:** O kit não traz shaft isolado em PNG; o shaft existe embutido nos Floor_*.png (ver auditoria).

## Veículos

### `vehicle.car1.idle` — Veículo 1 — parada/vibração (animação)

- **Arquivos:** `Png/Cars/Car1/Idle/Cars-Car1_Idle_00.png` … `Png/Cars/Car1/Idle/Cars-Car1_Idle_19.png` (20 arquivos) · 240×168px
- **O que é (verificado):** Van roxa com rack de teto; loop de suspensão/vibração parado (frames 01↔19 espelhados, loop ping-pong natural).
- **Uso no jogo:** Veículo estacionado/aguardando pedido na rua (sistema de entregas).
- **Fase:** 3 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → carIdle(1, f)
- **Observação:** Carregamento sob demanda (6,7 MB no total dos 5 veículos); fora do boot.

### `vehicle.car2.idle` — Veículo 2 — parada/vibração (animação)

- **Arquivos:** `Png/Cars/Car2/Idle/Cars-Car2_Idle_00.png` … `Png/Cars/Car2/Idle/Cars-Car2_Idle_19.png` (20 arquivos) · 240×160px
- **O que é (verificado):** Picape teal (verde-azulada); loop de suspensão/vibração parado (frames 01↔19 espelhados, loop ping-pong natural).
- **Uso no jogo:** Veículo estacionado/aguardando pedido na rua (sistema de entregas).
- **Fase:** 3 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → carIdle(2, f)
- **Observação:** Carregamento sob demanda (6,7 MB no total dos 5 veículos); fora do boot.

### `vehicle.car3.idle` — Veículo 3 — parada/vibração (animação)

- **Arquivos:** `Png/Cars/Car3/Idle/Cars-Car3_Idle_00.png` … `Png/Cars/Car3/Idle/Cars-Car3_Idle_19.png` (20 arquivos) · 240×158px
- **O que é (verificado):** Compacto azul com estepe traseiro; loop de suspensão/vibração parado (frames 01↔19 espelhados, loop ping-pong natural).
- **Uso no jogo:** Veículo estacionado/aguardando pedido na rua (sistema de entregas).
- **Fase:** 3 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → carIdle(3, f)
- **Observação:** Carregamento sob demanda (6,7 MB no total dos 5 veículos); fora do boot.

### `vehicle.car4.idle` — Veículo 4 — parada/vibração (animação)

- **Arquivos:** `Png/Cars/Car4/Idle/Cars-Car4_Idle_00.png` … `Png/Cars/Car4/Idle/Cars-Car4_Idle_19.png` (20 arquivos) · 196×157px
- **O que é (verificado):** Hatch amarelo/laranja; loop de suspensão/vibração parado (frames 01↔19 espelhados, loop ping-pong natural).
- **Uso no jogo:** Veículo estacionado/aguardando pedido na rua (sistema de entregas).
- **Fase:** 3 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → carIdle(4, f)
- **Observação:** Carregamento sob demanda (6,7 MB no total dos 5 veículos); fora do boot.

### `vehicle.car5.idle` — Veículo 5 — parada/vibração (animação)

- **Arquivos:** `Png/Cars/Car5/Idle/Cars-Car5_Idle_00.png` … `Png/Cars/Car5/Idle/Cars-Car5_Idle_19.png` (20 arquivos) · 249×163px
- **O que é (verificado):** Van cinza/clara de entrega; loop de suspensão/vibração parado (frames 01↔19 espelhados, loop ping-pong natural).
- **Uso no jogo:** Veículo estacionado/aguardando pedido na rua (sistema de entregas).
- **Fase:** 3 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → carIdle(5, f)
- **Observação:** Carregamento sob demanda (6,7 MB no total dos 5 veículos); fora do boot.

### `vehicle.car1.move` — Veículo 1 — movimento (animação)

- **Arquivos:** `Png/Cars/Car1/Move/Cars-Car1_Move_00.png` … `Png/Cars/Car1/Move/Cars-Car1_Move_39.png` (40 arquivos) · 236×167px
- **O que é (verificado):** Mesmo veículo da variante correspondente em deslocamento: rodas e suspensão animadas (40 frames).
- **Uso no jogo:** Entrada/saída de veículos na rua para entregas concluídas.
- **Fase:** 3 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → carMove(1, f)

### `vehicle.car2.move` — Veículo 2 — movimento (animação)

- **Arquivos:** `Png/Cars/Car2/Move/Cars-Car2_Move_00.png` … `Png/Cars/Car2/Move/Cars-Car2_Move_39.png` (40 arquivos) · 236×160px
- **O que é (verificado):** Mesmo veículo da variante correspondente em deslocamento: rodas e suspensão animadas (40 frames).
- **Uso no jogo:** Entrada/saída de veículos na rua para entregas concluídas.
- **Fase:** 3 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → carMove(2, f)

### `vehicle.car3.move` — Veículo 3 — movimento (animação)

- **Arquivos:** `Png/Cars/Car3/Move/Cars-Car3_Move_00.png` … `Png/Cars/Car3/Move/Cars-Car3_Move_39.png` (40 arquivos) · 237×158px
- **O que é (verificado):** Mesmo veículo da variante correspondente em deslocamento: rodas e suspensão animadas (40 frames).
- **Uso no jogo:** Entrada/saída de veículos na rua para entregas concluídas.
- **Fase:** 3 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → carMove(3, f)

### `vehicle.car4.move` — Veículo 4 — movimento (animação)

- **Arquivos:** `Png/Cars/Car4/Move/Cars-Car4_Move_00.png` … `Png/Cars/Car4/Move/Cars-Car4_Move_39.png` (40 arquivos) · 204×158px
- **O que é (verificado):** Mesmo veículo da variante correspondente em deslocamento: rodas e suspensão animadas (40 frames).
- **Uso no jogo:** Entrada/saída de veículos na rua para entregas concluídas.
- **Fase:** 3 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → carMove(4, f)

### `vehicle.car5.move` — Veículo 5 — movimento (animação)

- **Arquivos:** `Png/Cars/Car5/Move/Cars-Car5_Move_00.png` … `Png/Cars/Car5/Move/Cars-Car5_Move_39.png` (40 arquivos) · 243×162px
- **O que é (verificado):** Mesmo veículo da variante correspondente em deslocamento: rodas e suspensão animadas (40 frames).
- **Uso no jogo:** Entrada/saída de veículos na rua para entregas concluídas.
- **Fase:** 3 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → carMove(5, f)

## Mapa

### `map.area` — Mapa de cidades (ilha)

- **Arquivos:** `Png/Open Area Map/Area.png` · 1903×3118px
- **O que é (verificado):** Ilha verde com estradas cinzas e pontos de marcador, sobre mar azul; o conteúdo útil ocupa a faixa central de um canvas vertical 1903×3118.
- **Uso no jogo:** Tela de seleção/expansão de cidades (Fase 6).
- **Fase:** 6 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → mapArea

### `map.building.available` — Marcador de prédio disponível

- **Arquivos:** `Png/Open Area Map/Available Building.png` · 260×250px
- **O que é (verificado):** Edifício em perspectiva com telhado marrom/madeira e base clara (estado disponível).
- **Uso no jogo:** Marcador de cidade desbloqueável no mapa.
- **Fase:** 6 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → mapAvailable

### `map.building.locked` — Marcador de prédio bloqueado

- **Arquivos:** `Png/Open Area Map/Locked Building.png` · 259×250px
- **O que é (verificado):** Mesmo edifício em tons de cinza/grafite (estado bloqueado).
- **Uso no jogo:** Marcador de cidade ainda bloqueada.
- **Fase:** 6 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → mapLocked

### `map.lock` — Cadeado

- **Arquivos:** `Png/Open Area Map/Lock.png` · 83×99px
- **O que é (verificado):** Cadeado laranja com haste marrom.
- **Uso no jogo:** Ícone de bloqueio sobre marcadores e requisitos.
- **Fase:** 6 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → mapLock

### `map.namePlate` — Placa de nome

- **Arquivos:** `Png/Open Area Map/NamePlate.png` · 193×73px
- **O que é (verificado):** Placa verde escura com pino laranja à esquerda (suporte para nome da cidade).
- **Uso no jogo:** Placa com o nome da cidade no mapa.
- **Fase:** 6 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → mapPlate

### `map.clouds` — Nuvens do mapa

- **Arquivos:** `Png/Open Area Map/Clouds.png` · 442×164px
- **O que é (verificado):** Grupo de nuvens claras para decorar a tela do mapa.
- **Uso no jogo:** Decoração/parallax da tela de cidades.
- **Fase:** 6 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → mapClouds

## Loja

### `shop.background` — Fundo da loja (padrão)

- **Arquivos:** `Png/Shop Screen/Artboard 1.png` · 1903×3118px
- **O que é (verificado):** Padrão de losangos azuis (textura de fundo da tela de loja).
- **Uso no jogo:** Fundo da loja premium (Fase 9).
- **Fase:** 9 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → shopBackground

### `shop.header` — Barra de cabeçalho da loja

- **Arquivos:** `Png/Shop Screen/Artboard 2.png` · 1914×454px
- **O que é (verificado):** Barra horizontal marrom sólida (cabeçalho).
- **Uso no jogo:** Cabeçalho da tela de loja.
- **Fase:** 9 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → shopHeader

### `shop.divider` — Divisor fino degradê

- **Arquivos:** `Png/Shop Screen/Artboard 3.png` · 1903×229px
- **O que é (verificado):** Filete horizontal em degradê azul (divisor de seções).
- **Uso no jogo:** Divisor de seções da loja.
- **Fase:** 9 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → shopDivider

### `shop.scroll` — Barra de rolagem/seleção degradê

- **Arquivos:** `Png/Shop Screen/Artboard 4.png` · 1904×349px
- **O que é (verificado):** Barra horizontal degradê azul com fade branco no topo (trilho de scroll/abas).
- **Uso no jogo:** Trilho de rolagem ou seletor de abas da loja.
- **Fase:** 9 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → shopScrollbar

### `shop.panelGreen` — Painel verde com cabeçalho

- **Arquivos:** `Png/Shop Screen/Artboard 5.png` · 542×862px
- **O que é (verificado):** Painel verde claro com faixa de cabeçalho verde escura.
- **Uso no jogo:** Painel de listas/seções da loja.
- **Fase:** 9 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → shopPanelGreen

### `shop.panelOrange` — Painel laranja arredondado

- **Arquivos:** `Png/Shop Screen/Artboard 6.png` · 268×154px
- **O que é (verificado):** Retângulo laranja arredondado com sombra (painel/botão grande).
- **Uso no jogo:** Painel de destaque ou CTA da loja.
- **Fase:** 9 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → shopPanelOrange

### `shop.iap.piggy` — Ícone de pacote IAP — piggy

- **Arquivos:** `Png/Shop Screen/Artboard 7.png` · 443×392px
- **O que é (verificado):** Porquinho rosa com moedas e gemas (pacote IAP menor).
- **Uso no jogo:** Ícone de produto na loja premium; só aparece com pagamentos reais configurados (Fase 9).
- **Fase:** 9 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → iapPiggy

### `shop.iap.chest` — Ícone de pacote IAP — chest

- **Arquivos:** `Png/Shop Screen/Artboard 8.png` · 490×414px
- **O que é (verificado):** Baú azul transbordando gemas e moedas (pacote IAP médio).
- **Uso no jogo:** Ícone de produto na loja premium; só aparece com pagamentos reais configurados (Fase 9).
- **Fase:** 9 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → iapChest

### `shop.iap.cart` — Ícone de pacote IAP — cart

- **Arquivos:** `Png/Shop Screen/Artboard 9.png` · 481×468px
- **O que é (verificado):** Carrinho de mercado cheio de gemas/moedas (pacote IAP grande).
- **Uso no jogo:** Ícone de produto na loja premium; só aparece com pagamentos reais configurados (Fase 9).
- **Fase:** 9 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → iapCart

### `shop.iap.redGem` — Ícone de pacote IAP — redGem

- **Arquivos:** `Png/Shop Screen/Artboard 10.png` · 484×329px
- **O que é (verificado):** Gema vermelha grande com moedas (pacote especial).
- **Uso no jogo:** Ícone de produto na loja premium; só aparece com pagamentos reais configurados (Fase 9).
- **Fase:** 9 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → iapRedGem

### `shop.iap.gemPile` — Ícone de pacote IAP — gemPile

- **Arquivos:** `Png/Shop Screen/Artboard 11.png` · 433×316px
- **O que é (verificado):** Pilha de gemas verdes com moedas (pacote de gemas).
- **Uso no jogo:** Ícone de produto na loja premium; só aparece com pagamentos reais configurados (Fase 9).
- **Fase:** 9 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → iapGemPile

### `shop.iap.basket` — Ícone de pacote IAP — basket

- **Arquivos:** `Png/Shop Screen/Artboard 12.png` · 397×366px
- **O que é (verificado):** Cesta de madeira cheia de gemas/moedas (pacote promocional).
- **Uso no jogo:** Ícone de produto na loja premium; só aparece com pagamentos reais configurados (Fase 9).
- **Fase:** 9 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → iapBasket

## UI

### `ui.adsIcon` — UI — Ads_Icon

- **Arquivos:** `Png/Ui and PopUp/Ads_Icon.png` · 76×57px
- **O que é (verificado):** Quadrado marrom com triângulo branco de play (ícone de vídeo/anúncio).
- **Uso no jogo:** Ícone de "assistir anúncio" em ofertas recompensadas.
- **Fase:** 7 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.adsIcon

### `ui.areaBox` — UI — Area Box

- **Arquivos:** `Png/Ui and PopUp/Area Box.png` · 694×236px
- **O que é (verificado):** Retângulo laranja/areia sólido arredondado (preenchimento de painel de área).
- **Uso no jogo:** Painel de área/hub na tela de cidades.
- **Fase:** 6 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.areaBox

### `ui.arrowUpgrade` — UI — ArrowUpgrade

- **Arquivos:** `Png/Ui and PopUp/ArrowUpgrade.png` · 45×51px
- **O que é (verificado):** Seta amarela apontando para cima.
- **Uso no jogo:** Indicador de "melhorar" em botões/linhas de upgrade.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.arrowUpgrade

### `ui.boostIcon` — UI — Boost_Icon

- **Arquivos:** `Png/Ui and PopUp/Boost_Icon.png` · 55×71px
- **O que é (verificado):** Raio amarelo (boost).
- **Uso no jogo:** Ícone do botão de boost ×2.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.boostIcon

### `ui.btnUp` — UI — BtnUp

- **Arquivos:** `Png/Ui and PopUp/BtnUp.png` · 108×104px
- **O que é (verificado):** Botão quadrado verde com ícone de prancheta/lista.
- **Uso no jogo:** Abrir lista/painel de melhorias (alternativa ao botão de texto).
- **Fase:** 3 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.btnUp

### `ui.btnUpPressed` — UI — BtnUpPressed

- **Arquivos:** `Png/Ui and PopUp/BtnUpPressed.png` · 108×104px
- **O que é (verificado):** Mesmo botão em versão pressionada (tons escuros).
- **Uso no jogo:** Estado pressed do btnUp.
- **Fase:** 3 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.btnUpPressed

### `ui.btnBlue` — UI — Btn_Blue

- **Arquivos:** `Png/Ui and PopUp/Btn_Blue.png` · 451×160px
- **O que é (verificado):** Botão retangular azul claro com borda escura.
- **Uso no jogo:** Botão secundário/informativo em popups.
- **Fase:** 4 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.btnBlue

### `ui.btnBlueOff` — UI — Btn_Blue_Off

- **Arquivos:** `Png/Ui and PopUp/Btn_Blue_Off.png` · 451×160px
- **O que é (verificado):** Botão azul acinzentado (desativado).
- **Uso no jogo:** Estado desativado de compras no painel (motivo exibido junto).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.btnBlueOff

### `ui.btnBoost` — UI — Btn_Boost

- **Arquivos:** `Png/Ui and PopUp/Btn_Boost.png` · 347×172px
- **O que é (verificado):** Botão amarelo/laranja arredondado (boost).
- **Uso no jogo:** Botão de boost recompensado.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.btnBoost

### `ui.btnBoostPressed` — UI — Btn_Boost Pressed

- **Arquivos:** `Png/Ui and PopUp/Btn_Boost Pressed.png` · 347×171px
- **O que é (verificado):** Versão pressionada marrom do botão de boost.
- **Uso no jogo:** Estado pressed do boost.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.btnBoostPressed

### `ui.btnBoostDisabled` — UI — Btn_Boost Disable

- **Arquivos:** `Png/Ui and PopUp/Btn_Boost Disable.png` · 347×172px
- **O que é (verificado):** Botão de boost acinzentado (indisponível).
- **Uso no jogo:** Estado indisponível do boost (sem provedor de anúncios).
- **Fase:** 7 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.btnBoostDisabled

### `ui.btnClose` — UI — Btn_Close

- **Arquivos:** `Png/Ui and PopUp/Btn_Close.png` · 85×85px
- **O que é (verificado):** X branco com contorno escuro.
- **Uso no jogo:** Fechar popups/painéis.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.btnClose

### `ui.btnGreen` — UI — Btn_Green

- **Arquivos:** `Png/Ui and PopUp/Btn_Green.png` · 256×104px
- **O que é (verificado):** Botão retangular verde claro com borda marrom.
- **Uso no jogo:** Ação principal (comprar / abrir melhorias).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.btnGreen

### `ui.btnGreenPressed` — UI — Btn_Green Pressed

- **Arquivos:** `Png/Ui and PopUp/Btn_Green Pressed.png` · 256×104px
- **O que é (verificado):** Versão pressionada verde escura.
- **Uso no jogo:** Estado pressed da ação principal.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.btnGreenPressed

### `ui.btnHelp` — UI — Btn_Help

- **Arquivos:** `Png/Ui and PopUp/Btn_Help.png` · 167×163px
- **O que é (verificado):** Botão quadrado laranja com lâmpada.
- **Uso no jogo:** Ajuda/explicações de sistemas.
- **Fase:** 10 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.btnHelp

### `ui.btnMusic` — UI — Btn_Music

- **Arquivos:** `Png/Ui and PopUp/Btn_Music.png` · 168×163px
- **O que é (verificado):** Botão quadrado laranja com nota musical.
- **Uso no jogo:** Toggle de música (quando houver recurso de áudio).
- **Fase:** 10 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.btnMusic

### `ui.btnMusicOff` — UI — Btn_Music_Off

- **Arquivos:** `Png/Ui and PopUp/Btn_Music_Off.png` · 168×162px
- **O que é (verificado):** Mesmo botão com nota cortada (off).
- **Uso no jogo:** Estado off do toggle de música.
- **Fase:** 10 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.btnMusicOff

### `ui.btnOrange` — UI — Btn_Orange

- **Arquivos:** `Png/Ui and PopUp/Btn_Orange.png` · 568×201px
- **O que é (verificado):** Botão retangular laranja grande.
- **Uso no jogo:** Ação secundária em popups.
- **Fase:** 4 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.btnOrange

### `ui.btnOrangePressed` — UI — Btn_Orange_Pressed

- **Arquivos:** `Png/Ui and PopUp/Btn_Orange_Pressed.png` · 568×201px
- **O que é (verificado):** Versão pressionada marrom.
- **Uso no jogo:** Estado pressed do botão laranja.
- **Fase:** 4 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.btnOrangePressed

### `ui.btnOrangeSmall` — UI — Btn_Orange_Small

- **Arquivos:** `Png/Ui and PopUp/Btn_Orange_Small.png` · 392×143px
- **O que é (verificado):** Botão laranja menor.
- **Uso no jogo:** Toggles das configurações (usado hoje).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.btnOrangeSmall

### `ui.btnOrangeSmallOff` — UI — Btn_Orange_Small_Off

- **Arquivos:** `Png/Ui and PopUp/Btn_Orange_Small_Off.png` · 393×143px
- **O que é (verificado):** Versão off/acinzentada do botão menor.
- **Uso no jogo:** Estado off de toggles.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.btnOrangeSmallOff

### `ui.btnSound` — UI — Btn_Sound

- **Arquivos:** `Png/Ui and PopUp/Btn_Sound.png` · 167×163px
- **O que é (verificado):** Botão quadrado laranja com alto-falante.
- **Uso no jogo:** Toggle de efeitos sonoros (quando houver áudio).
- **Fase:** 10 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.btnSound

### `ui.btnSoundOff` — UI — Btn_Sound_Off

- **Arquivos:** `Png/Ui and PopUp/Btn_Sound_Off.png` · 168×162px
- **O que é (verificado):** Mesmo botão com alto-falante cortado.
- **Uso no jogo:** Estado off do som.
- **Fase:** 10 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.btnSoundOff

### `ui.btnVibra` — UI — Btn_Vibra

- **Arquivos:** `Png/Ui and PopUp/Btn_Vibra.png` · 168×163px
- **O que é (verificado):** Botão quadrado laranja com celular vibrando.
- **Uso no jogo:** Toggle de vibração (relevante só no app Android).
- **Fase:** 11 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.btnVibra

### `ui.btnVibraOff` — UI — Btn_Vibra_Off

- **Arquivos:** `Png/Ui and PopUp/Btn_Vibra_Off.png` · 168×162px
- **O que é (verificado):** Mesmo botão cortado (off).
- **Uso no jogo:** Estado off da vibração.
- **Fase:** 11 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.btnVibraOff

### `ui.coinIcon` — UI — CoinIcon

- **Arquivos:** `Png/Ui and PopUp/CoinIcon.png` · 57×54px
- **O que é (verificado):** Moeda amarela com cifrão.
- **Uso no jogo:** Ícone de dinheiro na HUD.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.coinIcon

### `ui.contentBox` — UI — ContentBox

- **Arquivos:** `Png/Ui and PopUp/ContentBox.png` · 695×100px
- **O que é (verificado):** Barra pêssego clara com um ponto escuro à esquerda (linha de conteúdo com marcador).
- **Uso no jogo:** Fundo das linhas do painel de melhorias.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.contentBox

### `ui.rewardGlow` — UI — Gams Image

- **Arquivos:** `Png/Ui and PopUp/Gams Image.png` · 744×765px
- **O que é (verificado):** Monte de gemas verdes e moedas com brilho radial amarelo.
- **Uso no jogo:** Arte de recompensa (popup offline, conclusão de missão/evento).
- **Fase:** 4 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.rewardGlow

### `ui.gemsIcon` — UI — GemsIcon

- **Arquivos:** `Png/Ui and PopUp/GemsIcon.png` · 61×57px
- **O que é (verificado):** Gema verde facetada.
- **Uso no jogo:** Ícone de moeda premium (somente se/quando existir).
- **Fase:** 9 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.gemsIcon

### `ui.gemsPlus` — UI — GemsPlusBar

- **Arquivos:** `Png/Ui and PopUp/GemsPlusBar.png` · 57×55px
- **O que é (verificado):** Quadrado verde escuro com sinal de + branco.
- **Uso no jogo:** Botão "comprar mais gemas" ao lado do saldo premium.
- **Fase:** 9 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.gemsPlus

### `ui.hubAreaBar` — UI — HubAreaBar

- **Arquivos:** `Png/Ui and PopUp/HubAreaBar.png` · 362×159px
- **O que é (verificado):** Barra verde escura com mapa aparecendo no topo e pino laranja.
- **Uso no jogo:** Barra de área/hub do jogador na tela de cidades.
- **Fase:** 6 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.hubAreaBar

### `ui.hudCoinBar` — UI — HudCoinBar

- **Arquivos:** `Png/Ui and PopUp/HudCoinBar.png` · 310×81px
- **O que é (verificado):** Barra âmbar arredondada com contorno escuro (suporte de saldo).
- **Uso no jogo:** Barra de dinheiro no topo da HUD.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.hudCoinBar

### `ui.manyUpgradeBox` — UI — ManyUpgradeBox

- **Arquivos:** `Png/Ui and PopUp/ManyUpgradeBox.png` · 273×85px
- **O que é (verificado):** Caixa marrom clara dividida em 3 segmentos (seletor múltiplo).
- **Uso no jogo:** Seletor de compra múltipla (x1/x10/max) no painel.
- **Fase:** 3 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.manyUpgradeBox

### `ui.manyUpgradeBoxGreen` — UI — ManyUpgradeBoxGreen

- **Arquivos:** `Png/Ui and PopUp/ManyUpgradeBoxGreen.png` · 92×75px
- **O que é (verificado):** Quadrado verde (segmento ativo do seletor múltiplo).
- **Uso no jogo:** Segmento ativo do seletor de compra múltipla.
- **Fase:** 3 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.manyUpgradeBoxGreen

### `ui.mapIcon` — UI — MapIcon

- **Arquivos:** `Png/Ui and PopUp/MapIcon.png` · 174×169px
- **O que é (verificado):** Mapa dobrado com pino laranja sobre base de madeira.
- **Uso no jogo:** Botão de mapa de cidades (hoje: indisponível com motivo).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.mapIcon

### `ui.popUpBox` — UI — PopUp_Box

- **Arquivos:** `Png/Ui and PopUp/PopUp_Box.png` · 1065×1297px
- **O que é (verificado):** Painel bege alto com cabeçalho marrom escuro (janela genérica).
- **Uso no jogo:** Corpo do painel de melhorias e de popups futuros.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.popUpBox

### `ui.requirementBox` — UI — RequermentBox

- **Arquivos:** `Png/Ui and PopUp/RequermentBox.png` · 259×59px
- **O que é (verificado):** Barra marrom escura arredondada (faixa de requisito).
- **Uso no jogo:** Linhas de requisito em popups de desbloqueio/cidade.
- **Fase:** 6 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.requirementBox

### `ui.settingIcon` — UI — SettingIcon

- **Arquivos:** `Png/Ui and PopUp/SettingIcon.png` · 128×122px
- **O que é (verificado):** Botão quadrado verde com engrenagem branca.
- **Uso no jogo:** Abrir configurações.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.settingsIcon

### `ui.settingIconPressed` — UI — SettingIconPressed

- **Arquivos:** `Png/Ui and PopUp/SettingIconPressed.png` · 128×122px
- **O que é (verificado):** Mesmo botão pressionado (engrenagem rosada/fundo escuro).
- **Uso no jogo:** Estado pressed das configurações.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.settingsIconPressed

### `ui.settingsPopUp` — UI — Settings PopUp

- **Arquivos:** `Png/Ui and PopUp/Settings PopUp.png` · 953×1286px
- **O que é (verificado):** Painel bege com cabeçalho marrom (corpo do popup de configurações).
- **Uso no jogo:** Corpo do popup de configurações.
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.settingsPopUp

### `ui.shopIcon` — UI — ShopIcon

- **Arquivos:** `Png/Ui and PopUp/ShopIcon.png` · 180×172px
- **O que é (verificado):** Lojinha com toldo listrado vermelho/branco sobre base laranja.
- **Uso no jogo:** Botão de loja premium (hoje: indisponível com motivo).
- **Fase:** 2 · **Status:** implementado · validado em preview
- **Chaves no código:** `src/assets/registry.ts` → ui.shopIcon

### `ui.volumeBarBg` — UI — VolumeBar_Bg

- **Arquivos:** `Png/Ui and PopUp/VolumeBar_Bg.png` · 778×214px
- **O que é (verificado):** Trilho arredondado vazado com barra laranja interna (slider).
- **Uso no jogo:** Slider de volume (quando houver áudio).
- **Fase:** 10 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.volumeBarBg

### `ui.volumeBarBtn` — UI — VolumeBar_Btn

- **Arquivos:** `Png/Ui and PopUp/VolumeBar_Btn.png` · 88×89px
- **O que é (verificado):** Knob creme arredondado com base avermelhada.
- **Uso no jogo:** Manopla do slider de volume.
- **Fase:** 10 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.volumeBarBtn

### `ui.volumeBarYellow` — UI — VolumeBar_Yellow

- **Arquivos:** `Png/Ui and PopUp/VolumeBar_Yellow.png` · 641×52px
- **O que é (verificado):** Filete amarelo (preenchimento de slider).
- **Uso no jogo:** Preenchimento do slider de volume.
- **Fase:** 10 · **Status:** reservado
- **Chaves no código:** `src/assets/registry.ts` → ui.volumeBarYellow

## Fontes

### `src.ai` — Fontes vetoriais (Ai)

- **Arquivos:** `Ai/Background.ai` … `Ai/Shop Screen.ai` (12 arquivos)
- **O que é (verificado):** Vetores Adobe Illustrator originais do kit (12 arquivos): Background, Cars, Cashier, Cashier Girl Parts, Chef Guy Parts, Floors, Floors Girl Parts, Lift, Lift Guy Parts, Open Area Map, PopUp and Ui, Shop Screen.
- **Uso no jogo:** Edição de arte fora do jogo; permite recortes futuros se necessário. Não entram no build.
- **Fase:** - · **Status:** nao-usado-runtime

### `src.eps` — Fontes vetoriais (Eps)

- **Arquivos:** `Eps/Background.eps` … `Eps/Shop Screen.eps` (12 arquivos)
- **O que é (verificado):** Vetores EPS equivalentes aos AI (12 arquivos), mesma classificação.
- **Uso no jogo:** Edição de arte fora do jogo; permite recortes futuros se necessário. Não entram no build.
- **Fase:** - · **Status:** nao-usado-runtime

### `src.spine.cars` — Rig Spine — Cars

- **Arquivos:** `Spine/Cars/Cars.spine` … `Spine/Cars/Images/TireFx.png` (9 arquivos)
- **O que é (verificado):** Projeto Spine 4.2 dos veículos + partes (corpos Car1–Car5, Shade, Tire, TireFx).
- **Uso no jogo:** Fonte de animação esquelética. NÃO usado em runtime (ADR-0002): as sequências PNG oficiais cobrem todas as animações necessárias sem adicionar runtime Spine.
- **Fase:** - · **Status:** nao-usado-runtime

### `src.spine.cashierGirl` — Rig Spine — Cashier Girl

- **Arquivos:** `Spine/Cashier Girl/CashierGirl.spine` … `Spine/Cashier Girl/Images/HandB.png` (6 arquivos)
- **O que é (verificado):** Projeto Spine da atendente + partes (corpo, máquina de caixa, pedido, cabelo, mão).
- **Uso no jogo:** Fonte de animação esquelética. NÃO usado em runtime (ADR-0002): as sequências PNG oficiais cobrem todas as animações necessárias sem adicionar runtime Spine.
- **Fase:** - · **Status:** nao-usado-runtime

### `src.spine.chef` — Rig Spine — Chef Guy

- **Arquivos:** `Spine/Chef Guy/ChefGuy.spine` … `Spine/Chef Guy/Images/SushiBox.png` (11 arquivos)
- **O que é (verificado):** Projeto Spine do chef + partes (corpos, roupas, mãos, cabeças, pernas, caixa de sushi).
- **Uso no jogo:** Fonte de animação esquelética. NÃO usado em runtime (ADR-0002): as sequências PNG oficiais cobrem todas as animações necessárias sem adicionar runtime Spine.
- **Fase:** - · **Status:** nao-usado-runtime

### `src.spine.floorGirl` — Rig Spine — Floor Girl

- **Arquivos:** `Spine/Floor Girl/Floor Girl.spine` … `Spine/Floor Girl/Images/Machine.png` (6 arquivos)
- **O que é (verificado):** Projeto Spine da funcionária de andar + partes (corpo, cabelo, mão, cabeça, máquina).
- **Uso no jogo:** Fonte de animação esquelética. NÃO usado em runtime (ADR-0002): as sequências PNG oficiais cobrem todas as animações necessárias sem adicionar runtime Spine.
- **Fase:** - · **Status:** nao-usado-runtime

### `src.spine.liftGuy` — Rig Spine — Lift Guy

- **Arquivos:** `Spine/Lift Guy/Images/Body.png` … `Spine/Lift Guy/Lift Guy.spine` (6 arquivos) · 36×46px
- **O que é (verificado):** Projeto Spine do operador de elevador + partes (corpo, mãos, cabeça, perna).
- **Uso no jogo:** Fonte de animação esquelética. NÃO usado em runtime (ADR-0002): as sequências PNG oficiais cobrem todas as animações necessárias sem adicionar runtime Spine.
- **Fase:** - · **Status:** nao-usado-runtime

### `src.atlas.cars` — Atlas TexturePacker — Cars

- **Arquivos:** `Json Atlas/Cars/Cars.atlas` … `Json Atlas/Cars/Cars.png` (3 arquivos)
- **O que é (verificado):** Atlas TexturePacker (Cars.png 1024×256 + .json/.atlas) com corpos/peças dos veículos para o Spine.
- **Uso no jogo:** Acompanha os rigs Spine; sem uso em runtime (ADR-0002).
- **Fase:** - · **Status:** nao-usado-runtime

### `src.atlas.cashierGirl` — Atlas TexturePacker — Cashier Girl

- **Arquivos:** `Json Atlas/Cashier Girl/ChashierGirl.atlas` … `Json Atlas/Cashier Girl/ChashierGirl.png` (3 arquivos)
- **O que é (verificado):** Atlas das partes da atendente (256×64) para o Spine.
- **Uso no jogo:** Acompanha os rigs Spine; sem uso em runtime (ADR-0002).
- **Fase:** - · **Status:** nao-usado-runtime

### `src.atlas.chef` — Atlas TexturePacker — Chef Guy

- **Arquivos:** `Json Atlas/Chef Guy/ChefGuy.atlas` … `Json Atlas/Chef Guy/ChefGuy.png` (3 arquivos)
- **O que é (verificado):** Atlas das partes do chef (256×64) para o Spine.
- **Uso no jogo:** Acompanha os rigs Spine; sem uso em runtime (ADR-0002).
- **Fase:** - · **Status:** nao-usado-runtime

### `src.atlas.floorGirl` — Atlas TexturePacker — Floor Girl

- **Arquivos:** `Json Atlas/Floor Girl/FloorGirl.atlas` … `Json Atlas/Floor Girl/FloorGirl.png` (3 arquivos)
- **O que é (verificado):** Atlas das partes da funcionária de andar (128×64) para o Spine.
- **Uso no jogo:** Acompanha os rigs Spine; sem uso em runtime (ADR-0002).
- **Fase:** - · **Status:** nao-usado-runtime

### `src.atlas.liftGuy` — Atlas TexturePacker — Lift Guy

- **Arquivos:** `Json Atlas/Lift Guy/Lift Guy.atlas` … `Json Atlas/Lift Guy/Lift Guy.png` (3 arquivos)
- **O que é (verificado):** Atlas das partes do operador de elevador (128×64) para o Spine.
- **Uso no jogo:** Acompanha os rigs Spine; sem uso em runtime (ADR-0002).
- **Fase:** - · **Status:** nao-usado-runtime

## Metadados

### `meta.license` — Licença do kit

- **Arquivos:** `license.txt`
- **O que é (verificado):** Arquivo de texto apontando para https://craftpix.net/file-licenses/.
- **Uso no jogo:** Obrigação de licença; referenciado em docs/assets/ASSET_LICENSES.md e nos créditos do jogo.
- **Fase:** - · **Status:** metadado

### `meta.fonts` — Fontes sugeridas pelo kit

- **Arquivos:** `FontLink.txt`
- **O que é (verificado):** Links Google Fonts: Bebas Neue, Passion One, Lilita One.
- **Uso no jogo:** O jogo usa Lilita One (OFL) via CSS, conforme sugestão do kit.
- **Fase:** 1 · **Status:** metadado · validado em preview

### `meta.sourceUrl` — Atalho para a página do kit

- **Arquivos:** `Free Assets Craftpix!.url`
- **O que é (verificado):** Atalho de internet Windows para https://craftpix.net/freebies/.
- **Uso no jogo:** Proveniência do pacote; preservado por auditoria.
- **Fase:** - · **Status:** metadado

### `meta.dsstore` — Ruído de sistema operacional (.DS_Store)

- **Arquivos:** `Png/.DS_Store` … `Png/Chef Guy/.DS_Store` (8 arquivos)
- **O que é (verificado):** Arquivos ocultos de metadata do macOS, sem conteúdo visual.
- **Uso no jogo:** Nenhum. Mantidos para não tocar nos originais; ignorados pelo pipeline de build.
- **Fase:** - · **Status:** metadado
