import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import AuthProvider from "@/components/AuthProvider";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Nana B Enterprises | Quality Home Appliances in Ghana",
    template: "%s | Nana B Enterprises",
  },
  description:
    "Shop quality home, kitchen and lifestyle appliances from Nana B Enterprises. Wholesale and retail, with delivery across Ghana.",
  openGraph: {
    title: "Nana B Enterprises",
    description: "Home of quality and professional appliances.",
    images: ["/assets/appliance-showroom.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F7F8FB] text-ink antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <BottomNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
