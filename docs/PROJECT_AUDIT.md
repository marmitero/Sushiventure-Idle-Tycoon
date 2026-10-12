# PROJECT_AUDIT — Auditoria inicial (Fase 0)

_Data: 2026-10-12 · Branch auditada: `arena/a8701903-sushiventure-idle-tycoon` (base `main` @ `11d1ebc`)_

## 1. Auditoria do GitHub

| Item | Resultado |
|---|---|
| Repositório | `marmitero/Sushiventure-Idle-Tycoon` |
| Branch padrão | `main` |
| Commit base | `11d1ebcb394a51662a1ad9788a8b6862a23ee94a` ("master prompt") |
| Histórico | 1 commit antes desta etapa |
| Conteúdo inicial | `Sprites/` (assets do kit) + `docs/master-prompt.md` |
| Código pré-existente | **Nenhum** (projeto greenfield além dos assets) |
| Dependências/config/build/testes/CI | Inexistentes antes desta etapa |
| Arquivos sensíveis | Nenhum encontrado (sem `.env`, chaves ou tokens) |
| Estado local×remoto | Limpo no início; branch de trabalho criada pela Arena |
| Licença do conteúdo | Kit CraftPix gratuito (ver `docs/assets/ASSET_LICENSES.md`) |
| Ruído versionado | `.DS_Store` dentro de `Sprites/` (inofensivo; não removido para preservar originais) |

## 2. Auditoria dos sprites (`Sprites/`)

- **609 arquivos** no total; **559 PNG** de runtime (~10,1 MB); 12 `.ai`, 12 `.eps`,
  5 `.spine` + imagens, 10 arquivos de atlas TexturePacker (`.json`/`.atlas` + PNGs),
  `license.txt`, `FontLink.txt`, atalho `.url`.
- Inventário completo e reproduzível: [`docs/assets/ASSET_INVENTORY.md`](assets/ASSET_INVENTORY.md)
  e `docs/assets/asset_inventory.csv` (gerados por `scripts/gen-asset-docs.mjs`).
- **Manifesto item a item (o que é cada recurso + uso no jogo):**
  [`docs/assets/ASSET_MANIFEST.md`](assets/ASSET_MANIFEST.md) /
  [`ASSET_MANIFEST.json`](assets/ASSET_MANIFEST.json), gerados por
  `npm run manifest` com validação de cobertura (609 arquivos classificados
  exatamente uma vez; o gerador falha se sobrar arquivo).
- Folhas de contato visuais: [`docs/assets/previews/`](assets/previews/) (8 imagens).
- **Duplicatas:** 49 grupos, todos dentro de `Png/Cars/*/Idle` — frames espelhados
  do loop de animação (01↔19, 02↔18 …). Esperado, não é defeito.
- **Ilegíveis/corrompidos:** nenhum (todos os PNGs passam no parser de header).

### Conteúdo confirmado visualmente

| Conjunto | Contagem | Observação |
|---|---|---|
| `Floors/Floor_Lv0..Lv10` | 11 | Lv0 = casulo bloqueado ("ADD NEW FLOOR" + lacre CLOSED); Lv1–Lv10 = andares mobiliados progressivamente; coluna escura do shaft de elevador embutida à esquerda |
| `Cashiers/CashierL1..L6` | 6 | Fachada térrea com logo "SUSHI TOWER", placa CASHIER, DRIVE THRU; níveis adicionam toldo, menu, semáforos laterais |
| `Backgrounds/Backgrounds.png` | 1 | 1904×3118: céu → skyline → calçada → rua → solo |
| `Backgrounds/Clouds.png` | 1 | Nuvem para parallax |
| Personagens | 4 | Cashier Girl (40f), Chef Guy (cooking 20f, walk 20f, walk-full-order 20f), Floor Girl (20f), Lift Guy (20f) |
| `Cars/Car1..Car5` | 300 | Idle 20f + Move 40f por variante |
| `Open Area Map/` | 6 | Mapa, prédio disponível, prédio bloqueado, cadeado, placa de nome, nuvens |
| `Shop Screen/` | 12 | Fundo/painéis da loja + 6 ícones de pacote IAP |
| `Ui and PopUp/` | 44 | Botões (normal/pressed/off), ícones, barras, popup genérico, popup de configurações, barra de HUD de moedas |

### Lacunas reais identificadas

1. **Elevador/shaft isolado em PNG não existe** — o kit anuncia "lift / elevator
   shaft", mas só há o shaft embutido nos `Floor_*.png` e o personagem Lift Guy.
   Decisão: usar o shaft embutido (ADR-0002); documentado, não é placeholder.
2. **Popup de ganhos offline dedicado não existe** como arquivo nomeado; o kit
   fornece `PopUp_Box.png` genérico + `Gams Image.png` (brilho de recompensa).
   Decisão: compor o popup offline com esses elementos (Fase 4).
3. **Logo "Sushi Tower"** existe apenas rasterizado dentro dos `CashierL*.png`
   (topo da fachada). Não há arquivo de logo isolado.
4. **Sem arquivos de áudio** no kit.
5. Spine 4.2 + atlases existem, mas o runtime Spine não foi adotado (ADR-0002):
   usamos as sequências PNG oficiais, que cobrem todas as animações necessárias.

## 3. Auditoria da CraftPix (página oficial)

Página consultada em 2026-10-12: https://craftpix.net/freebies/free-sushi-restaurant-game-asset-kit/

Anunciado × presente no repositório:

| Anunciado | Presente? |
|---|---|
| 11 floor levels (Lv0–Lv10) | ✅ |
| 6 cashier upgrade levels | ✅ |
| lift / elevator shaft | ⚠️ somente embutido nos floors (ver lacuna 1) |
| background with sky and clouds | ✅ |
| parallax city buildings | ✅ (dentro de `Backgrounds.png`) |
| cashier girl / chef guy / floor girl / lift guy | ✅ |
| 5 delivery car variants + idle + move | ✅ |
| city map screen + markers + locks + name plates | ✅ |
| shop screen UI + IAP package icons | ✅ |
| settings popup | ✅ |
| offline earnings popup | ⚠️ genérico (`PopUp_Box`) |
| floor upgrade popup / cashier upgrade popup | ⚠️ genéricos (`PopUp_Box`, `ContentBox`) |
| Sushi Tower logo | ⚠️ apenas dentro dos cashiers |
| Formatos PNG, AI, EPS | ✅ (+ Spine/atlases extras) |

Licença: "Free Download … royalty free usage in unlimited projects", detalhes em
https://craftpix.net/file-licenses/ — ver [`ASSET_LICENSES.md`](assets/ASSET_LICENSES.md).

## 4. Conclusões que dirigiram a arquitetura

- Não havia código: liberdade para aplicar a stack recomendada (Phaser 3 + TS + Vite).
- O kit sustenta integralmente torre, térreo, elenco, mapa, loja e UI → nenhum
  placeholder é necessário para o escopo das Fases 1–6.
- O peso dos carros (6,7 MB) exige carregamento sob demanda → pipeline com
  manifesto e cargas em estágios.
- Economia precisa de números grandes → camada Decimal própria e testada.
