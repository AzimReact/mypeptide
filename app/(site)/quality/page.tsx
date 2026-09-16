import type { Metadata } from "next";
import Link from "next/link";
import {
  FileCheck2,
  Microscope,
  ShieldCheck,
  Snowflake,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Quality & Documentation",
  description:
    "How Axiom Research tests, documents, and ships every reference compound in our catalog.",
};

const STEPS = [
  {
    number: "01",
    title: "Synthesis & Formulation",
    description:
      "Each compound is synthesized or formulated in small production lots, with process parameters recorded for every batch.",
  },
  {
    number: "02",
    title: "Independent Analysis",
    description:
      "Samples from every lot are analyzed via HPLC and mass spectrometry to confirm identity and purity prior to release.",
  },
  {
    number: "03",
    title: "Documentation",
    description:
      "Results are compiled into a Certificate of Analysis and paired with a Safety Data Sheet covering handling guidance.",
  },
  {
    number: "04",
    title: "Cold-Chain Packaging",
    description:
      "Temperature-sensitive items are packaged with insulated materials and shipped promptly after payment confirmation.",
  },
];

const PILLARS = [
  {
    icon: Microscope,
    title: "Independent Batch Testing",
    description: "Every lot is verified prior to release for distribution.",
  },
  {
    icon: FileCheck2,
    title: "Public Documentation",
    description: "COA and SDS files are published directly on product pages.",
  },
  {
    icon: Snowflake,
    title: "Cold-Chain Handling",
    description: "Packaging follows cold-chain best practices where required.",
  },
  {
    icon: ShieldCheck,
    title: "Traceable Batches",
    description: "Every vial carries a lot number tied to its test results.",
  },
];

export default function QualityPage() {
  return (
    <div>
      <section className="border-b border-line bg-paper-dim/40 bg-grid">
        <div className="container-edit py-16 text-center lg:py-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            Our Standard
          </p>
          <h1 className="mx-auto mt-3 max-w-2xl font-display text-3xl tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Every Batch Tested. Every Result Published.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-graphite">
            Quality isn&apos;t a marketing claim here — it&apos;s a documented
            process behind every product we distribute.
          </p>
        </div>
      </section>

      <section className="container-edit py-16 lg:py-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="border border-line-strong p-6">
              <pillar.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
              <h3 className="mt-4 text-[13px] font-semibold text-ink">
                {pillar.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-graphite">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-ink text-paper">
        <div className="container-edit py-16 lg:py-24">
          <h2 className="max-w-lg font-display text-2xl tracking-tight text-paper sm:text-3xl">
            From Synthesis to Your Shelf
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.number}>
                <span className="font-mono text-[12px] text-accent">
                  {step.number}
                </span>
                <h3 className="mt-3 text-[14px] font-semibold text-paper">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-paper/60">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-edit py-16 text-center lg:py-24">
        <h2 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">
          Review documentation before you buy.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[14px] text-graphite">
          Every product page includes a downloadable Certificate of Analysis
          and Safety Data Sheet.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/shop">
            Browse the Catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
