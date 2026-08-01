import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import AuthProvider from "@/components/AuthProvider";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nana B Enterprises | Home Appliances in Accra, Ghana",
    template: "%s | Nana B Enterprises",
  },
  description:
    "Shop TVs, fridges, washing machines, cookers, blenders, fans and quality home appliances from Nana B Enterprises in Makola, Accra. Wholesale, retail and delivery across Ghana.",
  keywords: [
    "Nana B Enterprises",
    "Nana B Enterprise",
    "Nana B Enterprise Ghana",
    "Nana B appliances",
    "home appliances Ghana",
    "appliance shop Accra",
    "electronics Makola",
    "kitchen appliances Ghana",
    "wholesale appliances Ghana",
    "TVs fridges washing machines Accra",
  ],
  applicationName: "Nana B Enterprises",
  icons: {
    icon: [{ url: "/icon.jpg", type: "image/jpeg", sizes: "512x512" }],
    shortcut: "/icon.jpg",
    apple: "/icon.jpg",
  },
  authors: [{ name: "Nana B Enterprises" }],
  creator: "Nana B Enterprises",
  publisher: "Nana B Enterprises",
  category: "Home appliances and electronics",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "/",
    siteName: "Nana B Enterprises",
    title: "Nana B Enterprises | Quality Home Appliances in Ghana",
    description: "Wholesale and retail home appliances from Makola, Accra, with delivery across Ghana.",
    images: [{
      url: "/assets/appliance-showroom.png",
      width: 1774,
      height: 887,
      alt: "Nana B Enterprises home appliance showroom",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nana B Enterprises | Home Appliances in Ghana",
    description: "Quality wholesale and retail appliances with delivery across Ghana.",
    images: ["/assets/appliance-showroom.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Nana B Enterprises",
        alternateName: ["Nana B Enterprise", "Nana B Appliances Ghana"],
        publisher: { "@id": `${siteUrl}/#business` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": ["Store", "HomeGoodsStore", "Organization"],
        "@id": `${siteUrl}/#business`,
        url: siteUrl,
        name: "Nana B Enterprises",
        alternateName: "Nana B Enterprise",
        description: "Wholesale and retail home, kitchen and lifestyle appliances in Makola, Accra, Ghana.",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/assets/nana-b-logo.jpg`,
        },
        image: `${siteUrl}/assets/appliance-showroom.png`,
        telephone: "+233244018530",
        email: "nanabooakye1@gmail.com",
        priceRange: "GH₵",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Makola Shopping Mall, opposite Georgina Stores, Angelina House, 1st Floor, Shop 31",
          addressLocality: "Accra",
          addressCountry: "GH",
        },
        areaServed: { "@type": "Country", name: "Ghana" },
        sameAs: [
          "https://www.instagram.com/nana_b_enterprises/",
          "https://www.facebook.com/share/1GC8MPxyDJ/",
        ],
      },
    ],
  };

  return (
    <html lang="en">
      <body className="bg-[#F7F8FB] text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }}
        />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <WhatsAppButton />
            <BottomNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
