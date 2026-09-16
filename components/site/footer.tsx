import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { href: "/shop", label: "All Products" },
      { href: "/shop?featured=true", label: "Featured" },
      { href: "/track-order", label: "Track Order" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/quality", label: "Quality & Documentation" },
      { href: "/research-use", label: "Research Use" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/shipping", label: "Shipping Policy" },
      { href: "/refund", label: "Refund Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper/80">
      <div className="container-edit grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-[0.02em] text-paper"
          >
            AXIOM
            <span className="ml-2 align-middle text-[10px] font-sans font-semibold uppercase tracking-[0.28em] text-paper/60">
              Research
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-paper/55">
            Precision research compounds with batch-level documentation, for
            laboratory and research use only.
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.heading}>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/45">
              {column.heading}
            </h3>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-paper/70 transition-colors hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-paper/10">
        <div className="container-edit flex flex-col gap-3 py-6 text-[11px] text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Axiom Research. All rights reserved.
          </p>
          <p className="max-w-xl leading-relaxed sm:text-right">
            For laboratory and research use only. Not for human or veterinary
            use. Not a drug, food, or cosmetic.
          </p>
        </div>
      </div>
    </footer>
  );
}
