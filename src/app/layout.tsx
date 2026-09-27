import type { Metadata, Viewport } from "next";
import { spaceGrotesk, hanken, inter } from "./fonts";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { site, INSTAGRAM_URL } from "@/content/site";
import { siteUrl } from "@/lib/url";

const title = "The Last Page — from learning design to building a creative career";

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: title, template: "%s — The Last Page" },
  description: site.description,
  applicationName: "The Last Page",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "The Last Page",
    title,
    description: site.description,
    url: "/",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Runs before first paint. Adds `motion` to <html> only when the visitor has
 * not asked for reduced motion; entrance states are gated on that class, so
 * without JS (or with reduced motion) every word is visible immediately.
 * Failsafe: if the app never signals `motion-ready`, reveal everything.
 */
const motionFlag = `(function(){try{var d=document.documentElement;if(window.matchMedia('(prefers-reduced-motion: no-preference)').matches){d.classList.add('motion');setTimeout(function(){d.classList.add('motion-ready')},3200)}}catch(e){}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Last Page",
  description: site.description,
  url: siteUrl().toString(),
  sameAs: [INSTAGRAM_URL],
  parentOrganization: { "@type": "Organization", name: "Divergent Classes" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${spaceGrotesk.variable} ${hanken.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        <SmoothScroll />
        <Cursor />
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
