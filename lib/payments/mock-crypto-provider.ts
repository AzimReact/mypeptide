import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import type { CryptoCurrency } from "@/lib/validation/checkout";
import type {
  CreatePaymentInput,
  PaymentDetails,
  PaymentProvider,
} from "@/lib/payments/payment-provider";

const PAYMENT_WINDOW_MS = 1000 * 60 * 15; // 15 minutes to pay, demo purposes

// Fixed demo exchange rates (USD per unit) and demo wallet addresses.
// These are illustrative only — no real blockchain or market data is used.
const MOCK_RATES: Record<CryptoCurrency, number> = {
  BTC: 62_345.1,
  ETH: 2_543.2,
  USDT: 1,
  USDC: 1,
};

const MOCK_WALLETS: Record<CryptoCurrency, string> = {
  BTC: "bc1q_demo_axiomresearch_wallet_9f2c7e1a4b",
  ETH: "0xDEM0A1C0A1c9De91E8B1BeefCafe000AX10Mrsh",
  USDT: "0xDEM0A1C0A1c9De91E8B1BeefCafe000AX10Mrsh",
  USDC: "0xDEM0A1C0A1c9De91E8B1BeefCafe000AX10Mrsh",
};

const CRYPTO_DECIMALS: Record<CryptoCurrency, number> = {
  BTC: 6,
  ETH: 5,
  USDT: 2,
  USDC: 2,
};

function toCryptoAmount(usdCents: number, currency: CryptoCurrency): string {
  const usd = usdCents / 100;
  const amount = usd / MOCK_RATES[currency];
  return amount.toFixed(CRYPTO_DECIMALS[currency]);
}

function toPaymentDetails(payment: {
  providerPaymentId: string | null;
  currency: string;
  cryptoAmount: string;
  walletAddress: string;
  expiresAt: Date;
  status: string;
}): PaymentDetails {
  return {
    providerPaymentId: payment.providerPaymentId ?? "",
    currency: payment.currency as CryptoCurrency,
    cryptoAmount: payment.cryptoAmount,
    walletAddress: payment.walletAddress,
    expiresAt: payment.expiresAt,
    status: payment.status as PaymentDetails["status"],
  };
}

class MockCryptoPaymentProvider implements PaymentProvider {
  async createPayment(input: CreatePaymentInput): Promise<PaymentDetails> {
    const expiresAt = new Date(Date.now() + PAYMENT_WINDOW_MS);
    const cryptoAmount = toCryptoAmount(input.amountUsdCents, input.currency);
    const walletAddress = MOCK_WALLETS[input.currency];

    const payment = await prisma.payment.upsert({
      where: { orderId: input.orderId },
      create: {
        orderId: input.orderId,
        provider: "mock_crypto",
        status: "pending",
        currency: input.currency,
        cryptoAmount,
        walletAddress,
        providerPaymentId: randomUUID(),
        expiresAt,
      },
      update: {
        currency: input.currency,
        cryptoAmount,
        walletAddress,
        expiresAt,
        status: "pending",
        paidAt: null,
      },
    });

    return toPaymentDetails(payment);
  }

  async getPaymentStatus(orderId: string): Promise<PaymentDetails> {
    const payment = await prisma.payment.findUniqueOrThrow({
      where: { orderId },
    });

    if (
      (payment.status === "pending" || payment.status === "confirming") &&
      payment.expiresAt.getTime() < Date.now()
    ) {
      const expired = await prisma.payment.update({
        where: { orderId },
        data: { status: "expired" },
      });
      return toPaymentDetails(expired);
    }

    return toPaymentDetails(payment);
  }

  /**
   * Demo-only helper with no equivalent on the PaymentProvider interface:
   * simulates a customer confirming payment. Moves pending/confirming
   * straight to "confirming", then resolves to "paid" a few seconds later
   * to imitate on-chain confirmation delay.
   */
  async simulateCustomerPaid(orderId: string): Promise<PaymentDetails> {
    const confirming = await prisma.payment.update({
      where: { orderId },
      data: { status: "confirming" },
    });

    setTimeout(async () => {
      try {
        await prisma.payment.update({
          where: { orderId },
          data: { status: "paid", paidAt: new Date() },
        });
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "paid" },
        });

        const items = await prisma.orderItem.findMany({ where: { orderId } });
        for (const item of items) {
          if (!item.productId) continue;
          await prisma.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
        }
      } catch {
        // Order/payment may have been removed in the meantime; nothing to do.
      }
    }, 4000);

    return toPaymentDetails(confirming);
  }
}

export const mockCryptoPaymentProvider = new MockCryptoPaymentProvider();
