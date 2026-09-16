import Link from "next/link";
import { FileText } from "lucide-react";

interface DocumentItem {
  id: string;
  type: string;
  title: string;
  url: string;
}

export function ProductDocuments({ documents }: { documents: DocumentItem[] }) {
  if (documents.length === 0) {
    return (
      <p className="text-[13px] text-graphite">
        Documentation for this product is available on request via our{" "}
        <Link href="/contact" className="text-ink underline underline-offset-4">
          Contact
        </Link>{" "}
        page.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {documents.map((doc) => (
        <li key={doc.id}>
          <Link
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 py-4"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 shrink-0 text-accent" />
              <div>
                <p className="text-[13px] font-medium text-ink">{doc.title}</p>
                <p className="text-[11px] uppercase tracking-[0.08em] text-graphite-light">
                  {doc.type} · PDF
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-graphite transition-colors group-hover:text-ink">
              Download
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
