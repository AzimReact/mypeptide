"use client";

import * as React from "react";
import { unstable_rethrow } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema, type AdminLoginInput } from "@/lib/validation/auth";
import { loginAction } from "@/app/admin/(auth)/login/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginInput>({ resolver: zodResolver(adminLoginSchema) });

  async function onSubmit(values: AdminLoginInput) {
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await loginAction(values);
      if (result && !result.ok) {
        setError(result.error);
        setIsSubmitting(false);
      }
    } catch (error) {
      unstable_rethrow(error);
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-5 border border-line-strong bg-paper p-8"
    >
      <div className="mb-2 text-center">
        <h1 className="font-display text-xl tracking-tight text-ink">
          Admin Sign In
        </h1>
        <p className="mt-1 text-[13px] text-graphite">
          Restricted access — authorized personnel only.
        </p>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" className="mt-2" {...register("email")} />
        {errors.email && (
          <p className="mt-1.5 text-[12px] text-danger">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          className="mt-2"
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1.5 text-[12px] text-danger">{errors.password.message}</p>
        )}
      </div>

      {error && <p className="text-[13px] text-danger">{error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing In…" : "Sign In"}
      </Button>
    </form>
  );
}
