import { mockCryptoPaymentProvider } from "@/lib/payments/mock-crypto-provider";
import type { PaymentProvider } from "@/lib/payments/payment-provider";

/**
 * Single seam for swapping payment implementations. Production crypto
 * payment integration is intentionally mocked in this MVP — a real provider
 * must be selected and verified for the client's jurisdiction and business
 * category before production implementation. When that happens, implement
 * `PaymentProvider` in a `real-crypto-provider.ts` and return it here; no
 * caller outside this file needs to change.
 */
export function getPaymentProvider(): PaymentProvider {
  return mockCryptoPaymentProvider;
}

export { mockCryptoPaymentProvider };
export type { PaymentProvider } from "@/lib/payments/payment-provider";
