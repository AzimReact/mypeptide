import Link from "next/link";
import {
  ArrowRight,
  FileCheck2,
  FlaskConical,
  Microscope,
  ShieldCheck,
  Snowflake,
  Thermometer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductGrid } from "@/components/site/product-grid";
import { HeroGraphic } from "@/components/site/home/hero-graphic";
import { getFeaturedProducts } from "@/lib/data/products";
import { getActiveCategories } from "@/lib/data/categories";
import { FAQ_ENTRIES } from "@/lib/content/faq";

const QUALITY_PILLARS = [
  {
    icon: Microscope,
    title: "Independent Batch Testing",
    description:
      "Every production lot is verified via HPLC and mass spectrometry prior to release for research distribution.",
  },
  {
    icon: FileCheck2,
    title: "Documentation On Every Order",
    description:
      "Certificates of Analysis and Safety Data Sheets are available for download on every product page.",
  },
  {
    icon: Snowflake,
    title: "Controlled Cold-Chain Handling",
    description:
      "Temperature-sensitive compounds are packaged and shipped with cold-chain best practices in mind.",
  },
  {
    icon: ShieldCheck,
    title: "Traceable Lot Numbers",
    description:
      "Each vial is assigned a batch number that maps directly to its analytical documentation.",
  },
];

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(4),
    getActiveCategories(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-paper">
        <div className="container-edit grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
          <div className="order-2 lg:order-1">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Axiom Research — Reference Compounds
            </p>
            <h1 className="font-display text-[42px] font-medium leading-[1.05] tracking-tight text-ink text-balance sm:text-[54px] lg:text-[60px]">
              Precision Research.
              <br />
              Verified Purity.
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-graphite">
              Axiom Research supplies rigorously documented reference
              compounds for laboratory research — every lot independently
              tested, every certificate available before you buy.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/shop">
                  Shop the Catalog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="whitespace-normal text-center">
                <Link href="/quality">Explore Our Quality Standard</Link>
              </Button>
            </div>

            <p className="mt-8 flex items-start gap-2 text-[12px] leading-relaxed text-graphite-light">
              <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              For laboratory and research use only. Not for human or
              veterinary use.
            </p>
          </div>

          <div className="order-1 aspect-[4/4.5] w-full lg:order-2">
            <HeroGraphic />
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="container-edit py-20 lg:py-28">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              Featured
            </p>
            <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
              Selected Reference Compounds
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:text-accent-dark"
          >
            View All Products
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      {/* Quality */}
      <section className="border-y border-line bg-paper-dim/50 bg-grid">
        <div className="container-edit py-20 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              Our Standard
            </p>
            <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
              Quality Is Not An Afterthought
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-graphite">
              Every product we distribute is backed by a documented testing
              process, so your research team can verify what they receive.
            </p>
          </div>

          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {QUALITY_PILLARS.map((pillar) => (
              <div key={pillar.title} className="text-center sm:text-left">
                <div className="mx-auto flex h-11 w-11 items-center justify-center border border-line-strong bg-paper sm:mx-0">
                  <pillar.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-[14px] font-semibold text-ink">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-graphite">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-edit py-20 lg:py-28">
        <div className="mb-10">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            Catalog
          </p>
          <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
            Browse by Category
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group flex flex-col justify-between border border-line-strong p-6 transition-colors hover:border-ink"
            >
              <div>
                <h3 className="font-display text-xl tracking-tight text-ink">
                  {category.name}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-graphite">
                  {category.description}
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-graphite-light">
                  {category._count.products} Products
                </span>
                <ArrowRight className="h-4 w-4 text-ink transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Documentation */}
      <section className="border-y border-line bg-ink text-paper">
        <div className="container-edit grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/50">
              Documentation
            </p>
            <h2 className="font-display text-3xl tracking-tight text-paper sm:text-4xl">
              Every Order, Fully Documented
            </h2>
            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-paper/65">
              Certificates of Analysis and Safety Data Sheets are published on
              every product page — not locked behind a request form. Review
              batch testing data before you ever add an item to cart.
            </p>
            <Button asChild variant="accent" size="lg" className="mt-8 whitespace-normal text-center">
              <Link href="/quality">View Our Documentation Standard</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-paper/15 p-6">
              <FileCheck2 className="h-5 w-5 text-accent" strokeWidth={1.5} />
              <h3 className="mt-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-paper">
                Certificate of Analysis
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-paper/60">
                Purity, identity, and batch-level test results for every lot.
              </p>
            </div>
            <div className="border border-paper/15 p-6">
              <ShieldCheck className="h-5 w-5 text-accent" strokeWidth={1.5} />
              <h3 className="mt-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-paper">
                Safety Data Sheet
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-paper/60">
                Handling and storage guidance for laboratory environments.
              </p>
            </div>
            <div className="border border-paper/15 p-6 sm:col-span-2">
              <Thermometer className="h-5 w-5 text-accent" strokeWidth={1.5} />
              <h3 className="mt-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-paper">
                Storage &amp; Handling Notes
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-paper/60">
                Clear storage temperature and handling guidance included with
                every reference compound listing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research use */}
      <section className="container-edit py-20 lg:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <FlaskConical className="h-8 w-8 text-accent" strokeWidth={1.5} />
          <h2 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">
            For Laboratory &amp; Research Use Only
          </h2>
          <p className="text-[14px] leading-relaxed text-graphite">
            Every product listed on this site is sold exclusively for lawful
            laboratory and research applications. Our catalog is not intended
            for human or veterinary use, and nothing on this site should be
            interpreted as a therapeutic, diagnostic, or medical claim. See
            our{" "}
            <Link href="/research-use" className="text-ink underline underline-offset-4">
              Research Use policy
            </Link>{" "}
            for full details.
          </p>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="border-t border-line bg-paper-dim/40">
        <div className="container-edit py-20 lg:py-28">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                Support
              </p>
              <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>

            <Accordion type="single" collapsible>
              {FAQ_ENTRIES.slice(0, 4).map((entry) => (
                <AccordionItem key={entry.question} value={entry.question}>
                  <AccordionTrigger>{entry.question}</AccordionTrigger>
                  <AccordionContent>{entry.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink hover:text-accent-dark"
              >
                View All Questions →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-edit py-24 text-center lg:py-32">
        <h2 className="font-display text-3xl tracking-tight text-ink text-balance sm:text-4xl lg:text-5xl">
          Research-grade compounds,
          <br />
          verified before they ship.
        </h2>
        <Button asChild size="lg" className="mt-9">
          <Link href="/shop">
            Browse the Full Catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </>
  );
}
