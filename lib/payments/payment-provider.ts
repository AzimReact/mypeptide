import type { CryptoCurrency } from "@/lib/validation/checkout";
import type { PaymentStatus } from "@/lib/orders";

export interface CreatePaymentInput {
  orderId: string;
  amountUsdCents: number;
  currency: CryptoCurrency;
}

export interface PaymentDetails {
  providerPaymentId: string;
  currency: CryptoCurrency;
  cryptoAmount: string;
  walletAddress: string;
  expiresAt: Date;
  status: PaymentStatus;
}

/**
 * Provider-independent payment interface. Checkout and the crypto payment UI
 * depend only on this contract, never on a specific implementation — so a
 * `RealCryptoPaymentProvider` can later replace `MockCryptoPaymentProvider`
 * without touching UI or checkout code. See lib/payments/index.ts.
 */
export interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<PaymentDetails>;
  getPaymentStatus(orderId: string): Promise<PaymentDetails>;
}
