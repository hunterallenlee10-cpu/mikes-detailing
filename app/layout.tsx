import type { Metadata, Viewport } from "next";
import { Archivo, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { business } from "@/content/site";
import { businessSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/layout/Nav";
import { PromoPill } from "@/components/layout/PromoPill";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { Effects } from "@/components/layout/Effects";
import { ReferralCapture } from "@/components/referral/ReferralCapture";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: "Mike's Automotive Detailing | Ceramic Coating & Detailing in Leonardtown, MD",
    template: "%s",
  },
  description:
    "Southern Maryland's detail & ceramic coating shop. IGL Coatings Certified Installer and LowGlow Certified Dealer in Leonardtown, MD — detailing, paint correction, lighting, car audio and tint. Call or text (301) 752-8505.",
  applicationName: business.name,
  authors: [{ name: business.owner }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: business.name,
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  category: "automotive",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-US" className={`${archivo.variable} ${manrope.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flake min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[80] rounded-full bg-white px-5 py-3 font-bold text-jet focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <JsonLd data={businessSchema()} />
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
          <Nav />
          <div className="absolute inset-x-0 top-[calc(env(safe-area-inset-top)+4.6rem)] px-3 sm:top-[calc(env(safe-area-inset-top)+5.2rem)]">
            <PromoPill />
          </div>
        </div>
        <main id="main">{children}</main>
        <Footer />
        <MobileActionBar />
        <ReferralCapture />
        <Effects />
        {/* Vercel Web Analytics only exists on Vercel deployments */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
