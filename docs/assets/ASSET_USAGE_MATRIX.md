# ASSET_USAGE_MATRIX

_Gerado a partir de `ASSET_MANIFEST.json` em 2026-10-12T12:35:42.680Z.
Destino concreto de cada entrada da auditoria; detalhe completo no manifesto.

| Entrada | Categoria | Destino no jogo | Fase | Status | Validado |
|---|---|---|---|---|---|
| `tower.floor.locked` | Torre | Slot do próximo andar na torre | 2 | implementado | ✅ |
| `tower.floor.lv1` | Torre | Arte do andar de índice i quando seu nível lógico é 1 (mapeamento 1:1 nível→arte) | 2 | implementado | ✅ |
| `tower.floor.lv2` | Torre | Arte do andar de índice i quando seu nível lógico é 2 (mapeamento 1:1 nível→arte) | 2 | implementado | ✅ |
| `tower.floor.lv3` | Torre | Arte do andar de índice i quando seu nível lógico é 3 (mapeamento 1:1 nível→arte) | 2 | implementado | ✅ |
| `tower.floor.lv4` | Torre | Arte do andar de índice i quando seu nível lógico é 4 (mapeamento 1:1 nível→arte) | 2 | implementado | ✅ |
| `tower.floor.lv5` | Torre | Arte do andar de índice i quando seu nível lógico é 5 (mapeamento 1:1 nível→arte) | 2 | implementado | ✅ |
| `tower.floor.lv6` | Torre | Arte do andar de índice i quando seu nível lógico é 6 (mapeamento 1:1 nível→arte) | 2 | implementado | ✅ |
| `tower.floor.lv7` | Torre | Arte do andar de índice i quando seu nível lógico é 7 (mapeamento 1:1 nível→arte) | 2 | implementado | ✅ |
| `tower.floor.lv8` | Torre | Arte do andar de índice i quando seu nível lógico é 8 (mapeamento 1:1 nível→arte) | 2 | implementado | ✅ |
| `tower.floor.lv9` | Torre | Arte do andar de índice i quando seu nível lógico é 9 (mapeamento 1:1 nível→arte) | 2 | implementado | ✅ |
| `tower.floor.lv10` | Torre | Arte do andar de índice i quando seu nível lógico é 10 (mapeamento 1:1 nível→arte) | 2 | implementado | ✅ |
| `tower.cashier.lv1` | Torre | Arte do térreo (storefront) quando cashierLevel = 1 | 2 | implementado | ✅ |
| `tower.cashier.lv2` | Torre | Arte do térreo (storefront) quando cashierLevel = 2 | 2 | implementado | ✅ |
| `tower.cashier.lv3` | Torre | Arte do térreo (storefront) quando cashierLevel = 3 | 2 | implementado | ✅ |
| `tower.cashier.lv4` | Torre | Arte do térreo (storefront) quando cashierLevel = 4 | 2 | implementado | ✅ |
| `tower.cashier.lv5` | Torre | Arte do térreo (storefront) quando cashierLevel = 5 | 2 | implementado | ✅ |
| `tower.cashier.lv6` | Torre | Arte do térreo (storefront) quando cashierLevel = 6 | 2 | implementado | ✅ |
| `scene.background` | Cenário | Fonte única do cenário: no boot é derivado em memória em `bg | 1 | implementado | ✅ |
| `scene.clouds` | Cenário | Instâncias em parallax no céu da cena da torre | 1 | implementado | ✅ |
| `cast.cashierGirl` | Elenco | Funcionária visual do térreo, posicionada na janela do caixa | 1 | implementado | ✅ |
| `cast.chef.cooking` | Elenco | Estado "cozinhando" do chef no ciclo de vida da cozinha | 1 | implementado | ✅ |
| `cast.chef.walk` | Elenco | Deslocamento do chef entre estação e balcão | 1 | implementado | ✅ |
| `cast.chef.walkFullOrder` | Elenco | Momento de entrega do pedido no ciclo da cozinha | 1 | implementado | ✅ |
| `cast.floorGirl` | Elenco | Funcionária visual dos andares superiores | 1 | implementado | ✅ |
| `cast.liftGuy` | Elenco | Operador visual dentro do shaft de elevador embutido nos floors | 1 | implementado | ✅ |
| `vehicle.car1.idle` | Veículos | Veículo estacionado/aguardando pedido na rua (sistema de entregas, Fase 3) | 3 | implementado | — |
| `vehicle.car2.idle` | Veículos | Veículo estacionado/aguardando pedido na rua (sistema de entregas, Fase 3) | 3 | implementado | — |
| `vehicle.car3.idle` | Veículos | Variante visual adicional de entrega, vinculada a cidades futuras (Fase 6) | 6 | reservado | — |
| `vehicle.car4.idle` | Veículos | Variante visual adicional de entrega, vinculada a cidades futuras (Fase 6) | 6 | reservado | — |
| `vehicle.car5.idle` | Veículos | Variante visual adicional de entrega, vinculada a cidades futuras (Fase 6) | 6 | reservado | — |
| `vehicle.car1.move` | Veículos | Entrada/saída de veículos na rua para entregas concluídas (Fase 3) | 3 | implementado | — |
| `vehicle.car2.move` | Veículos | Entrada/saída de veículos na rua para entregas concluídas (Fase 3) | 3 | implementado | — |
| `vehicle.car3.move` | Veículos | Variante visual de entrega para cidades futuras (Fase 6) | 6 | reservado | — |
| `vehicle.car4.move` | Veículos | Variante visual de entrega para cidades futuras (Fase 6) | 6 | reservado | — |
| `vehicle.car5.move` | Veículos | Variante visual de entrega para cidades futuras (Fase 6) | 6 | reservado | — |
| `map.area` | Mapa | Tela de seleção/expansão de cidades (Fase 6) | 6 | reservado | — |
| `map.building.available` | Mapa | Marcador de cidade desbloqueável no mapa | 6 | reservado | — |
| `map.building.locked` | Mapa | Marcador de cidade ainda bloqueada | 6 | reservado | — |
| `map.lock` | Mapa | Ícone de bloqueio sobre marcadores e requisitos | 6 | reservado | — |
| `map.namePlate` | Mapa | Placa com o nome da cidade no mapa | 6 | reservado | — |
| `map.clouds` | Mapa | Decoração/parallax da tela de cidades | 6 | reservado | — |
| `shop.background` | Loja | Fundo da loja premium (Fase 9) | 9 | reservado | — |
| `shop.header` | Loja | Cabeçalho da tela de loja | 9 | reservado | — |
| `shop.divider` | Loja | Divisor de seções da loja | 9 | reservado | — |
| `shop.scroll` | Loja | Trilho de rolagem ou seletor de abas da loja | 9 | reservado | — |
| `shop.panelGreen` | Loja | Painel de listas/seções da loja | 9 | reservado | — |
| `shop.panelOrange` | Loja | Painel de destaque ou CTA da loja | 9 | reservado | — |
| `shop.iap.piggy` | Loja | Ícone de produto na loja premium; só aparece com pagamentos reais configurados (Fase 9) | 9 | reservado | — |
| `shop.iap.chest` | Loja | Ícone de produto na loja premium; só aparece com pagamentos reais configurados (Fase 9) | 9 | reservado | — |
| `shop.iap.cart` | Loja | Ícone de produto na loja premium; só aparece com pagamentos reais configurados (Fase 9) | 9 | reservado | — |
| `shop.iap.redGem` | Loja | Ícone de produto na loja premium; só aparece com pagamentos reais configurados (Fase 9) | 9 | reservado | — |
| `shop.iap.gemPile` | Loja | Ícone de produto na loja premium; só aparece com pagamentos reais configurados (Fase 9) | 9 | reservado | — |
| `shop.iap.basket` | Loja | Ícone de produto na loja premium; só aparece com pagamentos reais configurados (Fase 9) | 9 | reservado | — |
| `ui.adsIcon` | UI | Ícone de "assistir anúncio" em ofertas recompensadas | 7 | reservado | — |
| `ui.areaBox` | UI | Painel de área/hub na tela de cidades | 6 | reservado | — |
| `ui.arrowUpgrade` | UI | Indicador de "melhorar" em botões/linhas de upgrade | 2 | implementado | ✅ |
| `ui.boostIcon` | UI | Ícone do botão de boost ×2 | 2 | implementado | ✅ |
| `ui.btnUp` | UI | Ícone de prancheta usado como identidade do botão EQUIPE (HUD) | 3 | implementado | ✅ |
| `ui.btnUpPressed` | UI | Estado pressed do btnUp | 3 | implementado | ✅ |
| `ui.btnBlue` | UI | Botão secundário/informativo em popups | 4 | reservado | — |
| `ui.btnBlueOff` | UI | Estado desativado de compras no painel (motivo exibido junto) | 2 | implementado | ✅ |
| `ui.btnBoost` | UI | Botão de boost recompensado | 2 | implementado | ✅ |
| `ui.btnBoostPressed` | UI | Estado pressed do boost | 2 | implementado | ✅ |
| `ui.btnBoostDisabled` | UI | Estado indisponível do boost (sem provedor de anúncios) | 7 | reservado | — |
| `ui.btnClose` | UI | Fechar popups/painéis | 2 | implementado | ✅ |
| `ui.btnGreen` | UI | Ação principal (comprar / abrir melhorias) | 2 | implementado | ✅ |
| `ui.btnGreenPressed` | UI | Estado pressed da ação principal | 2 | implementado | ✅ |
| `ui.btnHelp` | UI | Ajuda/explicações de sistemas | 10 | reservado | — |
| `ui.btnMusic` | UI | Toggle de música (quando houver recurso de áudio) | 10 | reservado | — |
| `ui.btnMusicOff` | UI | Estado off do toggle de música | 10 | reservado | — |
| `ui.btnOrange` | UI | Ação secundária em popups | 4 | reservado | — |
| `ui.btnOrangePressed` | UI | Estado pressed do botão laranja | 4 | reservado | — |
| `ui.btnOrangeSmall` | UI | Toggles das configurações (usado hoje) | 2 | implementado | ✅ |
| `ui.btnOrangeSmallOff` | UI | Estado off de toggles | 2 | implementado | ✅ |
| `ui.btnSound` | UI | Toggle de efeitos sonoros (quando houver áudio) | 10 | reservado | — |
| `ui.btnSoundOff` | UI | Estado off do som | 10 | reservado | — |
| `ui.btnVibra` | UI | Toggle de vibração (relevante só no app Android) | 11 | reservado | — |
| `ui.btnVibraOff` | UI | Estado off da vibração | 11 | reservado | — |
| `ui.coinIcon` | UI | Ícone de dinheiro na HUD | 2 | implementado | ✅ |
| `ui.contentBox` | UI | Fundo das linhas do painel de melhorias | 2 | implementado | ✅ |
| `ui.rewardGlow` | UI | Arte de recompensa do popup de ganhos offline (Fase 4); missões/eventos reutilizarão | 4 | implementado | ✅ |
| `ui.gemsIcon` | UI | Ícone da pílula de Pontos de Sucesso na HUD superior (referência Screenshot_7) | 5 | implementado | ✅ |
| `ui.gemsPlus` | UI | Botão "comprar mais gemas" ao lado do saldo premium | 9 | reservado | — |
| `ui.hubAreaBar` | UI | Badge de distrito na HUD superior (referência Screenshot_7); o mapa da Fase 6 reutiliza a mesma arte | 5 | implementado | ✅ |
| `ui.hudCoinBar` | UI | Barra de dinheiro no topo da HUD | 2 | implementado | ✅ |
| `ui.manyUpgradeBox` | UI | Seletor de compra múltipla (x1/x10/max) no painel | 3 | reservado | — |
| `ui.manyUpgradeBoxGreen` | UI | Badge de upgrade por andar na borda direita da torre (referência Screenshot_7), com ui | 5 | implementado | ✅ |
| `ui.mapIcon` | UI | Botão de mapa de cidades (hoje: indisponível com motivo) | 2 | implementado | ✅ |
| `ui.popUpBox` | UI | Corpo do painel de melhorias e de popups futuros | 2 | implementado | ✅ |
| `ui.requirementBox` | UI | Linhas de requisito em popups de desbloqueio/cidade | 6 | reservado | — |
| `ui.settingIcon` | UI | Abrir configurações | 2 | implementado | ✅ |
| `ui.settingIconPressed` | UI | Estado pressed das configurações | 2 | implementado | ✅ |
| `ui.settingsPopUp` | UI | Corpo do popup de configurações | 2 | implementado | ✅ |
| `ui.shopIcon` | UI | Botão de loja premium (hoje: indisponível com motivo) | 2 | implementado | ✅ |
| `ui.volumeBarBg` | UI | Slider de volume (quando houver áudio) | 10 | reservado | — |
| `ui.volumeBarBtn` | UI | Manopla do slider de volume | 10 | reservado | — |
| `ui.volumeBarYellow` | UI | Preenchimento do slider de volume | 10 | reservado | — |
| `src.ai` | Fontes | Edição de arte fora do jogo; permite recortes futuros se necessário | - | nao-usado-runtime | — |
| `src.eps` | Fontes | Edição de arte fora do jogo; permite recortes futuros se necessário | - | nao-usado-runtime | — |
| `src.spine.cars` | Fontes | Fonte de animação esquelética | - | nao-usado-runtime | — |
| `src.spine.cashierGirl` | Fontes | Fonte de animação esquelética | - | nao-usado-runtime | — |
| `src.spine.chef` | Fontes | Fonte de animação esquelética | - | nao-usado-runtime | — |
| `src.spine.floorGirl` | Fontes | Fonte de animação esquelética | - | nao-usado-runtime | — |
| `src.spine.liftGuy` | Fontes | Fonte de animação esquelética | - | nao-usado-runtime | — |
| `src.atlas.cars` | Fontes | Acompanha os rigs Spine; sem uso em runtime (ADR-0002) | - | nao-usado-runtime | — |
| `src.atlas.cashierGirl` | Fontes | Acompanha os rigs Spine; sem uso em runtime (ADR-0002) | - | nao-usado-runtime | — |
| `src.atlas.chef` | Fontes | Acompanha os rigs Spine; sem uso em runtime (ADR-0002) | - | nao-usado-runtime | — |
| `src.atlas.floorGirl` | Fontes | Acompanha os rigs Spine; sem uso em runtime (ADR-0002) | - | nao-usado-runtime | — |
| `src.atlas.liftGuy` | Fontes | Acompanha os rigs Spine; sem uso em runtime (ADR-0002) | - | nao-usado-runtime | — |
| `meta.license` | Metadados | Obrigação de licença; referenciado em docs/assets/ASSET_LICENSES | - | metadado | — |
| `meta.fonts` | Metadados | O jogo usa Lilita One (OFL) via CSS, conforme sugestão do kit | 1 | metadado | ✅ |
| `meta.sourceUrl` | Metadados | Proveniência do pacote; preservado por auditoria | - | metadado | — |
| `meta.dsstore` | Metadados | Nenhum | - | metadado | — |
