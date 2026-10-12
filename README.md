# Sushiventure Idle Tycoon

Jogo idle/tycoon de restaurante de sushi com torre vertical, equipe animada,
receita automática, progressão por andares, cidades e renascimento.

- **Plataforma atual:** navegador (PC e mobile, portrait-first)
- **Plataforma futura:** Android via empacotamento (Capacitor), reaproveitando o core
- **Stack:** TypeScript + Phaser 3 + Vite · testes com Vitest
- **Constituição do projeto:** [`docs/master-prompt.md`](docs/master-prompt.md)
- **Estado operacional:** [`AI_STATE.md`](AI_STATE.md)

## Executar

```bash
npm install
npm run dev        # gera assets derivados e sobe o servidor em 0.0.0.0:5173
```

## Scripts

| Comando | Função |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (gera assets antes) |
| `npm run build` | Typecheck + build de produção em `dist/` |
| `npm run preview` | Serve o build de produção |
| `npm test` | Testes unitários/integração (Vitest) |
| `npm run typecheck` | Somente TypeScript estrito |
| `npm run sim` | Simulação headless de progressão (balanceamento) |
| `npm run assets` | Deriva `public/assets/` a partir de `Sprites/Png` |
| `npm run validate` | typecheck + testes + build |

## Documentação

| Documento | Conteúdo |
|---|---|
| [`AI_STATE.md`](AI_STATE.md) | Estado real do projeto, pendências e próximo passo |
| [`docs/CONSTITUTION.md`](docs/CONSTITUTION.md) | Visão, pilares e regras inegociáveis |
| [`docs/PROJECT_AUDIT.md`](docs/PROJECT_AUDIT.md) | Auditoria inicial (Git, assets, CraftPix) |
| [`docs/PROJECT_ROADMAP.md`](docs/PROJECT_ROADMAP.md) | Fases, critérios de aceitação e status |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Módulos, fluxos e contratos de serviço |
| [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) | Modelo de save e migrações |
| [`docs/GAME_DESIGN/`](docs/GAME_DESIGN/GAME_DESIGN_DOCUMENT.md) | Design de jogo, economia, prestígio, offline, missões |
| [`docs/assets/ASSET_INVENTORY.md`](docs/assets/ASSET_INVENTORY.md) | Inventário gerado dos recursos gráficos |
| [`docs/assets/ASSET_USAGE_MATRIX.md`](docs/assets/ASSET_USAGE_MATRIX.md) | Asset → destino → implementado/validado |
| [`docs/assets/ASSET_LICENSES.md`](docs/assets/ASSET_LICENSES.md) | Licença CraftPix e obrigações |
| [`docs/monetization/MONETIZATION.md`](docs/monetization/MONETIZATION.md) | Estratégia e integrações de monetização |
| [`docs/TESTING.md`](docs/TESTING.md) | Estratégia e procedimentos de teste |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Build, hospedagem e publicação |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Ameaças e controles |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Histórico de alterações |
| [`docs/decisions/`](docs/decisions/ADR-0001-initial-architecture.md) | Registros de decisão arquitetural |

## Assets

Os originais do kit oficial (CraftPix — Free Sushi Restaurant Game Asset Kit)
estão versionados em `Sprites/` e **nunca são modificados**. O build usa
derivados gerados em `public/assets/` (gitignored), com manifesto próprio.
Veja [`docs/assets/ASSET_LICENSES.md`](docs/assets/ASSET_LICENSES.md).

## Status rápido

Fases 0–2 concluídas e testadas (auditoria, fundação técnica e loop econômico
inicial). Detalhes e evidências em [`AI_STATE.md`](AI_STATE.md).
