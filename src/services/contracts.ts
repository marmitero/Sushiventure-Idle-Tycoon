/**
 * External service contracts (docs/ARCHITECTURE.md §5.3).
 *
 * No core module may depend on a concrete vendor. Concrete adapters are
 * registered at bootstrap; anything without credentials resolves to a
 * clearly-labelled "not configured" adapter that NEVER grants benefits.
 */

export interface AuthSession {
  userId: string;
  provider: string;
  guest: boolean;
}

export interface AuthProvider {
  readonly id: string;
  readonly configured: boolean;
  signInGuest(): Promise<AuthSession>;
  linkAccount(email: string): Promise<AuthSession>;
  signOut(): Promise<void>;
}

export type RewardedAdResult =
  | { status: 'completed'; receiptId: string }
  | { status: 'cancelled' }
  | { status: 'unavailable'; reason: string }
  | { status: 'error'; reason: string };

export interface RewardedAdProvider {
  readonly id: string;
  readonly configured: boolean;
  /** Resolves ONLY after the provider confirms the ad was fully watched. */
  showRewarded(placementId: string): Promise<RewardedAdResult>;
}

export interface PurchaseRequest {
  productId: string;
  idempotencyKey: string;
}

export type PurchaseResult =
  | { status: 'approved'; transactionId: string }
  | { status: 'pending' }
  | { status: 'declined'; reason: string }
  | { status: 'unavailable'; reason: string };

export interface PaymentProvider {
  readonly id: string;
  readonly configured: boolean;
  purchase(request: PurchaseRequest): Promise<PurchaseResult>;
}

export interface PurchaseVerifier {
  readonly id: string;
  readonly configured: boolean;
  verify(transactionId: string, productId: string): Promise<{ valid: boolean; reason?: string }>;
}

export interface AnalyticsProvider {
  readonly id: string;
  readonly configured: boolean;
  track(event: string, properties?: Record<string, string | number | boolean>): void;
}

export interface RemoteConfigProvider {
  readonly id: string;
  readonly configured: boolean;
  get<T>(key: string, fallback: T): T;
}
