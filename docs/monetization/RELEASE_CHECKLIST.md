# RELEASE_CHECKLIST

Marcar somente com evidência. Estado em 2026-10-12.

## Build e qualidade

- [x] Typecheck estrito passa
- [x] Testes passam (39/39)
- [x] Build de produção passa
- [x] Preview manual em portrait e desktop
- [ ] Lighthouse/perf medido e documentado (Fase 10)
- [ ] Atlas packing das sequências (Fase 10)

## Monetização

- [ ] Provedor de anúncios escolhido e contratado
- [ ] IDs de produção configurados via ambiente (nunca no código)
- [ ] S2S verification testada em ambiente de teste do provedor
- [ ] Fluxo de cancelamento/falha testado
- [ ] Limites de frequência e regras de consentimento implementados
- [ ] Provedor de pagamento configurado + produtos publicados
- [ ] Verificação de compra no backend + idempotência testada
- [ ] Reembolsos tratados conforme provedor
- [ ] Modo dev de pagamentos bloqueado em produção

## Contas e dados

- [ ] Provedor de auth/nuvem configurado (Fase 8)
- [ ] Política de privacidade publicada (tratamento de dados real)
- [ ] Termos de uso, quando aplicável
- [ ] Exclusão/exportação de dados, quando aplicável (LGPD)

## Publicação

- [ ] PWA manifest + ícones + offline shell
- [ ] Créditos e licenças visíveis no jogo (CraftPix, fontes, libs)
- [ ] Hospedagem definida com HTTPS e cache de assets
- [ ] Checklist de loja Android (quando Capacitor entrar)
- [ ] `AI_STATE.md` e CHANGELOG atualizados no momento da publicação

**Nenhuma publicação foi declarada até agora.** O preview atual é ambiente de
desenvolvimento, não publicação.
