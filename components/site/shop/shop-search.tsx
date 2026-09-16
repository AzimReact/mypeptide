"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ShopSearch() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  // Remount whenever the URL's query changes from elsewhere (e.g. a "clear
  // filters" link), so the input's initial value always matches the URL
  // without needing an effect to keep the two in sync.
  return <ShopSearchField key={query} initialValue={query} />;
}

function ShopSearchField({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(initialValue);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams.toString());
    if (value.trim()) next.set("q", value.trim());
    else next.delete("q");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function clear() {
    setValue("");
    const next = new URLSearchParams(searchParams.toString());
    next.delete("q");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <form
      onSubmit={submit}
      className="flex h-11 w-full items-center gap-2 border border-line-strong px-3.5 sm:w-64"
    >
      <Search className="h-4 w-4 shrink-0 text-graphite" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products…"
        className="w-full bg-transparent text-[13px] text-ink placeholder:text-graphite-light focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="text-graphite hover:text-ink"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </form>
  );
}
