import type { Metadata } from "next";
import { fontDisplay, fontSans, fontMono } from "@/lib/fonts";
import { Toaster } from "sonner";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Axiom Research — Precision Research Compounds",
    template: "%s — Axiom Research",
  },
  description:
    "Axiom Research supplies rigorously documented reference compounds for laboratory and research use, with batch-level documentation available for every product.",
  openGraph: {
    title: "Axiom Research",
    description:
      "Precision research compounds with verified documentation, for laboratory use only.",
    url: siteUrl,
    siteName: "Axiom Research",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-ink)",
              color: "var(--color-paper)",
              border: "1px solid var(--color-ink-soft)",
              borderRadius: "4px",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
