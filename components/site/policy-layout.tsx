import { AlertTriangle } from "lucide-react";

export function PolicyLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-edit py-14 lg:py-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {updated && (
          <p className="mt-2 text-[12px] text-graphite-light">
            Last updated: {updated}
          </p>
        )}

        <div className="mt-8 flex gap-3 border border-warn/30 bg-warn-soft p-4 text-[13px] leading-relaxed text-ink">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
          <p>
            <strong>Placeholder legal copy.</strong> This page is provided for
            demonstration purposes only. Final legal text must be supplied and
            reviewed by the client or their legal counsel before production
            use.
          </p>
        </div>

        <div className="prose-policy mt-10 space-y-8 text-[14px] leading-relaxed text-graphite">
          {children}
        </div>
      </div>
    </div>
  );
}

export function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 font-display text-xl tracking-tight text-ink">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
