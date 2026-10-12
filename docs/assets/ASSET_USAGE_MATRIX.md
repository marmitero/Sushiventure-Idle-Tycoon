# ASSET_USAGE_MATRIX

Associa cada conjunto de assets a um destino concreto. "Implementado" = código
carrega/usando hoje; "Validado" = verificado em preview/testes.
Caminhos relativos a `public/assets/` (chaves lógicas em `src/assets/registry.ts`).

| Asset | Categoria | Destino no jogo | Implementado | Validado |
|---|---|---|---|---|
| `png/Backgrounds/Backgrounds.png` | Cenário | Derivado em `bg.sky` (parallax) + `bg.street` (rua/solo) na `BootScene` | ✅ | ✅ preview |
| `png/Backgrounds/Clouds.png` | Cenário | Nuvens em parallax (4 instâncias) | ✅ | ✅ preview |
| `png/Floors/Floor_Lv0.png` | Torre | Slot bloqueado tocável (abre painel de desbloqueio) | ✅ | ✅ preview |
| `png/Floors/Floor_Lv1..Lv10.png` | Torre | Arte por nível de cada andar da torre | ✅ | ✅ preview |
| `png/Cashiers/CashierL1..L6.png` | Torre/térreo | Fachada do caixa por nível de upgrade | ✅ | ✅ preview |
| `png/Cashier Girl/ChashierGirl-animation_*` (40f) | Elenco | Atendente animada no balcão do térreo | ✅ | ✅ preview |
| `png/Chef Guy/Cooking/*`, `Walk/*`, `Walk Full Order/*` (60f) | Elenco | Chef com ciclo andar→cozinhar→entregar | ✅ | ✅ preview |
| `png/Floor Girl/FloorGirl-animation_*` (20f) | Elenco | Funcionária de andar | ✅ | ✅ preview |
| `png/Lift Guy/Lift Guy-animation_*` (20f) | Elenco | Operador do elevador no shaft | ✅ | ✅ preview |
| `png/Ui and PopUp/HudCoinBar.png`, `CoinIcon.png` | HUD | Barra de dinheiro no topo | ✅ | ✅ preview |
| `png/Ui and PopUp/Btn_Green(.Pressed).png` | UI | Botão MELHORIAS + compras do painel | ✅ | ✅ preview |
| `png/Ui and PopUp/Btn_Blue_Off.png` | UI | Estado "sem dinheiro" das compras | ✅ | ✅ preview |
| `png/Ui and PopUp/Btn_Boost(.Pressed).png`, `Boost_Icon.png` | UI | Botão de boost ×2 por anúncio | ✅ | ✅ preview |
| `png/Ui and PopUp/MapIcon.png`, `ShopIcon.png` | UI | Mapa/loja com estado "indisponível" explicado | ✅ | ✅ preview |
| `png/Ui and PopUp/SettingIcon(Pressed).png`, `Settings PopUp.png`, `Btn_Orange_Small(_Off).png`, `Btn_Close.png` | UI | Popup de configurações com toggles reais | ✅ | ✅ preview |
| `png/Ui and PopUp/PopUp_Box.png`, `ContentBox.png` | UI | Painel de melhorias e linhas | ✅ | ✅ preview |
| `png/Ui and PopUp/Gams Image.png` | UI | Brilho de recompensa (popup offline Fase 4 / feedback) | ⏳ Fase 4 | — |
| `png/Ui and PopUp/VolumeBar_*.png`, `Btn_Sound(_Off)`, `Btn_Music(_Off)`, `Btn_Vibra(_Off)` | UI | Controles de áudio/vibração quando houver recurso real | ⏳ Fase 10 | — |
| `png/Ui and PopUp/Ads_Icon.png`, `ArrowUpgrade.png`, `ManyUpgradeBox*.png`, `RequermentBox.png`, `Area Box.png`, `HubAreaBar.png`, `GemsIcon.png`, `GemsPlusBar.png`, `BtnUp(Pressed).png`, `Btn_Blue.png`, `Btn_Orange(_Pressed).png`, `Btn_Help.png` | UI | Reserva mapeada para painéis das Fases 4–9 | ⏳ | — |
| `png/Cars/Car1..Car5/{Idle,Move}/*` (300f) | Entregas | Veículos na rua com carga sob demanda | ⏳ Fase 3 | — |
| `png/Open Area Map/*` (6) | Navegação | Mapa de cidades, marcadores, cadeado, placa | ⏳ Fase 6 | — |
| `png/Shop Screen/Artboard 1..6` | Loja | Fundo/painéis da loja premium | ⏳ Fase 9 | — |
| `png/Shop Screen/Artboard 7..12` | Loja/IAP | Ícones de pacotes (somente com pagamentos reais) | ⏳ Fase 9 | — |
| `Sprites/Spine/**`, `Sprites/Json Atlas/**` | Fonte | Não usados em runtime (ADR-0002); sequências PNG cobrem as animações | — | — |
| `Sprites/Ai/**`, `Sprites/Eps/**` | Fonte | Edição de arte fora do jogo | — | — |

Folhas de contato para inspeção humana: [`previews/`](previews/).
