# ADR-0001 — Arquitetura inicial: TypeScript + Phaser 3 + Vite, core puro separado

- **Estado:** Aceito (2026-10-12)
- **Contexto:** Repositório sem código prévio (apenas assets e a constituição).
  A constituição recomenda avaliar TS + Phaser 3 + Vite + IndexedDB + PWA,
  com React apenas se necessário, e Android futuro via empacotamento.
- **Decisão:**
  1. TypeScript estrito como linguagem única de aplicação.
  2. Phaser **3.90** (linha estável) para render/scene/câmera/animações.
     Phaser 4 (4.2 disponível no registry) foi avaliado e **adiado**: API ainda
     em consolidação e nenhum ganho necessário para o escopo; migração poderá
     ser revisitada na Fase 10 com custo medido.
  3. Vite 5 para dev/build; Vitest para testes do core em Node.
  4. **Sem React** nesta fase: menus/popups são cenas Phaser com sprites do kit
     (evita segunda árvore de UI e mantém identidade visual do jogo).
  5. Núcleo econômico em `src/core` **sem qualquer import de Phaser/DOM**,
    testado isoladamente; apresentação e persistência consomem o core.
  6. Persistência local via adaptador (`localStorage` hoje); contrato
    `SaveRepository` permite trocar por IndexedDB/nuvem sem tocar no core.
  7. Serviços externos somente via contratos (`services/contracts.ts`).
- **Consequências:** testes rápidos e determinísticos; UI limitada aos recursos
  do Phaser (aceitável); bundle único de ~1,5 MB (353 kB gzip) a otimizar na
  Fase 10; Capacitor continua viável por ser web pura.
- **Alternativas rejeitadas:** PixiJS+UI própria (mais trabalho de UI),
  Phaser 4 imediato (risco de API), React+DOM para HUD (quebra a identidade
  visual e duplica sistemas de layout).
