import type { Metadata } from "next";
import { PolicyLayout, PolicySection } from "@/components/site/policy-layout";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPage() {
  return (
    <PolicyLayout eyebrow="Legal" title="Shipping Policy" updated="January 1, 2026">
      <PolicySection title="1. Processing Time">
        <p>
          Orders are processed after payment has been confirmed, typically
          within 1–2 business days. Orders placed on weekends or holidays are
          processed the next business day.
        </p>
      </PolicySection>

      <PolicySection title="2. Shipping Rates">
        <p>
          A flat shipping rate applies to all domestic orders under $200.
          Orders of $200 or more ship free. Placeholder text: international
          shipping rates and availability to be finalized.
        </p>
      </PolicySection>

      <PolicySection title="3. Delivery Estimates">
        <p>
          Placeholder text: estimated delivery windows by carrier/service
          level to be added once a shipping provider is finalized.
        </p>
      </PolicySection>

      <PolicySection title="4. Packaging">
        <p>
          Temperature-sensitive items are packaged with cold-chain best
          practices in mind. Placeholder text: specific packaging
          disclosures to be finalized for production use.
        </p>
      </PolicySection>

      <PolicySection title="5. Order Tracking">
        <p>
          Once your order ships, tracking information (if available) will be
          visible on the Track Order page using your order number and email.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
