"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Menu,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/(dashboard)/actions";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors",
              active
                ? "bg-ink text-paper"
                : "text-graphite hover:bg-paper-dim hover:text-ink"
            )}
          >
            <item.icon className="h-4 w-4" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({
  children,
  adminName,
}: {
  children: React.ReactNode;
  adminName: string;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-paper-dim/30">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-paper lg:flex">
        <div className="flex h-[76px] items-center border-b border-line px-6">
          <Link href="/admin" className="font-display text-lg font-semibold tracking-[0.02em] text-ink">
            AXIOM
            <span className="ml-2 align-middle text-[9px] font-sans font-semibold uppercase tracking-[0.28em] text-graphite">
              Admin
            </span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col justify-between py-6">
          <NavLinks />
          <div className="space-y-1 px-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-0 py-2.5 text-[13px] font-medium text-graphite hover:text-ink"
            >
              <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
              View Store
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 px-0 py-2.5 text-[13px] font-medium text-graphite hover:text-danger"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Log Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-[76px] items-center justify-between border-b border-line bg-paper px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center text-ink lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="hidden text-[13px] text-graphite lg:block">
            Signed in as <span className="text-ink">{adminName}</span>
          </span>
          <span className="font-display text-base font-semibold text-ink lg:hidden">
            AXIOM Admin
          </span>
          <div className="hidden lg:block" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="max-w-xs">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col justify-between py-6">
            <div className="px-2">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="space-y-1 px-6">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 py-2.5 text-[13px] font-medium text-graphite"
              >
                <ExternalLink className="h-4 w-4" />
                View Store
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 py-2.5 text-[13px] font-medium text-graphite hover:text-danger"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </form>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
