import type { Metadata } from "next";
import { PolicyLayout, PolicySection } from "@/components/site/policy-layout";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <PolicyLayout eyebrow="Legal" title="Terms of Service" updated="January 1, 2026">
      <PolicySection title="1. Acceptance of Terms">
        <p>
          By accessing or placing an order through this website, you agree to
          be bound by these Terms of Service. If you do not agree to these
          terms, please do not use this site.
        </p>
      </PolicySection>

      <PolicySection title="2. Research Use Only">
        <p>
          All products offered on this site are sold exclusively for lawful
          laboratory and research use by qualified individuals and
          institutions. Products are not intended for human or veterinary
          use, and you agree not to use them for any such purpose.
        </p>
      </PolicySection>

      <PolicySection title="3. Eligibility">
        <p>
          You must be at least 21 years of age and legally permitted to
          purchase research compounds in your jurisdiction to place an order
          through this site.
        </p>
      </PolicySection>

      <PolicySection title="4. Orders and Payment">
        <p>
          Orders are processed once payment has been confirmed. Prices are
          listed in U.S. dollars and are subject to change without notice.
          Placeholder text: additional payment terms to be provided by legal
          counsel.
        </p>
      </PolicySection>

      <PolicySection title="5. Limitation of Liability">
        <p>
          Placeholder text: this section will define liability limitations
          and disclaimers and should be finalized with legal counsel prior to
          production use.
        </p>
      </PolicySection>

      <PolicySection title="6. Contact">
        <p>
          Questions about these Terms of Service can be directed to us via
          our Contact page.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
