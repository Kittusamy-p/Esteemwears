import "./globals.css";
import dynamic from "next/dynamic";
import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// 🚀 Lazy load non-critical components
const Navbar = dynamic(() => import("@/components/Navbar"), {
  ssr: true,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: true,
});

export const metadata: Metadata = {
  title: {
    default: "Esteem Innerwear",
    template: "%s | Esteem Innerwear",
  },

  description:
    "Premium cotton innerwear for men and kids. Comfortable, durable, and affordable everyday wear designed for maximum comfort.",

  keywords: [
    "innerwear",
    "mens briefs",
    "kids wear",
    "cotton underwear",
    "comfortable innerwear",
    "affordable innerwear India",
    "best men's underwear",
    "kids underwear online",
  ],

  authors: [{ name: "Esteem Innerwear" }],
  creator: "Esteem Innerwear",
  publisher: "Esteem Innerwear",

  metadataBase: new URL("https://esteemwears.in"),

  openGraph: {
    title: "Esteem Innerwear - Comfortable Everyday Wear",
    description:
      "Shop premium cotton innerwear for men and kids. Soft, durable, and affordable daily comfort wear.",
    url: "https://esteemwears.in",
    siteName: "Esteem Innerwear",
    images: [
      {
        url: "https://res.cloudinary.com/desmywzoz/image/upload/vXXXXX/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Esteem Innerwear Banner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Esteem Innerwear",
    description:
      "Premium cotton innerwear for men and kids. Comfort that lasts all day.",
    images: [
      "https://res.cloudinary.com/desmywzoz/image/upload/vXXXXX/og-banner.png",
    ],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },

  // 🚀 PERFORMANCE BOOST
  other: {
    "theme-color": "#ffffff",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 🚀 Reduce layout shift */}
      <body className="flex flex-col min-h-screen antialiased">
        <Navbar />

        {/* Keep DOM shallow */}
        <main className="flex-1">{children}</main>

        <Footer />
      </body>
      <SpeedInsights />
    </html>
  );
}
