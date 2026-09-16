"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Copy, Loader2, ShieldAlert } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { CryptoCurrency } from "@/lib/validation/checkout";
import { Button } from "@/components/ui/button";
import {
  changeCurrencyAction,
  getPaymentStatusAction,
  simulatePaidAction,
} from "@/app/(site)/checkout/payment/[orderId]/actions";

const CURRENCIES: CryptoCurrency[] = ["BTC", "ETH", "USDT", "USDC"];

type PaymentStatus = "pending" | "confirming" | "paid" | "failed" | "expired";

interface CryptoPaymentProps {
  orderId: string;
  orderNumber: string;
  totalUsdCents: number;
  initial: {
    currency: CryptoCurrency;
    cryptoAmount: string;
    walletAddress: string;
    expiresAt: string;
    status: PaymentStatus;
    qrDataUrl: string;
  };
}

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

const STATUS_COPY: Record<PaymentStatus, { label: string; tone: string }> = {
  pending: { label: "Waiting for payment…", tone: "text-graphite" },
  confirming: { label: "Confirming transaction…", tone: "text-warn" },
  paid: { label: "Payment confirmed", tone: "text-success" },
  failed: { label: "Payment failed", tone: "text-danger" },
  expired: { label: "Payment window expired", tone: "text-danger" },
};

