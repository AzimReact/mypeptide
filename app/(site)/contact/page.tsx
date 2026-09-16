import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Axiom Research team.",
};

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "support@axiomresearch.demo",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "1–2 business days",
  },
  {
    icon: MapPin,
    label: "Based In",
    value: "United States",
  },
];

export default function ContactPage() {
  return (
    <div className="container-edit py-14 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            Contact
          </p>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
            Get in Touch
          </h1>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-graphite">
            Questions about an order, documentation, or our catalog? Send us
            a message and our team will follow up.
          </p>

          <div className="mt-10 space-y-6">
            {CONTACT_DETAILS.map((detail) => (
              <div key={detail.label} className="flex items-start gap-3">
                <detail.icon className="mt-0.5 h-4 w-4 text-accent" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-graphite">
                    {detail.label}
                  </p>
                  <p className="text-[13px] text-ink">{detail.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-line-strong p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
