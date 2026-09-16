import type { Metadata } from "next";
import { PolicyLayout, PolicySection } from "@/components/site/policy-layout";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <PolicyLayout eyebrow="Legal" title="Refund Policy" updated="January 1, 2026">
      <PolicySection title="1. Order Cancellations">
        <p>
          Orders may be cancelled prior to payment confirmation. Once a
          crypto payment has been confirmed on the blockchain (or, in this
          demo, once marked paid), orders are considered final and enter
          processing.
        </p>
      </PolicySection>

      <PolicySection title="2. Damaged or Incorrect Items">
        <p>
          Placeholder text: describe the process for reporting damaged,
          defective, or incorrect items, including any required timeframe
          and documentation.
        </p>
      </PolicySection>

      <PolicySection title="3. Refund Method">
        <p>
          Approved refunds are issued to the original cryptocurrency wallet
          used for payment. Placeholder text: refund timing and any
          applicable network fee handling to be finalized.
        </p>
      </PolicySection>

      <PolicySection title="4. Non-Refundable Items">
        <p>
          Placeholder text: list any categories of non-refundable products
          (e.g. opened documentation-only items) once finalized by the
          client.
        </p>
      </PolicySection>

      <PolicySection title="5. Contact for Refund Requests">
        <p>
          To request a refund, please contact us via our Contact page with
          your order number and a description of the issue.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
