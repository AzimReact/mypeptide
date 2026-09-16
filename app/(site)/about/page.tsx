import type { Metadata } from "next";
import { Microscope, ShieldCheck, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Axiom Research supplies documented reference compounds for the laboratory research community.",
};

const VALUES = [
  {
    icon: Microscope,
    title: "Precision",
    description:
      "We hold every batch to the same analytical standard, regardless of order size.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency",
    description:
      "Documentation is published on every product page — not gated behind a request form.",
  },
  {
    icon: Target,
    title: "Focus",
    description:
      "We supply a deliberately curated catalog rather than chasing breadth over rigor.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="container-edit py-16 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            About Axiom Research
          </p>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Built for researchers who verify everything.
          </h1>
          <p className="mt-6 text-[15px] leading-relaxed text-graphite">
            Axiom Research was founded on a simple premise: laboratories
            deserve reference compounds they can independently verify, not
            just trust on faith. Every product we distribute is backed by
            batch-level analytical documentation, published where researchers
            can actually find it — directly on the product page.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-graphite">
            We work with a deliberately focused catalog of peptide compounds,
            reagents, reference standards, and laboratory consumables, so we
            can maintain a consistent quality process across everything we
            offer.
          </p>
        </div>
      </section>

      <section className="border-y border-line bg-paper-dim/40">
        <div className="container-edit py-16 lg:py-24">
          <h2 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">
            What We Value
          </h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title}>
                <value.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                <h3 className="mt-4 text-[15px] font-semibold text-ink">
                  {value.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-graphite">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-edit py-16 lg:py-24">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">
            A note on intended use
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-graphite">
            Axiom Research supplies products strictly for lawful laboratory
            and research use. We do not make therapeutic, diagnostic, or
            medical claims about any product in our catalog. See our{" "}
            <a href="/research-use" className="text-ink underline underline-offset-4">
              Research Use Policy
            </a>{" "}
            for complete details.
          </p>
        </div>
      </section>
    </div>
  );
}
