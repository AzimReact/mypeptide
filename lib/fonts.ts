import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";

export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

export const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});
