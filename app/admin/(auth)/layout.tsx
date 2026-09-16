export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper-dim/40 bg-grid px-4">
      <div className="mb-8 font-display text-xl font-semibold tracking-[0.02em] text-ink">
        AXIOM
        <span className="ml-2 align-middle text-[10px] font-sans font-semibold uppercase tracking-[0.28em] text-graphite">
          Research
        </span>
      </div>
      {children}
    </div>
  );
}
