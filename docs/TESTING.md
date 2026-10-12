# TESTING

## Estratégia

| Nível | Ferramenta | Cobre |
|---|---|---|
| Unitário | Vitest (Node) | Decimal, economia, ops, migrações, format |
| Integração | Vitest | SaveManager + repositórios (round-trip, backup, cota) |
| Registro de assets | Vitest | registry ↔ manifest (nenhum caminho inexistente) |
| Simulação | `npm run sim` | pacing de progressão e sanidade econômica |
| Build/type | `tsc --noEmit`, `vite build` | contrato de compilação estrito |
| Visual/manual | preview ao vivo | cenas, HUD, responsividade (checklist abaixo) |

## Comandos

```bash
npm test            # 39 testes (5 arquivos)
npm run typecheck
npm run build
npm run sim
npm run validate    # os três primeiros em sequência
```

## Cobertura atual por requisito da constituição (27.1)

- Cálculo de receita ✅ · custos ✅ · multiplicadores ✅ · formatação ✅
- Compra de upgrades ✅ · desbloqueio de andares ✅ · caixa ✅
- Bônus temporários (boost idempotente) ✅ · migração/sanitização de saves ✅
- Funcionários, receitas, reputação, missões, conquistas, eventos, offline,
  renascimento: ⏳ testes serão adicionados junto com cada sistema (Fases 3–7).

## Checklist manual de interface (executar no preview)

1. Abrir em portrait ~390×844 e em desktop: torre legível, HUD sem sobreposição.
2. Recarregar: dinheiro e andares preservados; sem double-grant de boost.
3. Comprar sem dinheiro: botão desabilitado com motivo; toast explica.
4. Arrastar a torre para baixo/até o topo; câmera volta a seguir após 4s.
5. Boost (dev): cancelar não concede; confirmar concede ×2 por 30min e o timer
   sobrevive a reload.
6. Corromper `localStorage.sushiventure.save.main` e recarregar: recupera do `.bak`.

## Política

- Nenhum teste é removido/ignorada para passar build (regra 12).
- Toda fase nova entra com testes do seu core antes do merge/push.
- Simulações acompanham mudanças de balanceamento (números em ECONOMY.md §6).
