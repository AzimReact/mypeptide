"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/site/cart-provider";
import { CartDrawer } from "@/components/site/cart-drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/research-use", label: "Research" },
  { href: "/quality", label: "Quality" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const { itemCount, openCart, isHydrated } = useCart();
  const router = useRouter();

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    setSearchOpen(false);
    router.push(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : "/shop");
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-colors duration-300",
          scrolled
            ? "border-line bg-paper/90 backdrop-blur-md"
            : "border-transparent bg-paper"
        )}
      >
        <div className="container-edit flex h-[76px] items-center justify-between gap-6">
          <Link
            href="/"
            className="font-display text-[20px] font-semibold tracking-[0.02em] text-ink"
          >
            AXIOM
            <span className="ml-2 align-middle text-[10px] font-sans font-semibold uppercase tracking-[0.28em] text-graphite">
              Research
            </span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink/80 transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <div className="hidden items-center sm:flex">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center border-b border-ink"
                >
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onBlur={() => !query && setSearchOpen(false)}
                    placeholder="Search products…"
                    className="w-40 bg-transparent py-1.5 text-[13px] text-ink placeholder:text-graphite-light focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSearchOpen(false);
                    }}
                    className="p-1.5 text-graphite hover:text-ink"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-accent"
                  aria-label="Search"
                >
                  <Search className="h-[18px] w-[18px]" />
                </button>
              )}
            </div>

            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-accent"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {isHydrated && itemCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-paper">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-ink lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="max-w-xs">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-1 flex-col gap-1 px-6 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-line py-4 text-[15px] font-medium text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/track-order"
              onClick={() => setMobileOpen(false)}
              className="py-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-graphite"
            >
              Track Order
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      <CartDrawer />
    </>
  );
}
