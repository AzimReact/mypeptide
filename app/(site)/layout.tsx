import { CartProvider } from "@/components/site/cart-provider";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AgeVerificationModal } from "@/components/site/age-verification-modal";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <AgeVerificationModal />
    </CartProvider>
  );
}
