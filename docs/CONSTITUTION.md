# CONSTITUIÇÃO DO PROJETO

Fonte canônica: [`docs/master-prompt.md`](master-prompt.md) (versão 1.0).
Este documento resume e indexa as decisões constitucionais; em caso de
divergência, o master-prompt prevalece até que um ADR registre a mudança.

## Visão

Construir um império de restaurantes de sushi em um jogo idle/tycoon cuja
representação central é uma **torre vertical viva**, com equipe animada,
receita automática, progressão por cidades e renascimento com bônus permanentes.

## Pilares

| Pilar | Obrigação |
|---|---|
| A Visual | Torre como cenário central com o asset kit oficial |
| B Progressão | Sempre existir um próximo objetivo compreensível |
| C Automação | Receita automática; sem clique repetitivo |
| D Decisões | Custos, benefícios e prioridades reais |
| E Continuidade | Progresso offline controlado + camadas de prestígio |
| F Integridade | Sem duplicação/perda em saves, compras, recompensas |
| G Expansão | Novos conteúdos por configuração, sem reescrever o core |

## Regras inegociáveis (resumo operacional)

1. Não construir "site com cards" no lugar do jogo.
2. Não substituir a torre por painel administrativo.
3. Não usar placeholder onde existe asset oficial.
4. Não inventar arte genérica no lugar do kit.
5. Não simular integração e declará-la funcionando.
6. Não espalhar valores econômicos: curvas centralizadas em `src/core/config/balance.ts`.
7. Toda compra desconta custo corretamente (ops atômicas).
8. Nenhuma recompensa duas vezes (receipts idempotentes).
9. Botão funcional = efeito real verificado, não resposta visual.
10. Não apagar assets/licenças/docs/histórico sem necessidade comprovada.
11. Nenhum segredo no frontend ou no Git.
12. Não desativar testes/TS/validações para passar build.
13. Documentação acompanha cada mudança.
14. Sistema só completa com regras, erros e persistência testados.
15. MVP é primeira etapa, não destino.
16. Não publicar etapa quebrada.
17. Nova dependência/serviço exige avaliação de necessidade, custo e alternativa.

## Hierarquia de decisão

1. Preservar trabalho e dados existentes.
2. Cumprir esta constituição.
3. Jogo jogável e visualmente coerente.
4. Integridade de economia/saves/transações.
5. Compatibilidade PC + mobile.
6. Extensibilidade (cidades, sistemas, Android).
7. Documentação/testes/rastreabilidade.
8. Desempenho e custo.
9. Melhorias adicionais dentro do escopo.

## Protocolo de reporte

Cada etapa termina com relatório de: etapa, implementações, assets integrados,
testes (comandos e contagens), build, GitHub (branch/commit/push), documentação
atualizada, pendências e próxima etapa. Sem expressões vagas.
