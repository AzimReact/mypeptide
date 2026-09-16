"use client";

import * as React from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent — our team will respond within 1–2 business days.");
      e.currentTarget.reset();
      setIsSubmitting(false);
    }, 700);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-2" />
        </div>
      </div>
      <div>
        <Label htmlFor="orderNumber">Order Number (optional)</Label>
        <Input id="orderNumber" name="orderNumber" className="mt-2" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required className="mt-2" rows={5} />
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
