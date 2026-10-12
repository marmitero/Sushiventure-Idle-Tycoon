# Referência visual oficial — Screenshot_7.png

> Fonte: commit `58597f9` ("referencia visual") do diretor, arquivo
> `Screenshot_7.png` na raiz. É o mock oficial do kit CraftPix ("Sushi Tower
> Drive Thru") rodando em moldura de celular retrato. Este documento mappa cada
> elemento da referência para o asset/decisão correspondente no nosso build e
> registra os deltas conhecidos. A HUD é responsabilidade nossa (o diretor
> confirmou): compostas só com peças do kit quando existem.

## Leitura da referência (moldura do celular, retrato)

| # | Elemento na referência | Asset/decisão no nosso build | Estado |
|---|---|---|---|
| 1 | Céu azul com nuvens + skyline de prédios + calçada/rua/setas de pista + sebe verde | `Backgrounds.png` (1904×3118) fatiado em `bg.sky`/`bg.street` no BootScene + `Clouds.png` em parallax | ✅ implementado |
| 2 | Badge verde escuro com mapa no topo e pino ("CENTER PARK") | `ui.hubAreaBar` + texto do distrito real (`core/config/areas.ts`, `START_AREA`); pt-BR: "CENTRO" | ✅ implementado (nome vem de config, não de lugar fictício) |
| 3 | Pílula verde com gema ("546") | `ui.btnGreen` (pílula) + `ui.gemsIcon` + valor real de `prestigePoints` | ✅ implementado |
| 4 | Pílula âmbar com moeda ("2190 K") | `ui.hudCoinBar` + `ui.coinIcon` + `formatMoney(money)` | ✅ implementado |
| 5 | Engrenagem no canto superior direito | `ui.settingIcon` / `ui.settingIconPressed` | ✅ implementado |
| 6 | Torre de andares com interiores e telhados | `Floor_Lv0..10` empilhados por `floorVisualLevel(level)` | ✅ implementado |
| 7 | Placa de madeira com "FLOOR N" em cada andar | Tábua **vazia** já baked na arte de cada andar; desenhamos `ANDAR N` (pt-BR) sobre ela (`TOWER.plateX/plateDy`) | ✅ implementado |
| 8 | Shaft escuro de elevador à esquerda | Baked na coluna esquerda de cada `Floor_Lv*.png` | ✅ implementado |
| 9 | Cabine dourada do elevador com o operador dentro | **Delta:** a cabine só existe em vetor (`Sprites/Eps/Lift.eps`); sem ghostscript/Inkscape no sandbox para rasterizar. Runtime usa o lift guy animado percorrendo o shaft (mesma leitura de elevador). Vetor fica registrado para rasterizar em ferramenta de design futura | ⚠️ delta documentado |
| 10 | Quadrado verde com seta amarela na borda direita de cada andar | `ui.manyUpgradeBoxGreen` + `ui.arrowUpgrade`; toque abre o painel focado no andar (`TOWER.badgeX/badgeDy`) | ✅ implementado |
| 11 | Topo: casulo escuro + botão verde de preço ("4600 000") | `tower.floor.locked` (Floor_Lv0, faixa "ADD NEW FLOOR" baked) + `ui.btnGreen` + `ui.coinIcon` + `formatMoney(floorUnlockCost)` sobre a faixa cinza (`TOWER.nextSlotDy`); toque abre painel de desbloqueio | ✅ implementado |
| 12 | Loja/caixa no térreo com logo "SUSHI TOWER" | `CashierL1..L6` por `cashierLevel` (logo baked) | ✅ implementado |
| 13 | Carros na rua | `Cars/Car1..5` Idle/Move; variantes 1-2 no runtime, 3-5 reservadas (Fase 6) | ✅ implementado (tráfego derivado de `vehicleIntervalSec`) |
| 14 | Semáforo à esquerda e placa "DRIVE THRU" à direita da rua | **Delta:** não existem como PNG no kit (só no mock/vetor do promo). Não inventamos arte genérica (§constituição): rua permanece com o kit puro | ⚠️ delta documentado |
| 15 | Fileira de 5 carros estacionados em frente à loja | **Delta intencional:** no promo é vitrine das 5 variantes; no jogo, carros são tráfego vivo (feedback de entregas), não decoração parada | ⚠️ decisão documentada |
| 16 | Barra inferior escura com BOOST à esquerda e CITY MAP / SHOP à direita | Faixa escura (chrome de HUD) + `ui.btnBoost`+`ui.boostIcon`+rótulo, `ui.mapIcon`/`ui.shopIcon` rotulados MAPA/LOJA com cadeado oficial + motivo quando indisponíveis | ✅ implementado |
| 17 | (ausente na referência) botão de equipe | Necessidade nossa (contratação): `EQUIPE` centrado na barra inferior, mesmo lenguaje visual (btnGreen) | ✅ adição justificada |
| 18 | Textos em inglês baked na arte ("ADD NEW FLOOR", "CLOSED", logo) | Mantidos (originais intocáveis); wording pt-BR vive em painéis/toasts/rótulos nossos | ✅ decisão documentada |

## Regras que este alinhamento respeita

1. Nenhum elemento de HUD usa arte inventada/genérica: só peças do kit ou
   chrome plano (faixa escura), nunca "placeholder com cara de IA".
2. Todo número exibido vem de estado real (`money`, `prestigePoints`,
   `floorUnlockCost`); o badge de área vem de config de mundo que o mapa da
   Fase 6 reutilizará — nada de lugar fictício.
3. Serviços inexistentes (mapa, loja) permanecem honestamente bloqueados com
   cadeado oficial + motivo ao toque, mesmo ocupando o slot visual da
   referência.
4. Deltas (cabine vetorial, semáforo/placa drive-thru) ficam documentados aqui
   e no CHANGELOG em vez de serem simulados com arte falsa.

## Reprodução/verificação

- `tests/visual-reference.test.ts`: amarra (a) config de áreas real, (b) status
  `implementado` no manifesto para cada peça da composição, (c) âncoras de
  placa/badge/preço dentro da textura 1056×340 do andar.
- Preview ao vivo (retrato mobile, prioridade do produto): torre + HUD devem bater com a tabela
  acima, item a item.
