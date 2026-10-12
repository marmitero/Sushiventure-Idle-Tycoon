import type {
  AnalyticsProvider,
  AuthProvider,
  AuthSession,
  PaymentProvider,
  PurchaseRequest,
  PurchaseResult,
  PurchaseVerifier,
  RemoteConfigProvider,
  RewardedAdProvider,
  RewardedAdResult,
} from './contracts';

/**
 * DEVELOPMENT / NOT-CONFIGURED adapters.
 *
 * Every adapter here is explicit about being simulated or unavailable.
 * A "not configured" adapter never grants rewards, never approves purchases
 * and never reports success (constitution Part 19.1 / rule 5).
 */

export class GuestOnlyAuthProvider implements AuthProvider {
  readonly id = 'guest-local';
  readonly configured = true; // guest mode is a real, supported mode (Part 18.1)
  private session: AuthSession | null = null;

  async signInGuest(): Promise<AuthSession> {
    this.session = {
      userId: `guest-${cryptoRandomId()}`,
      provider: this.id,
      guest: true,
    };
    return this.session;
  }

  async linkAccount(): Promise<AuthSession> {
    throw new Error('Account linking requires a configured cloud provider (Phase 8).');
  }

  async signOut(): Promise<void> {
    this.session = null;
  }
}

export class NotConfiguredRewardedAdProvider implements RewardedAdProvider {
  readonly id = 'ads-not-configured';
  readonly configured = false;

  async showRewarded(): Promise<RewardedAdResult> {
    return {
      status: 'unavailable',
      reason: 'Nenhum provedor de anúncios configurado neste ambiente.',
    };
  }
}

/**
 * DEV-ONLY simulator. Clearly labelled; must never be registered in production
 * builds (see src/services/registry.ts and docs/monetization/RELEASE_CHECKLIST.md).
 */
export class DevSimulatedRewardedAdProvider implements RewardedAdProvider {
  readonly id = 'ads-dev-simulator';
  readonly configured = false; // simulated != configured

  constructor(private readonly confirmLabel = 'SIMULADOR DEV') {}

  async showRewarded(placementId: string): Promise<RewardedAdResult> {
    const watched = await devConfirm(
      `[${this.confirmLabel}] Reproduzir anúncio de teste para "${placementId}" até o final?`,
    );
    if (!watched) return { status: 'cancelled' };
    return { status: 'completed', receiptId: `dev-${cryptoRandomId()}` };
  }
}

export class NotConfiguredPaymentProvider implements PaymentProvider {
  readonly id = 'payments-not-configured';
  readonly configured = false;

  async purchase(): Promise<PurchaseResult> {
    return { status: 'unavailable', reason: 'Pagamentos não configurados neste ambiente.' };
  }
}

export class NotConfiguredPurchaseVerifier implements PurchaseVerifier {
  readonly id = 'verifier-not-configured';
  readonly configured = false;

  async verify(): Promise<{ valid: boolean; reason?: string }> {
    return { valid: false, reason: 'Verifier not configured' };
  }
}

export class NoopAnalyticsProvider implements AnalyticsProvider {
  readonly id = 'analytics-noop';
  readonly configured = false;
  readonly events: Array<{ event: string; properties?: Record<string, string | number | boolean> }> = [];

  track(event: string, properties?: Record<string, string | number | boolean>): void {
    this.events.push({ event, properties });
  }
}

export class StaticRemoteConfigProvider implements RemoteConfigProvider {
  readonly id = 'remote-config-static';
  readonly configured = false;
  constructor(private readonly values: Record<string, unknown> = {}) {}
  get<T>(key: string, fallback: T): T {
    const value = this.values[key];
    return (value === undefined ? fallback : value) as T;
  }
}

export function cryptoRandomId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** DEV-ONLY confirmation gate for the simulated ad flow. */
async function devConfirm(message: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  return window.confirm(message);
}

export type { PurchaseRequest };
