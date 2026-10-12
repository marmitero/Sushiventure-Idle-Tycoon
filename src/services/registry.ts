import type {
  AnalyticsProvider,
  AuthProvider,
  PaymentProvider,
  PurchaseVerifier,
  RemoteConfigProvider,
  RewardedAdProvider,
} from './contracts';
import {
  GuestOnlyAuthProvider,
  DevSimulatedRewardedAdProvider,
  NoopAnalyticsProvider,
  NotConfiguredPaymentProvider,
  NotConfiguredPurchaseVerifier,
  NotConfiguredRewardedAdProvider,
  StaticRemoteConfigProvider,
} from './devAdapters';

export interface ServiceBundle {
  auth: AuthProvider;
  ads: RewardedAdProvider;
  payments: PaymentProvider;
  verifier: PurchaseVerifier;
  analytics: AnalyticsProvider;
  remoteConfig: RemoteConfigProvider;
  /** Human-readable explanation of what is simulated vs real (shown in credits). */
  disclosure: string[];
}

/**
 * Resolves concrete adapters for the current environment.
 *
 * DEV  : rewarded ads use the clearly-labelled simulator (confirm dialog).
 * PROD : every monetization adapter reports "not configured" until the
 *        director supplies real credentials (docs/monetization/MONETIZATION.md).
 *        Nothing is ever faked in production.
 */
export function buildServices(isDev: boolean): ServiceBundle {
  const ads: RewardedAdProvider = isDev
    ? new DevSimulatedRewardedAdProvider()
    : new NotConfiguredRewardedAdProvider();
  return {
    auth: new GuestOnlyAuthProvider(),
    ads,
    payments: new NotConfiguredPaymentProvider(),
    verifier: new NotConfiguredPurchaseVerifier(),
    analytics: new NoopAnalyticsProvider(),
    remoteConfig: new StaticRemoteConfigProvider(),
    disclosure: [
      'Salvamento: local (navegador). Nuvem pendente de provedor (Fase 8).',
      isDev
        ? 'Anúncios: SIMULADOR DE DESENVOLVIMENTO (nenhuma rede real).'
        : 'Anúncios: não configurados neste ambiente.',
      'Pagamentos: não configurados neste ambiente.',
    ],
  };
}
