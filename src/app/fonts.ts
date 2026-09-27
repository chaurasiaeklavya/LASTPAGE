import localFont from "next/font/local";

// Brand typography [K3]. Self-hosted, Latin-subset variable fonts.
export const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk.woff2",
  weight: "300 700",
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});

export const hanken = localFont({
  src: "./fonts/hanken-grotesk.woff2",
  weight: "100 900",
  variable: "--font-hanken",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});

export const inter = localFont({
  src: "./fonts/inter.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
  preload: false, // labels only — never render-blocking
  adjustFontFallback: "Arial",
});