export function CryptoPayment({ orderId, orderNumber, totalUsdCents, initial }: CryptoPaymentProps) {
  const router = useRouter();
  const [currency, setCurrency] = React.useState(initial.currency);
  const [cryptoAmount, setCryptoAmount] = React.useState(initial.cryptoAmount);
  const [walletAddress, setWalletAddress] = React.useState(initial.walletAddress);
  const [qrDataUrl, setQrDataUrl] = React.useState(initial.qrDataUrl);
  const [expiresAt, setExpiresAt] = React.useState(new Date(initial.expiresAt));
  const [status, setStatus] = React.useState<PaymentStatus>(initial.status);
  const [remainingMs, setRemainingMs] = React.useState(0);
  const [isChangingCurrency, setIsChangingCurrency] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Countdown ticker. The current time is impure, so it's read here (inside
  // an effect) rather than during render.
  React.useEffect(() => {
    // Set the initial value immediately so the countdown doesn't flash
    // "00:00" for the second before the first interval tick fires.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemainingMs(expiresAt.getTime() - Date.now());
    const id = setInterval(() => {
      setRemainingMs(expiresAt.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  // Status polling
  React.useEffect(() => {
    if (status !== "pending" && status !== "confirming") return;
    const id = setInterval(async () => {
      try {
        const result = await getPaymentStatusAction(orderId);
        setStatus(result.status as PaymentStatus);
        setExpiresAt(new Date(result.expiresAt));
        if (result.status === "paid") {
          router.push(`/order/success/${orderId}`);
        }
      } catch {
        // Ignore transient polling errors.
      }
    }, 2500);
    return () => clearInterval(id);
  }, [status, orderId, router]);

  async function handleCurrencyChange(next: CryptoCurrency) {
    if (next === currency || isChangingCurrency) return;
    setIsChangingCurrency(true);
    try {
      const result = await changeCurrencyAction(orderId, next);
      setCurrency(result.currency);
      setCryptoAmount(result.cryptoAmount);
      setWalletAddress(result.walletAddress);
      setExpiresAt(new Date(result.expiresAt));
      setStatus(result.status as PaymentStatus);
      setQrDataUrl(result.qrDataUrl);
    } catch {
      toast.error("Could not update payment currency. Please try again.");
    } finally {
      setIsChangingCurrency(false);
    }
  }

  async function handleIHavePaid() {
    setIsConfirming(true);
    try {
      const result = await simulatePaidAction(orderId);
      setStatus(result.status as PaymentStatus);
      toast.info("Confirming your transaction…");
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsConfirming(false);
    }
  }

  async function handleCopyAddress() {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy address");
    }
  }

  const expired = status === "expired" || (remainingMs <= 0 && (status === "pending" || status === "confirming"));
  const effectiveStatus: PaymentStatus = expired ? "expired" : status;
  const isSettled = effectiveStatus === "paid" || effectiveStatus === "failed" || effectiveStatus === "expired";

  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
          Order {orderNumber}
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Pay With Crypto
        </h1>
        <p className="mt-2 text-2xl font-semibold text-ink">
          {formatPrice(totalUsdCents)}{" "}
          <span className="text-[14px] font-normal text-graphite">USD</span>
        </p>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-2">
        {CURRENCIES.map((c) => (
          <button
            key={c}
            onClick={() => handleCurrencyChange(c)}
            disabled={isChangingCurrency || isSettled}
            className={cn(
              "border py-3 text-[13px] font-semibold uppercase tracking-wide transition-colors",
              c === currency
                ? "border-ink bg-ink text-paper"
                : "border-line-strong text-ink hover:border-ink",
              (isChangingCurrency || isSettled) && "opacity-50"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {!isSettled && (
        <>
          <div className="mt-8 flex flex-col items-center gap-6 border border-line-strong p-8">
            <div className="relative h-56 w-56 shrink-0 overflow-hidden bg-paper-dim">
              {qrDataUrl && (
                <Image
                  src={qrDataUrl}
                  alt="Payment QR code"
                  fill
                  className={cn("object-contain transition-opacity", isChangingCurrency && "opacity-40")}
                />
              )}
            </div>

            <div className="w-full space-y-1 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-graphite">
                Amount
              </p>
              <p className="font-mono text-xl font-semibold text-ink">
                {cryptoAmount} {currency}
              </p>
            </div>

            <div className="w-full space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-graphite">
                Wallet Address
              </p>
              <button
                onClick={handleCopyAddress}
                className="flex w-full items-center justify-between gap-3 border border-line-strong bg-paper-dim px-3.5 py-3 text-left transition-colors hover:border-ink"
              >
                <span className="truncate font-mono text-[12px] text-ink">
                  {walletAddress}
                </span>
                {copied ? (
                  <Check className="h-4 w-4 shrink-0 text-success" />
                ) : (
                  <Copy className="h-4 w-4 shrink-0 text-graphite" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-y border-line py-4">
            <span className={cn("flex items-center gap-2 text-[13px] font-medium", STATUS_COPY[effectiveStatus].tone)}>
              {(effectiveStatus === "pending" || effectiveStatus === "confirming") && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {STATUS_COPY[effectiveStatus].label}
            </span>
            <span className="font-mono text-[13px] font-semibold text-ink">
              {formatCountdown(remainingMs)}
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              size="lg"
              onClick={handleIHavePaid}
              disabled={isConfirming || status === "confirming"}
            >
              {isConfirming || status === "confirming" ? "Confirming…" : "I Have Paid"}
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/checkout">Return to Checkout</Link>
            </Button>
          </div>
        </>
      )}

      {effectiveStatus === "expired" && (
        <div className="mt-8 flex flex-col items-center gap-4 border border-danger/30 bg-danger-soft p-8 text-center">
          <ShieldAlert className="h-7 w-7 text-danger" />
          <p className="text-[14px] font-medium text-ink">
            This payment window has expired.
          </p>
          <p className="text-[13px] text-graphite">
            No funds were charged. You can return to checkout to place a new
            order.
          </p>
          <Button asChild size="lg" className="mt-2 w-full">
            <Link href="/checkout">Return to Checkout</Link>
          </Button>
        </div>
      )}

      {effectiveStatus === "failed" && (
        <div className="mt-8 flex flex-col items-center gap-4 border border-danger/30 bg-danger-soft p-8 text-center">
          <ShieldAlert className="h-7 w-7 text-danger" />
          <p className="text-[14px] font-medium text-ink">
            We couldn&apos;t confirm this payment.
          </p>
          <Button asChild size="lg" className="mt-2 w-full">
            <Link href="/checkout">Return to Checkout</Link>
          </Button>
        </div>
      )}

      <p className="mt-8 text-center text-[11px] leading-relaxed text-graphite-light">
        This is a simulated crypto payment for demonstration purposes. No real
        blockchain transaction is required or recorded.
      </p>
    </div>
  );
}
