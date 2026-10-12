# MONETIZATION

## Princípio

Pontos de integração existem na arquitetura desde o início; serviços reais só
são ativados com configuração válida e teste. Nada é fingido em produção
(Parte 19.1). Estado atual: **nenhum serviço de monetização configurado**.

## Adaptadores e estado

| Contrato | Adaptador atual | Produz recompensa? |
|---|---|---|
| `RewardedAdProvider` | prod: `NotConfiguredRewardedAdProvider` · dev: `DevSimulatedRewardedAdProvider` (rotulado, com confirmação) | somente dev, sem valor real |
| `PaymentProvider` | `NotConfiguredPaymentProvider` | não |
| `PurchaseVerifier` | `NotConfiguredPurchaseVerifier` | não |
| `AnalyticsProvider` | `NoopAnalyticsProvider` | n/a |

## Anúncios recompensados

- Formato desejado: rewarded video com callback de conclusão confiável.
- Realidade de plataforma: SDKs Android (AdMob etc.) **não** valem para web
  pura; candidatos web serão avaliados com critérios: suporte a rewarded em
  browser, server-side verification (S2S), políticas de consentimento (LGPD/
  GDPR), custo e cobertura Brasil. Decisão pendente do diretor.
- Regras implementadas no core (independem do provedor): recompensa só após
  `completed` + receipt; idempotência por receipt; início/término persistentes;
  exibição do timer; indisponibilidade comunicada com clareza.

## Pagamentos

- Candidatos avaliados na Fase 9: Stripe e Mercado Pago (mercado BR), comparando
  disponibilidade web, taxas, requisitos KYC, regras de uso e verificação S2S.
- Fluxo obrigatório: checkout no provedor → confirmação confiável → validação
  no backend quando aplicável → concessão registrada com transactionId único →
  histórico auditável → reembolsos conforme o provedor.
- Nunca conceder produto com base em resposta do navegador.

## Loja e política comercial

- Itens previstos: pacotes de conveniência, cosméticos (se houver arte),
  apoio ao desenvolvimento. Progresso básico nunca atrás de pagamento.
- Sem falsas urgências, sem custos ocultos, sem compra acidental (confirmação),
  sem cobrar para corrigir falha de save, sem produtos que dependam de sistemas
  inexistentes, sem loot boxes (não implementar sem análise legal própria).

## Modo de desenvolvimento

- Simuladores identificados por nome (`ads-dev-simulator`) e impossibilitados
  de se registrar em build de produção sem mudança explícita de código.
- Produção: concessões fictícias desativadas, endpoints de teste bloqueados,
  configuração validada no boot, credenciais fora do repositório.

## O que o diretor precisa decidir/fornecer (nada foi solicitado ainda)

1. Provedor de anúncios compatível com web (ou adiar para o app Android).
2. Provedor de pagamento e conta comercial.
3. Backend de validação (Fase 8/9) — candidato: Supabase ou equivalente.
