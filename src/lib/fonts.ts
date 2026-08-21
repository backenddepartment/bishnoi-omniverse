import { Poppins, Noto_Sans_Devanagari } from "next/font/google";

// Poppins doesn't cover the Devanagari script, so Hindi text falls back to
// Noto Sans Devanagari — stacked together via CSS variables so both scripts
// render with matching, high-quality glyphs on the same page.
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

export const fontVariables = `${poppins.variable} ${notoSansDevanagari.variable}`;
