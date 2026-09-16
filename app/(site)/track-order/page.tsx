"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { OrderDetailsCard } from "@/components/site/order-details-card";
import { lookupOrderAction } from "@/app/(site)/track-order/actions";

type OrderResult = Awaited<ReturnType<typeof lookupOrderAction>>;

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<OrderResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);
    try {
      const response = await lookupOrderAction({ orderNumber, email });
      setResult(response);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container-edit py-14 lg:py-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
          Order Status
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Track Your Order
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-graphite">
          Enter your order number and the email address used at checkout.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 max-w-lg space-y-5 border border-line-strong p-6"
      >
        <div>
          <Label htmlFor="orderNumber">Order Number</Label>
          <Input
            id="orderNumber"
            placeholder="AXR-XXXXXXX-XXXX"
            className="mt-2"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="mt-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          <Search className="h-4 w-4" />
          {isSubmitting ? "Searching…" : "Track Order"}
        </Button>
        {result && !result.ok && (
          <p className="text-center text-[13px] text-danger">{result.error}</p>
        )}
      </form>

      {result?.ok && (
        <div className="mx-auto mt-10 max-w-lg">
          <OrderDetailsCard order={result.order} />
        </div>
      )}
    </div>
  );
}
