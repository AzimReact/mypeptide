"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/orders";
import { updateOrderAction } from "@/app/admin/(dashboard)/orders/actions";

interface OrderStatusFormProps {
  orderId: string;
  status: OrderStatus;
  trackingNumber: string;
  notes: string;
}

export function OrderStatusForm({ orderId, status, trackingNumber, notes }: OrderStatusFormProps) {
  const router = useRouter();
  const [form, setForm] = React.useState({
    status,
    trackingNumber: trackingNumber ?? "",
    notes: notes ?? "",
  });
  const [isSaving, setIsSaving] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    const result = await updateOrderAction(orderId, form);
    setIsSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? "Something went wrong.");
      return;
    }
    toast.success("Order updated");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 border border-line-strong p-6">
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink">
        Fulfillment
      </h2>

      <div>
        <Label htmlFor="status">Order Status</Label>
        <select
          id="status"
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as OrderStatus }))}
          className="mt-2 h-11 w-full border border-line-strong bg-paper px-3.5 text-[14px] text-ink focus:border-ink focus:outline-none"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="trackingNumber">Tracking Number</Label>
        <Input
          id="trackingNumber"
          className="mt-2"
          value={form.trackingNumber}
          onChange={(e) => setForm((f) => ({ ...f, trackingNumber: e.target.value }))}
          placeholder="Optional"
        />
      </div>

      <div>
        <Label htmlFor="notes">Internal Notes</Label>
        <Textarea
          id="notes"
          rows={4}
          className="mt-2"
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder="Visible to admin users only"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSaving}>
        {isSaving ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
