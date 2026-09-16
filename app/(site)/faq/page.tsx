import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ENTRIES } from "@/lib/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about ordering from Axiom Research.",
};

export default function FaqPage() {
  return (
    <div className="container-edit py-14 lg:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            Support
          </p>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
            Frequently Asked Questions
          </h1>
        </div>

        <div className="mt-12">
          <Accordion type="single" collapsible>
            {FAQ_ENTRIES.map((entry) => (
              <AccordionItem key={entry.question} value={entry.question}>
                <AccordionTrigger>{entry.question}</AccordionTrigger>
                <AccordionContent>{entry.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
