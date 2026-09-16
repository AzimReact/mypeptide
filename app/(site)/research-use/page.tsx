import type { Metadata } from "next";
import { FlaskConical, ShieldCheck, Users, XCircle } from "lucide-react";
import { ResearchUseNotice } from "@/components/site/research-use-notice";

export const metadata: Metadata = {
  title: "Research Use Policy",
  description:
    "Axiom Research's policy on the intended laboratory and research use of all products sold on this site.",
};

const SECTIONS = [
  {
    icon: FlaskConical,
    title: "Intended Use",
    body: "Every product listed on this site is manufactured and sold exclusively for lawful laboratory and research applications, including in-vitro study, analytical reference work, and method development. Nothing on this site is intended for human consumption, veterinary use, or any therapeutic purpose.",
  },
  {
    icon: Users,
    title: "Who Can Purchase",
    body: "Our catalog is intended for qualified researchers, laboratories, universities, and research institutions. By placing an order, you affirm that you are purchasing on behalf of a legitimate research effort and are at least 21 years of age.",
  },
  {
    icon: XCircle,
    title: "Prohibited Uses",
    body: "Products may not be used for human or veterinary administration, resale as a consumer product, or any application not permitted under applicable law. We do not provide dosing, administration, or treatment guidance of any kind.",
  },
  {
    icon: ShieldCheck,
    title: "Handling & Documentation",
    body: "Each product ships with a Certificate of Analysis and Safety Data Sheet outlining batch testing results and recommended laboratory handling practices. Researchers are responsible for following appropriate safety protocols in their own facility.",
  },
];

export default function ResearchUsePage() {
  return (
    <div className="container-edit py-14 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
          Policy
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Research Use Policy
        </h1>
        <p className="mt-4 text-[14px] leading-relaxed text-graphite">
          This policy outlines the intended use of every product distributed
          by Axiom Research. Please read it carefully before placing an
          order.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-3xl gap-10 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="flex h-11 w-11 items-center justify-center border border-line-strong">
              <section.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
            </div>
            <h2 className="mt-4 font-display text-lg tracking-tight text-ink">
              {section.title}
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-graphite">
              {section.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-2xl">
        <ResearchUseNotice />
      </div>
    </div>
  );
}
