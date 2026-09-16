import type { Metadata } from "next";
import { PolicyLayout, PolicySection } from "@/components/site/policy-layout";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PolicyLayout eyebrow="Legal" title="Privacy Policy" updated="January 1, 2026">
      <PolicySection title="1. Information We Collect">
        <p>
          When you place an order, we collect information necessary to
          process it, including your name, email address, shipping address,
          and order contents. We do not collect payment card information, as
          checkout is completed via cryptocurrency.
        </p>
      </PolicySection>

      <PolicySection title="2. How We Use Information">
        <p>
          Information collected is used solely to process orders, provide
          order tracking, and respond to customer inquiries. Placeholder
          text: additional data-use disclosures to be finalized with legal
          counsel.
        </p>
      </PolicySection>

      <PolicySection title="3. Data Storage">
        <p>
          Order information is stored securely for the purpose of order
          fulfillment and customer support. Placeholder text: retention
          periods and storage practices to be finalized for production use.
        </p>
      </PolicySection>

      <PolicySection title="4. Third-Party Sharing">
        <p>
          We do not sell customer information. Placeholder text: any
          necessary third-party processor disclosures (e.g. shipping
          carriers) should be added here for production use.
        </p>
      </PolicySection>

      <PolicySection title="5. Your Rights">
        <p>
          Placeholder text: this section should describe applicable consumer
          privacy rights based on the client&apos;s operating jurisdiction.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
