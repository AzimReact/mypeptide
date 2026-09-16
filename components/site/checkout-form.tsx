"use client";

import * as React from "react";
import { unstable_rethrow } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import {
  checkoutFormSchema,
  type CheckoutFormValues,
} from "@/lib/validation/checkout";
import { submitCheckout } from "@/app/(site)/checkout/actions";
import { useCart } from "@/components/site/cart-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[12px] text-danger">{message}</p>;
}

export function CheckoutForm() {
  const { items } = useCart();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      country: "United States",
      ageConfirmed: false,
      researchUseConfirmed: false,
      termsAccepted: false,
    },
  });

  const ageConfirmed = watch("ageConfirmed");
  const researchUseConfirmed = watch("researchUseConfirmed");
  const termsAccepted = watch("termsAccepted");

  async function onSubmit(values: CheckoutFormValues) {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await submitCheckout({
        ...values,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      if (result && !result.ok) {
        toast.error(result.error);
        setIsSubmitting(false);
      }
      // On success the server action redirects — this component unmounts.
    } catch (error) {
      unstable_rethrow(error);
      toast.error("Something went wrong placing your order. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <section>
        <h2 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink">
          Contact
        </h2>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" className="mt-2" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink">
          Shipping Address
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" className="mt-2" {...register("firstName")} />
            <FieldError message={errors.firstName?.message} />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" className="mt-2" {...register("lastName")} />
            <FieldError message={errors.lastName?.message} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" className="mt-2" {...register("address")} />
            <FieldError message={errors.address?.message} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" className="mt-2" {...register("city")} />
            <FieldError message={errors.city?.message} />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" className="mt-2" {...register("state")} />
            <FieldError message={errors.state?.message} />
          </div>
          <div>
            <Label htmlFor="zip">ZIP Code</Label>
            <Input id="zip" className="mt-2" {...register("zip")} />
            <FieldError message={errors.zip?.message} />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" className="mt-2" {...register("country")} />
            <FieldError message={errors.country?.message} />
          </div>
        </div>
      </section>

      <section className="space-y-4 border-t border-line pt-8">
        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox
            checked={ageConfirmed}
            onCheckedChange={(v) => setValue("ageConfirmed", v === true, { shouldValidate: true })}
            className="mt-0.5"
          />
          <span className="text-[13px] leading-relaxed text-ink">
            I confirm that I am 21 years of age or older.
          </span>
        </label>
        <FieldError message={errors.ageConfirmed?.message} />

        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox
            checked={researchUseConfirmed}
            onCheckedChange={(v) =>
              setValue("researchUseConfirmed", v === true, { shouldValidate: true })
            }
            className="mt-0.5"
          />
          <span className="text-[13px] leading-relaxed text-ink">
            I confirm these products are intended solely for lawful
            laboratory/research use, and not for human or veterinary use.
          </span>
        </label>
        <FieldError message={errors.researchUseConfirmed?.message} />

        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox
            checked={termsAccepted}
            onCheckedChange={(v) => setValue("termsAccepted", v === true, { shouldValidate: true })}
            className="mt-0.5"
          />
          <span className="text-[13px] leading-relaxed text-ink">
            I accept the{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/refund" className="underline underline-offset-4">
              Refund Policy
            </Link>
            .
          </span>
        </label>
        <FieldError message={errors.termsAccepted?.message} />
      </section>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Placing Order…" : "Continue to Payment"}
      </Button>
    </form>
  );
}
